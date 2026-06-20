import { toast } from 'sonner';

/**
 * Generate and download a PDF from a hidden HTML element.
 * The element is cloned into document.body at a fixed off-screen position
 * so html2canvas can fully render it (including inherited CSS variables/fonts).
 *
 * @param elementId  - id of the hidden layout element
 * @param filename   - output file name (e.g. "DonThuoc_00001.pdf")
 */
export async function generatePdf(elementId: string, filename: string): Promise<void> {
  const source = document.getElementById(elementId);
  if (!source) {
    toast.error('Không tìm thấy nội dung để tạo PDF');
    return;
  }

  // Create a temporary wrapper appended to body so all CSS variables / fonts are inherited
  const wrapper = document.createElement('div');
  wrapper.style.cssText =
    'position:absolute;top:-9999px;left:0;width:794px;background:#fff;z-index:-9999;pointer-events:none;';
  const clone = source.cloneNode(true) as HTMLElement;
  clone.style.display = 'block';
  clone.style.width = '794px';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    // Give browser a tick to apply styles & load fonts
    await new Promise((r) => setTimeout(r, 120));

    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).jsPDF;

    const canvas = await html2canvas(wrapper, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794,
      // Disable all page stylesheets in the clone so html2canvas never
      // encounters unsupported CSS color functions (e.g. oklch from Tailwind).
      // ClinicPdfLayout uses only inline styles so this is safe.
      onclone: (clonedDoc) => {
        Array.from(clonedDoc.styleSheets).forEach((sheet) => {
          try { sheet.disabled = true; } catch (_) { /* cross-origin sheets */ }
        });
        // Ensure all images have crossOrigin so html2canvas can capture them
        Array.from(clonedDoc.querySelectorAll('img')).forEach((img) => {
          img.crossOrigin = 'anonymous';
        });
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    // If content taller than one page, split across pages
    let yOffset = 0;
    while (yOffset < imgHeight) {
      if (yOffset > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, -yOffset, pageWidth, imgHeight);
      yOffset += pageHeight;
    }

    pdf.save(filename);
    toast.success('Tải PDF thành công!');
  } catch (err) {
    console.error('[generatePdf] error:', err);
    toast.error('Không thể tạo PDF. Vui lòng thử lại.');
  } finally {
    document.body.removeChild(wrapper);
  }
}

/**
 * Strip all Vietnamese medical title prefixes then return "BS. <name>".
 * Handles patterns like: "BS.", "BS CKII.", "BS CKI.", "PGS.TS.", "GS.TS.", "ThS.", "TS."
 */
export function formatDoctorName(name?: string | null): string {
  if (!name) return 'Đang cập nhật';
  let cleaned = name.trim();
  // 1. Strip seniority prefix (PGS, GS, ThS, TS, Ths) with optional dot
  cleaned = cleaned.replace(/^(?:PGS|GS|ThS|Ths|TS)\.?\s*/i, '');
  // 2. Strip BS prefix + optional specialist rank (CKI, CKII, CKIII) + optional dot
  cleaned = cleaned.replace(/^BS\.?\s*(?:CK(?:III|II|I)\.?)?\s*/i, '');
  cleaned = cleaned.trim();
  return cleaned ? `BS. ${cleaned}` : 'Đang cập nhật';
}

/** Format currency VND */
export function formatVND(amount?: number | null): string {
  if (!amount) return '---';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

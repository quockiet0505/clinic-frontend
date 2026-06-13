import React, { useState } from 'react';
import { PackagePlus, Plus, Trash2, Pill } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CustomSelect from '@/components/common/CustomSelect';

export default function PurchaseOrderFormDialog({ isOpen, onClose, onSave }: any) {
  const [supplierId, setSupplierId] = useState('');
  const [note, setNote] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [medName, setMedName] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');

  const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const handleAddItem = () => {
    if (medName && qty && price) {
      setItems([...items, { id: Date.now(), medicineName: medName, qty: Number(qty), price: Number(price) }]);
      setMedName(''); setQty(''); setPrice('');
    }
  };

  const handleSave = () => {
    onSave({ supplierName: supplierId || 'Selected Supplier', note, totalAmount, items });
    setSupplierId(''); setNote(''); setItems([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-0 rounded-[24px] shadow-2xl">
        {/* HEADER đồng bộ */}
        <div className="bg-primary-50 p-6 border-b border-primary-100 rounded-t-[24px] shrink-0">
          <div className="flex items-center gap-2 mb-2 text-primary-600">
            <PackagePlus size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Mua sắm</span>
          </div>
          <DialogTitle className="text-2xl font-semibold">Tạo Đơn nhập hàng</DialogTitle>
          <DialogDescription className="text-sm text-primary-600/80 font-medium">
            Tạo đơn hàng mới để bổ sung thuốc vào kho.
          </DialogDescription>
        </div>

        {/* BODY giữ nguyên logic */}
        <div className="p-6 bg-white space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block mb-2 text-sm font-medium text-slate-700">Chọn nhà cung cấp</label>
              <CustomSelect value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="h-11 w-full">
                <option value="" disabled>Chọn nhà cung cấp...</option>
                <option value="PharmaCorp Global">PharmaCorp Global</option>
                <option value="MedSupply Co.">MedSupply Co.</option>
              </CustomSelect>
            </div>
            <div className="space-y-2">
              <label className="block mb-2 text-sm font-medium text-slate-700">Ghi chú đơn hàng (Tùy chọn)</label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} className="h-11 rounded-[16px] font-medium" placeholder="vd: Nhập hàng gấp cho quý 2" />
            </div>
          </div>
          <div className="h-px bg-slate-200 w-full"></div>
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800">Danh sách mặt hàng</h3>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-3 items-end shadow-sm">
              <div className="w-full md:flex-1 space-y-2">
                <label className="block mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên thuốc</label>
                <Input value={medName} onChange={(e) => setMedName(e.target.value)} className="h-10 rounded-xl bg-slate-50" placeholder="Tìm kiếm medicine..." />
              </div>
              <div className="w-full md:w-24 space-y-2">
                <label className="block mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số lượng</label>
                <Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="h-10 rounded-xl bg-slate-50" placeholder="0" />
              </div>
              <div className="w-full md:w-32 space-y-2">
                <label className="block mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đơn giá ($)</label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="h-10 rounded-xl bg-slate-50" placeholder="0.00" />
              </div>
              <Button onClick={handleAddItem} className="h-10 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold px-5 w-full md:w-auto cursor-pointer">
                <Plus size={16} className="mr-1.5"/> Thêm
              </Button>
            </div>
            <div className="space-y-2">
              {items.length === 0 ? (
                <div className="text-center p-8 text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                  Chưa có mặt hàng nào được thêm vào đơn hàng này.
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center"><Pill size={14}/></div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{item.medicineName}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                          {item.qty} units × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-black text-slate-800">${(item.qty * item.price).toFixed(2)}</p>
                      <Button onClick={() => setItems(items.filter(i => i.id !== item.id))} variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-50">
                        <Trash2 size={14}/>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* FOOTER đồng bộ */}
        <DialogFooter className="p-6 pb-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0 rounded-b-[24px]">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng cộng</p>
            <p className="text-2xl font-black text-blue-600">${totalAmount.toFixed(2)}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="h-11 px-6 rounded-[14px] font-bold border-slate-300 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-300">
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={items.length === 0 || !supplierId} className="h-11 px-6 rounded-[14px] bg-primary hover:bg-primary-600 shadow-sm text-white font-bold">
              Hoàn tất đơn hàng
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
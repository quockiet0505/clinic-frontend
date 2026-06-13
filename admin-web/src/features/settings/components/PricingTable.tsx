import React from 'react';
import { Edit, Trash2, UserCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DoctorPricing } from '../types/settings';
import { getImageUrl } from '@/utils/image';

export default function PricingTable({ doctors, onEdit, onDelete }: any) {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="h-14 border-b border-slate-200">
            <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] px-8 w-[35%]">Bác sĩ</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] w-[30%]">Dịch vụ</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] w-[20%] text-right">Phí khám hiện tại</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] text-right pr-8 w-[15%]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doc: DoctorPricing) => (
            <TableRow key={doc.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
              <TableCell className="px-8 py-5">
                <div className="flex items-center gap-4">
                  {doc.imageUrl ? (
                    <div className="w-12 h-12 rounded-[16px] overflow-hidden border-2 border-slate-100 shadow-sm shrink-0">
                      <img src={getImageUrl(doc.imageUrl)} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-[16px] bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg border-2 border-blue-100 shrink-0">
                      {doc.doctorName ? doc.doctorName.charAt(0) : <UserCircle size={22} />}
                    </div>
                  )}
                  <div>
                    <p className="font-black text-slate-900 text-[15px]">{doc.doctorName}</p>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">MÃ: STF-{doc.staffId}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                  <span className="text-[14px] font-bold text-slate-700">{doc.serviceName}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end font-black text-emerald-600 text-lg">
                  {doc.price?.toLocaleString('vi-VN')} VNĐ
                </div>
              </TableCell>
              <TableCell className="text-right pr-8">
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => onEdit(doc)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5 font-semibold px-3 h-8 rounded-[10px] text-primary-600 border-primary-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 transition-all cursor-pointer"
                  >
                    <Edit size={14} /><span>Sửa</span>
                  </Button>
                  <Button
                    onClick={() => onDelete(doc)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5 font-semibold px-3 h-8 rounded-[10px] text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all cursor-pointer"
                  >
                    <Trash2 size={14} /><span>Xóa</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
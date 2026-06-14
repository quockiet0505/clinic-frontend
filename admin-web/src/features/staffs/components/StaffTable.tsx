import React from 'react';
import { Edit2, Trash2, Mail, Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Staff } from '../types/staff';
import { getRoleIcon } from './StaffFilterBar';
import { getImageUrl } from '@/utils/image';

interface Props {
  data: Staff[];
  onEdit: (s: Staff) => void;
  onDelete: (s: Staff) => void;
}

export default function StaffTable({ data, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-x-auto flex-1 flex flex-col">
      <div className="min-w-[800px] flex-1">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
            <TableRow className="border-b border-slate-200 hover:bg-transparent">
              <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] px-6 h-14 w-[25%]">Nhân viên</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] w-[20%] pl-2">Liên hệ</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] w-[20%] pl-2">Vai trò & Chuyên môn</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] w-[10%] pl-2 text-left">Đánh giá</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px] w-[25%] text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? data.map((staff) => (
              <TableRow key={staff.staffId} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {staff.imageUrl ? (
                      <div className="w-12 h-12 rounded-[16px] overflow-hidden border-2 border-slate-100 shadow-sm shrink-0">
                        <img src={getImageUrl(staff.imageUrl)} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center font-black text-lg border-2 shrink-0 ${staff.staffType === 'DOCTOR' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                        {staff.fullName.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-black text-slate-900 text-[15px] truncate" title={staff.fullName}>{staff.fullName}</p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">STF-{staff.staffId}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="pl-2 pr-4 align-middle">
                  <div className="flex flex-col justify-center gap-2 min-w-0">
                    <span className="flex items-center text-sm font-medium text-slate-600 truncate" title={staff.email}>
                      <Mail size={14} className="text-slate-400 mr-2 shrink-0" />
                      <span className="truncate">{staff.email || 'Chưa có email'}</span>
                    </span>
                    <span className="flex items-center text-sm font-medium text-slate-600 truncate" title={staff.phone}>
                      <Phone size={14} className="text-slate-400 mr-2 shrink-0" />
                      <span className="truncate">{staff.phone || 'Chưa có số điện thoại'}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="pl-2 pr-4">
                  <Badge variant="secondary" className={`font-bold rounded-xl border-0 uppercase tracking-wider text-[10px] px-2.5 py-1 whitespace-nowrap ${staff.staffType === 'DOCTOR' ? 'bg-blue-100 text-blue-700' :
                    staff.staffType === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                      staff.staffType === 'LAB_TECH' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                    {getRoleIcon(staff.staffType)}
                    {staff.staffType === 'DOCTOR' ? 'Bác sĩ' : staff.staffType === 'STAFF' ? 'Nhân viên' : staff.staffType === 'LAB_TECH' ? 'Kỹ thuật viên' : 'Quản trị viên'}
                  </Badge>
                  {staff.staffType === 'DOCTOR' && (
                    <p className="text-[12px] text-slate-500 font-bold mt-2 ml-1 flex items-center gap-1.5 truncate" title={staff.expertiseName}>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"></span>
                      <span className="truncate">{staff.expertiseName}</span>
                    </p>
                  )}
                </TableCell>
                <TableCell className="pl-2 pr-4 align-middle text-left">
                  {staff.staffType === 'DOCTOR' ? (
                    <div className="flex items-center justify-start gap-1">
                      <Star className="text-amber-400 fill-amber-400" size={16} />
                      <span className="font-bold text-slate-700">{staff.rating ? staff.rating.toFixed(1) : 'Chưa có'}</span>
                    </div>
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center align-middle">
                  <div className="flex justify-center items-center gap-1.5">
                    <Button onClick={() => onEdit(staff)} variant="outline" size="sm" className="flex items-center gap-1.5 font-semibold px-3 h-8 rounded-[10px] text-primary-600 border-primary-200 hover:bg-primary-50 whitespace-nowrap">
                      <Edit2 size={14} /><span>Sửa</span>
                    </Button>
                    <Button onClick={() => onDelete(staff)} variant="outline" size="sm" className="flex items-center gap-1.5 font-semibold px-3 h-8 rounded-[10px] text-red-600 border-red-200 hover:bg-red-50 whitespace-nowrap">
                      <Trash2 size={14} /><span>Xoá</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-slate-400 font-medium text-[15px]">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    </div>
                    Không tìm thấy nhân viên phù hợp.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { PackagePlus, Plus, Trash2, Pill } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PurchaseOrderFormDialog({ isOpen, onClose, onSave }: any) {
  const [supplierId, setSupplierId] = useState('');
  const [note, setNote] = useState('');
  const [items, setItems] = useState<any[]>([]);
  
  // States cho form thêm item
  const [medName, setMedName] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');

  // Tự động tính tổng tiền
  const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const handleAddItem = () => {
    if (medName && qty && price) {
      setItems([...items, { 
        id: Date.now(), 
        medicineName: medName, 
        qty: Number(qty), 
        price: Number(price) 
      }]);
      setMedName(''); setQty(''); setPrice('');
    }
  };

  const handleSave = () => {
    onSave({
      supplierName: supplierId || 'Selected Supplier', // Giả lập tên từ ID
      note: note,
      totalAmount: totalAmount,
      items: items
    });
    // Reset form
    setSupplierId(''); setNote(''); setItems([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-0 rounded-[32px] shadow-2xl bg-slate-50">
        
        {/* HEADER */}
        <div className="bg-blue-600 p-6 text-white shrink-0">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <PackagePlus size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Procurement</span>
          </div>
          <DialogTitle className="text-xl font-black">Create Purchase Order</DialogTitle>
          <DialogDescription className="text-blue-100">Draft a new order to restock pharmacy inventory.</DialogDescription>
        </div>
        
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          {/* THÔNG TIN CHUNG */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Select Supplier</label>
              <select 
                value={supplierId} onChange={(e) => setSupplierId(e.target.value)} 
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold text-slate-700 outline-none cursor-pointer shadow-sm"
              >
                <option value="" disabled>Choose a vendor...</option>
                <option value="PharmaCorp Global">PharmaCorp Global</option>
                <option value="MedSupply Co.">MedSupply Co.</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Order Notes (Optional)</label>
              <Input 
                value={note} onChange={(e) => setNote(e.target.value)} 
                className="h-11 rounded-xl bg-white shadow-sm font-medium" 
                placeholder="e.g. Urgent restock for Q2" 
              />
            </div>
          </div>

          <div className="h-px bg-slate-200 w-full"></div>

          {/* ITEM BUILDER (Thêm thuốc vào Đơn hàng) */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800">Order Items</h3>
            
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-3 items-end shadow-sm">
              <div className="w-full md:flex-1 space-y-2">
                <label className="block mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medicine Name</label>
                <Input value={medName} onChange={(e) => setMedName(e.target.value)} className="h-10 rounded-xl bg-slate-50" placeholder="Tìm kiếm medicine..." />
              </div>
              <div className="w-full md:w-24 space-y-2">
                <label className="block mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số lượng</label>
                <Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="h-10 rounded-xl bg-slate-50" placeholder="0" />
              </div>
              <div className="w-full md:w-32 space-y-2">
                <label className="block mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unit Price ($)</label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="h-10 rounded-xl bg-slate-50" placeholder="0.00" />
              </div>
              <Button onClick={handleAddItem} className="h-10 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold px-5 w-full md:w-auto cursor-pointer">
                <Plus size={16} className="mr-1.5"/> Add
              </Button>
            </div>

            {/* DANH SÁCH ITEMS ĐÃ THÊM */}
            <div className="space-y-2">
              {items.length === 0 ? (
                <div className="text-center p-8 text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                  No items added to this purchase order yet.
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
        
        {/* FOOTER & TỔNG TIỀN */}
        <DialogFooter className="p-6 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</p>
            <p className="text-2xl font-black text-blue-600">${totalAmount.toFixed(2)}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500 cursor-pointer">Hủy</Button>
            <Button 
              onClick={handleSave} 
              disabled={items.length === 0 || !supplierId} 
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-8 shadow-sm cursor-pointer"
            >
              Submit Order
            </Button>
          </div>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
import React, { useState } from 'react';
import { Plus, Tag, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ExpenseCategoryFormDialog from '../components/ExpenseCategoryFormDialog';
import { ExpenseCategory } from '../types/finance';

const INITIAL_CATEGORIES: ExpenseCategory[] = [
  { category_id: 1, category_name: 'Payroll', description: 'Staff salaries and bonuses' },
  { category_id: 2, category_name: 'Utilities', description: 'Electricity, Water, Internet' },
  { category_id: 3, category_name: 'Equipment', description: 'Medical tools and maintenance' },
];

export default function ExpenseCategories() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  
  // Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<ExpenseCategory | null>(null);
  const [deletingCat, setDeletingCat] = useState<ExpenseCategory | null>(null);

  const handleFormSubmit = (formData: any, isEdit: boolean) => {
    if (isEdit) {
      setCategories(categories.map(c => c.category_id === selectedCat?.category_id ? { ...c, ...formData } : c));
    } else {
      setCategories([{ ...formData, category_id: Date.now() }, ...categories]);
    }
    setIsFormOpen(false);
  };

  const openAddForm = () => {
    setSelectedCat(null);
    setIsFormOpen(true);
  };

  const openEditForm = (cat: ExpenseCategory) => {
    setSelectedCat(cat);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <PageHeader title="Expense Categories" description="Manage classification tags for clinic operational costs." />
        <Button onClick={openAddForm} className="h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-5 shadow-sm">
          <Plus size={18} className="mr-2"/> Add Category
        </Button>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="h-14">
              <TableHead className="font-bold text-slate-600 text-[11px] uppercase px-8">Category Name</TableHead>
              <TableHead className="font-bold text-slate-600 text-[11px] uppercase">Description</TableHead>
              <TableHead className="font-bold text-slate-600 text-[11px] uppercase text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.category_id} className="hover:bg-slate-50/50">
                <TableCell className="px-8 py-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Tag size={16} className="text-blue-500" /> {cat.category_name}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-slate-600">{cat.description}</span>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => openEditForm(cat)} variant="outline" size="icon" className="h-9 w-9 rounded-xl text-blue-600 border-slate-200 hover:bg-blue-50">
                      <Edit size={16}/>
                    </Button>
                    <Button onClick={() => setDeletingCat(cat)} variant="outline" size="icon" className="h-9 w-9 rounded-xl text-rose-600 border-slate-200 hover:bg-rose-50">
                      <Trash2 size={16}/>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* FORM DIALOG */}
      <ExpenseCategoryFormDialog 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit} 
        initialData={selectedCat} 
      />

      {/* XÁC NHẬN XÓA */}
      <ConfirmDialog 
        isOpen={!!deletingCat} 
        onClose={() => setDeletingCat(null)} 
        onConfirm={() => { setCategories(categories.filter(c => c.category_id !== deletingCat?.category_id)); setDeletingCat(null); }} 
        title="Delete Category" 
        description={`Are you sure you want to delete "${deletingCat?.category_name}"? This may affect associated expense records.`} 
      />
    </div>
  );
}
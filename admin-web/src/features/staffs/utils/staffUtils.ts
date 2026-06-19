import { Staff } from '@/features/staffs/types/staff';

/** is_deleted=0 là đang hoạt động; is_active=0 chỉ khi đã vô hiệu tài khoản */
export function isStaffActive(staff: Pick<Staff, 'isActive' | 'isDeleted'>) {
  if (staff.isDeleted === 1) return false;
  if (staff.isActive === 0 || staff.isActive === false) return false;
  return true;
}

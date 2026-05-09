
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts & Guards
import AdminLayout from '@/layouts/AdminLayout';
import AuthLayout from '@/layouts/AuthLayout';
import RoleGuard from '@/routes/guards/RoleGuard';

// --- 1. AUTH & DASHBOARD ---
import Login from '@/features/auth/pages/Login';
import AdminDashboard from '@/features/dashboard/pages/AdminDashboard';
import MyProfile from '@/features/profile/pages/MyProfile';


// --- 2. FRONT DESK (APPOINTMENTS & PATIENTS) ---
import AppointmentList from '@/features/appointments/pages/AppointmentList';
import AppointmentCalendar from '@/features/appointments/pages/AppointmentCalendar';
import FollowUpList from '@/features/appointments/pages/FollowUpList';
import PatientList from '@/features/patients/pages/PatientList';
import PatientDetails from '@/features/patients/pages/PatientDetails';


// --- 3. CLINICAL & MEDICAL ---
import ActiveVisits from '@/features/medical/pages/ActiveVisits';
import ConsultationWorkspace from '@/features/medical/pages/ConsultationWorkspace';
import MedicalRecordsList from '@/features/medical/pages/MedicalRecordsList';
import MedicalRecordDetail from '@/features/medical/pages/MedicalRecordDetail';


// --- 4. LABORATORY ---
import ServiceOrders from '@/features/laboratory/pages/ServiceOrders';
import LabResults from '@/features/laboratory/pages/LabResults';


// --- 5. PHARMACY & INVENTORY ---
import MedicineInventory from '@/features/pharmacy/pages/MedicineInventory';
import PrescriptionDispense from '@/features/pharmacy/pages/PrescriptionDispense';
import PurchaseOrders from '@/features/pharmacy/pages/PurchaseOrders';
import Suppliers from '@/features/pharmacy/pages/Suppliers';
import InventoryLogs from '@/features/pharmacy/pages/InventoryLogs';


// --- 6. FINANCE & BILLING ---
import InvoiceList from '@/features/finance/pages/InvoiceList';
import InvoiceDetails from '@/features/finance/pages/InvoiceDetails';
import Expenses from '@/features/finance/pages/Expenses';
import ExpenseCategories from '@/features/finance/pages/ExpenseCategories';
import RefundLogs from '@/features/finance/pages/RefundLogs';


// --- 7. CRM & COMMUNICATIONS ---
import Feedbacks from '@/features/crm/pages/Feedbacks';
import AiChatLogs from '@/features/crm/pages/AiChatLogs';
import Notifications from '@/features/crm/pages/Notifications';


// --- 8. HR & STAFF ---
import StaffList from '@/features/staffs/pages/StaffList';
import MySchedule from '@/features/staffs/pages/MySchedule';
import LeaveRequests from '@/features/staffs/pages/LeaveRequests';


// --- 9. SETTINGS ---
import GeneralSettings from '@/features/settings/pages/GeneralSettings';
import ExpertiseSettings from '@/features/settings/pages/ExpertiseSettings';
import ServiceCatalog from '@/features/settings/pages/ServiceCatalog';
import DoctorPricing from '@/features/settings/pages/DoctorPricing';
import RolesPermissions from '@/features/settings/pages/RolesPermissions';

// Placeholder Component for pending routes
const DummyPage = ({ title }: { title: string }) => (
  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center h-full min-h-[500px]">
    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
      <span className="text-2xl font-black">!</span>
    </div>
    <h1 className="font-black text-2xl text-slate-800">{title}</h1>
    <p className="text-slate-500 font-medium mt-2 text-center">
      This module is currently under development. <br /> Check back later!
    </p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { 
        index: true, 
        element: <Navigate to="/dashboard" replace /> 
      },
      
      // 1. DASHBOARD & PROFILE
      { 
        path: 'dashboard', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'DOCTOR', 'STAFF', 'LAB_TECH']}>
            <AdminDashboard />
          </RoleGuard>
        ) 
      },
      { 
        path: 'my-schedule', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'DOCTOR', 'STAFF', 'LAB_TECH']}>
            <MySchedule />
          </RoleGuard>
        ) 
      },
      { 
        path: 'profile', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'DOCTOR', 'STAFF', 'LAB_TECH']}>
            <MyProfile />
          </RoleGuard>
        ) 
      },
      
      // 2. FRONT DESK
      { 
        path: 'appointments', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'STAFF']}>
            <AppointmentList />
          </RoleGuard>
        ) 
      },
      { 
        path: 'appointments/calendar', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'STAFF', 'DOCTOR']}>
            <AppointmentCalendar />
          </RoleGuard>
        ) 
      },
      { 
        path: 'appointments/follow-ups', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'STAFF']}>
            <FollowUpList />
          </RoleGuard>
        ) 
      },
      { 
        path: 'patients', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'STAFF', 'DOCTOR']}>
            <PatientList />
          </RoleGuard>
        ) 
      },
      { 
        path: 'patients/:id', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'STAFF', 'DOCTOR']}>
            <PatientDetails />
          </RoleGuard>
        ) 
      },

      // 3. CLINICAL
      { 
        path: 'medical/active-visits', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'DOCTOR']}>
            <ActiveVisits />
          </RoleGuard>
        ) 
      },
      { 
        path: 'medical/consultation/:id', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'DOCTOR']}>
            <ConsultationWorkspace />
          </RoleGuard>
        ) 
      },
      { 
        path: 'medical/records', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'DOCTOR']}>
            <MedicalRecordsList />
          </RoleGuard>
        ) 
      },
      { 
        path: 'medical/records/:id', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'DOCTOR']}>
            <MedicalRecordDetail />
          </RoleGuard>
        ) 
      },

      // 4. LABORATORY
      { 
        path: 'laboratory/orders', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'DOCTOR', 'LAB_TECH']}>
            <ServiceOrders/>
          </RoleGuard>
        ) 
      },
      { 
        path: 'laboratory/results', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'DOCTOR', 'LAB_TECH']}>
            <LabResults />
          </RoleGuard>
        ) 
      },

      // 5. PHARMACY
      { 
        path: 'pharmacy/inventory', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'DOCTOR', 'STAFF']}>
            <MedicineInventory />
          </RoleGuard>
        ) 
      },
      { 
        path: 'pharmacy/prescriptions', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'STAFF']}>
            <PrescriptionDispense />
          </RoleGuard>
        ) 
      },
      { 
        path: 'pharmacy/purchase-orders', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'STAFF', 'DOCTOR']}>
            <PurchaseOrders />
          </RoleGuard>
        ) 
      },
      { 
        path: 'pharmacy/suppliers', 
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <Suppliers />
          </RoleGuard>
        ) 
      },
      { 
        path: 'pharmacy/inventory-logs', 
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <InventoryLogs />
          </RoleGuard>
        ) 
      },

      // 6. FINANCE & BILLING
      { 
        path: 'billing/invoices', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'STAFF']}>
            <InvoiceList />
          </RoleGuard>
        ) 
      },
      { 
        path: 'finance/invoices/:id', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'STAFF']}>
            <InvoiceDetails />
          </RoleGuard>
        ) 
      },
      
      { 
        path: 'finance/expenses', 
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <Expenses />
          </RoleGuard>
        ) 
      },
      { 
        path: 'finance/categories', 
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <ExpenseCategories />
          </RoleGuard>
        ) 
      },
      { 
        path: 'finance/refunds', 
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <RefundLogs />
          </RoleGuard>
        ) 
      },

      // 7. CRM & COMMUNICATIONS
      { 
        path: 'system/notifications', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'STAFF']}>
            <Notifications />
          </RoleGuard>
        ) 
      },
      { 
        path: 'system/feedback', 
        element: (
          <RoleGuard allowedRoles={['ADMIN', 'STAFF']}>
            <Feedbacks />
          </RoleGuard>
        ) 
      },
      { 
        path: 'system/ai-chat', 
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <AiChatLogs />
          </RoleGuard>
        ) 
      },

      // 8. HR & ADMINISTRATION
      { 
        path: 'staffs', 
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <StaffList />
          </RoleGuard>
        ) 
      },
      { 
        path: 'staffs/leave-requests', 
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <LeaveRequests />
          </RoleGuard>
        ) 
      },

      // 9. SETTINGS
      { 
        path: 'settings/general', 
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            < GeneralSettings />
          </RoleGuard>
        ) 
      },
      { 
        path: 'settings/roles', 
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            < RolesPermissions />
          </RoleGuard>
        ) 
      },
      { 
        path: 'settings/services', 
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <ServiceCatalog />
          </RoleGuard>
        ) 
      },
      { 
        path: 'settings/doctor_pricing', 
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <DoctorPricing />
          </RoleGuard>
        ) 
      },
      { 
        path: 'settings/expertise', 
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <ExpertiseSettings />
          </RoleGuard>
        ) 
      },
      { 
        path: 'settings/system-logs', 
        element: (
          <RoleGuard allowedRoles={['ADMIN']}>
            <DummyPage title="System Audit Logs" />
          </RoleGuard>
        ) 
      },
    ]
  },
  
  // --- 404 FALLBACK ---
  {
    path: '*',
    element: (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-9xl font-black text-slate-200">404</h1>
        <p className="text-xl font-bold text-slate-600 -mt-8">Page Not Found</p>
        <button onClick={() => window.location.href = '/'} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
          Go Back Home
        </button>
      </div>
    )
  }
]);
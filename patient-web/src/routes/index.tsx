// src/routes/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';

// Home & General Features
import { LandingPage } from '@/features/home/pages/LandingPage';
import { DoctorDirectory } from '@/features/home/pages/DoctorDirectory';
import { ServiceDirectory } from '@/features/home/pages/ServiceDirectory';
import { ContactPage } from '@/features/contact/pages/ContactPage';
import { FAQPage } from '@/features/home/pages/FAQPage';
import { NotificationPage } from '@/features/home/pages/NotificationPage';

// Appointments Feature
import { BookAppointment } from '@/features/appointments/pages/BookAppointment';
import { MyAppointments } from '@/features/appointments/pages/MyAppointments';
import { AppointmentDetail } from '@/features/appointments/pages/AppointmentDetail';

// // Patient Area Features
import { MyProfile } from '@/features/profile/pages/MyProfile';
import { BillingHistory } from '@/features/profile/pages/BillingHistory';
import { MyReviews } from '@/features/profile/pages/MyReviews';
import { MyRecords } from '@/features/records/pages/MyRecords';
import { HealthProfile } from '@/features/records/pages/HealthProfile';
import { Prescriptions } from '@/features/records/pages/Prescriptions';
import { LabResults } from '@/features/records/pages/LabResults';
import { RecordDetail } from '@/features/records/pages/RecordDetail';

// // Chatbot (If you still want it as a separate page, though usually a floating widget)
// import { FloatingChatbot } from '@/features/chatbot/components/FloatingChatbot';

// Auth Feature
import { Login } from '@/features/auth/pages/Login';
import { Register } from '@/features/auth/pages/Register';
import { GoogleRegister } from '@/features/auth/pages/GoogleRegister';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'doctors', element: <DoctorDirectory /> },
      { path: 'services', element: <ServiceDirectory /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'faq', element: <FAQPage /> },
      { path: 'notifications', element: <NotificationPage /> },
      {
        path: 'appointments',
        children: [
          { path: 'book', element: <BookAppointment /> },
          { path: 'detail', element: <AppointmentDetail /> },
          { path: 'my', element: <MyAppointments /> }
        ]
      },
      { path: 'profile', element: <MyProfile /> },
      { path: 'profile/billing', element: <BillingHistory /> },
      { path: 'profile/reviews', element: <MyReviews /> },
      { path: 'records', element: <HealthProfile /> },
      { path: 'records/history', element: <MyRecords /> },
      { path: 'records/detail/:id', element: <RecordDetail /> },
      { path: 'records/prescriptions', element: <Prescriptions /> },
      { path: 'records/lab-results', element: <LabResults /> },
      // { path: 'chatbot', element: <FloatingChatbot /> },
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'google-register', element: <GoogleRegister /> }
    ]
  },
  { path: '*', element: <Navigate to="/" replace /> }
]);
// Import JSON data securely from the local feature directory
import quickActions from '@/features/home/data/quick_actions.json';
import specialties from '@/features/home/data/specialties.json';
import doctors from '@/features/home/data/doctors.json';
import servicesHome from '@/features/home/data/services_home.json';
// Import the comprehensive list for the Services Directory page
import servicesList from '@/features/home/data/services_list.json';

export const homeApi = {
  getQuickActions: () => quickActions,
  getSpecialties: () => specialties,
  getFeaturedDoctors: () => doctors,
  getHomeServices: () => servicesHome,
  // Add this method to serve the full list of lab tests/services
  getListServices: () => servicesList,
};
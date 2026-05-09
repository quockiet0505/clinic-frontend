// --- lib/screens/appointment/select_doctor_screen.dart ---
import 'package:clinic_management_system/app_exports.dart';

class SelectDoctorScreen extends StatefulWidget {
  const SelectDoctorScreen({super.key});

  @override
  State<SelectDoctorScreen> createState() => _SelectDoctorScreenState();
}

class _SelectDoctorScreenState extends State<SelectDoctorScreen> {
  int _selectedSpecialtyIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: AppBar(
        backgroundColor: AppColors.bgLight,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.textMainLight),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text('Select Doctor', style: AppStyles.heading2.copyWith(color: AppColors.textMainLight)),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // 1. Search Bar
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: CustomTextField(
              hintText: 'Search doctor, specialty...',
              prefixIcon: Icons.search_rounded,
            ),
          ),

          // 2. Specialty Categories (Fetched from MockData)
          SizedBox(
            height: 50,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: MockData.specialties.length,
              itemBuilder: (context, index) {
                final isSelected = _selectedSpecialtyIndex == index;
                final specialty = MockData.specialties[index];
                
                return GestureDetector(
                  onTap: () => setState(() => _selectedSpecialtyIndex = index),
                  child: Container(
                    margin: const EdgeInsets.only(right: 12),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.primary : Colors.transparent,
                      border: Border.all(
                        color: isSelected ? AppColors.primary : AppColors.textSubLight.withOpacity(0.2),
                      ),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          specialty['icon'], 
                          size: 20, 
                          color: isSelected ? Colors.white : AppColors.textSubLight
                        ),
                        const SizedBox(width: 8),
                        Text(
                          specialty['name'],
                          style: AppStyles.bodyMedium.copyWith(
                            color: isSelected ? Colors.white : AppColors.textSubLight,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 20),

          // 3. Doctors List (Fetched from MockData)
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: MockData.popularDoctors.length,
              itemBuilder: (context, index) {
                final doctor = MockData.popularDoctors[index];
                return _buildDoctorCard(doctor);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDoctorCard(Map<String, dynamic> doctor) {
    return GestureDetector(
      onTap: () {
        // Navigate to Step 2: Select Date & Time
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const SelectTimeScreen()),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.textSubLight.withOpacity(0.1)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 15,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Image.network(
                doctor['image'],
                height: 80,
                width: 80,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    doctor['name'],
                    style: AppStyles.bodyLarge.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${doctor['specialty']} • TrustCare Clinic',
                    style: AppStyles.caption.copyWith(color: AppColors.textSubLight),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.star_rounded, color: AppColors.warning, size: 18),
                          const SizedBox(width: 4),
                          Text(
                            '${doctor['rating']} (${doctor['reviews']})',
                            style: AppStyles.caption.copyWith(color: AppColors.textMainLight, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      // Fallback fee to $50 if not present in MockData
                      Text(
                        '\$${doctor['fee'] ?? '50'}',
                        style: AppStyles.bodyLarge.copyWith(color: AppColors.primary, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
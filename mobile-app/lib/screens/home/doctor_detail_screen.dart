import 'package:clinic_management_system/app_exports.dart';
import 'package:shimmer/shimmer.dart';

class DoctorDetailScreen extends StatelessWidget {
  final Map<String, dynamic> doctor;

  const DoctorDetailScreen({super.key, required this.doctor});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300.0,
            floating: false,
            pinned: true,
            elevation: 0,
            backgroundColor: Colors.white,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textMainLight, size: 22),
              onPressed: () => Navigator.pop(context),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  CachedNetworkImage(imageUrl: doctor['imageUrl'] ?? 'https://ui-avatars.com/api/?name=N/A&background=random&format=png',
                        memCacheWidth: 400,
                        fadeInDuration: Duration.zero,
                        fadeOutDuration: Duration.zero,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Shimmer.fromColors(
                baseColor: const Color(0xFFE2E8F0),
                highlightColor: const Color(0xFFF8FAFC),
                child: Container(color: Colors.white),
              ),
              errorWidget: (context, url, error) => Container(color: Colors.grey[200], child: const Icon(Icons.person, size: 100, color: Colors.grey)),
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.transparent, Colors.white.withOpacity(0.8), Colors.white],
                        stops: const [0.6, 0.8, 1.0],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(doctor['fullName'] ?? 'Tên bác sĩ', style: AppStyles.heading1),
                  const SizedBox(height: 8),
                  Text(doctor['expertiseName'] ?? 'Chuyên khoa', style: AppStyles.bodyLarge.copyWith(color: AppColors.primary)),
                  const SizedBox(height: 16),
                  
                  // Stats Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildStatItem('Kinh nghiệm', '10+ năm', Icons.work_outline_rounded),
                      _buildStatItem('Đánh giá', '5.0', Icons.star_border_rounded),
                      _buildStatItem('Bệnh nhân', '1K+', Icons.people_outline_rounded),
                    ],
                  ),
                  
                  const SizedBox(height: 32),
                  Text('Giới thiệu', style: AppStyles.heading3),
                  const SizedBox(height: 12),
                  Text(
                    doctor['biography'] ?? 'Bác sĩ có nhiều năm kinh nghiệm trong lĩnh vực khám và điều trị bệnh lý. Luôn tận tâm và nhiệt tình với bệnh nhân.',
                    style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight, height: 1.6),
                  ),
                  
                  const SizedBox(height: 100), // Space for bottom button
                ],
              ),
            ),
          ),
        ],
      ),
      bottomSheet: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, -5))],
        ),
        child: SizedBox(
          width: double.infinity,
          height: 56,
          child: CustomButton(
            text: 'Đặt lịch khám',
            onPressed: () {
              // Context from app exports for navigation
              Navigator.push(context, MaterialPageRoute(builder: (_) => const SelectTimeScreen()));
            },
          ),
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.05), borderRadius: BorderRadius.circular(16)),
          child: Icon(icon, color: AppColors.primary),
        ),
        const SizedBox(height: 8),
        Text(value, style: AppStyles.bodyLarge.copyWith(fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text(label, style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
      ],
    );
  }
}

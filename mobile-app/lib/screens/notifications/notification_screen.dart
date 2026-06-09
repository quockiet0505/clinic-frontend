import 'package:clinic_management_system/app_exports.dart';
import 'package:easy_localization/easy_localization.dart';

class NotificationScreen extends StatelessWidget {
  const NotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock data since backend API isn't ready
    final notifications = [
      {
        'title': 'Lịch khám sắp tới',
        'body': 'Bạn có lịch khám với bác sĩ Nguyễn Văn A vào ngày mai lúc 09:00.',
        'time': '10 phút trước',
        'isRead': false,
        'icon': Icons.calendar_month_rounded,
        'color': AppColors.primary,
      },
      {
        'title': 'Kết quả xét nghiệm',
        'body': 'Kết quả xét nghiệm máu của bạn đã có. Vui lòng kiểm tra trong Hồ sơ y tế.',
        'time': '2 giờ trước',
        'isRead': true,
        'icon': Icons.biotech_rounded,
        'color': AppColors.accentMint,
      },
      {
        'title': 'Cập nhật hệ thống',
        'body': 'Chào mừng bạn đến với phiên bản mới của ClinicCare với nhiều tính năng nâng cấp.',
        'time': '1 ngày trước',
        'isRead': true,
        'icon': Icons.system_update_rounded,
        'color': Colors.orange,
      },
    ];

    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: GradientAppBar(
        title: 'notifications_title'.tr(),
        centerTitle: true,
        actions: [
          TextButton(
            onPressed: () {
              // TODO: Mark all as read API
            },
            child: Text(
              'notifications_mark_all_read'.tr(),
              style: AppStyles.caption.copyWith(color: Colors.white, fontWeight: FontWeight.bold),
            ),
          )
        ],
      ),
      body: notifications.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.notifications_off_rounded, size: 80, color: Colors.grey[300]),
                  const SizedBox(height: 16),
                  Text('notifications_empty'.tr(), style: AppStyles.bodyLarge.copyWith(color: AppColors.textSubLight)),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                final notif = notifications[index];
                final isRead = notif['isRead'] as bool;

                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isRead ? Colors.white : AppColors.primary.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      if (!isRead)
                        BoxShadow(color: AppColors.primary.withOpacity(0.1), blurRadius: 15, offset: const Offset(0, 5))
                      else
                        BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4)),
                    ],
                    border: isRead ? Border.all(color: Colors.grey.withOpacity(0.1)) : Border.all(color: AppColors.primary.withOpacity(0.2)),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: (notif['color'] as Color).withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(notif['icon'] as IconData, color: notif['color'] as Color, size: 24),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    notif['title'] as String,
                                    style: AppStyles.bodyLarge.copyWith(
                                      color: AppColors.textMainLight,
                                      fontWeight: isRead ? FontWeight.w600 : FontWeight.bold,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                if (!isRead)
                                  Container(
                                    width: 8, height: 8,
                                    decoration: const BoxDecoration(color: AppColors.error, shape: BoxShape.circle),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(
                              notif['body'] as String,
                              style: AppStyles.bodyMedium.copyWith(
                                color: isRead ? AppColors.textSubLight : AppColors.textMainLight.withOpacity(0.8),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              notif['time'] as String,
                              style: AppStyles.caption.copyWith(color: AppColors.textSubLight, fontSize: 11),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}

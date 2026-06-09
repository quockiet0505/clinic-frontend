import 'package:clinic_management_system/app_exports.dart';
import 'package:provider/provider.dart';
import 'package:clinic_management_system/providers/appointment_provider.dart';
import 'package:clinic_management_system/screens/appointment/select_doctor_screen.dart';
import 'package:intl/intl.dart';

import 'package:easy_localization/easy_localization.dart';

class AppointmentScreen extends StatefulWidget {
  const AppointmentScreen({super.key});

  @override
  State<AppointmentScreen> createState() => _AppointmentScreenState();
}

class _AppointmentScreenState extends State<AppointmentScreen> {

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AppointmentProvider>().fetchMyAppointments();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: GradientAppBar(
        title: 'schedule_title'.tr(),
        automaticallyImplyLeading: false,
      ),
      body: Consumer<AppointmentProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator(color: AppColors.primary));
          }

          final appointments = provider.myAppointments;

          return Column(
            children: [
              // Search and Filter Bar
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: Row(
                  children: [
                    Expanded(
                      child: Container(
                        height: 48,
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [BoxShadow(color: AppColors.textSubLight.withOpacity(0.1), blurRadius: 20, offset: const Offset(0, 10))],
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.search_rounded, color: AppColors.textSubLight.withOpacity(0.7)),
                            const SizedBox(width: 12),
                            Expanded(
                              child: TextField(
                                decoration: InputDecoration(
                                  hintText: 'schedule_search'.tr(),
                                  hintStyle: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight.withOpacity(0.7)),
                                  border: InputBorder.none,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Container(
                      height: 48, width: 48,
                      decoration: BoxDecoration(
                        color: AppColors.primary, 
                        borderRadius: BorderRadius.circular(16), 
                        boxShadow: [BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 12, offset: const Offset(0, 4))]
                      ),
                      child: IconButton(
                        icon: const Icon(Icons.tune_rounded, color: Colors.white, size: 24),
                        onPressed: () {},
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: _buildAppointmentList(appointments),
              ),
            ],
          );
        },
      ),
      floatingActionButton: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(30),
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withOpacity(0.3), 
              blurRadius: 15, 
              offset: const Offset(0, 5)
            ),
          ],
        ),
        child: GradientButton(
          text: 'home_book_now'.tr(),
          icon: Icons.add_rounded,
          height: 50,
          padding: const EdgeInsets.symmetric(horizontal: 20),
          onPressed: () {
            Navigator.push(context, MaterialPageRoute(builder: (context) => const SelectDoctorScreen()));
          },
        ),
      ),
    );
  }

  Widget _buildAppointmentList(List<Map<String, dynamic>> appointments) {
    if (appointments.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.event_busy_rounded, size: 80, color: Colors.grey[300]),
            const SizedBox(height: 16),
            Text('schedule_empty'.tr(), style: AppStyles.bodyLarge.copyWith(color: AppColors.textSubLight)),
          ],
        ),
      );
    }

    // Sort by date (newest first for simplicity, or nearest first)
    appointments.sort((a, b) {
      final dateA = a['appointmentDate'] ?? '';
      final dateB = b['appointmentDate'] ?? '';
      return dateB.compareTo(dateA); // descending
    });

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 24).copyWith(bottom: 100),
      itemCount: appointments.length, 
      itemBuilder: (context, index) {
        final apt = appointments[index];
        final doctorName = apt['doctorName'] ?? 'Bác sĩ';
        final expertise = apt['expertiseName'] ?? 'Chuyên khoa';
        final dateStr = apt['appointmentDate'] ?? '';
        final timeStr = apt['timeStart'] ?? '';
        final status = apt['status'] ?? '';
        
        String formattedDate = '';
        if (dateStr.isNotEmpty) {
          try {
            final d = DateTime.parse(dateStr);
            formattedDate = DateFormat('dd MMM, yyyy').format(d);
          } catch (e) {
            formattedDate = dateStr;
          }
        }

        String formattedTime = timeStr;
        if (timeStr.length >= 5) {
          formattedTime = timeStr.substring(0, 5); // 09:00:00 -> 09:00
        }

        Color statusColor = Colors.green;
        String statusText = status;
        bool isUpcoming = false;
        
        if (status == 'SCHEDULED' || status == 'CONFIRMED') {
          statusColor = Colors.green;
          statusText = 'schedule_confirmed'.tr();
          isUpcoming = true;
        } else if (status == 'CANCELLED') {
          statusColor = Colors.red;
          statusText = 'schedule_cancelled'.tr();
        } else if (status == 'COMPLETED') {
          statusColor = AppColors.primary;
          statusText = 'schedule_completed'.tr();
        }

        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 15, offset: const Offset(0, 5)),
            ],
            border: Border.all(color: Colors.grey.withOpacity(0.1)),
          ),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.calendar_month_rounded, color: AppColors.primary, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(formattedDate, style: AppStyles.bodyLarge.copyWith(fontWeight: FontWeight.bold)),
                          Text(formattedTime, style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(statusText, style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 12)),
                  ),
                ],
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 16),
                child: Divider(color: Colors.grey[100]),
              ),
              Row(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      image: const DecorationImage(image: NetworkImage('https://i.pravatar.cc/150?img=5'), fit: BoxFit.cover),
                      border: Border.all(color: AppColors.primary.withOpacity(0.2), width: 2),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(doctorName, style: AppStyles.bodyLarge.copyWith(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 2),
                        Text(expertise, style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.more_vert_rounded, color: AppColors.textSubLight),
                  )
                ],
              ),
              if (isUpcoming) ...[
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {},
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          side: BorderSide(color: AppColors.error.withOpacity(0.5)),
                        ),
                        child: Text('schedule_cancel_btn'.tr(), style: const TextStyle(color: AppColors.error)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: GradientButton(
                        text: 'schedule_reschedule_btn'.tr(),
                        height: 48,
                        padding: EdgeInsets.zero,
                        onPressed: () {},
                      ),
                    ),
                  ],
                )
              ]
            ],
          ),
        );
      },
    );
  }
}
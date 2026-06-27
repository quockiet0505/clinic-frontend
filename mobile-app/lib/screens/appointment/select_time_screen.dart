import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/utils/image_utils.dart';
import 'package:provider/provider.dart';
import 'package:clinic_management_system/providers/appointment_provider.dart';
import 'package:clinic_management_system/screens/appointment/confirm_booking_screen.dart';
import 'package:clinic_management_system/screens/appointment/select_doctor_screen.dart';
import 'package:clinic_management_system/utils/currency_formatter.dart';

class SelectTimeScreen extends StatefulWidget {
  const SelectTimeScreen({super.key});

  @override
  State<SelectTimeScreen> createState() => _SelectTimeScreenState();
}

class _SelectTimeScreenState extends State<SelectTimeScreen> {
  int _selectedDateIndex = 0;

  List<Map<String, String>> _generateDates() {
    final List<Map<String, String>> dates = [];
    final now = DateTime.now();
    final weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    for (int i = 0; i < 14; i++) {
      final date = now.add(Duration(days: i));
      dates.add({
        'day': weekDays[date.weekday - 1],
        'date': date.day.toString().padLeft(2, '0'),
        'month': '/${date.month}',
        'fullDate': "${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}"
      });
    }
    return dates;
  }

  late List<Map<String, String>> _availableDates;

  @override
  void initState() {
    super.initState();
    _availableDates = _generateDates();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AppointmentProvider>().selectDate(_availableDates[0]['fullDate']!);
    });
  }

  void _handleContinue(AppointmentProvider provider) {
    if (provider.selectedTimeSlot == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Vui lòng chọn thời gian khám'),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
      return;
    }
    if (provider.note.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Vui lòng nhập triệu chứng / lý do khám'),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
      return;
    }
    Navigator.push(context, MaterialPageRoute(builder: (context) => const ConfirmBookingScreen()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFF),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8FAFF),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, color: Color(0xFF1F2937), size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Chọn Ngày & Giờ', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF1F2937), fontSize: 18)),
        centerTitle: true,
      ),
      body: Consumer<AppointmentProvider>(
        builder: (context, provider, child) {
          final doctor = provider.selectedDoctor;
          final service = provider.selectedService;
          final specialty = provider.selectedSpecialty;

          if (doctor == null && service == null && specialty == null) {
            return const Center(child: Text("Missing Data"));
          }

          if (provider.bookingMode == 'DOCTOR' && doctor == null) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.person_search, size: 48, color: Color(0xFF9CA3AF)),
                    const SizedBox(height: 16),
                    const Text(
                      'Vui lòng chọn bác sĩ trước khi chọn ngày giờ',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF374151)),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      specialty != null ? 'Chuyên khoa: ${specialty['expertiseName'] ?? ''}' : '',
                      style: const TextStyle(fontSize: 13, color: Color(0xFF6B7280)),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const SelectDoctorScreen()),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('Chọn bác sĩ'),
                    ),
                  ],
                ),
              ),
            );
          }

          return Column(
            children: [
              // Info Card - part of scroll, same bg as body
              Container(
                margin: const EdgeInsets.fromLTRB(20, 12, 20, 0),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 3))],
                ),
                child: Row(
                  children: [
                      // Avatar / Icon
                      if (doctor != null) ...[
                        Hero(
                          tag: 'doctor_img_${doctor.id}',
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(14),
                            child: Image.network(
                              ImageUtils.fixImageUrl(doctor.imageUrl),
                              height: 64, width: 64, fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => Container(color: Colors.grey[200], height: 64, width: 64, child: const Icon(Icons.person)),
                            ),
                          ),
                        ),
                      ] else if (service != null) ...[
                        Container(
                          height: 64, width: 64,
                          decoration: BoxDecoration(color: AppColors.primary.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(14)),
                          child: const Icon(Icons.medical_services_outlined, color: AppColors.primary, size: 32),
                        ),
                      ] else if (specialty != null) ...[
                        Container(
                          height: 64, width: 64,
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
                          child: Image.network(
                            ImageUtils.fixImageUrl(specialty['iconUrl'] ?? specialty['imageUrl'] ?? ''),
                            fit: BoxFit.contain,
                            errorBuilder: (_, __, ___) => const Icon(Icons.medical_services, color: AppColors.primary),
                          ),
                        ),
                      ],
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (doctor != null) ...[
                              Text('BS. ${doctor.name}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1F2937))),
                              const SizedBox(height: 2),
                              Text(doctor.specialty ?? 'Chuyên khoa', style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  const Icon(Icons.payments_rounded, size: 14, color: Color(0xFF10B981)),
                                  const SizedBox(width: 4),
                                  Text(
                                    CurrencyFormatter.formatVND(doctor.consultationFee),
                                    style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 13),
                                  ),
                                ],
                              ),
                            ] else if (service != null) ...[
                              Text(service.serviceName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1F2937)), maxLines: 2),
                              const SizedBox(height: 2),
                              Text(service.serviceType, style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  const Icon(Icons.payments_rounded, size: 14, color: Color(0xFF10B981)),
                                  const SizedBox(width: 4),
                                  Text(
                                    CurrencyFormatter.formatVND(service.discountPrice ?? service.originalPrice),
                                    style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 13),
                                  ),
                                ],
                              ),
                            ] else if (specialty != null) ...[
                              Text(specialty['expertiseName'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1F2937))),
                              const SizedBox(height: 2),
                              const Text('Khám chuyên khoa', style: TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
                            ],
                          ],
                        ),
                      ),
                    ],
                ),
              ),

              // Scrollable content
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Date picker
                      const Text('Chọn ngày khám', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1F2937))),
                      const SizedBox(height: 12),
                      SizedBox(
                        height: 80,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: _availableDates.length,
                          itemBuilder: (context, index) => _buildDateCard(index, provider),
                        ),
                      ),
                      const SizedBox(height: 28),

                      // Time Slots
                      Row(
                        children: [
                          const Text('Chọn giờ khám', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1F2937))),
                          const SizedBox(width: 4),
                          const Text('*', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 16)),
                        ],
                      ),
                      const SizedBox(height: 16),

                      if (provider.isLoading)
                        const Center(child: CircularProgressIndicator())
                      else
                        _buildTimeGrid(provider),

                      const SizedBox(height: 28),

                      // Symptom input
                      Row(
                        children: [
                          const Text('Triệu chứng / Lý do khám', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1F2937))),
                          const SizedBox(width: 4),
                          const Text('*', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 16)),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 8, offset: const Offset(0, 2)),
                          ],
                        ),
                        child: TextField(
                          onChanged: provider.updateNote,
                          maxLines: 4,
                          decoration: InputDecoration(
                            hintText: 'Mô tả triệu chứng, lý do đến khám...',
                            hintStyle: const TextStyle(color: Color(0xFF9CA3AF), fontSize: 14),
                            prefixIcon: const Padding(
                              padding: EdgeInsets.only(bottom: 60.0),
                              child: Icon(Icons.edit_note_rounded, color: AppColors.primary, size: 24),
                            ),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                            ),
                            filled: true,
                            fillColor: Colors.white,
                            contentPadding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ),

              // Bottom action bar
              _buildBottomBar(provider),
            ],
          );
        },
      ),
    );
  }

  Widget _buildDateCard(int index, AppointmentProvider provider) {
    final isSelected = _selectedDateIndex == index;
    final date = _availableDates[index];

    return GestureDetector(
      onTap: () {
        setState(() => _selectedDateIndex = index);
        provider.selectDate(date['fullDate']!);
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: 58,
        margin: const EdgeInsets.only(right: 10),
        decoration: BoxDecoration(
          gradient: isSelected
              ? const LinearGradient(
                  colors: [AppColors.primary, Color(0xFF7C3AED)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                )
              : null,
          color: isSelected ? null : Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: isSelected
              ? [BoxShadow(color: AppColors.primary.withValues(alpha: 0.35), blurRadius: 12, offset: const Offset(0, 4))]
              : [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 6, offset: const Offset(0, 2))],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              date['day']!,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: isSelected ? Colors.white.withValues(alpha: 0.8) : const Color(0xFF9CA3AF),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              date['date']!,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: isSelected ? Colors.white : const Color(0xFF1F2937),
              ),
            ),
            Text(
              date['month']!,
              style: TextStyle(
                fontSize: 10,
                color: isSelected ? Colors.white.withValues(alpha: 0.7) : const Color(0xFF9CA3AF),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTimeGrid(AppointmentProvider provider) {
    if (provider.availableSlots.isEmpty) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: 20),
        child: Center(
          child: Text(
            'Không có lịch trống trong ngày này',
            style: TextStyle(color: Color(0xFF6B7280), fontSize: 14),
          ),
        ),
      );
    }

    final morningSlots = provider.availableSlots.where((slot) {
      final timeStr = slot['timeStart'] as String;
      if (timeStr.isEmpty) return false;
      final hour = int.tryParse(timeStr.split(':')[0]) ?? 0;
      return hour < 12;
    }).toList();

    final afternoonSlots = provider.availableSlots.where((slot) {
      final timeStr = slot['timeStart'] as String;
      if (timeStr.isEmpty) return false;
      final hour = int.tryParse(timeStr.split(':')[0]) ?? 0;
      return hour >= 12;
    }).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (morningSlots.isNotEmpty) ...[
          _buildSessionHeader(Icons.wb_sunny_rounded, 'Buổi sáng', const Color(0xFFFF8008)),
          const SizedBox(height: 10),
          _buildTimeGridView(morningSlots, provider),
          const SizedBox(height: 20),
        ],
        if (afternoonSlots.isNotEmpty) ...[
          _buildSessionHeader(Icons.nights_stay_rounded, 'Buổi chiều', const Color(0xFF6366F1)),
          const SizedBox(height: 10),
          _buildTimeGridView(afternoonSlots, provider),
        ],
      ],
    );
  }

  Widget _buildSessionHeader(IconData icon, String label, Color color) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
          child: Icon(icon, color: color, size: 16),
        ),
        const SizedBox(width: 8),
        Text(label, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 14)),
      ],
    );
  }

  Widget _buildTimeGridView(List<Map<String, dynamic>> slots, AppointmentProvider provider) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        childAspectRatio: 2.2,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
      ),
      itemCount: slots.length,
      itemBuilder: (context, index) {
        final slot = slots[index];
        final timeStr = slot['timeStart'] as String;
        final isAvailable = slot['isAvailable'] == true;
        final doctorName = slot['doctorName'] as String?;

        final isSelected = isAvailable &&
            provider.selectedTimeSlot != null &&
            provider.selectedTimeSlot!['timeStart'] == timeStr;

        return GestureDetector(
          onTap: isAvailable ? () => provider.selectTimeSlot(slot) : null,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 180),
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
            decoration: BoxDecoration(
              gradient: isSelected
                  ? const LinearGradient(
                      colors: [Color(0xFFFF8008), Color(0xFFFFC837)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    )
                  : null,
              color: isSelected ? null : (isAvailable ? Colors.white : const Color(0xFFF3F4F6)),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isSelected
                    ? Colors.transparent
                    : (isAvailable
                        ? const Color(0xFFFF8008).withValues(alpha: 0.3)
                        : Colors.transparent),
                width: 1.5,
              ),
              boxShadow: isSelected
                  ? [BoxShadow(color: const Color(0xFFFF8008).withValues(alpha: 0.4), blurRadius: 8, offset: const Offset(0, 3))]
                  : (isAvailable ? [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 4)] : []),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  timeStr.length >= 5 ? timeStr.substring(0, 5) : timeStr,
                  style: TextStyle(
                    fontSize: 13,
                    color: isSelected
                        ? Colors.white
                        : (isAvailable ? const Color(0xFF1F2937) : const Color(0xFFD1D5DB)),
                    fontWeight: isSelected ? FontWeight.bold : (isAvailable ? FontWeight.w600 : FontWeight.normal),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildBottomBar(AppointmentProvider provider) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 16, offset: const Offset(0, -4)),
        ],
      ),
      child: SizedBox(
        width: double.infinity,
        height: 52,
        child: ElevatedButton(
          onPressed: () => _handleContinue(provider),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            elevation: 0,
          ),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Tiếp tục', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
              SizedBox(width: 8),
              Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 20),
            ],
          ),
        ),
      ),
    );
  }
}

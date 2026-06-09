import 'package:clinic_management_system/app_exports.dart';
import 'package:provider/provider.dart';
import 'package:clinic_management_system/providers/appointment_provider.dart';
import 'confirm_booking_screen.dart';

class SelectTimeScreen extends StatefulWidget {
  const SelectTimeScreen({super.key});

  @override
  State<SelectTimeScreen> createState() => _SelectTimeScreenState();
}

class _SelectTimeScreenState extends State<SelectTimeScreen> {
  int _selectedDateIndex = 0;

  // Next 7 days
  List<Map<String, String>> _generateDates() {
    final List<Map<String, String>> dates = [];
    final now = DateTime.now();
    final weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (int i = 0; i < 7; i++) {
      final date = now.add(Duration(days: i));
      dates.add({
        'day': weekDays[date.weekday - 1],
        'date': date.day.toString().padLeft(2, '0'),
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
    if (provider.selectedTime == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a time slot first')),
      );
      return;
    }
    // TODO: Navigate to Confirm Booking Screen
    Navigator.push(context, MaterialPageRoute(builder: (context) => const ConfirmBookingScreen()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: const GradientAppBar(
        title: 'Chọn Ngày & Giờ',
      ),
      body: Consumer<AppointmentProvider>(
        builder: (context, provider, child) {
          final selectedDoctor = provider.selectedDoctor;
          if (selectedDoctor == null) {
            return const Center(child: Text("No doctor selected."));
          }

          return Column(
            children: [
              // Doctor Info Header
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
                child: Row(
                  children: [
                    Hero(
                      tag: 'doctor_img_${selectedDoctor['staffId']}',
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(
                          selectedDoctor['imageUrl'] ?? 'https://via.placeholder.com/150',
                          height: 60, width: 60, fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Container(color: Colors.grey[200], height: 60, width: 60, child: const Icon(Icons.person, color: Colors.grey)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Dr. ${selectedDoctor['fullName']}', style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
                        Text(selectedDoctor['expertiseName'] ?? 'Specialist', style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
                      ],
                    )
                  ],
                ),
              ),

              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 1. Date Selection
                      Text(DateTime.now().year.toString(), style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
                      const SizedBox(height: 16),
                      SizedBox(
                        height: 85,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: _availableDates.length,
                          itemBuilder: (context, index) {
                            return _buildDateCard(index, provider);
                          },
                        ),
                      ),
                      const SizedBox(height: 32),

                      // 2. Time Slots
                      Text('Available Time', style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
                      const SizedBox(height: 16),
                      
                      if (provider.isLoading)
                        const Center(child: CircularProgressIndicator())
                      else if (provider.availableSlots.isEmpty)
                        const Center(child: Padding(
                          padding: EdgeInsets.all(20.0),
                          child: Text("No available slots on this date."),
                        ))
                      else
                        _buildTimeGrid(provider),
                    ],
                  ),
                ),
              ),
              
              // Bottom Action Bar
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
        setState(() {
          _selectedDateIndex = index;
        });
        provider.selectDate(date['fullDate']!);
      },
      child: Container(
        width: 65,
        margin: const EdgeInsets.only(right: 12),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.textSubLight.withOpacity(0.2),
          ),
          boxShadow: isSelected ? [
            BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4))
          ] : [],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              date['day']!,
              style: AppStyles.caption.copyWith(
                color: isSelected ? Colors.white.withOpacity(0.8) : AppColors.textSubLight,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              date['date']!,
              style: AppStyles.heading3.copyWith(
                color: isSelected ? Colors.white : AppColors.textMainLight,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTimeGrid(AppointmentProvider provider) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        childAspectRatio: 2.5,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: provider.availableSlots.length,
      itemBuilder: (context, index) {
        final time = provider.availableSlots[index];
        final isSelected = provider.selectedTime == time;

        return GestureDetector(
          onTap: () => provider.selectTime(time),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: isSelected ? AppColors.primary : Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isSelected ? AppColors.primary : AppColors.textSubLight.withOpacity(0.2),
              ),
              boxShadow: isSelected ? [
                BoxShadow(color: AppColors.primary.withOpacity(0.2), blurRadius: 8, offset: const Offset(0, 4))
              ] : [],
            ),
            child: Text(
              time,
              style: AppStyles.bodyMedium.copyWith(
                color: isSelected ? Colors.white : AppColors.textMainLight,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildBottomBar(AppointmentProvider provider) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: CustomButton(
              text: 'Continue',
              onPressed: () => _handleContinue(provider),
            ),
          ),
        ],
      ),
    );
  }
}
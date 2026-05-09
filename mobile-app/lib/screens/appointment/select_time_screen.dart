// --- lib/screens/appointment/select_time_screen.dart ---
import 'package:clinic_management_system/app_exports.dart';

class SelectTimeScreen extends StatefulWidget {
  const SelectTimeScreen({super.key});

  @override
  State<SelectTimeScreen> createState() => _SelectTimeScreenState();
}

class _SelectTimeScreenState extends State<SelectTimeScreen> {
  int _selectedDateIndex = 0;
  int _selectedTimeIndex = -1;

  // Mock Data: Next 7 days
  final List<Map<String, String>> _availableDates = [
    {'day': 'Mon', 'date': '24'},
    {'day': 'Tue', 'date': '25'},
    {'day': 'Wed', 'date': '26'},
    {'day': 'Thu', 'date': '27'},
    {'day': 'Fri', 'date': '28'},
    {'day': 'Sat', 'date': '29'},
    {'day': 'Sun', 'date': '30'},
  ];

  // Mock Data: Time slots
  final List<String> _morningSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
  final List<String> _afternoonSlots = ['01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM'];

  void _handleContinue() {
    if (_selectedTimeIndex == -1) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a time slot first')),
      );
      return;
    }
    // TODO: Navigate to Confirm Booking Screen
    // Navigator.push(context, MaterialPageRoute(builder: (context) => const ConfirmBookingScreen()));
  }

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
        title: Text('Select Date & Time', style: AppStyles.heading2.copyWith(color: AppColors.textMainLight)),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. Date Selection Section
                  Text('October 2026', style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
                  const SizedBox(height: 16),
                  SizedBox(
                    height: 85,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _availableDates.length,
                      itemBuilder: (context, index) {
                        return _buildDateCard(index);
                      },
                    ),
                  ),
                  const SizedBox(height: 32),

                  // 2. Morning Time Slots
                  Text('Morning', style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
                  const SizedBox(height: 16),
                  _buildTimeGrid(_morningSlots, 0),
                  
                  const SizedBox(height: 32),

                  // 3. Afternoon Time Slots
                  Text('Afternoon', style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
                  const SizedBox(height: 16),
                  _buildTimeGrid(_afternoonSlots, _morningSlots.length),
                ],
              ),
            ),
          ),
          
          // 4. Bottom Action Bar
          _buildBottomBar(),
        ],
      ),
    );
  }

  // Helper Widget: Date Card
  Widget _buildDateCard(int index) {
    final isSelected = _selectedDateIndex == index;
    final date = _availableDates[index];

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedDateIndex = index;
          _selectedTimeIndex = -1; // Reset time when date changes
        });
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

  // Helper Widget: Time Slots Grid
  Widget _buildTimeGrid(List<String> slots, int startIndexOffset) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        childAspectRatio: 2.5,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: slots.length,
      itemBuilder: (context, index) {
        // Calculate global index to keep track across both morning and afternoon lists
        final globalIndex = startIndexOffset + index;
        final isSelected = _selectedTimeIndex == globalIndex;

        return GestureDetector(
          onTap: () => setState(() => _selectedTimeIndex = globalIndex),
          child: Container(
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: isSelected ? AppColors.primary : Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isSelected ? AppColors.primary : AppColors.textSubLight.withOpacity(0.2),
              ),
            ),
            child: Text(
              slots[index],
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

  // Helper Widget: Bottom Bar with Price and Button
  Widget _buildBottomBar() {
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
              onPressed: _handleContinue,
            ),
          ),
        ],
      ),
    );
  }
}
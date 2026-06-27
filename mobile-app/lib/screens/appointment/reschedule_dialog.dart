import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:clinic_management_system/providers/appointment_provider.dart';
import 'package:clinic_management_system/models/appointment_model.dart';
import 'package:intl/intl.dart';

class RescheduleDialog extends StatefulWidget {
  final AppointmentModel appointment;

  const RescheduleDialog({Key? key, required this.appointment}) : super(key: key);

  @override
  State<RescheduleDialog> createState() => _RescheduleDialogState();
}

class _RescheduleDialogState extends State<RescheduleDialog> {
  final TextEditingController _reasonController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final provider = context.read<AppointmentProvider>();
      // Pre-select current doctor or expertise if DOCTOR mode
      if (widget.appointment.bookingMode != 'SERVICE' && widget.appointment.mainDoctorId != null) {
        // Need to refetch doctor to select it properly, but for now we just allow date/time selection
      }
    });
  }

  @override
  void dispose() {
    _reasonController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context, AppointmentProvider provider) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 30)),
    );
    if (picked != null) {
      provider.selectDate(DateFormat('yyyy-MM-dd').format(picked));
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppointmentProvider>();
    final remain = 2 - (widget.appointment.rescheduleCount ?? 0);

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.amber[50],
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.edit_calendar_rounded, color: Colors.amber, size: 24),
                  ),
                  const SizedBox(width: 16),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Dời lịch hẹn', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Bạn còn $remain lần dời lịch. Vui lòng chọn ngày giờ mới.',
                style: const TextStyle(color: Colors.grey, fontSize: 13),
              ),
              const SizedBox(height: 24),
              
              // Date Picker
              const Text('Ngày khám mới', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 8),
              InkWell(
                onTap: () => _selectDate(context, provider),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    border: Border.all(color: Colors.grey[200]!),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        provider.selectedDate != null 
                          ? DateFormat('dd/MM/yyyy').format(DateTime.parse(provider.selectedDate!))
                          : 'Chọn ngày khám',
                        style: TextStyle(
                          color: provider.selectedDate != null ? Colors.black87 : Colors.grey,
                          fontSize: 14,
                        ),
                      ),
                      const Icon(Icons.calendar_month, color: Colors.grey, size: 20),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              
              // Time Slots
              if (provider.selectedDate != null) ...[
                const Text('Giờ khám mới', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                const SizedBox(height: 8),
                if (provider.isLoading)
                  const Center(child: Padding(padding: EdgeInsets.all(16), child: CircularProgressIndicator()))
                else if (provider.availableSlots.isEmpty)
                  const Text('Không có giờ trống', style: TextStyle(color: Colors.red))
                else
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: provider.availableSlots.map((slot) {
                      final isSelected = provider.selectedTimeSlot == slot;
                      final isAvailable = slot['isAvailable'] == true;
                      
                      return InkWell(
                        onTap: isAvailable ? () => provider.selectTimeSlot(slot) : null,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          decoration: BoxDecoration(
                            color: isSelected 
                              ? Colors.amber 
                              : (isAvailable ? Colors.white : Colors.grey[100]),
                            border: Border.all(
                              color: isSelected ? Colors.amber : Colors.grey[300]!
                            ),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            slot['timeStart'].substring(0, 5),
                            style: TextStyle(
                              color: isSelected 
                                ? Colors.white 
                                : (isAvailable ? Colors.black87 : Colors.grey),
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                const SizedBox(height: 16),
              ],
              
              // Reason
              const Text('Lý do dời lịch', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 8),
              TextField(
                controller: _reasonController,
                maxLines: 3,
                decoration: InputDecoration(
                  hintText: 'Nhập lý do dời lịch...',
                  hintStyle: const TextStyle(color: Colors.grey, fontSize: 14),
                  filled: true,
                  fillColor: Colors.grey[50],
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey[200]!),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey[200]!),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              
              // Action Buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('Huỷ', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: provider.isLoading ? null : () async {
                        if (_reasonController.text.trim().isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Vui lòng nhập lý do')),
                          );
                          return;
                        }
                        final success = await provider.rescheduleAppointment(
                          appointmentId: widget.appointment.appointmentId,
                          reason: _reasonController.text.trim(),
                        );
                        if (success && mounted) {
                          Navigator.pop(context, true);
                        } else if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(provider.error ?? 'Dời lịch thất bại')),
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.amber,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        elevation: 0,
                      ),
                      child: provider.isLoading
                          ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                          : const Text('Xác nhận', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

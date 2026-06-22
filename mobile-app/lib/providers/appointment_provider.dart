import 'package:flutter/material.dart';
import '../core/network/dio_client.dart';
import '../models/appointment_model.dart';
import '../models/doctor_model.dart';
import '../models/service_model.dart';
import '../services/booking_service.dart';

class AppointmentProvider extends ChangeNotifier {
  final BookingService _bookingService = BookingService();

  DoctorModel? selectedDoctor;
  ServiceModel? selectedService;
  Map<String, dynamic>? selectedSpecialty;
  String? selectedDate;
  Map<String, dynamic>? selectedTimeSlot;
  int? selectedExpertiseId;
  int? suggestedExpertiseId;
  String note = '';
  String bookingMode = 'DOCTOR';
  bool isAiSuggested = false;

  bool isLoading = false;
  String? error;

  List<Map<String, dynamic>> availableSlots = [];

  List<AppointmentModel> myAppointments = [];

  void selectDoctor(DoctorModel doctor) {
    selectedDoctor = doctor;
    selectedService = null;
    selectedSpecialty = null;
    selectedExpertiseId = doctor.expertiseId;
    bookingMode = 'DOCTOR';
    selectedDate = null;
    selectedTimeSlot = null;
    note = '';
    availableSlots = [];
    notifyListeners();
  }

  void selectService(ServiceModel service) {
    selectedService = service;
    selectedDoctor = null;
    selectedSpecialty = null;
    selectedExpertiseId = null;
    bookingMode = 'SERVICE';
    selectedDate = null;
    selectedTimeSlot = null;
    note = '';
    availableSlots = [];
    notifyListeners();
  }

  void selectSpecialty(Map<String, dynamic> specialty) {
    selectedSpecialty = specialty;
    selectedDoctor = null;
    selectedService = null;
    selectedExpertiseId = specialty['expertiseId'];
    bookingMode = 'EXPERTISE';
    selectedDate = null;
    selectedTimeSlot = null;
    note = '';
    availableSlots = [];
    notifyListeners();
  }

  void applyAiSuggestion({
    required int suggestedExpertiseId,
    int? selectedExpertiseId,
    String? symptomNote,
  }) {
    this.suggestedExpertiseId = suggestedExpertiseId;
    isAiSuggested = true;
    if (selectedExpertiseId != null) {
      this.selectedExpertiseId = selectedExpertiseId;
      bookingMode = 'EXPERTISE';
    }
    if (symptomNote != null && symptomNote.isNotEmpty) {
      note = symptomNote;
    }
    notifyListeners();
  }

  void updateNote(String newNote) {
    note = newNote;
    notifyListeners();
  }

  Future<void> fetchMyAppointments() async {
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final data = await _bookingService.getMyAppointments();
      myAppointments = data.map((e) => AppointmentModel.fromJson(e)).toList();
    } catch (e) {
      error = e.toString().replaceAll('Exception: ', '');
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  void selectDate(String date) {
    selectedDate = date;
    selectedTimeSlot = null;
    fetchAvailableSlots();
  }

  void selectTimeSlot(Map<String, dynamic> slot) {
    selectedTimeSlot = slot;
    final doctorId = slot['doctorId'];
    if (doctorId != null && selectedDoctor == null && bookingMode == 'EXPERTISE') {
      // Slot từ chuyên khoa có gán bác sĩ
    }
    notifyListeners();
  }

  Future<void> fetchAvailableSlots() async {
    if (selectedDate == null) return;

    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final data = await _bookingService.getAvailableSlots(
        doctorId: selectedDoctor?.id,
        expertiseId: bookingMode == 'EXPERTISE' ? selectedExpertiseId : null,
        serviceId: bookingMode == 'SERVICE' ? selectedService?.serviceId : null,
        date: selectedDate!,
      );

      availableSlots = data.map((e) {
        if (e is String) return {'timeStart': e, 'timeEnd': '', 'isAvailable': true};
        return {
          'timeStart': e['timeStart'] ?? e['time'] ?? e['startTime']?.toString() ?? '',
          'timeEnd': e['timeEnd'] ?? '',
          'isAvailable': e['isAvailable'] ?? true,
          'doctorId': e['doctorId'],
          'doctorName': e['doctorName'],
        };
      }).toList();
    } catch (e) {
      error = e.toString().replaceAll('Exception: ', '');
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> confirmBooking() async {
    if (selectedDate == null || selectedTimeSlot == null) return false;

    isLoading = true;
    notifyListeners();

    try {
      int? doctorId = selectedDoctor?.id;
      if (doctorId == null && selectedTimeSlot?['doctorId'] != null) {
        doctorId = selectedTimeSlot!['doctorId'] as int?;
      }

      await _bookingService.confirmBooking(
        doctorId: doctorId,
        serviceId: selectedService?.serviceId,
        expertiseId: selectedExpertiseId,
        suggestedExpertiseId: suggestedExpertiseId,
        bookingMode: bookingMode,
        date: selectedDate!,
        timeStart: selectedTimeSlot!['timeStart'],
        timeEnd: selectedTimeSlot!['timeEnd'] ?? selectedTimeSlot!['timeStart'],
        note: note,
        isAiSuggested: isAiSuggested,
      );
      return true;
    } catch (e) {
      error = e.toString().replaceAll('Exception: ', '');
      return false;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }
}

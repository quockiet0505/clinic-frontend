import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'dart:convert';
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
    if (!isPatientBookableService(service.serviceType)) {
      error = 'Dịch vụ này chỉ được chỉ định trong quá trình khám.';
      notifyListeners();
      return;
    }
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
    bookingMode = 'DOCTOR';
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
      bookingMode = 'DOCTOR';
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

  Future<void> fetchMyAppointments({bool forceRefresh = false}) async {
    final box = Hive.box('appCache');
    const cacheKeyAppts = 'cached_appointments';
    const cacheKeyTime = 'appointments_timestamp';

    if (!forceRefresh) {
      final int? timestamp = box.get(cacheKeyTime);
      if (timestamp != null) {
        final lastFetch = DateTime.fromMillisecondsSinceEpoch(timestamp);
        final diff = DateTime.now().difference(lastFetch).inMinutes;

        if (diff < 5) {
          final String? cachedData = box.get(cacheKeyAppts);
          if (cachedData != null) {
            try {
              final List<dynamic> list = jsonDecode(cachedData);
              myAppointments = list.map((e) => AppointmentModel.fromJson(e)).toList();
              notifyListeners();
              return;
            } catch (_) {}
          }
        } else {
          final String? cachedData = box.get(cacheKeyAppts);
          if (cachedData != null) {
            try {
              final List<dynamic> list = jsonDecode(cachedData);
              myAppointments = list.map((e) => AppointmentModel.fromJson(e)).toList();
              notifyListeners();
            } catch (_) {}
          }
        }
      }
    }

    if (myAppointments.isEmpty) {
      isLoading = true;
      notifyListeners();
    }
    error = null;

    try {
      final data = await _bookingService.getMyAppointments();
      myAppointments = data.map((e) => AppointmentModel.fromJson(e)).toList();
      
      box.put(cacheKeyAppts, jsonEncode(data));
      box.put(cacheKeyTime, DateTime.now().millisecondsSinceEpoch);
    } catch (e) {
      if (myAppointments.isEmpty) {
        error = e.toString().replaceAll('Exception: ', '');
      }
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
    notifyListeners();
  }

  Future<void> fetchAvailableSlots() async {
    if (selectedDate == null) return;

    if (bookingMode == 'DOCTOR' && selectedDoctor == null) {
      availableSlots = [];
      notifyListeners();
      return;
    }

    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final data = await _bookingService.getAvailableSlots(
        doctorId: selectedDoctor?.id,
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

    if (bookingMode == 'DOCTOR') {
      if (selectedExpertiseId == null || selectedDoctor == null) {
        error = 'Vui lòng chọn chuyên khoa và bác sĩ.';
        notifyListeners();
        return false;
      }
    }

    isLoading = true;
    notifyListeners();

    try {
      await _bookingService.confirmBooking(
        doctorId: selectedDoctor?.id,
        serviceId: selectedService?.serviceId,
        expertiseId: bookingMode == 'DOCTOR' ? selectedExpertiseId : null,
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

  Future<bool> rescheduleAppointment({
    required int appointmentId,
    required String reason,
  }) async {
    if (selectedDate == null || selectedTimeSlot == null) {
      error = 'Vui lòng chọn ngày và giờ.';
      return false;
    }

    isLoading = true;
    notifyListeners();

    try {
      await _bookingService.rescheduleAppointment(
        appointmentId: appointmentId,
        doctorId: selectedDoctor?.id,
        date: selectedDate!,
        timeStart: selectedTimeSlot!['timeStart'],
        timeEnd: selectedTimeSlot!['timeEnd'] ?? selectedTimeSlot!['timeStart'],
        reason: reason,
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

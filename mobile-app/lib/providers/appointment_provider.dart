import 'package:flutter/material.dart';
import '../core/network/dio_client.dart';
import 'package:dio/dio.dart';
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
  String note = '';

  bool isLoading = false;
  String? error;

  List<Map<String, dynamic>> availableSlots = [];

  List<AppointmentModel> myAppointments = [];

  void selectDoctor(DoctorModel doctor) {
    selectedDoctor = doctor;
    selectedService = null;
    selectedSpecialty = null;
    selectedExpertiseId = doctor.expertiseId;
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
    selectedDate = null;
    selectedTimeSlot = null;
    note = '';
    availableSlots = [];
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
      myAppointments = data
              .map((e) => AppointmentModel.fromJson(e))
              .toList();
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
    notifyListeners();
  }

  Future<void> fetchAvailableSlots() async {
    if (selectedDate == null) return;
    final targetDoctorId = selectedDoctor?.id ?? 0; // 0 if service booking or any doctor
    
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final data = await _bookingService.getAvailableSlots(targetDoctorId, selectedDate!);
      
      availableSlots = data.map((e) {
        if (e is String) return {'timeStart': e, 'timeEnd': ''};
        return {
          'timeStart': e['timeStart'] ?? e['time'] ?? e['startTime'].toString(),
          'timeEnd': e['timeEnd'] ?? '',
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
      await _bookingService.confirmBooking(
        doctorId: selectedDoctor?.id, 
        serviceId: selectedService?.serviceId,
        expertiseId: selectedExpertiseId,
        date: selectedDate!, 
        timeStart: selectedTimeSlot!['timeStart'],
        timeEnd: selectedTimeSlot!['timeEnd'],
        note: note,
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

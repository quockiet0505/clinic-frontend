import 'package:flutter/material.dart';
import '../core/network/dio_client.dart';
import 'package:dio/dio.dart';

class AppointmentProvider extends ChangeNotifier {
  final DioClient _dioClient = DioClient();

  Map<String, dynamic>? selectedDoctor;
  String? selectedDate;
  String? selectedTime;

  bool isLoading = false;
  String? error;

  List<String> availableSlots = [];

  List<Map<String, dynamic>> myAppointments = [];

  void selectDoctor(Map<String, dynamic> doctor) {
    selectedDoctor = doctor;
    selectedDate = null;
    selectedTime = null;
    availableSlots = [];
    notifyListeners();
  }

  Future<void> fetchMyAppointments() async {
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final response = await _dioClient.dio.get('/appointments/my');
      myAppointments = List<Map<String, dynamic>>.from(response.data['data']);
    } on DioException catch (e) {
      error = e.message;
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  void selectDate(String date) {
    selectedDate = date;
    selectedTime = null;
    fetchAvailableSlots();
  }

  void selectTime(String time) {
    selectedTime = time;
    notifyListeners();
  }

  Future<void> fetchAvailableSlots() async {
    if (selectedDoctor == null || selectedDate == null) return;
    
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      // TODO: Connect to real API to get available slots
      // final response = await _dioClient.dio.get('/appointments/available-slots', queryParameters: {
      //   'doctorId': selectedDoctor!['staffId'],
      //   'date': selectedDate,
      // });
      // availableSlots = List<String>.from(response.data['data']);

      // Mock for now to allow UI development
      await Future.delayed(const Duration(milliseconds: 500));
      availableSlots = ['09:00', '09:30', '10:00', '13:00', '14:30', '16:00'];
    } on DioException catch (e) {
      error = e.message;
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> confirmBooking() async {
    if (selectedDoctor == null || selectedDate == null || selectedTime == null) return false;
    
    isLoading = true;
    notifyListeners();

    try {
      // final response = await _dioClient.dio.post('/appointments', data: {
      //   'mainDoctorId': selectedDoctor!['staffId'],
      //   'appointmentDate': selectedDate,
      //   'timeStart': selectedTime,
      //   'appointmentType': 'ONLINE' // Or 'WALK_IN'
      // });
      
      await Future.delayed(const Duration(milliseconds: 1000));
      return true;
    } catch (e) {
      error = e.toString();
      return false;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }
}

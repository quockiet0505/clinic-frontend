import 'package:flutter/material.dart';
import '../models/record_model.dart';
import '../models/lab_result_model.dart';
import '../services/medical_service.dart';

class RecordProvider extends ChangeNotifier {
  final MedicalService _medicalService = MedicalService();

  List<RecordModel> myRecords = [];
  List<LabResultModel> myLabResults = [];

  bool isLoading = false;
  String? error;

  Map<int, Map<String, dynamic>> recordDetails = {};

  Future<void> fetchMyRecords() async {
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final data = await _medicalService.getMyRecords();
      myRecords = data.map((e) => RecordModel.fromJson(e)).toList();
      
      final labData = await _medicalService.getMyLabResults();
      myLabResults = labData.map((e) => LabResultModel.fromJson(e)).toList();
    } catch (e) {
      error = e.toString().replaceAll('Exception: ', '');
      print('Fetch records error: $e');
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchRecordDetail(int recordId) async {
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final detail = await _medicalService.getRecordDetail(recordId);
      recordDetails[recordId] = detail;
    } catch (e) {
      error = e.toString().replaceAll('Exception: ', '');
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }
}

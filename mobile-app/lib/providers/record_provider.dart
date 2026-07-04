import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'dart:convert';
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

  Future<void> fetchMyRecords({bool forceRefresh = false}) async {
    final box = Hive.box('appCache');
    const cacheKeyRecords = 'cached_records';
    const cacheKeyLabs = 'cached_labs';
    const cacheKeyTime = 'records_timestamp';

    // 1. Check TTL Cache (5 minutes)
    if (!forceRefresh) {
      final int? timestamp = box.get(cacheKeyTime);
      if (timestamp != null) {
        final lastFetch = DateTime.fromMillisecondsSinceEpoch(timestamp);
        final diff = DateTime.now().difference(lastFetch).inMinutes;

        if (diff < 5) {
          // Cache is fresh, load instantly and return!
          final String? cachedRecordsStr = box.get(cacheKeyRecords);
          final String? cachedLabsStr = box.get(cacheKeyLabs);
          
          if (cachedRecordsStr != null && cachedLabsStr != null) {
            try {
              final List<dynamic> recordsList = jsonDecode(cachedRecordsStr);
              myRecords = recordsList.map((e) => RecordModel.fromJson(e)).toList();
              
              final List<dynamic> labsList = jsonDecode(cachedLabsStr);
              myLabResults = labsList.map((e) => LabResultModel.fromJson(e)).toList();
              
              notifyListeners();
              return; // EXIT EARLY, NO BACKEND CALL
            } catch (e) {
              print('Cache parsing error: $e');
            }
          }
        } else {
          // Expired: load old cache to avoid blank screen while fetching
          final String? cachedRecordsStr = box.get(cacheKeyRecords);
          final String? cachedLabsStr = box.get(cacheKeyLabs);
          if (cachedRecordsStr != null && cachedLabsStr != null) {
            try {
              final List<dynamic> recordsList = jsonDecode(cachedRecordsStr);
              myRecords = recordsList.map((e) => RecordModel.fromJson(e)).toList();
              final List<dynamic> labsList = jsonDecode(cachedLabsStr);
              myLabResults = labsList.map((e) => LabResultModel.fromJson(e)).toList();
              notifyListeners();
            } catch (_) {}
          }
        }
      }
    }

    // 2. Fetch from Backend
    if (myRecords.isEmpty && myLabResults.isEmpty) {
      isLoading = true;
      notifyListeners();
    }
    error = null;

    try {
      final recordsData = await _medicalService.getMyRecords();
      myRecords = recordsData.map((e) => RecordModel.fromJson(e)).toList();
      
      final labsData = await _medicalService.getMyLabResults();
      myLabResults = labsData.map((e) => LabResultModel.fromJson(e)).toList();

      // 3. Save to Hive Cache
      box.put(cacheKeyRecords, jsonEncode(recordsData));
      box.put(cacheKeyLabs, jsonEncode(labsData));
      box.put(cacheKeyTime, DateTime.now().millisecondsSinceEpoch);

    } catch (e) {
      if (myRecords.isEmpty) {
        error = e.toString().replaceAll('Exception: ', '');
      }
      print('Fetch records error: $e');
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchRecordDetail(int recordId) async {
    if (!recordDetails.containsKey(recordId)) {
      isLoading = true;
      notifyListeners();
    }
    error = null;

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

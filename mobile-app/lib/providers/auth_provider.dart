import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:clinic_management_system/services/auth_service.dart';
import 'package:clinic_management_system/models/user_model.dart';
import 'dart:io';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _error;
  String? get error => _error;

  bool _isAuthenticated = false;
  bool get isAuthenticated => _isAuthenticated;

  Map<String, dynamic>? _user;
  Map<String, dynamic>? get user => _user;

  Future<void> fetchProfile() async {
    try {
      _user = await _authService.getProfile();
      notifyListeners();
    } catch (e) {
      // Ignore or handle
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _authService.login(email, password);
      
      final token = data['token'];
      if (token != null) {
        await _storage.write(key: 'jwt_token', value: token);
      }
      
      // We could store user model here if needed.
      _isAuthenticated = true;
      _isLoading = false;
      await fetchProfile(); // Fetch profile upon login
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register(String fullName, String phone, String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _authService.register(fullName, phone, email, password);
      _isLoading = false;
      notifyListeners();
      return true; // Register success, no auto-login to let them login manually or we can auto-login
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateProfile(Map<String, dynamic> data, {File? avatarFile}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      if (avatarFile != null) {
        final avatarUrl = await _authService.uploadAvatar(avatarFile.path);
        data['avatarUrl'] = avatarUrl;
      }
      final updatedUser = await _authService.updateProfile(data);
      _user = updatedUser;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> changePassword(String currentPassword, String newPassword) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _authService.changePassword(currentPassword, newPassword);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    await _storage.delete(key: 'jwt_token');
    _isAuthenticated = false;
    notifyListeners();
  }
}

// --- lib/utils/mock_data.dart ---
import 'package:flutter/material.dart';

class MockData {
  // 1. Unified Specialties Data (Matches backend schema)
  static const List<Map<String, dynamic>> specialties = [
    {
      'id': 2, 
      'name': 'Cardiology', 
      'icon': Icons.favorite_rounded, 
      'bgColor': Color(0xFFFFE5E5), 
      'iconColor': Color(0xFFFF4B4B)
    },
    {
      'id': 3, 
      'name': 'Neurology', 
      'icon': Icons.psychology_rounded, 
      'bgColor': Color(0xFFF3E5F5), 
      'iconColor': Color(0xFF9C27B0)
    },
    {
      'id': 4, 
      'name': 'Pediatrics', 
      'icon': Icons.child_care_rounded, 
      'bgColor': Color(0xFFFFF4E5), 
      'iconColor': Color(0xFFF79009)
    },
    {
      'id': 5, 
      'name': 'Eye Care', 
      'icon': Icons.visibility_rounded, 
      'bgColor': Color(0xFFE5F0FF), 
      'iconColor': Color(0xFF4B8CFF)
    },
    {
      'id': 6, 
      'name': 'Dentist', 
      'icon': Icons.medical_information_rounded, 
      'bgColor': Color(0xFFE5F9F0), 
      'iconColor': Color(0xFF12B76A)
    },
  ];

  // 2. Popular Doctors Data
  static const List<Map<String, dynamic>> popularDoctors = [
    {
      'id': 'DOC001',
      'name': 'Dr. John Wilson',
      'specialty': 'Cardiology',
      'rating': 4.8,
      'reviews': 124,
      'image': 'https://i.pravatar.cc/150?img=11',
    },
    {
      'id': 'DOC002',
      'name': 'Dr. Alexa Johnson',
      'specialty': 'Neurology',
      'rating': 4.9,
      'reviews': 89,
      'image': 'https://i.pravatar.cc/150?img=5',
    },
    {
      'id': 'DOC003',
      'name': 'Dr. Robert Fox',
      'specialty': 'Pediatrics',
      'rating': 4.7,
      'reviews': 210,
      'image': 'https://i.pravatar.cc/150?img=33',
    },
  ];
}
import 'package:flutter/material.dart';

class ClinicDateField extends StatelessWidget {
  final String label;
  final DateTime? value;
  final String hint;
  final VoidCallback onTap;

  const ClinicDateField({
    super.key,
    required this.label,
    required this.value,
    required this.onTap,
    this.hint = 'Chọn',
  });

  @override
  Widget build(BuildContext context) {
    final displayValue = value != null
        ? '${value!.day.toString().padLeft(2, '0')}/${value!.month.toString().padLeft(2, '0')}/${value!.year}'
        : hint;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF94A3B8))),
          const SizedBox(height: 8),
          GestureDetector(
            onTap: onTap,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.cake_outlined, size: 20, color: Color(0xFF64748B)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      displayValue,
                      style: TextStyle(
                        fontSize: 15,
                        color: value != null ? const Color(0xFF0F172A) : const Color(0xFF94A3B8),
                        fontWeight: FontWeight.w500,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const Icon(Icons.calendar_month_rounded, color: Color(0xFF64748B), size: 20),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

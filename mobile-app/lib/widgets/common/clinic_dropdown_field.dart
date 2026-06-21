import 'package:flutter/material.dart';

class ClinicDropdownField<T> extends StatelessWidget {
  final String label;
  final T? value;
  final List<T> items;
  final IconData icon;
  final void Function(T?) onChanged;
  final Map<T, String>? displayMap;
  final String hint;

  const ClinicDropdownField({
    super.key,
    required this.label,
    required this.value,
    required this.items,
    required this.icon,
    required this.onChanged,
    this.displayMap,
    this.hint = 'Chọn',
  });

  @override
  Widget build(BuildContext context) {
    final displayValue = value != null ? (displayMap != null ? (displayMap![value] ?? value.toString()) : value.toString()) : hint;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF94A3B8))),
          const SizedBox(height: 8),
          GestureDetector(
            onTap: () {
              showModalBottomSheet(
                context: context,
                backgroundColor: Colors.transparent,
                isScrollControlled: true,
                builder: (BuildContext context) {
                  return Container(
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                    ),
                    padding: const EdgeInsets.fromLTRB(0, 12, 0, 24),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(width: 40, height: 4, decoration: BoxDecoration(color: const Color(0xFFE2E8F0), borderRadius: BorderRadius.circular(2))),
                        const SizedBox(height: 20),
                        Text('Chọn $label', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: Color(0xFF0F172A))),
                        const SizedBox(height: 16),
                        ...items.map((item) {
                          final isSelected = item == value;
                          return InkWell(
                            onTap: () {
                              onChanged(item);
                              Navigator.pop(context);
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                              color: isSelected ? const Color(0xFFEFF6FF) : Colors.transparent,
                              child: Row(
                                children: [
                                  Text(
                                    displayMap != null ? (displayMap![item] ?? item.toString()) : item.toString(),
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                                      color: isSelected ? const Color(0xFF2563EB) : const Color(0xFF334155),
                                    ),
                                  ),
                                  const Spacer(),
                                  if (isSelected) const Icon(Icons.check_circle_rounded, color: Color(0xFF2563EB), size: 20),
                                ],
                              ),
                            ),
                          );
                        }),
                        SizedBox(height: MediaQuery.of(context).padding.bottom), // SafeArea support
                      ],
                    ),
                  );
                },
              );
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  Icon(icon, size: 20, color: const Color(0xFF64748B)),
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
                  const Icon(Icons.keyboard_arrow_down_rounded, color: Color(0xFF64748B), size: 20),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

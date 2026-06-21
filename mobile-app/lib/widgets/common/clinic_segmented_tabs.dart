import 'package:flutter/material.dart';
import 'package:clinic_management_system/core/constants/app_colors.dart';

class ClinicTabItem {
  final String value;
  final String label;

  const ClinicTabItem({required this.value, required this.label});
}

/// Modern segmented tab bar — slate track + white active pill.
class ClinicSegmentedTabs extends StatelessWidget {
  final List<ClinicTabItem> tabs;
  final String selectedValue;
  final ValueChanged<String> onChanged;
  final EdgeInsetsGeometry padding;

  const ClinicSegmentedTabs({
    super.key,
    required this.tabs,
    required this.selectedValue,
    required this.onChanged,
    this.padding = const EdgeInsets.symmetric(horizontal: 20),
  });

  /// Convenience for simple string tabs.
  factory ClinicSegmentedTabs.simple({
    required List<String> labels,
    required String selected,
    required ValueChanged<String> onChanged,
    EdgeInsetsGeometry padding = const EdgeInsets.symmetric(horizontal: 20),
  }) {
    return ClinicSegmentedTabs(
      tabs: labels.map((l) => ClinicTabItem(value: l, label: l)).toList(),
      selectedValue: selected,
      onChanged: onChanged,
      padding: padding,
    );
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: padding,
      child: Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE2E8F0).withValues(alpha: 0.8)),
        ),
        child: Row(
          children: tabs.map((tab) {
            final isSelected = selectedValue == tab.value;
            return Padding(
              padding: const EdgeInsets.only(right: 4),
              child: GestureDetector(
                onTap: () => onChanged(tab.value),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: isSelected ? Colors.white : Colors.transparent,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: isSelected
                        ? [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 8, offset: const Offset(0, 2))]
                        : null,
                  ),
                  child: Text(
                    tab.label,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                      color: isSelected ? AppColors.primary : const Color(0xFF64748B),
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}

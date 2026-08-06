import 'package:flutter/material.dart';
import 'package:clinic_management_system/core/constants/app_colors.dart';

class ClinicTabItem {
  final String value;
  final String label;

  const ClinicTabItem({required this.value, required this.label});
}

/// Segmented tabs with a single sliding pill — smooth tab switching.
class ClinicSegmentedTabs extends StatefulWidget {
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
  State<ClinicSegmentedTabs> createState() => _ClinicSegmentedTabsState();
}

class _ClinicSegmentedTabsState extends State<ClinicSegmentedTabs> {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: widget.padding,
      physics: const BouncingScrollPhysics(),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: widget.tabs.map((tab) {
          final isSelected = widget.selectedValue == tab.value;
          return GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: () {
              if (tab.value != widget.selectedValue) {
                widget.onChanged(tab.value);
              }
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              margin: const EdgeInsets.only(right: 8),
              decoration: BoxDecoration(
                gradient: isSelected ? AppColors.primaryGradient : null,
                color: isSelected ? null : Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: isSelected ? Colors.transparent : const Color(0xFFE2E8F0),
                  width: 1,
                ),
              ),
              child: Text(
                tab.label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                  color: isSelected ? Colors.white : const Color(0xFF64748B),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

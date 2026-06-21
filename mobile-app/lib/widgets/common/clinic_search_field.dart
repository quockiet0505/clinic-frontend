import 'package:flutter/material.dart';
import 'package:clinic_management_system/core/constants/app_colors.dart';
import 'package:clinic_management_system/core/constants/app_styles.dart';

/// Unified search input used across list screens.
class ClinicSearchField extends StatelessWidget {
  final String hintText;
  final bool autofocus;
  final ValueChanged<String>? onChanged;
  final TextEditingController? controller;
  final Widget? trailing;
  final VoidCallback? onFilterTap;
  final bool filterActive;

  const ClinicSearchField({
    super.key,
    required this.hintText,
    this.autofocus = false,
    this.onChanged,
    this.controller,
    this.trailing,
    this.onFilterTap,
    this.filterActive = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 48,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          const SizedBox(width: 14),
          Icon(Icons.search_rounded, color: AppColors.textSubLight.withValues(alpha: 0.75), size: 22),
          const SizedBox(width: 10),
          Expanded(
            child: TextField(
              controller: controller,
              autofocus: autofocus,
              onChanged: onChanged,
              style: AppStyles.bodyMedium.copyWith(color: AppColors.textMainLight, fontSize: 14),
              decoration: InputDecoration(
                hintText: hintText,
                hintStyle: AppStyles.bodyMedium.copyWith(
                  color: AppColors.textSubLight.withValues(alpha: 0.75),
                  fontSize: 14,
                ),
                border: InputBorder.none,
                isDense: true,
                contentPadding: EdgeInsets.zero,
              ),
            ),
          ),
          if (trailing != null) trailing!,
          if (onFilterTap != null)
            IconButton(
              onPressed: onFilterTap,
              icon: Icon(
                Icons.tune_rounded,
                size: 22,
                color: filterActive ? AppColors.primary : AppColors.textSubLight.withValues(alpha: 0.75),
              ),
            ),
          if (trailing == null && onFilterTap == null) const SizedBox(width: 8),
        ],
      ),
    );
  }
}

/// Sort cycle button: 0 = default, 1 = ascending, 2 = descending.
class ClinicSortButton extends StatelessWidget {
  final int sortState;
  final VoidCallback onTap;

  const ClinicSortButton({super.key, required this.sortState, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final active = sortState != 0;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 48,
        width: 48,
        decoration: BoxDecoration(
          color: active ? AppColors.primary : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: active ? AppColors.primary : const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: (active ? AppColors.primary : Colors.black).withValues(alpha: active ? 0.18 : 0.04),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Icon(
          sortState == 0
              ? Icons.swap_vert_rounded
              : (sortState == 1 ? Icons.arrow_upward_rounded : Icons.arrow_downward_rounded),
          color: active ? Colors.white : AppColors.textMainLight,
          size: 22,
        ),
      ),
    );
  }
}

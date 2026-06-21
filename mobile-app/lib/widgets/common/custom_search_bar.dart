import 'package:flutter/material.dart';
import 'package:clinic_management_system/core/constants/app_colors.dart';
import 'clinic_search_field.dart';

/// @deprecated Use [ClinicSearchField] or [ClinicListToolbar] instead.
class CustomSearchBar extends StatelessWidget {
  final String hintText;
  final bool autofocus;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onFilterTap;

  const CustomSearchBar({
    super.key,
    required this.hintText,
    this.autofocus = false,
    this.onChanged,
    this.onFilterTap,
  });

  @override
  Widget build(BuildContext context) {
    return ClinicSearchField(
      hintText: hintText,
      autofocus: autofocus,
      onChanged: onChanged,
      onFilterTap: onFilterTap,
    );
  }
}

import 'package:flutter/material.dart';
import 'package:clinic_management_system/core/constants/app_colors.dart';
import 'package:clinic_management_system/core/constants/app_styles.dart';

/// Unified search input used across list screens.
class ClinicSearchField extends StatefulWidget {
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
  State<ClinicSearchField> createState() => _ClinicSearchFieldState();
}

class _ClinicSearchFieldState extends State<ClinicSearchField> {
  late TextEditingController _controller;
  bool _showClear = false;

  @override
  void initState() {
    super.initState();
    _controller = widget.controller ?? TextEditingController();
    _showClear = _controller.text.isNotEmpty;
    _controller.addListener(_onTextChanged);
  }

  @override
  void didUpdateWidget(ClinicSearchField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.controller != null && widget.controller != _controller) {
      _controller.removeListener(_onTextChanged);
      _controller = widget.controller!;
      _controller.addListener(_onTextChanged);
      _showClear = _controller.text.isNotEmpty;
    }
  }

  @override
  void dispose() {
    if (widget.controller == null) {
      _controller.dispose();
    } else {
      _controller.removeListener(_onTextChanged);
    }
    super.dispose();
  }

  void _onTextChanged() {
    final hasText = _controller.text.isNotEmpty;
    if (hasText != _showClear) {
      setState(() {
        _showClear = hasText;
      });
    }
  }

  void _clearSearch() {
    _controller.clear();
    if (widget.onChanged != null) {
      widget.onChanged!('');
    }
  }

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
              controller: _controller,
              autofocus: widget.autofocus,
              onChanged: widget.onChanged,
              style: AppStyles.bodyMedium.copyWith(color: AppColors.textMainLight, fontSize: 14),
              decoration: InputDecoration(
                hintText: widget.hintText,
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
          if (_showClear)
            GestureDetector(
              onTap: _clearSearch,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                child: Icon(Icons.cancel_rounded, color: AppColors.textSubLight.withValues(alpha: 0.5), size: 18),
              ),
            ),
          if (widget.trailing != null) widget.trailing!,
          if (widget.onFilterTap != null)
            IconButton(
              onPressed: widget.onFilterTap,
              icon: Icon(
                Icons.tune_rounded,
                size: 22,
                color: widget.filterActive ? AppColors.primary : AppColors.textSubLight.withValues(alpha: 0.75),
              ),
            ),
          if (widget.trailing == null && widget.onFilterTap == null) const SizedBox(width: 8),
        ],
      ),
    );
  }
}

/// Sort cycle chip: 0 = default, 1 = ascending, 2 = descending.
class ClinicSortButton extends StatelessWidget {
  final int sortState;
  final VoidCallback onTap;
  final String label;

  const ClinicSortButton({
    super.key,
    required this.sortState,
    required this.onTap,
    this.label = 'Giá',
  });

  @override
  Widget build(BuildContext context) {
    final active = sortState != 0;
    final IconData arrowIcon = sortState == 1
        ? Icons.north_rounded
        : (sortState == 2 ? Icons.south_rounded : Icons.unfold_more_rounded);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 220),
          curve: Curves.easeOutCubic,
          height: 48,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            color: active ? AppColors.primary.withValues(alpha: 0.08) : Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: active ? AppColors.primary.withValues(alpha: 0.35) : const Color(0xFFE2E8F0),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: active ? 0.03 : 0.04),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.payments_outlined,
                size: 17,
                color: active ? AppColors.primary : AppColors.textSubLight.withValues(alpha: 0.8),
              ),
              const SizedBox(width: 5),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: active ? AppColors.primary : AppColors.textMainLight,
                ),
              ),
              const SizedBox(width: 2),
              Icon(
                arrowIcon,
                size: 15,
                color: active ? AppColors.primary : AppColors.textSubLight.withValues(alpha: 0.65),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

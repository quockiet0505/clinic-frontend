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
  final GlobalKey _trackKey = GlobalKey();
  final Map<String, GlobalKey> _tabKeys = {};

  double _indicatorLeft = 0;
  double _indicatorWidth = 0;
  bool _indicatorReady = false;

  @override
  void initState() {
    super.initState();
    _syncTabKeys();
    WidgetsBinding.instance.addPostFrameCallback((_) => _updateIndicator());
  }

  @override
  void didUpdateWidget(ClinicSegmentedTabs oldWidget) {
    super.didUpdateWidget(oldWidget);
    _syncTabKeys();
    if (oldWidget.selectedValue != widget.selectedValue ||
        oldWidget.tabs.length != widget.tabs.length) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _updateIndicator());
    }
  }

  void _syncTabKeys() {
    for (final tab in widget.tabs) {
      _tabKeys.putIfAbsent(tab.value, () => GlobalKey());
    }
  }

  void _updateIndicator() {
    if (!mounted) return;
    final trackContext = _trackKey.currentContext;
    final tabContext = _tabKeys[widget.selectedValue]?.currentContext;
    if (trackContext == null || tabContext == null) return;

    final trackBox = trackContext.findRenderObject() as RenderBox?;
    final tabBox = tabContext.findRenderObject() as RenderBox?;
    if (trackBox == null || tabBox == null) return;

    final tabOffset = tabBox.localToGlobal(Offset.zero, ancestor: trackBox);
    setState(() {
      _indicatorLeft = tabOffset.dx;
      _indicatorWidth = tabBox.size.width;
      _indicatorReady = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: widget.padding,
      physics: const BouncingScrollPhysics(),
      child: Container(
        key: _trackKey,
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE2E8F0).withValues(alpha: 0.8)),
        ),
        child: Stack(
          children: [
            AnimatedPositioned(
              duration: const Duration(milliseconds: 260),
              curve: Curves.easeOutCubic,
              left: _indicatorLeft,
              width: _indicatorWidth,
              top: 0,
              bottom: 0,
              child: AnimatedOpacity(
                duration: const Duration(milliseconds: 120),
                opacity: _indicatorReady ? 1 : 0,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.06),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: widget.tabs.map((tab) {
                final isSelected = widget.selectedValue == tab.value;
                return GestureDetector(
                  key: _tabKeys[tab.value],
                  behavior: HitTestBehavior.opaque,
                  onTap: () {
                    if (tab.value == widget.selectedValue) return;
                    widget.onChanged(tab.value);
                    WidgetsBinding.instance.addPostFrameCallback((_) => _updateIndicator());
                  },
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
                    child: Text(
                      tab.label,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                        color: isSelected ? AppColors.primary : const Color(0xFF64748B),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }
}

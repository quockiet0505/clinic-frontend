import 'package:flutter/material.dart';
import 'clinic_search_field.dart';
import 'clinic_segmented_tabs.dart';

/// Flexible list toolbar: search + optional sort/filter + optional tabs.
class ClinicListToolbar extends StatelessWidget {
  final String searchHint;
  final ValueChanged<String>? onSearchChanged;
  final bool autofocusSearch;

  /// Price / generic sort cycle (0 none, 1 asc, 2 desc). Null = hidden.
  final int? sortState;
  final VoidCallback? onSortTap;

  final VoidCallback? onDateFilterTap;
  final bool dateFilterActive;

  final List<ClinicTabItem>? tabs;
  final String? selectedTab;
  final ValueChanged<String>? onTabChanged;

  final EdgeInsetsGeometry padding;

  const ClinicListToolbar({
    super.key,
    required this.searchHint,
    this.onSearchChanged,
    this.autofocusSearch = false,
    this.sortState,
    this.onSortTap,
    this.onDateFilterTap,
    this.dateFilterActive = false,
    this.tabs,
    this.selectedTab,
    this.onTabChanged,
    this.padding = const EdgeInsets.fromLTRB(20, 0, 20, 0),
  });

  @override
  Widget build(BuildContext context) {
    final showSort = sortState != null && onSortTap != null;
    final showDateFilter = onDateFilterTap != null;
    final showTabs = tabs != null && tabs!.isNotEmpty && selectedTab != null && onTabChanged != null;

    return Padding(
      padding: padding,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: ClinicSearchField(
                  hintText: searchHint,
                  autofocus: autofocusSearch,
                  onChanged: onSearchChanged,
                  onFilterTap: showDateFilter ? onDateFilterTap : null,
                  filterActive: dateFilterActive,
                ),
              ),
              if (showSort) ...[
                const SizedBox(width: 10),
                ClinicSortButton(sortState: sortState!, onTap: onSortTap!),
              ],
            ],
          ),
          if (showTabs) ...[
            const SizedBox(height: 12),
            ClinicSegmentedTabs(
              tabs: tabs!,
              selectedValue: selectedTab!,
              onChanged: onTabChanged!,
              padding: EdgeInsets.zero,
            ),
          ],
        ],
      ),
    );
  }
}

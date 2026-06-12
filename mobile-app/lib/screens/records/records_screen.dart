import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/models/record_model.dart';
import 'package:clinic_management_system/models/lab_result_model.dart';
import 'package:clinic_management_system/screens/records/record_detail_screen.dart';
import 'package:clinic_management_system/screens/records/lab_result_screen.dart';
import 'package:clinic_management_system/utils/date_formatter.dart';
import 'package:provider/provider.dart';
import '../../providers/record_provider.dart';

class RecordsScreen extends StatefulWidget {
  const RecordsScreen({super.key});

  @override
  State<RecordsScreen> createState() => _RecordsScreenState();
}

class _RecordsScreenState extends State<RecordsScreen> {
  String _searchQuery = '';
  String _selectedTab = 'Tất cả';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<RecordProvider>().fetchMyRecords();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFF),
      body: Consumer<RecordProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator(color: AppColors.primary));
          }
          if (provider.error != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, color: AppColors.error, size: 48),
                  const SizedBox(height: 16),
                  Text('Đã có lỗi xảy ra', style: AppStyles.heading3),
                  const SizedBox(height: 8),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Text(provider.error!, style: AppStyles.bodyMedium, textAlign: TextAlign.center),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => provider.fetchMyRecords(),
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
                    child: const Text('Thử lại', style: TextStyle(color: Colors.white)),
                  )
                ],
              ),
            );
          }

          final medicalRecords = provider.myRecords;
          final labResults = provider.myLabResults;
          
          List<dynamic> allRecords = [];
          if (_selectedTab == 'Khám bệnh') {
            allRecords = medicalRecords;
          } else if (_selectedTab == 'Xét nghiệm') {
            allRecords = labResults;
          } else {
            allRecords = [...medicalRecords, ...labResults];
            // Sort by date descending
            allRecords.sort((a, b) {
              String dateA = a is RecordModel ? a.createdAt : (a as LabResultModel).date ?? '';
              String dateB = b is RecordModel ? b.createdAt : (b as LabResultModel).date ?? '';
              return dateB.compareTo(dateA);
            });
          }

          final records = allRecords.where((r) {
            final q = _searchQuery.toLowerCase();
            if (r is RecordModel) {
              return (r.diagnosis ?? '').toLowerCase().contains(q) ||
                  (r.doctorName ?? '').toLowerCase().contains(q);
            } else if (r is LabResultModel) {
              return (r.serviceName ?? '').toLowerCase().contains(q);
            }
            return false;
          }).toList();

          return Column(
            children: [
              // Unified header - same bg as body
              Container(
                color: const Color(0xFFF8FAFF),
                padding: EdgeInsets.only(
                  top: MediaQuery.of(context).padding.top + 12,
                  left: 20, right: 20, bottom: 16,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.folder_shared_rounded, color: AppColors.primary, size: 20),
                        ),
                        const SizedBox(width: 10),
                        const Text('Hồ sơ y tế', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF1F2937))),
                        const Spacer(),
                        Consumer<RecordProvider>(
                          builder: (_, p, __) => Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withValues(alpha: 0.08),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text('${p.myRecords.length} bản ghi', style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 12)),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    // Search
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 2))],
                      ),
                      child: TextField(
                        onChanged: (v) => setState(() => _searchQuery = v),
                        decoration: const InputDecoration(
                          hintText: 'Tìm theo chẩn đoán, bác sĩ...',
                          hintStyle: TextStyle(color: Color(0xFF9CA3AF), fontSize: 14),
                          prefixIcon: Icon(Icons.search_rounded, color: Color(0xFF9CA3AF), size: 20),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(vertical: 13),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Tabs
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: ['Tất cả', 'Khám bệnh', 'Xét nghiệm'].map((tab) {
                      final isSelected = _selectedTab == tab;
                      return GestureDetector(
                        onTap: () => setState(() => _selectedTab = tab),
                        child: Container(
                          margin: const EdgeInsets.only(right: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.primary.withValues(alpha: 0.1) : Colors.transparent,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            tab,
                            style: TextStyle(
                              color: isSelected ? AppColors.primary : const Color(0xFF9CA3AF),
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),

              // Body - same bg, no visual break
              Expanded(
                child: records.isEmpty
                    ? _buildEmptyState(isSearchEmpty: allRecords.isNotEmpty)
                    : ListView.builder(
                        padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
                        itemCount: records.length,
                        itemBuilder: (context, index) => _buildRecordCard(records[index]),
                      ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildRecordCard(dynamic record) {
    if (record is LabResultModel) {
      return GestureDetector(
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => LabResultScreen(results: [record]))),
        child: Container(
          margin: const EdgeInsets.only(bottom: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 3))],
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 4, height: 52,
                  decoration: BoxDecoration(color: Colors.orange, borderRadius: BorderRadius.circular(4)),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        record.serviceName ?? 'Xét nghiệm',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF1F2937)),
                        maxLines: 1, overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text('Kết quả: ${record.conclusion ?? record.resultData ?? 'Đã có'}', style: const TextStyle(fontSize: 13, color: Color(0xFF6B7280))),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          const Icon(Icons.calendar_today_outlined, size: 12, color: Color(0xFF6B7280)),
                          const SizedBox(width: 4),
                          Text(DateFormatter.formatDateTime(record.date), style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280), fontWeight: FontWeight.w500)),
                        ],
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.chevron_right_rounded, color: Color(0xFFD1D5DB), size: 22),
              ],
            ),
          ),
        ),
      );
    } else {
      String doctorName = (record as RecordModel).doctorName ?? 'Chưa rõ';
      doctorName = doctorName.replaceAll(RegExp(r'^(BS\.|BS\s|Bác sĩ\s)', caseSensitive: false), '').trim();
      if (doctorName != 'Chưa rõ' && doctorName.isNotEmpty) {
        doctorName = 'BS. $doctorName';
      }

      return GestureDetector(
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => RecordDetailScreen(record: record))),
        child: Container(
          margin: const EdgeInsets.only(bottom: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 3))],
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 4, height: 52,
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        record.diagnosis ?? 'Chưa có chẩn đoán',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF1F2937)),
                        maxLines: 1, overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(doctorName, style: const TextStyle(fontSize: 13, color: Color(0xFF6B7280))),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          const Icon(Icons.calendar_today_outlined, size: 12, color: Color(0xFF6B7280)),
                          const SizedBox(width: 4),
                          Text(DateFormatter.formatDateTime(record.createdAt), style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280), fontWeight: FontWeight.w500)),
                        ],
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.chevron_right_rounded, color: Color(0xFFD1D5DB), size: 22),
              ],
            ),
          ),
        ),
      );
    }
  }

  Widget _buildEmptyState({required bool isSearchEmpty}) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.07),
              shape: BoxShape.circle,
            ),
            child: Icon(
              isSearchEmpty ? Icons.search_off_rounded : Icons.folder_off_rounded,
              size: 48, color: AppColors.primary.withValues(alpha: 0.4),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            isSearchEmpty ? 'Không tìm thấy hồ sơ phù hợp' : 'Chưa có hồ sơ y tế',
            style: const TextStyle(color: Color(0xFF6B7280), fontSize: 15, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}

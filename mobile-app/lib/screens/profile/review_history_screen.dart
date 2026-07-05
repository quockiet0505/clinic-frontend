import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/services/feedback_service.dart';
import 'package:clinic_management_system/widgets/common/clinic_segmented_tabs.dart';
import 'package:intl/intl.dart';

import 'package:clinic_management_system/widgets/common/gradient_app_bar.dart';

class ReviewHistoryScreen extends StatefulWidget {
  const ReviewHistoryScreen({super.key});

  @override
  State<ReviewHistoryScreen> createState() => _ReviewHistoryScreenState();
}

class _ReviewHistoryScreenState extends State<ReviewHistoryScreen> {
  String _selectedTab = 'DOCTOR';
  final FeedbackService _feedbackService = FeedbackService();

  static const _tabs = [
    ClinicTabItem(value: 'DOCTOR', label: 'Bác sĩ'),
    ClinicTabItem(value: 'CLINIC', label: 'Phòng khám'),
  ];

  List<dynamic> _doctorFeedbacks = [];
  List<dynamic> _clinicFeedbacks = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchHistory();
  }

  Future<void> _fetchHistory() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final docs = await _feedbackService.getMyDoctorFeedbacks();
      final clinics = await _feedbackService.getMyClinicFeedbacks();
      if (!mounted) return;
      setState(() {
        _doctorFeedbacks = docs;
        _clinicFeedbacks = clinics;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Widget _buildStars(int rating) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (index) {
        return Icon(
          index < rating ? Icons.star_rounded : Icons.star_border_rounded,
          size: 16,
          color: index < rating ? Colors.amber : AppColors.textSubLight.withValues(alpha: 0.3),
        );
      }),
    );
  }

  Widget _buildReviewCard(dynamic feedback, bool isDoctor) {
    final title = isDoctor ? (feedback['doctorName'] ?? 'Bác sĩ') : 'Phòng khám';
    final dateStr = feedback['createdAt'];
    String formattedDate = '';
    if (dateStr != null) {
      try {
        final d = DateTime.parse(dateStr);
        formattedDate = DateFormat('dd/MM/yyyy HH:mm').format(d);
      } catch (_) {}
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: AppStyles.bodyMedium.copyWith(fontWeight: FontWeight.bold, color: AppColors.primary)),
              Text(formattedDate, style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
            ],
          ),
          const SizedBox(height: 8),
          _buildStars(feedback['rating'] ?? 0),
          if (feedback['comment'] != null && feedback['comment'].toString().isNotEmpty) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.05),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                feedback['comment'],
                style: AppStyles.caption.copyWith(color: AppColors.textMainLight, fontStyle: FontStyle.italic),
              ),
            ),
          ],
          if (feedback['reply'] != null && feedback['reply'].toString().isNotEmpty) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.green.withValues(alpha: 0.05),
                borderRadius: BorderRadius.circular(8),
                border: const Border(left: BorderSide(color: Colors.green, width: 3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Phản hồi từ ${feedback['repliedBy'] ?? 'Phòng khám'}:',
                    style: AppStyles.caption.copyWith(fontWeight: FontWeight.bold, color: Colors.green),
                  ),
                  const SizedBox(height: 4),
                  Text(feedback['reply'], style: AppStyles.caption.copyWith(color: AppColors.textMainLight)),
                ],
              ),
            ),
          ],
          if (dateStr != null) Builder(builder: (context) {
            final createdAt = DateTime.tryParse(dateStr);
            if (createdAt != null && DateTime.now().difference(createdAt).inHours < 24) {
              return Padding(
                padding: const EdgeInsets.only(top: 12),
                child: Align(
                  alignment: Alignment.centerRight,
                  child: TextButton.icon(
                    onPressed: () => _showEditReviewDialog(feedback, isDoctor),
                    icon: const Icon(Icons.edit_rounded, size: 16),
                    label: const Text('Sửa đánh giá'),
                    style: TextButton.styleFrom(
                      foregroundColor: AppColors.primary,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                  ),
                ),
              );
            }
            return const SizedBox.shrink();
          }),
        ],
      ),
    );
  }

  void _showEditReviewDialog(dynamic feedback, bool isDoctor) {
    int rating = feedback['rating'] ?? 0;
    final commentController = TextEditingController(text: feedback['comment'] ?? '');
    bool isAnonymous = feedback['isAnonymous'] ?? false;
    bool isSubmitting = false;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setStateDialog) => Dialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          backgroundColor: Colors.white,
          surfaceTintColor: Colors.transparent,
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Cập nhật đánh giá',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1F2937)),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                const Text(
                  'Chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện dịch vụ',
                  style: TextStyle(fontSize: 13, color: Color(0xFF6B7280)),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF9FAFB),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFF3F4F6)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(5, (index) {
                      return GestureDetector(
                        onTap: () => setStateDialog(() => rating = index + 1),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 4),
                          child: Icon(
                            index < rating ? Icons.star_rounded : Icons.star_border_rounded,
                            size: 40,
                            color: index < rating ? Colors.amber : const Color(0xFFD1D5DB),
                          ),
                        ),
                      );
                    }),
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  'Góp ý thêm',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF374151)),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: commentController,
                  maxLines: 4,
                  decoration: InputDecoration(
                    hintText: 'Nhập bình luận của bạn (không bắt buộc)...',
                    hintStyle: const TextStyle(color: Color(0xFF9CA3AF), fontSize: 14),
                    filled: true,
                    fillColor: const Color(0xFFF9FAFB),
                    contentPadding: const EdgeInsets.all(16),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Theme(
                  data: ThemeData(
                    unselectedWidgetColor: const Color(0xFFD1D5DB),
                  ),
                  child: CheckboxListTile(
                    value: isAnonymous,
                    onChanged: (v) => setStateDialog(() => isAnonymous = v ?? false),
                    title: const Text('Đánh giá ẩn danh', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Color(0xFF4B5563))),
                    controlAffinity: ListTileControlAffinity.leading,
                    contentPadding: EdgeInsets.zero,
                    activeColor: AppColors.primary,
                    visualDensity: VisualDensity.compact,
                  ),
                ),
                const SizedBox(height: 32),
                Row(
                  children: [
                    Expanded(
                      child: TextButton(
                        onPressed: isSubmitting ? null : () => Navigator.pop(context),
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: const Text('Hủy', style: TextStyle(color: Color(0xFF6B7280), fontWeight: FontWeight.w600, fontSize: 16)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 2,
                      child: ElevatedButton(
                        onPressed: isSubmitting ? null : () async {
                          if (rating == 0) {
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Vui lòng chọn số sao')));
                            return;
                          }
                          setStateDialog(() => isSubmitting = true);
                          try {
                            if (isDoctor) {
                              await _feedbackService.updateDoctorReview(
                                reviewId: feedback['reviewId'] ?? feedback['id'] ?? feedback['feedbackId'],
                                doctorId: feedback['doctorId'],
                                appointmentId: feedback['appointmentId'] ?? 0,
                                rating: rating,
                                comment: commentController.text,
                                isAnonymous: isAnonymous,
                              );
                            } else {
                              await _feedbackService.updateClinicReview(
                                reviewId: feedback['feedbackId'] ?? feedback['id'],
                                recordId: feedback['recordId'],
                                appointmentId: feedback['appointmentId'],
                                rating: rating,
                                comment: commentController.text,
                                isAnonymous: isAnonymous,
                              );
                            }
                            if (mounted) {
                              Navigator.pop(context);
                              _fetchHistory();
                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Đã cập nhật đánh giá')));
                            }
                          } catch (e) {
                            setStateDialog(() => isSubmitting = false);
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: isSubmitting 
                          ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                          : const Text('Lưu thay đổi', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildList(List<dynamic> list, bool isDoctor) {
    if (list.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.rate_review_outlined, size: 64, color: AppColors.textSubLight.withValues(alpha: 0.3)),
            const SizedBox(height: 16),
            Text('Chưa có đánh giá nào', style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight)),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _fetchHistory,
      color: AppColors.primary,
      child: ListView.builder(
        key: PageStorageKey(isDoctor ? 'doctor_reviews' : 'clinic_reviews'),
        padding: const EdgeInsets.all(16),
        itemCount: list.length,
        itemBuilder: (context, index) => _buildReviewCard(list[index], isDoctor),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFF),
      appBar: const GradientAppBar(title: 'Lịch sử đánh giá'),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 12),
            child: ClinicSegmentedTabs(
              tabs: _tabs,
              selectedValue: _selectedTab,
              onChanged: (v) => setState(() => _selectedTab = v),
            ),
          ),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
                : _error != null
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('Đã có lỗi xảy ra', style: AppStyles.bodyLarge.copyWith(color: AppColors.error)),
                            const SizedBox(height: 8),
                            Text(_error!, style: AppStyles.caption.copyWith(color: AppColors.textSubLight)),
                            const SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: _fetchHistory,
                              style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
                              child: const Text('Thử lại'),
                            ),
                          ],
                        ),
                      )
                    : IndexedStack(
                        index: _selectedTab == 'DOCTOR' ? 0 : 1,
                        children: [
                          _buildList(_doctorFeedbacks, true),
                          _buildList(_clinicFeedbacks, false),
                        ],
                      ),
          ),
        ],
      ),
    );
  }
}

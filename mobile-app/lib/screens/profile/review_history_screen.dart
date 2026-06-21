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
        builder: (context, setStateDialog) => AlertDialog(
          title: const Text('Sửa đánh giá', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(5, (index) {
                    return IconButton(
                      icon: Icon(
                        index < rating ? Icons.star_rounded : Icons.star_border_rounded,
                        size: 32,
                        color: index < rating ? Colors.amber : Colors.grey[300],
                      ),
                      onPressed: () => setStateDialog(() => rating = index + 1),
                    );
                  }),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: commentController,
                  maxLines: 3,
                  decoration: InputDecoration(
                    hintText: 'Nhập bình luận của bạn...',
                    filled: true,
                    fillColor: Colors.grey[100],
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    SizedBox(
                      height: 24,
                      width: 24,
                      child: Checkbox(
                        value: isAnonymous,
                        onChanged: (v) => setStateDialog(() => isAnonymous = v ?? false),
                        activeColor: AppColors.primary,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Text('Đánh giá ẩn danh', style: TextStyle(fontSize: 14)),
                  ],
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: isSubmitting ? null : () => Navigator.pop(context),
              child: const Text('Hủy', style: TextStyle(color: Colors.grey)),
            ),
            ElevatedButton(
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
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: isSubmitting 
                ? const SizedBox(height: 16, width: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Text('Lưu'),
            ),
          ],
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
                    : _buildList(
                        _selectedTab == 'DOCTOR' ? _doctorFeedbacks : _clinicFeedbacks,
                        _selectedTab == 'DOCTOR',
                      ),
          ),
        ],
      ),
    );
  }
}

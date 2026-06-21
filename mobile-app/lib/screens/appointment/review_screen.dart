import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/models/appointment_model.dart';
import 'package:clinic_management_system/services/feedback_service.dart';

import 'package:clinic_management_system/widgets/common/gradient_app_bar.dart';

class ReviewScreen extends StatefulWidget {
  final AppointmentModel appointment;

  const ReviewScreen({super.key, required this.appointment});

  @override
  State<ReviewScreen> createState() => _ReviewScreenState();
}

class _ReviewScreenState extends State<ReviewScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final FeedbackService _feedbackService = FeedbackService();

  int _doctorRating = 0;
  String _doctorComment = '';
  bool _doctorIsAnonymous = false;
  bool _doctorSubmitting = false;

  int _clinicRating = 0;
  String _clinicComment = '';
  bool _clinicIsAnonymous = false;
  bool _clinicSubmitting = false;

  int? _doctorReviewId;
  int? _clinicReviewId;
  String? _doctorCreatedAt;
  String? _clinicCreatedAt;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchExistingReviews();
  }

  Future<void> _fetchExistingReviews() async {
    try {
      final doctorFeedbacks = await _feedbackService.getMyDoctorFeedbacks();
      final existingDoctor = doctorFeedbacks.firstWhere(
        (f) => f['appointmentId'] == widget.appointment.appointmentId,
        orElse: () => null,
      );
      if (existingDoctor != null && mounted) {
        setState(() {
          _doctorReviewId = existingDoctor['feedbackId'] ?? existingDoctor['id'];
          _doctorRating = existingDoctor['rating'] ?? 0;
          _doctorComment = existingDoctor['comment'] ?? '';
          _doctorIsAnonymous = existingDoctor['isAnonymous'] ?? false;
          _doctorCreatedAt = existingDoctor['createdAt'];
        });
      }

      final clinicFeedbacks = await _feedbackService.getMyClinicFeedbacks();
      final existingClinic = clinicFeedbacks.firstWhere(
        (f) => f['appointmentId'] == widget.appointment.appointmentId,
        orElse: () => null,
      );
      if (existingClinic != null && mounted) {
        setState(() {
          _clinicReviewId = existingClinic['feedbackId'] ?? existingClinic['id'];
          _clinicRating = existingClinic['rating'] ?? 0;
          _clinicComment = existingClinic['comment'] ?? '';
          _clinicIsAnonymous = existingClinic['isAnonymous'] ?? false;
          _clinicCreatedAt = existingClinic['createdAt'];
        });
      }
    } catch (e) {
      debugPrint('Error fetching existing reviews: $e');
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _submitDoctorReview() async {
    if (_doctorRating == 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Vui lòng chọn số sao đánh giá bác sĩ')));
      return;
    }

    setState(() => _doctorSubmitting = true);
    try {
      if (_doctorReviewId != null) {
        await _feedbackService.updateDoctorReview(
          reviewId: _doctorReviewId!,
          doctorId: widget.appointment.mainDoctorId ?? 0,
          appointmentId: widget.appointment.appointmentId,
          rating: _doctorRating,
          comment: _doctorComment,
          isAnonymous: _doctorIsAnonymous,
        );
      } else {
        await _feedbackService.submitDoctorReview(
          doctorId: widget.appointment.mainDoctorId ?? 0,
          appointmentId: widget.appointment.appointmentId,
          rating: _doctorRating,
          comment: _doctorComment,
          isAnonymous: _doctorIsAnonymous,
        );
      }
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Đã lưu đánh giá bác sĩ thành công!')));
      Navigator.pop(context, true);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
    } finally {
      if (mounted) setState(() => _doctorSubmitting = false);
    }
  }

  Future<void> _submitClinicReview() async {
    if (_clinicRating == 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Vui lòng chọn số sao đánh giá phòng khám')));
      return;
    }

    setState(() => _clinicSubmitting = true);
    try {
      if (_clinicReviewId != null) {
        await _feedbackService.updateClinicReview(
          reviewId: _clinicReviewId!,
          appointmentId: widget.appointment.appointmentId,
          rating: _clinicRating,
          comment: _clinicComment,
          isAnonymous: _clinicIsAnonymous,
        );
      } else {
        await _feedbackService.submitClinicReview(
          appointmentId: widget.appointment.appointmentId,
          rating: _clinicRating,
          comment: _clinicComment,
          isAnonymous: _clinicIsAnonymous,
        );
      }
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Đã lưu đánh giá phòng khám thành công!')));
      Navigator.pop(context, true);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
    } finally {
      if (mounted) setState(() => _clinicSubmitting = false);
    }
  }

  Widget _buildRatingStars(int rating, Function(int) onRatingChanged, bool isEditable) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(5, (index) {
        return IconButton(
          icon: Icon(
            index < rating ? Icons.star_rounded : Icons.star_border_rounded,
            size: 40,
            color: index < rating ? Colors.amber : AppColors.textSubLight.withOpacity(0.3),
          ),
          onPressed: isEditable ? () => onRatingChanged(index + 1) : null,
        );
      }),
    );
  }

  Widget _buildReviewTab({
    required String title,
    required int rating,
    required String comment,
    required bool isAnonymous,
    required bool isSubmitting,
    required String? createdAt,
    required bool isEditMode,
    required Function(int) onRatingChanged,
    required Function(String) onCommentChanged,
    required Function(bool?) onAnonymousChanged,
    required VoidCallback onSubmit,
  }) {
    bool isEditable = true;
    if (createdAt != null) {
      final createdDate = DateTime.tryParse(createdAt);
      if (createdDate != null) {
        isEditable = DateTime.now().difference(createdDate).inHours < 24;
      }
    }

    final commentController = TextEditingController(text: comment);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          if (!isEditable)
            Container(
              margin: const EdgeInsets.only(bottom: 24),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFFF3F4F6),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE5E7EB)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline_rounded, color: Color(0xFF6B7280), size: 20),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Đánh giá này đã quá 24 giờ và không thể chỉnh sửa.',
                      style: AppStyles.caption.copyWith(color: const Color(0xFF4B5563)),
                    ),
                  ),
                ],
              ),
            ),
          
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.05),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.star_rounded, size: 60, color: AppColors.primary),
          ),
          const SizedBox(height: 24),
          Text(title, style: AppStyles.heading2.copyWith(fontSize: 18), textAlign: TextAlign.center),
          
          const SizedBox(height: 30),
          _buildRatingStars(rating, onRatingChanged, isEditable),
          
          const SizedBox(height: 40),
          Align(
            alignment: Alignment.centerLeft,
            child: Text('Góp ý thêm (Không bắt buộc)', style: AppStyles.caption.copyWith(color: AppColors.textSubLight, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: commentController,
            onChanged: onCommentChanged,
            maxLines: 4,
            readOnly: !isEditable,
            decoration: InputDecoration(
              hintText: isEditable ? 'Nhập trải nghiệm của bạn...' : 'Không có nhận xét.',
              hintStyle: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight.withOpacity(0.5)),
              filled: true,
              fillColor: isEditable ? AppColors.primary.withOpacity(0.03) : const Color(0xFFF9FAFB),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
              focusedBorder: isEditable 
                  ? OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.primary, width: 1.5))
                  : OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
            ),
          ),
          
          const SizedBox(height: 16),
          CheckboxListTile(
            value: isAnonymous,
            onChanged: isEditable ? onAnonymousChanged : null,
            title: Text('Đánh giá ẩn danh', style: AppStyles.bodyMedium.copyWith(fontWeight: FontWeight.bold, color: AppColors.textMainLight)),
            controlAffinity: ListTileControlAffinity.leading,
            contentPadding: EdgeInsets.zero,
            activeColor: AppColors.primary,
          ),
          
          if (isEditable) ...[
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: isSubmitting 
                  ? const Center(child: CircularProgressIndicator())
                  : GradientButton(
                      text: isEditMode ? 'Cập nhật đánh giá' : 'Gửi Đánh Giá',
                      onPressed: rating > 0 ? onSubmit : () {},
                    ),
            ),
          ],
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: GradientAppBar(
        title: 'Đánh giá dịch vụ',
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSubLight,
          indicatorColor: AppColors.primary,
          tabs: const [
            Tab(icon: Icon(Icons.person), text: 'Bác sĩ'),
            Tab(icon: Icon(Icons.local_hospital), text: 'Phòng khám'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildReviewTab(
            title: 'Bạn đánh giá thế nào về BS. ${widget.appointment.doctorName}?',
            rating: _doctorRating,
            comment: _doctorComment,
            isAnonymous: _doctorIsAnonymous,
            isSubmitting: _doctorSubmitting,
            createdAt: _doctorCreatedAt,
            isEditMode: _doctorReviewId != null,
            onRatingChanged: (r) => setState(() => _doctorRating = r),
            onCommentChanged: (c) => setState(() => _doctorComment = c),
            onAnonymousChanged: (v) => setState(() => _doctorIsAnonymous = v ?? false),
            onSubmit: _submitDoctorReview,
          ),
          _buildReviewTab(
            title: 'Bạn cảm thấy hài lòng với dịch vụ phòng khám chứ?',
            rating: _clinicRating,
            comment: _clinicComment,
            isAnonymous: _clinicIsAnonymous,
            isSubmitting: _clinicSubmitting,
            createdAt: _clinicCreatedAt,
            isEditMode: _clinicReviewId != null,
            onRatingChanged: (r) => setState(() => _clinicRating = r),
            onCommentChanged: (c) => setState(() => _clinicComment = c),
            onAnonymousChanged: (v) => setState(() => _clinicIsAnonymous = v ?? false),
            onSubmit: _submitClinicReview,
          ),
        ],
      ),
    );
  }
}

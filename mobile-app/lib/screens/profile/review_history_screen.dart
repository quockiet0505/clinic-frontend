import 'package:flutter/material.dart';
import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/services/feedback_service.dart';
import 'package:intl/intl.dart';

class ReviewHistoryScreen extends StatefulWidget {
  const ReviewHistoryScreen({super.key});

  @override
  State<ReviewHistoryScreen> createState() => _ReviewHistoryScreenState();
}

class _ReviewHistoryScreenState extends State<ReviewHistoryScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final FeedbackService _feedbackService = FeedbackService();

  List<dynamic> _doctorFeedbacks = [];
  List<dynamic> _clinicFeedbacks = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
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

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Widget _buildStars(int rating) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (index) {
        return Icon(
          index < rating ? Icons.star_rounded : Icons.star_border_rounded,
          size: 16,
          color: index < rating ? Colors.amber : AppColors.textSubLight.withOpacity(0.3),
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
            color: Colors.black.withOpacity(0.03),
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
                color: AppColors.primary.withOpacity(0.05),
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
                color: Colors.green.withOpacity(0.05),
                borderRadius: BorderRadius.circular(8),
                border: const Border(left: BorderSide(color: Colors.green, width: 3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Phản hồi từ ${feedback['repliedBy'] ?? 'Phòng khám'}:', style: AppStyles.caption.copyWith(fontWeight: FontWeight.bold, color: Colors.green)),
                  const SizedBox(height: 4),
                  Text(feedback['reply'], style: AppStyles.caption.copyWith(color: AppColors.textMainLight)),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildList(List<dynamic> list, bool isDoctor) {
    if (list.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.rate_review_outlined, size: 64, color: AppColors.textSubLight.withOpacity(0.3)),
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
        itemBuilder: (context, index) {
          return _buildReviewCard(list[index], isDoctor);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFF),
      appBar: AppBar(
        title: Text('Lịch sử đánh giá', style: AppStyles.heading3.copyWith(color: AppColors.textMainLight)),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textMainLight),
          onPressed: () => Navigator.pop(context),
        ),
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
      body: _isLoading
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
              : TabBarView(
                  controller: _tabController,
                  children: [
                    _buildList(_doctorFeedbacks, true),
                    _buildList(_clinicFeedbacks, false),
                  ],
                ),
    );
  }
}

import 'package:clinic_management_system/app_exports.dart';
import 'package:clinic_management_system/services/follow_up_service.dart';
import 'package:clinic_management_system/services/notification_service.dart';
import 'package:easy_localization/easy_localization.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  final NotificationService _notificationService = NotificationService();
  final FollowUpService _followUpService = FollowUpService();

  List<PatientNotification> _notifications = [];
  List<PatientFollowUp> _pendingFollowUps = [];
  bool _loading = true;
  String? _error;
  int? _actionLoadingId;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final results = await Future.wait([
        _notificationService.getMyNotifications(),
        _followUpService.getMyFollowUps(),
      ]);
      setState(() {
        _notifications = results[0] as List<PatientNotification>;
        _pendingFollowUps = (results[1] as List<PatientFollowUp>)
            .where((f) => f.status == 'PENDING')
            .toList();
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  Future<void> _confirmFollowUp(int id) async {
    setState(() => _actionLoadingId = id);
    try {
      await _followUpService.confirm(id);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Đã xác nhận lịch tái khám')),
        );
        await _load();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) setState(() => _actionLoadingId = null);
    }
  }

  Future<void> _declineFollowUp(int id) async {
    setState(() => _actionLoadingId = id);
    try {
      await _followUpService.decline(id, reason: 'Bệnh nhân từ chối trên app');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Đã ghi nhận từ chối tái khám')),
        );
        await _load();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) setState(() => _actionLoadingId = null);
    }
  }

  String _formatTimeAgo(DateTime date) {
    final diff = DateTime.now().difference(date);
    if (diff.inMinutes < 1) return 'Vừa xong';
    if (diff.inHours < 1) return '${diff.inMinutes} phút trước';
    if (diff.inDays < 1) return '${diff.inHours} giờ trước';
    if (diff.inDays < 7) return '${diff.inDays} ngày trước';
    return DateFormat('dd/MM/yyyy').format(date);
  }

  IconData _iconForContent(String content) {
    final lc = content.toLowerCase();
    if (lc.contains('tái khám')) return Icons.event_repeat_rounded;
    if (lc.contains('lịch hẹn') || lc.contains('appointment')) return Icons.calendar_month_rounded;
    if (lc.contains('xét nghiệm') || lc.contains('kết quả')) return Icons.biotech_rounded;
    return Icons.notifications_rounded;
  }

  Color _colorForContent(String content) {
    final lc = content.toLowerCase();
    if (lc.contains('tái khám')) return Colors.deepPurple;
    if (lc.contains('lịch hẹn')) return AppColors.primary;
    if (lc.contains('xét nghiệm') || lc.contains('kết quả')) return AppColors.accentMint;
    return Colors.orange;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgLight,
      appBar: GradientAppBar(
        title: 'notifications_title'.tr(),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: _loading ? null : _load,
            icon: const Icon(Icons.refresh_rounded, color: Colors.white),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('Không tải được thông báo', style: AppStyles.bodyLarge),
                      const SizedBox(height: 12),
                      TextButton(onPressed: _load, child: const Text('Thử lại')),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                    children: [
                      if (_pendingFollowUps.isNotEmpty) ...[
                        Text('Lịch tái khám cần xác nhận', style: AppStyles.bodyLarge.copyWith(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 12),
                        ..._pendingFollowUps.map((fu) => _buildFollowUpCard(fu)),
                        const SizedBox(height: 20),
                        Text('Thông báo', style: AppStyles.bodyLarge.copyWith(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 12),
                      ],
                      if (_notifications.isEmpty && _pendingFollowUps.isEmpty)
                        SizedBox(
                          height: MediaQuery.of(context).size.height * 0.5,
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.notifications_off_rounded, size: 80, color: Colors.grey[300]),
                                const SizedBox(height: 16),
                                Text('notifications_empty'.tr(), style: AppStyles.bodyLarge.copyWith(color: AppColors.textSubLight)),
                              ],
                            ),
                          ),
                        )
                      else
                        ..._notifications.map(_buildNotificationCard),
                    ],
                  ),
                ),
    );
  }

  Widget _buildFollowUpCard(PatientFollowUp fu) {
    final loading = _actionLoadingId == fu.followUpId;
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.deepPurple.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.deepPurple.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(fu.doctorName, style: AppStyles.bodyLarge.copyWith(fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(fu.scheduledDatetime, style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight)),
          if (fu.note != null && fu.note!.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(fu.note!, style: AppStyles.caption),
          ],
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: loading ? null : () => _declineFollowUp(fu.followUpId),
                  child: const Text('Từ chối'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: loading ? null : () => _confirmFollowUp(fu.followUpId),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.deepPurple),
                  child: Text(loading ? '...' : 'Xác nhận'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationCard(PatientNotification notif) {
    final color = _colorForContent(notif.content);
    final icon = _iconForContent(notif.content);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
        border: Border.all(color: Colors.grey.withOpacity(0.1)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  notif.subject.isNotEmpty ? notif.subject : 'Thông báo',
                  style: AppStyles.bodyLarge.copyWith(fontWeight: FontWeight.bold),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 6),
                Text(notif.content, style: AppStyles.bodyMedium.copyWith(color: AppColors.textSubLight)),
                const SizedBox(height: 8),
                Text(_formatTimeAgo(notif.sentAt), style: AppStyles.caption.copyWith(color: AppColors.textSubLight, fontSize: 11)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

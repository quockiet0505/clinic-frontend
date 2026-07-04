import 'package:clinic_management_system/app_exports.dart';

class GradientAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final bool centerTitle;
  final List<Widget>? actions;
  final Widget? leading;
  final bool automaticallyImplyLeading;
  final PreferredSizeWidget? bottom;
  final VoidCallback? onBackPress;

  const GradientAppBar({
    super.key,
    required this.title,
    this.centerTitle = true,
    this.actions,
    this.leading,
    this.automaticallyImplyLeading = true,
    this.bottom,
    this.onBackPress,
  });

  @override
  Widget build(BuildContext context) {
    Widget? leadingWidget = leading;
    
    if (leadingWidget == null && automaticallyImplyLeading && Navigator.canPop(context)) {
      leadingWidget = Padding(
        padding: const EdgeInsets.only(left: 16),
        child: IconButton(
          padding: EdgeInsets.zero,
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textMainLight, size: 22),
          onPressed: onBackPress ?? () => Navigator.pop(context),
        ),
      );
    }

    return AppBar(
      toolbarHeight: 70,
      title: Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textMainLight)),
      centerTitle: centerTitle,
      elevation: 0,
      backgroundColor: Colors.transparent,
      automaticallyImplyLeading: false,
      leading: leadingWidget,
      leadingWidth: 64, // 16 margin + 40 width + 8 padding
      actions: actions,
      bottom: bottom,
      flexibleSpace: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFDBEAFE), // Blue-100
              Color(0xFFF8FAFF), // Light background color instead of pure white
            ],
            stops: [0.0, 1.0],
          ),
        ),
      ),
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(70.0 + (bottom?.preferredSize.height ?? 0.0));
}

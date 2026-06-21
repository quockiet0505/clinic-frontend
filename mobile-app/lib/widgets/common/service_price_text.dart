import 'package:flutter/material.dart';
import 'package:clinic_management_system/core/constants/app_colors.dart';
import 'package:clinic_management_system/core/constants/app_styles.dart';
import 'package:clinic_management_system/models/service_model.dart';
import 'package:clinic_management_system/utils/currency_formatter.dart';
import 'package:clinic_management_system/utils/service_price_utils.dart';

class ServicePriceText extends StatelessWidget {
  final ServiceModel service;
  final double priceFontSize;
  final double strikeFontSize;

  const ServicePriceText({
    super.key,
    required this.service,
    this.priceFontSize = 15,
    this.strikeFontSize = 11,
  });

  @override
  Widget build(BuildContext context) {
    if (service.hasDiscount) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            CurrencyFormatter.formatVND(service.originalPrice),
            style: AppStyles.caption.copyWith(
              decoration: TextDecoration.lineThrough,
              color: AppColors.textSubLight,
              fontSize: strikeFontSize,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            CurrencyFormatter.formatVND(service.effectivePrice),
            style: AppStyles.bodyMedium.copyWith(
              color: const Color(0xFFEF4444),
              fontSize: priceFontSize,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      );
    }

    return Text(
      CurrencyFormatter.formatVND(service.originalPrice),
      style: AppStyles.bodyMedium.copyWith(
        color: AppColors.primary,
        fontSize: priceFontSize,
        fontWeight: FontWeight.bold,
      ),
    );
  }
}

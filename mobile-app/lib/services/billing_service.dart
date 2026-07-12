import 'package:clinic_management_system/core/network/dio_client.dart';

class BillingService {
  final DioClient _dioClient = DioClient();

  Future<List<dynamic>> getMyInvoices() async {
    try {
      final response = await _dioClient.dio.get('/invoices/my');
      if (response.statusCode == 200) {
        return response.data['data'] as List<dynamic>;
      } else {
        throw Exception(response.data['message'] ?? 'Failed to fetch billing history');
      }
    } catch (e) {
      rethrow;
    }
  }

  Future<dynamic> requestTransfer(int invoiceId) async {
    try {
      final response = await _dioClient.dio.put('/invoices/$invoiceId/request-transfer');
      if (response.statusCode == 200) {
        return response.data['data'];
      } else {
        throw Exception(response.data['message'] ?? 'Failed to request transfer verification');
      }
    } catch (e) {
      rethrow;
    }
  }
}

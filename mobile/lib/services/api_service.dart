import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

String get _baseUrl => dotenv.env['API_BASE_URL'] ?? 'http://localhost:4000';

Future<String?> _getAccessToken() async {
  try {
    final session = await Amplify.Auth.fetchAuthSession() as CognitoAuthSession;
    return session.userPoolTokensResult.value?.accessToken.raw;
  } catch (_) {
    return null;
  }
}

Future<Map<String, dynamic>> apiPost(String path, Map<String, dynamic> body) async {
  final token = await _getAccessToken();
  final res = await http.post(
    Uri.parse('$_baseUrl$path'),
    headers: {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    },
    body: jsonEncode(body),
  );
  final data = jsonDecode(res.body) as Map<String, dynamic>;
  if (res.statusCode >= 400) throw data;
  return data;
}

Future<Map<String, dynamic>> apiGet(String path) async {
  final token = await _getAccessToken();
  final res = await http.get(
    Uri.parse('$_baseUrl$path'),
    headers: {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    },
  );
  final data = jsonDecode(res.body) as Map<String, dynamic>;
  if (res.statusCode >= 400) throw data;
  return data;
}

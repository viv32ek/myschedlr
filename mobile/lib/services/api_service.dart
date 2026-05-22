import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

const _baseUrl = 'http://localhost:4000';
const _storage = FlutterSecureStorage();

Future<Map<String, dynamic>> apiPost(String path, Map<String, dynamic> body) async {
  final token = await _storage.read(key: 'accessToken');
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
  final token = await _storage.read(key: 'accessToken');
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

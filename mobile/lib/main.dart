import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'screens/login_screen.dart';
import 'screens/signup_screen.dart';
import 'screens/home_screen.dart';
import 'config/amplify_config.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: '.env');
  await _configureAmplify();
  runApp(const MySchedlrApp());
}

class MySchedlrApp extends StatelessWidget {
  const MySchedlrApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'MySchedlr',
      theme: ThemeData(colorSchemeSeed: const Color(0xFF3B82F6), useMaterial3: true),
      routerConfig: _router,
    );
  }
}

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';

final _router = GoRouter(
  initialLocation: '/login',
  routes: [
    GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
    GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
  ],
);

void main() => runApp(const MySchedlrApp());

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

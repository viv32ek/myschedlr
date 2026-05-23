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

Future<void> _configureAmplify() async {
  try {
    await Amplify.addPlugin(AmplifyAuthCognito());
    await Amplify.configure(buildAmplifyConfig());
  } on AmplifyAlreadyConfiguredException {
    // Thrown during hot-reload — safe to ignore.
  }
}

Future<bool> _isSignedIn() async {
  try {
    final session = await Amplify.Auth.fetchAuthSession();
    return session.isSignedIn;
  } catch (_) {
    return false;
  }
}

final _router = GoRouter(
  initialLocation: '/login',
  redirect: (BuildContext context, GoRouterState state) async {
    final signedIn = await _isSignedIn();
    final loc = state.matchedLocation;
    final goingToAuth = loc == '/login' || loc == '/signup';

    if (!signedIn && !goingToAuth) return '/login';
    if (signedIn && goingToAuth) return '/home';
    return null;
  },
  routes: [
    GoRoute(path: '/login',  builder: (_, __) => const LoginScreen()),
    GoRoute(path: '/signup', builder: (_, __) => const SignupScreen()),
    GoRoute(path: '/home',   builder: (_, __) => const HomeScreen()),
    // /profile is reserved for v2 — redirect to /home until implemented
    GoRoute(path: '/profile', redirect: (_, __) async => '/home'),
  ],
);

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

// auth-app.jsx
// Auth state machine: signIn ↔ signUp ↔ forgot ↔ verify → done. Top-right
// slot of the form panel shows the contextual "go-to-other-screen" CTA so the
// primary form stays focused on one job.

function AuthApp() {
  // Read initial screen from ?screen=… so the Tweaks panel can deep-link, and
  // so a refresh keeps you where you were. Defaults to 'signIn'.
  const initial = () => {
    const u = new URL(window.location);
    const s = u.searchParams.get('screen');
    return ['signIn', 'signUp', 'forgot', 'verify', 'done'].includes(s) ? s : 'signIn';
  };
  const [screen, setScreen] = React.useState(initial);

  const go = React.useCallback((next) => {
    setScreen(next);
    const u = new URL(window.location);
    u.searchParams.set('screen', next);
    window.history.replaceState({}, '', u);
  }, []);

  // Top-right link in the form panel — contextual.
  const topRight = (() => {
    if (screen === 'signIn') {
      return (
        <span style={{ fontSize: 14, color: SKY.inkSoft, fontWeight: 500 }}>
          No account?{' '}
          <TextLink onClick={() => go('signUp')}>Sign up</TextLink>
        </span>
      );
    }
    if (screen === 'signUp') {
      return (
        <span style={{ fontSize: 14, color: SKY.inkSoft, fontWeight: 500 }}>
          Have an account?{' '}
          <TextLink onClick={() => go('signIn')}>Sign in</TextLink>
        </span>
      );
    }
    if (screen === 'forgot' || screen === 'verify') {
      return <TextLink color={SKY.inkSoft} onClick={() => go('signIn')}>← Back to sign in</TextLink>;
    }
    return null;
  })();

  return (
    <>
      <AuthShell topRight={topRight}>
        {screen === 'signIn' && <SignInScreen go={go} />}
        {screen === 'signUp' && <SignUpScreen go={go} />}
        {screen === 'forgot' && <ForgotPasswordScreen go={go} />}
        {screen === 'verify' && <VerifyAccountScreen go={go} />}
        {screen === 'done'   && <DoneScreen go={go} />}
      </AuthShell>

      <TweaksPanel title="Prototype nav">
        <TweakSection label="Screen" />
        <TweakSelect
          label="Jump to"
          value={screen}
          options={[
            { value: 'signIn', label: 'Sign in' },
            { value: 'signUp', label: 'Sign up' },
            { value: 'forgot', label: 'Forgot password' },
            { value: 'verify', label: 'Verify account' },
            { value: 'done',   label: 'Signed-in success' },
          ]}
          onChange={go}
        />
        <TweakSection label="Theme accent" />
        <TweakColor
          label="Blue shade"
          value={SKY.accent}
          options={['#2f80ed', '#1f7ae0', '#2f5fff', '#3b6dd9', '#4f46e5', '#0ea5e9']}
          onChange={(v) => { SKY.accent = v; setScreen((s) => s); /* re-render */ }}
        />
      </TweaksPanel>
    </>
  );
}

const authRoot = ReactDOM.createRoot(document.getElementById('root'));
authRoot.render(<AuthApp />);

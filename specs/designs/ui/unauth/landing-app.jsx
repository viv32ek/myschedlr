// landing-app.jsx
// Wires the landing page sections together + a small Tweaks panel for
// last-mile theme tuning (blue shade, button radius, dark CTA, etc.).

const LANDING_TWEAKS = /*EDITMODE-BEGIN*/{
  "accent": "#2f80ed",
  "buttonRadius": 14,
  "showStats": true
}/*EDITMODE-END*/;

function LandingApp() {
  const [t, setTweak] = useTweaks(LANDING_TWEAKS);

  // Live-tune the global SKY tokens by mutating CSS custom properties on the
  // wrapper. Since SKY is read directly by components, the cleanest thing is
  // to override values via a small style overlay and a derived SKY object.
  React.useEffect(() => {
    SKY.accent = t.accent;
    SKY.radiusButton = t.buttonRadius;
  }, [t.accent, t.buttonRadius]);

  // Force re-render of children when tweaks change by keying on the values.
  const key = `${t.accent}-${t.buttonRadius}-${t.showStats}`;

  return (
    <div style={{ background: SKY.bg, minHeight: '100vh' }}>
      <div key={key} style={{
        fontFamily: '"Manrope", ui-sans-serif, system-ui, sans-serif',
        fontFeatureSettings: '"ss01", "cv11"',
        color: SKY.ink,
      }}>
        <TopNav />
        <Hero />
        {t.showStats && <TrustBar />}
        <RolesSection />
        <FeaturesSection />
        <MultiTenantSection />
        <BigCTA />
        <Footer />
      </div>

      <TweaksPanel title="Tune Sky theme">
        <TweakSection label="Accent" />
        <TweakColor
          label="Blue shade"
          value={t.accent}
          options={['#2f80ed', '#1f7ae0', '#2f5fff', '#3b6dd9', '#4f46e5', '#0ea5e9']}
          onChange={(v) => setTweak('accent', v)}
        />

        <TweakSection label="Shape" />
        <TweakSlider
          label="Button radius"
          value={t.buttonRadius}
          min={4} max={24} step={2} unit="px"
          onChange={(v) => setTweak('buttonRadius', v)}
        />

        <TweakSection label="Sections" />
        <TweakToggle
          label="Show stats strip"
          value={t.showStats}
          onChange={(v) => setTweak('showStats', v)}
        />
      </TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LandingApp />);

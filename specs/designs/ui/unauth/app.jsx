// app.jsx — MySchedlr theme exploration
// Wires up DesignCanvas with 4 variation rows (Bright / Editorial / Dark / Soft).
// Each row shows: Style Tile · Landing Hero · Student Dashboard.
// Tweaks panel applies optional global overrides on top of each theme.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentOverride": "vary",
  "cardRadius": "vary",
  "buttonRadius": "vary",
  "fontWeight": "vary",
  "spotlight": "bright-blue"
}/*EDITMODE-END*/;

// Four Bright-direction explorations that stay within the blue family.
// Each tweaks one or more of {blue tone, bg warmth, shape sharpness} so we
// can see how each axis reads on the landing hero.
const BRIGHT_BLUE_VARIANTS = [
  {
    ...THEMES.bright,
    key: 'bb-cobalt',
    tag: '01a',
    name: 'Cobalt',
    blurb: 'Baseline cream + cobalt. Confident, friendly, the default.',
    accent: '#2f5fff',
    accentSoft: '#dde4ff',
  },
  {
    ...THEMES.bright,
    key: 'bb-navy',
    tag: '01b',
    name: 'Navy / Enterprise',
    blurb: 'Cooler neutral surface + deep navy. Reads grown-up & ops-ready.',
    bg: '#f3f4f7',
    surface: '#ffffff',
    surfaceAlt: '#e4e7ee',
    ink: '#0b1224',
    inkSoft: '#2c3548',
    muted: '#6a7080',
    accent: '#1e3a8a',
    accentSoft: '#dde3f2',
    accentInk: '#ffffff',
    line: 'rgba(11,18,36,0.10)',
    radiusCard: 0,
    radiusButton: 6,
    shadow: '0 0 0 1px rgba(11,18,36,0.06)',
  },
  {
    ...THEMES.bright,
    key: 'bb-sky',
    tag: '01c',
    name: 'Sky / Friendly',
    blurb: 'Warmer cream, lighter sky blue, softer corners. Student-leaning.',
    bg: '#fbf5ea',
    surface: '#ffffff',
    surfaceAlt: '#f1ebdc',
    accent: '#2f80ed',
    accentSoft: '#d8e7fb',
    radiusCard: 10,
    radiusButton: 16,
    shadow: '0 2px 4px rgba(26,23,20,0.06), 0 12px 28px rgba(47,128,237,0.08)',
  },
  {
    ...THEMES.bright,
    key: 'bb-indigo',
    tag: '01d',
    name: 'Indigo / Academic',
    blurb: 'Slight purple tilt. Pairs well with mono labels, library feel.',
    bg: '#f6f4ec',
    accent: '#4f46e5',
    accentSoft: '#e2dffb',
    radiusCard: 2,
    radiusButton: 10,
  },
];

// Curated accent options. Oranges hold the original system, blues are the
// alt-family explore. Soft tint is derived in applyTweaks().
const ACCENT_SWATCHES = [
  '#ff5a1f', // signal orange
  '#e74617', // bold orange
  '#2f5fff', // cobalt
  '#3b6dd9', // royal
  '#1f7ae0', // azure
  '#4f46e5', // indigo
];

// Mix a hex toward white by `amount` (0..1). Used to derive accent-soft on
// light themes when the user overrides the accent.
function tintTowardWhite(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const mix = (c) => Math.round(c + (255 - c) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Build the active theme for a given variant by layering Tweaks on top.
function applyTweaks(base, t) {
  const out = { ...base };
  if (t.accentOverride !== 'vary') {
    out.accent = t.accentOverride;
    // Re-derive the soft tint so pills/highlights stay readable on the new hue.
    out.accentSoft = base.key === 'dark'
      ? hexToRgba(t.accentOverride, 0.18)
      : tintTowardWhite(t.accentOverride, 0.85);
  }
  if (t.cardRadius !== 'vary')   out.radiusCard   = Number(t.cardRadius);
  if (t.buttonRadius !== 'vary') out.radiusButton = Number(t.buttonRadius);
  return out;
}

function ArtboardWrap({ children, dim }) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      transition: 'filter .2s, opacity .2s',
      filter: dim ? 'grayscale(0.4)' : 'none',
      opacity: dim ? 0.55 : 1,
    }}>{children}</div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Headline weight override is applied via a small <style> at app root.
  const weightCss = t.fontWeight === 'vary' ? '' :
    `.dc-card h1, .dc-card h2 { font-weight: ${t.fontWeight} !important; }`;

  // Theme keys in display order.
  const order = ['bright', 'editorial', 'dark', 'soft'];
  const active = order.map((k) => ({
    key: k,
    theme: applyTweaks(THEMES[k], t),
    dim: t.spotlight !== 'all' && t.spotlight !== k,
  }));

  const blueRowDim = t.spotlight !== 'all' && t.spotlight !== 'bright-blue';
  const blueVariants = BRIGHT_BLUE_VARIANTS.map((v) => ({
    key: v.key,
    theme: applyTweaks(v, t),
  }));

  return (
    <>
      <style>{weightCss}</style>
      <DesignCanvas minScale={0.05} maxScale={2}>
        {/* Comparison row: Bright direction, four blue treatments */}
        <DCSection
          id="bright-blue"
          title="01 · Bright + Blue · explore"
          subtitle="Same Bright direction, four blue treatments. Compare hero-to-hero."
        >
          {blueVariants.map(({ key, theme }) => (
            <DCArtboard key={key} id={key} label={`${theme.tag} · ${theme.name}`} width={1280} height={760}>
              <ArtboardWrap dim={blueRowDim}><LandingHero theme={theme} /></ArtboardWrap>
            </DCArtboard>
          ))}
        </DCSection>

        {active.map(({ key, theme, dim }) => (
          <DCSection
            key={key}
            id={key}
            title={`${theme.tag} · ${theme.name}`}
            subtitle={theme.blurb}
          >
            <DCArtboard id={`${key}-tile`}  label="Style tile"        width={1120} height={780}>
              <ArtboardWrap dim={dim}><StyleTile theme={theme} /></ArtboardWrap>
            </DCArtboard>
            <DCArtboard id={`${key}-land`}  label="Landing hero"      width={1280} height={760}>
              <ArtboardWrap dim={dim}><LandingHero theme={theme} /></ArtboardWrap>
            </DCArtboard>
            <DCArtboard id={`${key}-dash`}  label="Student dashboard" width={1280} height={800}>
              <ArtboardWrap dim={dim}><StudentDashboard theme={theme} /></ArtboardWrap>
            </DCArtboard>
          </DCSection>
        ))}

        {/* Pinned context post-its */}
        <DCPostIt top={-40} left={56} width={260} rotate={-1.5}>
          4 directions × 3 surfaces. Pan/zoom freely. Tap any artboard to focus it.
        </DCPostIt>
      </DesignCanvas>

      <TweaksPanel title="Theme tweaks">
        <TweakSection label="Spotlight" />
        <TweakSelect
          label="Highlight one"
          value={t.spotlight}
          options={[
            { value: 'all',          label: 'Show everything' },
            { value: 'bright-blue',  label: '01 · Bright + Blue explore' },
            { value: 'bright',       label: '01 · Bright Optimist' },
            { value: 'editorial',    label: '02 · Editorial Calm' },
            { value: 'dark',         label: '03 · Dark Focus' },
            { value: 'soft',         label: '04 · Soft Pop' },
          ]}
          onChange={(v) => setTweak('spotlight', v)}
        />

        <TweakSection label="Accent · orange / blue" />
        <TweakColor
          label="Override accent"
          value={t.accentOverride === 'vary' ? null : t.accentOverride}
          options={ACCENT_SWATCHES}
          onChange={(v) => setTweak('accentOverride', v)}
        />
        <TweakButton
          label="Reset to per-direction"
          secondary
          onClick={() => setTweak('accentOverride', 'vary')}
        />

        <TweakSection label="Shape" />
        <TweakSelect
          label="Container radius"
          value={t.cardRadius}
          options={[
            { value: 'vary', label: 'Per direction' },
            { value: '0', label: 'Sharp · 0px' },
            { value: '4', label: 'Soft · 4px' },
            { value: '10', label: 'Round · 10px' },
            { value: '16', label: 'Pillow · 16px' },
          ]}
          onChange={(v) => setTweak('cardRadius', v)}
        />
        <TweakSelect
          label="Button radius"
          value={t.buttonRadius}
          options={[
            { value: 'vary', label: 'Per direction' },
            { value: '4',  label: 'Slim · 4px' },
            { value: '10', label: 'Soft · 10px' },
            { value: '16', label: 'Pill-ish · 16px' },
            { value: '999', label: 'Full pill' },
          ]}
          onChange={(v) => setTweak('buttonRadius', v)}
        />

        <TweakSection label="Type" />
        <TweakSelect
          label="Headline weight"
          value={t.fontWeight}
          options={[
            { value: 'vary', label: 'Per direction (default)' },
            { value: '500', label: '500 · Medium' },
            { value: '600', label: '600 · Semibold' },
            { value: '700', label: '700 · Bold' },
            { value: '800', label: '800 · Extrabold' },
          ]}
          onChange={(v) => setTweak('fontWeight', v)}
        />
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

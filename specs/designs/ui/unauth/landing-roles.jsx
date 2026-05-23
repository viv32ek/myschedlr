// landing-roles.jsx
// Two big narrative sections: "Three roles, one school OS" with tabbed
// switcher + matching mini-screenshot, and "Multi-tenant by design" with
// an isolation diagram.

const ROLES = {
  admin: {
    label: 'Admin',
    eyebrow: 'For school operators',
    title: 'Shape the school. Once.',
    blurb: 'Stand up courses, batches, faculty rosters and academic calendars from a single console. Multi-tenant by default — onboard a sister-school in an afternoon.',
    bullets: [
      'Bulk-import students, faculty and classrooms from CSV',
      'Define course → batch → section hierarchies once, clone yearly',
      'Tenant-scoped role permissions with audit log',
      'Real-time occupancy, attendance and revenue dashboards',
    ],
  },
  faculty: {
    label: 'Faculty',
    eyebrow: 'For teachers',
    title: 'Spend the hour teaching, not chasing.',
    blurb: 'See your day, take attendance in one tap, push readings to a batch, and grade tests with auto-keys. Every result writes back to the parent tenant.',
    bullets: [
      'Today-view: classes, materials and pending grading in one screen',
      'One-tap attendance with parent SMS auto-send',
      'Schedule make-up classes with conflict detection',
      'Auto-graded MCQs + rubric-graded subjective tests',
    ],
  },
  student: {
    label: 'Student',
    eyebrow: 'For learners',
    title: 'Know what\'s next. Always.',
    blurb: 'Your batch, your schedule, your tests and your scores — in one place. Streak tracking and weekly digests keep students moving without nagging.',
    bullets: [
      'Live class joins, materials and notes per batch',
      'Test schedule with reminders 24h, 1h and 5m before',
      'Score trends per subject and rank in batch',
      'Weekly digest to parents — opt-in per tenant',
    ],
  },
};

function RolesSection() {
  const [active, setActive] = React.useState('student');
  const r = ROLES[active];
  return (
    <LSection
      id="roles"
      bg={SKY.bg}
      align="center"
      eyebrow="Product"
      title="Three roles. One school OS."
      subtitle="Each tenant runs MySchedlr their way — admins shape the structure, faculty deliver the classes, students track the work. Every action stays inside the tenant boundary."
    >
      {/* Tabs */}
      <div role="tablist" style={{
        display: 'inline-flex',
        background: SKY.surface,
        border: `1px solid ${SKY.line}`,
        borderRadius: 999, padding: 4, gap: 2,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        margin: '0 auto 40px', alignSelf: 'center',
      }}>
        {Object.entries(ROLES).map(([key, r]) => {
          const on = active === key;
          return (
            <button key={key} role="tab" aria-selected={on}
              onClick={() => setActive(key)}
              style={{
                border: 'none', cursor: 'pointer',
                padding: '10px 22px',
                borderRadius: 999,
                background: on ? SKY.accent : 'transparent',
                color: on ? '#fff' : SKY.inkSoft,
                fontFamily: 'inherit', fontWeight: 600, fontSize: 14,
                letterSpacing: '-0.005em',
                transition: 'background .15s, color .15s',
              }}>{r.label}</button>
          );
        })}
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '0.95fr 1.1fr', gap: 56,
        alignItems: 'center', textAlign: 'left',
      }}>
        {/* Copy */}
        <div>
          <LCardLabel color={SKY.accent}>{r.eyebrow}</LCardLabel>
          <h3 style={{
            margin: '12px 0 16px',
            fontSize: 36, fontWeight: 700,
            letterSpacing: '-0.028em', lineHeight: 1.1,
            color: SKY.ink, textWrap: 'balance',
          }}>{r.title}</h3>
          <p style={{
            margin: 0, fontSize: 16, lineHeight: 1.55,
            color: SKY.inkSoft, fontWeight: 500, textWrap: 'pretty',
          }}>{r.blurb}</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {r.bullets.map((b, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{
                  flexShrink: 0, width: 20, height: 20, borderRadius: 10,
                  background: SKY.accentSoft, color: SKY.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 1,
                }}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6l2.5 2.5L9 3" />
                  </svg>
                </span>
                <span style={{ fontSize: 15, color: SKY.ink, lineHeight: 1.45, fontWeight: 500 }}>{b}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 28 }}>
            <LButton kind="secondary" size="md">
              See {r.label.toLowerCase()} demo
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" /></svg>
            </LButton>
          </div>
        </div>

        {/* Mini-screenshot */}
        <div style={{
          background: SKY.surface,
          borderRadius: SKY.radiusCard,
          boxShadow: SKY.shadowLg,
          border: `1px solid ${SKY.line}`,
          overflow: 'hidden',
          aspectRatio: '4/3',
        }}>
          {active === 'admin' && <AdminPeek />}
          {active === 'faculty' && <FacultyPeek />}
          {active === 'student' && <StudentPeek />}
        </div>
      </div>
    </LSection>
  );
}

// ─── Per-role mini-screenshots ─────────────────────────────────────────────

function MiniWindow({ title, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 16px',
        background: SKY.surfaceAlt, borderBottom: `1px solid ${SKY.line}`,
      }}>
        <div style={{ display: 'flex', gap: 5 }}>
          <span style={{ width: 9, height: 9, borderRadius: 5, background: '#ff6058' }} />
          <span style={{ width: 9, height: 9, borderRadius: 5, background: '#ffbd2e' }} />
          <span style={{ width: 9, height: 9, borderRadius: 5, background: '#28c941' }} />
        </div>
        <span style={{
          marginLeft: 12, fontSize: 12, color: SKY.muted,
          fontFamily: 'ui-monospace, monospace',
        }}>{title}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

function AdminPeek() {
  return (
    <MiniWindow title="northwind.myschedlr.app/admin">
      <div style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div>
            <LCardLabel>Tenant · Northwind Academy</LCardLabel>
            <div style={{ fontSize: 18, fontWeight: 700, color: SKY.ink, marginTop: 4, letterSpacing: '-0.02em' }}>Operations</div>
          </div>
          <LPill tone="accent">Live</LPill>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[['Batches', '24'], ['Faculty', '38'], ['Students', '612'], ['Rooms', '18']].map(([l, n]) => (
            <div key={l} style={{
              background: SKY.bg, borderRadius: 8, padding: '10px 12px',
              border: `1px solid ${SKY.line}`,
            }}>
              <div style={{ fontSize: 9.5, color: SKY.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, fontFamily: 'ui-monospace, monospace' }}>{l}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: SKY.ink, marginTop: 2, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{n}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, background: SKY.bg, borderRadius: 8, border: `1px solid ${SKY.line}`, padding: 12, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: SKY.ink }}>Today · room occupancy</span>
            <span style={{ fontSize: 10, color: SKY.muted, fontFamily: 'ui-monospace, monospace' }}>09:00 → 17:00</span>
          </div>
          <div style={{ display: 'grid', gridTemplateRows: 'repeat(5, 1fr)', gap: 4, flex: 1, minHeight: 0 }}>
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 9.5, color: SKY.muted, fontFamily: 'ui-monospace, monospace' }}>R-{200 + row}</span>
                <div style={{ position: 'relative', height: '60%', background: SKY.surface, borderRadius: 4, border: `1px solid ${SKY.line}` }}>
                  {[[8, 24], [38, 18], [62, 14]].slice(0, row % 4 + 1).map(([l, w], i) => (
                    <div key={i} style={{
                      position: 'absolute', left: l + '%', width: w + '%', top: 2, bottom: 2,
                      background: i === 0 ? SKY.accent : i === 1 ? SKY.ink : SKY.muted,
                      borderRadius: 3,
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MiniWindow>
  );
}

function FacultyPeek() {
  return (
    <MiniWindow title="northwind.myschedlr.app/teach">
      <div style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <LCardLabel>Tue · May 19 · Mr. Rao</LCardLabel>
          <div style={{ fontSize: 18, fontWeight: 700, color: SKY.ink, marginTop: 4, letterSpacing: '-0.02em' }}>My day · 4 classes</div>
        </div>
        {[
          { t: '09:00', s: 'Mathematics · 9-B', loc: 'R-118', state: 'done' },
          { t: '11:30', s: 'Physics · 11-A',    loc: 'R-214', state: 'live' },
          { t: '14:00', s: 'Physics · 11-B',    loc: 'R-214', state: 'next' },
          { t: '15:30', s: 'Make-up · 12-A',    loc: 'R-220', state: 'next' },
        ].map((c, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px',
            background: c.state === 'live' ? SKY.accentSoft : SKY.bg,
            border: `1px solid ${c.state === 'live' ? SKY.accent : SKY.line}`,
            borderRadius: 8,
            opacity: c.state === 'done' ? 0.55 : 1,
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: SKY.ink, width: 42, fontVariantNumeric: 'tabular-nums', textDecoration: c.state === 'done' ? 'line-through' : 'none' }}>{c.t}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: SKY.ink }}>{c.s}</div>
              <div style={{ fontSize: 10.5, color: SKY.muted, fontFamily: 'ui-monospace, monospace', marginTop: 1 }}>{c.loc}</div>
            </div>
            {c.state === 'live' && <LPill tone="accent">Live now</LPill>}
            {c.state === 'next' && <span style={{ fontSize: 11, color: SKY.muted, fontWeight: 600 }}>upcoming</span>}
            {c.state === 'done' && <span style={{ fontSize: 11, color: SKY.muted, fontWeight: 600 }}>27 / 28 ✓</span>}
          </div>
        ))}
      </div>
    </MiniWindow>
  );
}

function StudentPeek() {
  return (
    <MiniWindow title="northwind.myschedlr.app">
      <div style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <LCardLabel>Hey Anika · 3 classes today</LCardLabel>
            <div style={{ fontSize: 18, fontWeight: 700, color: SKY.ink, marginTop: 4, letterSpacing: '-0.02em' }}>Up next · in 6 min</div>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: 18,
            background: SKY.accent, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13,
          }}>AK</div>
        </div>
        <div style={{
          background: SKY.bg, borderRadius: 10, padding: 14, border: `1px solid ${SKY.line}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: SKY.muted, fontFamily: 'ui-monospace, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>11:30 · R-214</span>
            <LPill tone="accent">in 6 min</LPill>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: SKY.ink, letterSpacing: '-0.015em' }}>Mechanics — Friction</div>
          <div style={{ fontSize: 11.5, color: SKY.muted, marginTop: 4 }}>Sunita Rao · 3 readings · 1 quiz</div>
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, minHeight: 0 }}>
          <div style={{ background: SKY.bg, borderRadius: 8, padding: 12, border: `1px solid ${SKY.line}` }}>
            <div style={{ fontSize: 10, color: SKY.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>Avg score</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: SKY.ink, marginTop: 2, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>84<span style={{ fontSize: 12, color: SKY.muted, fontWeight: 500 }}>%</span></div>
            <div style={{ fontSize: 10.5, color: SKY.accent, fontWeight: 600, marginTop: 2 }}>↑ 6 vs last test</div>
          </div>
          <div style={{ background: SKY.bg, borderRadius: 8, padding: 12, border: `1px solid ${SKY.line}` }}>
            <div style={{ fontSize: 10, color: SKY.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>Streak</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: SKY.ink, marginTop: 2, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>12<span style={{ fontSize: 12, color: SKY.muted, fontWeight: 500 }}>d</span></div>
            <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < 12 ? SKY.accent : SKY.line }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MiniWindow>
  );
}

// ─── Multi-tenant section ──────────────────────────────────────────────────

function MultiTenantSection() {
  return (
    <LSection
      id="tenant"
      bg={SKY.surfaceDeep}
      ink="#fff"
      align="center"
      eyebrow={<><span style={{ color: '#fff' }}>Architecture</span></>}
      title="Multi-tenant by design. Zero spillover."
      subtitle="Every school runs in a fully isolated tenant. Same product, same updates, completely separate data — guaranteed at the database, cache and audit-log layer."
    >
      <TenantDiagram />

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
        marginTop: 64, textAlign: 'left',
      }}>
        {[
          {
            t: 'Tenant-scoped subdomain',
            d: 'Each org gets their own URL — northwind.myschedlr.app — branded with their logo, colors and policies.',
          },
          {
            t: 'Hard data isolation',
            d: 'Row-level security at the database layer. Cross-tenant queries return zero rows by construction, not by convention.',
          },
          {
            t: 'Per-tenant admin controls',
            d: 'Roles, permissions, retention policies and SSO live inside each tenant. Org admins never see another school\'s settings.',
          },
        ].map((f, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: SKY.radiusCard,
            padding: 24,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: SKY.accent, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 16, marginBottom: 16,
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {i === 0 && <><path d="M3 5h12M3 9h12M3 13h6" /><circle cx="13" cy="13" r="2.5" /></>}
                {i === 1 && <><rect x="3" y="4" width="12" height="11" rx="1.5" /><path d="M3 8h12M8 4v11" /></>}
                {i === 2 && <><circle cx="9" cy="6" r="2.5" /><path d="M3 15c0-3 3-5 6-5s6 2 6 5" /></>}
              </svg>
            </div>
            <h4 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: '#fff', letterSpacing: '-0.015em' }}>{f.t}</h4>
            <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.5, color: 'rgba(255,255,255,0.65)' }}>{f.d}</p>
          </div>
        ))}
      </div>
    </LSection>
  );
}

function TenantDiagram() {
  const tenants = [
    { name: 'Northwind Academy', color: '#3b82f6', sub: 'northwind', students: 612, faculty: 38 },
    { name: 'Harbor Tutorial',   color: '#f97316', sub: 'harbor',    students: 184, faculty: 12 },
    { name: 'Kaveri Institute',  color: '#10b981', sub: 'kaveri',    students: 1042, faculty: 67 },
  ];
  return (
    <div style={{
      position: 'relative',
      padding: '32px 16px 16px',
    }}>
      {/* Three tenant cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, position: 'relative', zIndex: 2 }}>
        {tenants.map((t, i) => (
          <div key={i} style={{
            background: '#fff',
            color: SKY.ink,
            borderRadius: SKY.radiusCard,
            padding: 20,
            boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: t.color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 13,
              }}>{t.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
              <LPill tone="accent">isolated</LPill>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: SKY.ink, letterSpacing: '-0.01em' }}>{t.name}</div>
            <div style={{ fontSize: 11.5, color: SKY.muted, fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>
              {t.sub}.myschedlr.app
            </div>
            <div style={{
              marginTop: 14, paddingTop: 14, borderTop: `1px solid ${SKY.line}`,
              display: 'flex', gap: 16,
            }}>
              <div>
                <div style={{ fontSize: 10, color: SKY.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, fontFamily: 'ui-monospace, monospace' }}>Students</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: SKY.ink, fontVariantNumeric: 'tabular-nums' }}>{t.students.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: SKY.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, fontFamily: 'ui-monospace, monospace' }}>Faculty</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: SKY.ink, fontVariantNumeric: 'tabular-nums' }}>{t.faculty}</div>
              </div>
            </div>
            {/* connector dot at bottom */}
            <div style={{
              position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)',
              width: 12, height: 12, borderRadius: 6,
              background: t.color, border: '2px solid ' + SKY.surfaceDeep,
            }} />
          </div>
        ))}
      </div>

      {/* SVG connector lines + central platform */}
      <svg width="100%" height="180" viewBox="0 0 600 180" style={{ marginTop: -8, display: 'block' }} preserveAspectRatio="none">
        <path d="M100,0 C100,40 300,60 300,100" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" strokeDasharray="3 4" />
        <path d="M300,0 L300,100" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" strokeDasharray="3 4" />
        <path d="M500,0 C500,40 300,60 300,100" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" strokeDasharray="3 4" />
      </svg>

      {/* Central "platform" pill */}
      <div style={{
        margin: '-72px auto 0',
        background: SKY.accent,
        color: '#fff',
        padding: '18px 28px',
        borderRadius: 999,
        display: 'inline-flex',
        alignItems: 'center', gap: 12,
        boxShadow: '0 12px 40px rgba(47,128,237,0.4)',
        position: 'relative', zIndex: 2,
        left: '50%', transform: 'translateX(-50%)',
      }}>
        <Monogram size={28} theme={{ ...SKY, accent: '#fff', accentInk: SKY.accent, radiusCard: 6 }} />
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.015em' }}>myschedlr platform</span>
        <span style={{
          fontSize: 11, fontFamily: 'ui-monospace, monospace',
          background: 'rgba(255,255,255,0.18)', padding: '3px 8px', borderRadius: 6,
          letterSpacing: '0.04em',
        }}>shared infra</span>
      </div>
    </div>
  );
}

Object.assign(window, { RolesSection, MultiTenantSection });

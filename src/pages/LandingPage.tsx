import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import {
  LayoutGrid, Users, Sparkles, Bell, Link, Shield,
  Play, Check, Star, Menu, X, ArrowRight, ChevronRight,
} from 'lucide-react';

// ── Scroll-reveal hook ────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ── 1. NAVBAR ────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = (id: string) => {
    document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  const links = [
    { label: 'Features',      id: 'features' },
    { label: 'How It Works',  id: 'how-it-works' },
    { label: 'Pricing',       id: 'pricing' },
    { label: 'Testimonials',  id: 'testimonials' },
  ];

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl bg-[#080C14]/80 border-b border-white/10 shadow-xl shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <span className="text-white font-bold text-sm font-heading">T</span>
            </div>
            <span className="font-heading font-bold text-lg text-white tracking-tight">Taskify</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="text-white/55 hover:text-white text-sm font-body transition-colors duration-200"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/login"
              className="text-white/60 hover:text-white text-sm font-body px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="shimmer px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium font-body shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all duration-200"
            >
              Get Started Free
            </a>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(o => !o)}
            className="md:hidden text-white/60 hover:text-white transition-colors p-1"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        } bg-[#0D1220]/98 backdrop-blur-xl border-b border-white/10`}
      >
        <div className="px-5 py-5 flex flex-col gap-4">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="text-white/60 hover:text-white text-sm font-body text-left transition-colors"
            >
              {l.label}
            </button>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
            <a href="/login"    className="text-center py-2.5 text-white/60 text-sm font-body">Sign In</a>
            <a href="/register" className="text-center py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium font-body">Get Started Free</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ── 2. HERO ──────────────────────────────────────────────────────────────────
function Hero() {
  const [typed, setTyped] = useState('');

  useEffect(() => {
    const words = ['Faster.', 'Smarter.', 'Together.', 'On Time.'];
    let wi = 0, ci = 0, deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    let alive = true;

    const tick = () => {
      if (!alive) return;
      const w = words[wi];
      if (!deleting) {
        ci++;
        setTyped(w.slice(0, ci));
        if (ci === w.length) { deleting = true; timer = setTimeout(tick, 2200); }
        else timer = setTimeout(tick, 100);
      } else {
        ci--;
        setTyped(w.slice(0, ci));
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
        timer = setTimeout(tick, 55);
      }
    };
    timer = setTimeout(tick, 700);
    return () => { alive = false; clearTimeout(timer); };
  }, []);

  const badges = ['SOC 2 Certified', 'GDPR Ready', '99.9% Uptime', 'SSO Support'];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Blobs */}
      <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] bg-indigo-600 blur-[130px] opacity-[0.18] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] bg-violet-600 blur-[130px] opacity-[0.14] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/3  w-[300px] h-[300px] bg-cyan-500  blur-[110px] opacity-[0.10] rounded-full pointer-events-none" />

      {/* Animated mesh */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.22) 0%, transparent 70%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 9s ease infinite',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium font-body mb-6">
            <Sparkles size={11} />
            AI-Powered Project Management
          </div>

          <h1 className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight mb-5">
            Manage Projects.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Ship {typed}
            </span>
            <span className="text-indigo-400 animate-pulse">|</span>
          </h1>

          <p className="text-white/55 text-lg font-body leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
            Taskify unifies your team's tasks, timelines, and reports in one elegant workspace.
            From sprint planning to stakeholder reviews — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
            <a
              href="/register"
              className="shimmer inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold font-body shadow-xl shadow-indigo-500/35 hover:shadow-indigo-500/55 hover:scale-[1.02] transition-all duration-200"
            >
              Start for Free <ArrowRight size={16} />
            </a>
            <button className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl border border-white/15 text-white/75 hover:text-white hover:border-white/30 hover:bg-white/5 font-body font-medium transition-all duration-200">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                <Play size={9} fill="currentColor" className="ml-0.5" />
              </div>
              Watch Demo
            </button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {badges.map(b => (
              <span key={b} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/45 text-xs font-body">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Dashboard mockup */}
        <div className="hidden md:flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[420px]" style={{ animation: 'float 4s ease-in-out infinite' }}>
            {/* Main card */}
            <div className="backdrop-blur-xl bg-white/[0.06] border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/60">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-white text-sm font-heading font-semibold">Q1 Sprint Overview</div>
                  <div className="text-white/35 text-xs font-body mt-0.5">Updated just now</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-body">On Track</span>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                {[
                  { label: 'Total',     val: '48', color: 'text-cyan-400' },
                  { label: 'Done',      val: '31', color: 'text-emerald-400' },
                  { label: 'Review',    val: '9',  color: 'text-amber-400' },
                ].map(k => (
                  <div key={k.label} className="bg-white/5 rounded-xl p-3 border border-white/[0.06]">
                    <div className={`text-xl font-bold font-heading ${k.color}`}>{k.val}</div>
                    <div className="text-white/35 text-xs font-body mt-0.5">{k.label}</div>
                  </div>
                ))}
              </div>

              {/* Task list */}
              <div className="space-y-2 mb-5">
                {[
                  { task: 'API Authentication Module',  dot: 'bg-emerald-400', done: true },
                  { task: 'Dashboard UI Components',    dot: 'bg-indigo-400',  done: false },
                  { task: 'Payment Integration',        dot: 'bg-amber-400',   done: false },
                  { task: 'Mobile Responsive Design',   dot: 'bg-white/20',    done: false },
                ].map(t => (
                  <div key={t.task} className="flex items-center gap-3 py-1.5 border-b border-white/[0.05] last:border-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.dot}`} />
                    <span className={`text-xs font-body flex-1 ${t.done ? 'text-white/35 line-through' : 'text-white/65'}`}>
                      {t.task}
                    </span>
                  </div>
                ))}
              </div>

              {/* Avatars */}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2.5">
                  {[
                    ['AK', 'from-indigo-500 to-violet-500'],
                    ['SR', 'from-cyan-500 to-blue-500'],
                    ['MJ', 'from-rose-500 to-pink-500'],
                    ['TL', 'from-amber-500 to-orange-500'],
                  ].map(([init, grad]) => (
                    <div
                      key={init}
                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${grad} border-2 border-[#0f1624] flex items-center justify-center text-white text-[10px] font-bold font-heading`}
                    >
                      {init}
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-[#0f1624] flex items-center justify-center text-white/40 text-[10px] font-body">
                    +3
                  </div>
                </div>
                <span className="text-white/35 text-xs font-body">7 active</span>
              </div>
            </div>

            {/* Floating accent */}
            <div className="absolute -top-4 -right-5 bg-[#121929] border border-white/10 rounded-xl p-3 shadow-xl backdrop-blur-xl">
              <div className="text-white/40 text-xs font-body mb-0.5">Velocity</div>
              <div className="text-lg font-bold font-heading text-cyan-400">↑ 24%</div>
            </div>

            {/* Bottom accent */}
            <div className="absolute -bottom-4 -left-5 bg-[#121929] border border-white/10 rounded-xl p-3 shadow-xl backdrop-blur-xl">
              <div className="text-white/40 text-xs font-body mb-0.5">Tasks Today</div>
              <div className="text-base font-bold font-heading text-emerald-400">12 / 14 ✓</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 3. SOCIAL PROOF ──────────────────────────────────────────────────────────
function SocialProof() {
  const logos = [
    'Accenture', 'Shopify', 'Figma', 'Stripe', 'Vercel',
    'Linear', 'GitHub', 'Atlassian', 'Slack', 'Salesforce', 'HubSpot', 'Notion',
  ];
  const doubled = [...logos, ...logos];

  return (
    <section className="py-14 border-y border-white/[0.06] bg-[#0D1220]">
      <p className="text-center text-white/35 text-xs font-body mb-8 tracking-widest uppercase">
        Trusted by 2,000+ teams worldwide
      </p>
      <div className="overflow-hidden">
        <div
          className="flex gap-4 whitespace-nowrap"
          style={{ animation: 'marquee 28s linear infinite' }}
        >
          {doubled.map((logo, i) => (
            <span
              key={i}
              className="inline-flex items-center flex-shrink-0 px-5 py-2 bg-white/[0.04] border border-white/10 rounded-full text-sm text-white/45 font-body hover:text-white/65 transition-colors duration-200 cursor-default"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 4. FEATURES ──────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: LayoutGrid, title: 'Project Management',    desc: 'Kanban boards, Gantt charts, and sprint planning — adapt to any team workflow in seconds.' },
  { icon: Users,      title: 'Team Collaboration',    desc: 'Real-time updates, @mentions, and threaded comments keep your whole team perfectly aligned.' },
  { icon: Sparkles,   title: 'AI-Powered Reports',    desc: 'Auto-generate executive summaries and velocity reports with a single click.' },
  { icon: Bell,       title: 'Smart Notifications',   desc: 'Intelligent alerts surface what matters and suppress what doesn\'t. Zero noise.' },
  { icon: Link,       title: 'HR Integration',         desc: 'Sync with BambooHR, Workday, and more. Roles and access update automatically.' },
  { icon: Shield,     title: 'Role-Based Access',      desc: 'Granular permissions ensure exactly the right people see exactly the right data.' },
];

function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean[]>(FEATURES.map(() => false));

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('[data-card]');
    if (!cards) return;
    const observers: IntersectionObserver[] = [];
    cards.forEach((card, idx) => {
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setTimeout(() => setVisible(p => { const n = [...p]; n[idx] = true; return n; }), idx * 90);
            obs.disconnect();
          }
        },
        { threshold: 0.1 },
      );
      obs.observe(card);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <section id="features" className="py-28 bg-[#080C14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium font-body mb-5">
            <LayoutGrid size={11} /> Features
          </div>
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-white mb-5">
            Everything your team needs
          </h2>
          <p className="text-white/50 text-lg font-body max-w-xl mx-auto leading-relaxed">
            Built for modern engineering and product teams who ship fast and need clarity at every level.
          </p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                data-card
                className={`bg-[#121929] border border-white/[0.07] rounded-2xl p-6 group
                  hover:-translate-y-1.5 hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]
                  transition-all duration-500 ${visible[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/45 group-hover:scale-110 transition-all duration-300">
                  <Icon size={21} className="text-white" />
                </div>
                <h3 className="font-heading font-semibold text-white text-lg mb-2.5">{feat.title}</h3>
                <p className="text-white/50 text-sm font-body leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── 5. HOW IT WORKS ──────────────────────────────────────────────────────────
const STEPS = [
  { num: '01', icon: Users,      title: 'Invite Your Team',    desc: 'Import from HR systems or invite directly. Roles are assigned automatically based on your org structure.' },
  { num: '02', icon: LayoutGrid, title: 'Create Projects',     desc: 'Use templates or start from scratch. Set milestones, assign tasks, and define deadlines in minutes.' },
  { num: '03', icon: Sparkles,   title: 'Ship & Celebrate',    desc: 'AI reports summarize progress for stakeholders. Celebrate wins and retrospect automatically.' },
];

function HowItWorks() {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <section id="how-it-works" className="py-28 bg-[#0D1220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium font-body mb-5">
            <ChevronRight size={11} /> How It Works
          </div>
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-white mb-5">
            Up and running in minutes
          </h2>
          <p className="text-white/50 text-lg font-body max-w-md mx-auto">
            No lengthy onboarding. Three steps and your team is shipping.
          </p>
        </div>

        <div
          ref={ref}
          className={`relative grid grid-cols-1 md:grid-cols-3 gap-10 mt-14 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Dashed connector line */}
          <div
            className="hidden md:block absolute top-8 border-t border-dashed border-indigo-500/25"
            style={{ left: '20%', right: '20%' }}
          />

          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="relative flex flex-col items-center text-center"
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <div className="relative mb-6 z-10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/35">
                    <Icon size={26} className="text-white" />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#0D1220] border border-indigo-500/40 flex items-center justify-center">
                    <span className="text-indigo-400 text-[10px] font-bold font-heading">{s.num}</span>
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-white text-xl mb-3">{s.title}</h3>
                <p className="text-white/50 text-sm font-body leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── 6. DASHBOARD BENTO GRID ──────────────────────────────────────────────────
function DashboardPreview() {
  const { ref, visible } = useScrollReveal(0.05);

  return (
    <section className="py-28 bg-[#080C14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-white mb-5">
            Your command center
          </h2>
          <p className="text-white/50 font-body text-lg max-w-md mx-auto">
            A living dashboard that updates in real-time as your team works.
          </p>
        </div>

        <div
          ref={ref}
          className={`grid gap-4 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
        >
          {/* ── Large: Line chart (col-span-2) */}
          <div className="col-span-3 md:col-span-2 bg-[#121929] border border-white/[0.07] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-semibold text-white text-sm">Velocity Trend</h3>
                <p className="text-white/40 text-xs font-body mt-0.5">Tasks completed per week</p>
              </div>
              <span className="text-cyan-400 text-sm font-body font-semibold bg-cyan-400/10 px-2.5 py-1 rounded-full border border-cyan-400/20">↑ 18%</span>
            </div>
            <svg viewBox="0 0 400 100" className="w-full h-28" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,82 L55,70 L110,74 L165,44 L220,57 L275,30 L330,40 L400,18 L400,100 L0,100 Z" fill="url(#lg2)" />
              <polyline
                points="0,82 55,70 110,74 165,44 220,57 275,30 330,40 400,18"
                fill="none" stroke="url(#lg1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              />
              {([0,55,110,165,220,275,330,400] as number[]).map((x, i) => {
                const ys = [82, 70, 74, 44, 57, 30, 40, 18];
                return <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="#6366f1" />;
              })}
            </svg>
            <div className="flex justify-between mt-1 px-0.5">
              {['Wk 1','Wk 2','Wk 3','Wk 4','Wk 5','Wk 6','Wk 7','Wk 8'].map(w => (
                <span key={w} className="text-white/25 text-[9px] font-body">{w}</span>
              ))}
            </div>
          </div>

          {/* ── Donut (col-span-1) */}
          <div className="col-span-3 md:col-span-1 bg-[#121929] border border-white/[0.07] rounded-2xl p-5 flex flex-col">
            <h3 className="font-heading font-semibold text-white text-sm mb-0.5">Task Status</h3>
            <p className="text-white/40 text-xs font-body mb-5">This Sprint</p>
            <div className="flex items-center gap-5 flex-1">
              <div
                className="w-24 h-24 rounded-full flex-shrink-0"
                style={{
                  background: 'conic-gradient(#6366f1 0% 65%, #8b5cf6 65% 82%, #06b6d4 82% 92%, rgba(255,255,255,0.05) 92% 100%)',
                  WebkitMask: 'radial-gradient(farthest-side, transparent 52%, black 52%)',
                  mask: 'radial-gradient(farthest-side, transparent 52%, black 52%)',
                }}
              />
              <div className="space-y-2 flex-1">
                {[
                  { label: 'Done',        pct: '65%', color: 'bg-indigo-500' },
                  { label: 'In Progress', pct: '17%', color: 'bg-violet-500' },
                  { label: 'Review',      pct: '10%', color: 'bg-cyan-500' },
                  { label: 'Todo',        pct:  '8%', color: 'bg-white/10' },
                ].map(d => (
                  <div key={d.label} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${d.color}`} />
                    <span className="text-white/55 text-xs font-body flex-1">{d.label}</span>
                    <span className="text-white/35 text-xs font-body">{d.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Members (col-span-1) */}
          <div className="col-span-3 md:col-span-1 bg-[#121929] border border-white/[0.07] rounded-2xl p-5">
            <h3 className="font-heading font-semibold text-white text-sm mb-0.5">Active Members</h3>
            <p className="text-white/40 text-xs font-body mb-4">4 online now</p>
            <div className="flex -space-x-3 mb-3">
              {[
                ['AK','from-indigo-500 to-violet-500'],
                ['SR','from-cyan-500 to-blue-500'],
                ['MJ','from-rose-500 to-pink-500'],
                ['TL','from-amber-500 to-orange-500'],
              ].map(([init, grad]) => (
                <div
                  key={init}
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${grad} border-2 border-[#121929] flex items-center justify-center text-white text-xs font-bold font-heading`}
                >
                  {init}
                </div>
              ))}
            </div>
            <span className="text-cyan-400 text-xs font-body">+ 3 more teammates</span>
          </div>

          {/* ── Projects progress (col-span-1) */}
          <div className="col-span-3 md:col-span-1 bg-[#121929] border border-white/[0.07] rounded-2xl p-5">
            <h3 className="font-heading font-semibold text-white text-sm mb-0.5">Active Projects</h3>
            <p className="text-white/40 text-xs font-body mb-5">2 in progress</p>
            <div className="space-y-4">
              {[
                { name: 'Mobile App v2', pct: 72, color: 'from-indigo-500 to-violet-500' },
                { name: 'API Gateway',   pct: 45, color: 'from-violet-500 to-cyan-500' },
              ].map(p => (
                <div key={p.name}>
                  <div className="flex justify-between text-xs font-body mb-2">
                    <span className="text-white/60">{p.name}</span>
                    <span className="text-white/40">{p.pct}%</span>
                  </div>
                  <div className="w-full bg-white/[0.07] rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full bg-gradient-to-r ${p.color}`}
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Activity feed (col-span-3) */}
          <div className="col-span-3 bg-[#121929] border border-white/[0.07] rounded-2xl p-5">
            <h3 className="font-heading font-semibold text-white text-sm mb-4">Recent Activity</h3>
            <div className="space-y-3.5">
              {[
                { av:'AK', grad:'from-indigo-500 to-violet-500', name:'Ahmed K.',    verb:'completed',      item:'User Auth Module',     time:'2m ago',  vc:'text-emerald-400' },
                { av:'SR', grad:'from-cyan-500 to-blue-500',     name:'Sara R.',     verb:'commented on',   item:'Dashboard Redesign',   time:'14m ago', vc:'text-cyan-400'    },
                { av:'MJ', grad:'from-rose-500 to-pink-500',     name:'Mike J.',     verb:'moved to review',item:'Payment Gateway',      time:'1h ago',  vc:'text-amber-400'   },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${row.grad} flex items-center justify-center text-white text-xs font-bold font-heading flex-shrink-0`}>
                    {row.av}
                  </div>
                  <div className="flex-1 min-w-0 text-xs font-body">
                    <span className="text-white/80">{row.name} </span>
                    <span className={row.vc}>{row.verb} </span>
                    <span className="text-white/65 font-medium">{row.item}</span>
                  </div>
                  <span className="text-white/30 text-xs font-body flex-shrink-0">{row.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 7. STATS ─────────────────────────────────────────────────────────────────
interface StatCardProps { value: number; suffix: string; label: string; decimals?: number }

function StatCard({ value, suffix, label, decimals = 0 }: StatCardProps) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useScrollReveal(0.3);

  useEffect(() => {
    if (!visible) return;
    const steps = 60, duration = 2000;
    const inc = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(parseFloat(current.toFixed(decimals)));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, value, decimals]);

  const display = decimals > 0 ? count.toFixed(decimals) : count.toLocaleString();

  return (
    <div
      ref={ref}
      className={`bg-[#121929] border border-white/[0.07] rounded-2xl p-7 text-center transition-all duration-700 hover:border-indigo-500/30 hover:shadow-[0_0_25px_rgba(99,102,241,0.1)] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="text-4xl font-bold font-heading bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2.5">
        {display}{suffix}
      </div>
      <div className="text-white/50 text-sm font-body">{label}</div>
    </div>
  );
}

function Stats() {
  const STATS = [
    { value: 2000,  suffix: '+', label: 'Teams Worldwide',   decimals: 0 },
    { value: 98,    suffix: '%', label: 'Satisfaction Rate', decimals: 0 },
    { value: 50000, suffix: '+', label: 'Tasks Completed',   decimals: 0 },
    { value: 4.9,   suffix: '★', label: 'Average Rating',    decimals: 1 },
  ];

  return (
    <section className="py-24 bg-[#0D1220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-white mb-4">Trusted at scale</h2>
          <p className="text-white/50 font-body text-lg">Numbers that speak for themselves.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  );
}

// ── 8. PRICING ───────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Starter', price: '$0', period: 'Free forever',
    desc: 'Perfect for small teams just getting started.',
    features: ['5 projects', 'Up to 10 members', 'Basic Kanban board', '1 GB storage', 'Email support'],
    cta: 'Get Started Free', href: '/register', popular: false,
  },
  {
    name: 'Pro', price: '$14', period: 'per user / month',
    desc: 'Ideal for growing product and engineering teams.',
    features: ['Unlimited projects', 'Unlimited members', 'AI reports & insights', '50 GB storage', 'HR integrations', 'Priority support', 'Custom roles'],
    cta: 'Start Pro Trial', href: '/register?plan=pro', popular: true,
  },
  {
    name: 'Enterprise', price: 'Custom', period: 'Annual billing',
    desc: 'For large orgs with advanced compliance needs.',
    features: ['Everything in Pro', 'SSO & SAML', 'Dedicated success manager', 'SLA guarantee', 'Custom integrations', 'Audit logs', 'On-premise option'],
    cta: 'Contact Sales', href: '/contact', popular: false,
  },
];

function Pricing() {
  const { ref, visible } = useScrollReveal(0.05);

  return (
    <section id="pricing" className="py-28 bg-[#080C14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium font-body mb-5">
            <Star size={11} /> Pricing
          </div>
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-white mb-5">
            Simple, transparent pricing
          </h2>
          <p className="text-white/50 text-lg font-body max-w-md mx-auto">
            Start free, scale when you're ready. No surprises, ever.
          </p>
        </div>

        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 items-center mt-14 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {PLANS.map((plan, idx) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-7 transition-all duration-300 ${
                plan.popular
                  ? 'bg-[#121929] border-2 border-indigo-500 scale-[1.04] shadow-[0_0_50px_rgba(99,102,241,0.22)]'
                  : 'bg-[#121929] border border-white/[0.07] hover:border-white/15 hover:-translate-y-1'
              }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-semibold font-body shadow-lg shadow-indigo-500/40 whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-heading font-bold text-white text-xl mb-1.5">{plan.name}</h3>
                <p className="text-white/40 text-sm font-body">{plan.desc}</p>
              </div>

              <div className="mb-7">
                <div className="font-heading font-bold text-5xl text-white">{plan.price}</div>
                <div className="text-white/40 text-sm font-body mt-1">{plan.period}</div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm font-body">
                    <Check size={14} className="text-emerald-400 flex-shrink-0" />
                    <span className="text-white/65">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={`block w-full text-center py-3 rounded-xl font-semibold font-body transition-all duration-200 ${
                  plan.popular
                    ? 'shimmer bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02]'
                    : 'border border-white/15 text-white/65 hover:text-white hover:border-white/30 hover:bg-white/5'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 9. TESTIMONIALS ──────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: 'Taskify replaced three tools we were using. Our sprint velocity went up 30% in the first month alone.',
    name: 'Sarah Chen', role: 'VP of Engineering, NovaTech',
    initials: 'SC', grad: 'from-indigo-500 to-violet-500',
  },
  {
    quote: 'The AI reports are a game-changer. I used to spend 3 hours every week on stakeholder updates — now it\'s one click.',
    name: 'James Okafor', role: 'Product Manager, Launchpad',
    initials: 'JO', grad: 'from-cyan-500 to-blue-500',
  },
  {
    quote: 'We onboarded 50 people in under an hour. The HR sync is seamless. Best investment we\'ve made this year.',
    name: 'Priya Mehta', role: 'CTO, ScaleStack',
    initials: 'PM', grad: 'from-rose-500 to-pink-500',
  },
];

function Testimonials() {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <section id="testimonials" className="py-28 bg-[#0D1220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-18">
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-white mb-5">
            Loved by teams everywhere
          </h2>
          <p className="text-white/50 text-lg font-body">Real words from real customers.</p>
        </div>

        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={t.name}
              className="bg-[#121929] border border-white/[0.07] rounded-2xl p-6 hover:border-white/15 hover:-translate-y-1 transition-all duration-300"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <blockquote className="text-white/65 text-sm font-body leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.grad} flex items-center justify-center text-white text-sm font-bold font-heading flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold font-heading">{t.name}</div>
                  <div className="text-white/40 text-xs font-body mt-0.5">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 10. CTA BANNER ───────────────────────────────────────────────────────────
function CTABanner() {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <section className="py-28 bg-[#080C14] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600 blur-[130px] opacity-[0.18] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-600 blur-[130px] opacity-[0.18] rounded-full pointer-events-none" />

      <div
        ref={ref}
        className={`relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <h2 className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-tight">
          Ready to ship{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            10x faster?
          </span>
        </h2>
        <p className="text-white/55 text-xl font-body mb-10 max-w-2xl mx-auto leading-relaxed">
          Join 2,000+ teams already using Taskify. Start free today — no credit card required.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/register"
            className="shimmer inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-lg font-semibold font-body hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)] transition-all duration-200"
            style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}
          >
            Start for Free <ArrowRight size={20} />
          </a>
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/15 text-white/70 hover:text-white hover:border-white/30 hover:bg-white/5 text-lg font-body font-medium transition-all duration-200"
          >
            Sign In
          </a>
        </div>
      </div>
    </section>
  );
}

// ── 11. FOOTER ───────────────────────────────────────────────────────────────
function Footer() {
  const COLS = [
    { title: 'Product',   links: ['Features', 'Pricing', 'Changelog', 'Roadmap', 'Security'] },
    { title: 'Company',   links: ['About', 'Blog', 'Careers', 'Press', 'Contact'] },
    { title: 'Resources', links: ['Documentation', 'API Reference', 'Integrations', 'Status', 'Community'] },
    { title: 'Legal',     links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'] },
  ];

  return (
    <footer className="bg-[#080C14] border-t border-white/[0.07] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-white font-bold text-sm font-heading">T</span>
              </div>
              <span className="font-heading font-bold text-white">Taskify</span>
            </div>
            <p className="text-white/40 text-sm font-body leading-relaxed mb-5 max-w-xs">
              Modern project management for high-velocity teams who ship without chaos.
            </p>
            <div className="flex gap-2.5">
              {[
                { icon: 'ri:twitter-x-fill',  href: 'https://x.com',          label: 'X / Twitter' },
                { icon: 'ri:linkedin-fill',    href: 'https://linkedin.com',   label: 'LinkedIn'    },
                { icon: 'ri:github-fill',      href: 'https://github.com',     label: 'GitHub'      },
              ].map(({ icon, href, label }) => (
                <a
                  key={icon}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <Icon icon={icon} width={15} height={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          {COLS.map(col => (
            <div key={col.title}>
              <h4 className="font-heading font-semibold text-white text-sm mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-white/40 text-sm font-body hover:text-white transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.07] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm font-body">© 2026 Taskify, Inc. All rights reserved.</p>
          <p className="text-white/20 text-xs font-body">Built with ♥ for teams who ship</p>
        </div>
      </div>
    </footer>
  );
}

// ── MAIN EXPORT ──────────────────────────────────────────────────────────────
export function LandingPage() {
  return (
    <div className="bg-[#080C14] min-h-screen text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <Stats />
      <Pricing />
      <Testimonials />
      <CTABanner />
      <Footer />
    </div>
  );
}

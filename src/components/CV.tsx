import { motion, useInView, useMotionValue, useSpring, useTransform, useScroll } from "motion/react";
import { useEffect, useRef } from "react";
import {
  Bot, Linkedin, Github, Mail, Phone, MessageCircle, MapPin,
  Code2, Cpu, Database, GitBranch, Cloud, Network, FlaskConical,
  Smartphone, Server, Brain, LineChart, MessagesSquare, Lightbulb,
  Sparkles, Zap, Trophy, Target, ArrowUpRight, Cloud as CloudIcon,
} from "lucide-react";

/* ---------- helpers ---------- */
function Counter({ to, suffix = "", duration = 1.8 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 });
  useEffect(() => {
    if (inView) mv.set(to);
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix;
    });
  }, [inView, to, suffix, mv, spring]);
  return <span ref={ref}>0{suffix}</span>;
}

function Gauge({ value, label, color = "var(--cyan)" }: { value: number; label: string; color?: string }) {
  const ref = useRef<SVGCircleElement>(null);
  const inView = useInView(ref, { once: true });
  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={r} stroke="oklch(1 0 0 / 0.08)" strokeWidth="10" fill="none" />
          <motion.circle
            ref={ref}
            cx="70" cy="70" r={r}
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={inView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-bold text-foreground">
            <Counter to={value} suffix="%" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">coverage</span>
        </div>
      </div>
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
    </div>
  );
}

function MiniRing({ value, size = 36, delay = 0 }: { value: number; size?: number; delay?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg className="flex-shrink-0 -rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="oklch(1 0 0 / 0.08)" strokeWidth="3" fill="none" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" fill="none"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: offset }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ filter: "drop-shadow(0 0 4px oklch(0.78 0.18 195 / 0.5))" }}
      />
    </svg>
  );
}

/* ---------- data ---------- */
const stats = [
  { value: 500, suffix: "+", label: "Regression tests automated", icon: FlaskConical },
  { value: 70, suffix: "%", label: "Manual effort reduced", icon: Zap },
  { value: 6, suffix: " yrs", label: "Engineering experience", icon: Trophy },
  { value: 35, suffix: "%", label: "Defect detection lift", icon: Target },
];

const skills = [
  { name: "Java", level: 95, icon: Code2 },
  { name: "Python", level: 88, icon: Code2 },
  { name: "Appium & XCUITest", level: 95, icon: Smartphone },
  { name: "Selenium & WebDriver", level: 92, icon: Code2 },
  { name: "REST Assured & API Testing", level: 93, icon: Network },
  { name: "TestNG & JUnit", level: 90, icon: FlaskConical },
  { name: "Jenkins CI/CD", level: 88, icon: Server },
  { name: "SQL & MongoDB", level: 85, icon: Database },
  { name: "Git & GitHub", level: 94, icon: GitBranch },
  { name: "Cloud Device Labs", level: 86, icon: Cloud },
  { name: "Salesforce Platform", level: 82, icon: CloudIcon },
  { name: "Docker & Kubernetes", level: 75, icon: Cpu },
];

const aiSkills = [
  { name: "Machine Learning & AI", icon: Brain, desc: "Predictive flakiness models" },
  { name: "AI Test Analytics", icon: LineChart, desc: "Regression prioritization" },
  { name: "ChatGPT / OpenAI API", icon: MessagesSquare, desc: "Generative test design" },
  { name: "Prompt Engineering", icon: Lightbulb, desc: "LLM-powered tooling" },
];

const experience = [
  {
    role: "Member of Technical Staff",
    company: "Salesforce",
    location: "Bengaluru, India",
    period: "Sep 2024 — Present",
    color: "var(--cyan)",
    bullets: [
      "Designed scalable mobile automation frameworks using Appium and XCUITest, boosting test coverage and reliability.",
      "Implemented CI/CD-integrated suites for continuous regression across multiple releases.",
      "Reduced manual regression effort by 70% via expanded automation coverage and optimized test design.",
      "Developed reusable SDKs and components adopted by multiple teams.",
      "Led end-to-end release validation and managed cloud device testing (Sauce Labs).",
      "Leveraged ML models to prioritize regression tests and analyze flakiness, improving defect detection efficiency by 35%.",
    ],
  },
  {
    role: "Senior SDET",
    company: "Info Edge (Naukri.com)",
    location: "Noida, India",
    period: "Jun 2022 — Sep 2024",
    color: "var(--magenta)",
    bullets: [
      "Built cross-platform automation frameworks for mobile, web and API using Selenium, Appium and REST Assured.",
      "Integrated suites into Jenkins pipelines for continuous execution and reporting.",
      "Executed 500+ regression scenarios for high-traffic recruitment platforms.",
      "Collaborated with development teams for defect triaging and mentored junior engineers.",
      "Implemented AI-assisted self-healing scripts and dynamic test data generation to cut maintenance overhead.",
    ],
  },
  {
    role: "Automation Engineer",
    company: "Nagarro",
    location: "Gurugram, India",
    period: "Oct 2020 — May 2022",
    color: "var(--amber)",
    bullets: [
      "Automated REST and WCF API testing for enterprise banking applications, reducing test cycle time by 50%.",
      "Developed SQL/PLSQL frameworks for data integrity and migration testing.",
      "Supported SOAP→REST migration through automated verification suites.",
    ],
  },
];

const contacts = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/kanishka-mogha-014729172/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/cazmick", label: "GitHub" },
  { icon: Mail, href: "mailto:kanishkamogha20@gmail.com", label: "Email" },
  { icon: MessageCircle, href: "https://wa.me/919690226995", label: "WhatsApp" },
  { icon: Phone, href: "tel:+919690226995", label: "Call" },
];

/* ---------- main ---------- */
export default function CV() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* scroll progress bar */}
      <motion.div
        className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left"
        style={{ background: "var(--gradient-hero)", scaleX: scrollYProgress }}
      />

      {/* ambient grid */}
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none fixed left-1/2 top-0 -z-10 h-[600px] w-[1200px] -translate-x-1/2 rounded-full blur-3xl"
           style={{ background: "radial-gradient(circle, oklch(0.78 0.18 195 / 0.18), transparent 60%)" }} />

      {/* floating orbs */}
      <div className="pointer-events-none fixed -left-32 top-1/3 h-72 w-72 rounded-full blur-3xl animate-float"
           style={{ background: "oklch(0.7 0.22 320 / 0.25)" }} />
      <div className="pointer-events-none fixed -right-32 top-2/3 h-80 w-80 rounded-full blur-3xl animate-float"
           style={{ background: "oklch(0.78 0.18 195 / 0.2)", animationDelay: "2s" }} />

      <div className="relative mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
        {/* Top contact bar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mb-10 flex items-center justify-between gap-4"
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span className="relative grid h-2 w-2 place-items-center">
                <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
                <span className="relative h-2 w-2 rounded-full bg-primary" />
              </span>
              available for opportunities
            </div>
            <div className="mt-1 flex items-center gap-1.5 pl-4 text-[10px] uppercase tracking-[0.2em] text-accent/80">
              <MapPin className="h-3 w-3" /> Open for relocation
            </div>
          </div>
          <div className="flex items-center gap-2">
            {contacts.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                whileHover={{ y: -3, scale: 1.08 }} whileTap={{ scale: 0.95 }}
                className="glass grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </motion.nav>

        {/* HERO */}
        <section ref={heroRef} className="relative mb-16">
          <div className="glass relative overflow-hidden rounded-3xl p-8 md:p-12" style={{ boxShadow: "var(--shadow-elevated)" }}>
            {/* decorative orbits */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 opacity-30 animate-spin-slow">
              <div className="absolute inset-0 rounded-full border border-primary/30" />
              <div className="absolute inset-8 rounded-full border border-secondary/30" />
              <div className="absolute inset-16 rounded-full border border-accent/30" />
            </div>

            <div className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
              {/* Avatar / gauge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative">
                  <div className="absolute -inset-2 rounded-3xl opacity-70 blur-2xl" style={{ background: "var(--gradient-cyan-magenta)" }} />
                  <div className="relative grid h-40 w-40 place-items-center rounded-3xl"
                       style={{ background: "var(--gradient-surface)", boxShadow: "var(--shadow-glow-cyan)" }}>
                    <Bot className="h-20 w-20 text-primary" strokeWidth={1.4} />
                    <span className="absolute -right-2 -top-2 grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-foreground shadow-lg">
                      <Sparkles className="h-4 w-4" />
                    </span>
                  </div>
                </div>
                <Gauge value={95} label="Test Coverage" />
              </motion.div>

              {/* Info */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
                  className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> SDET · Mobile · API · AI in QE
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
                  className="font-display text-5xl font-bold leading-[1.05] md:text-6xl"
                >
                  Kanishka <span className="text-gradient">Mogha</span>
                </motion.h1>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
                  className="mt-3 text-lg font-medium text-muted-foreground md:text-xl"
                >
                  Senior SDET — Mobile & API Automation Specialist
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.8 }}
                  className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground"
                >
                  Experienced software development engineer in test specializing in building robust
                  automation frameworks for mobile, API, web and backend systems. Passionate about
                  continuous integration, test architecture and driving quality across every stage of the
                  SDLC — with a sharp focus on bringing AI into the testing pipeline, from predictive
                  analytics to generative test case design.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                  className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
                >
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> Bengaluru, India</span>
                  <a href="mailto:kanishkamogha20@gmail.com" className="inline-flex items-center gap-1.5 text-foreground hover:text-primary">
                    <Mail className="h-4 w-4" /> kanishkamogha20@gmail.com
                  </a>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="glass group relative overflow-hidden rounded-2xl p-5"
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
                     style={{ background: "var(--gradient-cyan-magenta)" }} />
                <s.icon className="mb-3 h-5 w-5 text-primary" />
                <div className="font-display text-3xl font-bold text-foreground">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <Section title="Core Stack" eyebrow="01 — Tools & Frameworks">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {skills.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="glass relative flex items-center gap-3 overflow-hidden rounded-xl p-3"
              >
                <MiniRing value={s.level} size={36} delay={i * 0.03} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium leading-tight">{s.name}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{s.level}%</div>
                </div>
                <div className="absolute bottom-0 left-0 h-[2px] rounded-full bg-primary/60" style={{ width: `${s.level}%` }} />
              </motion.div>
            ))}
          </div>
        </Section>

        {/* AI SECTION */}
        <Section title="AI in Quality Engineering" eyebrow="02 — Emerging Practice">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {aiSkills.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="glass group relative overflow-hidden rounded-2xl p-6"
              >
                <div className="absolute inset-x-0 -top-1 h-[2px] opacity-60" style={{ background: "var(--gradient-hero)" }} />
                <s.icon className="mb-4 h-7 w-7 text-accent transition-transform group-hover:scale-110" />
                <div className="font-display text-lg font-semibold">{s.name}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.desc}</div>
                <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </Section>

        {/* EXPERIENCE */}
        <Section title="Professional Experience" eyebrow="03 — Career Timeline">
          <div className="relative">
            {/* Animated line */}
            <motion.div
              className="absolute left-[15px] top-2 w-px origin-top md:left-[19px]"
              style={{ height: progress, background: "var(--gradient-hero)" }}
            />
            <div className="absolute left-[15px] top-2 h-full w-px bg-border md:left-[19px]" />

            <div className="space-y-8">
              {experience.map((job, i) => (
                <motion.article
                  key={job.company}
                  initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="relative pl-12 md:pl-16"
                >
                  {/* dot */}
                  <span className="absolute left-0 top-2 grid h-8 w-8 place-items-center rounded-full md:left-1 md:h-9 md:w-9"
                        style={{ background: "var(--surface-2)", border: `2px solid ${job.color}`, boxShadow: `0 0 20px ${job.color}` }}>
                    <span className="h-2 w-2 rounded-full" style={{ background: job.color }} />
                  </span>

                  <div className="glass rounded-2xl p-6 transition-transform hover:-translate-y-1 md:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-foreground">{job.role}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                          <span className="font-medium" style={{ color: job.color }}>{job.company}</span>
                          <span className="text-muted-foreground">· {job.location}</span>
                        </div>
                      </div>
                      <span className="rounded-full border border-border bg-surface-2/60 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        {job.period}
                      </span>
                    </div>
                    <ul className="mt-5 space-y-2.5">
                      {job.bullets.map((b, bi) => (
                        <motion.li
                          key={bi}
                          initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                          transition={{ delay: 0.1 + bi * 0.04 }}
                          className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                        >
                          <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full" style={{ background: job.color }} />
                          <span>{b}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </Section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mt-20 overflow-hidden rounded-3xl p-10 text-center md:p-14"
          style={{ background: "var(--gradient-surface)", boxShadow: "var(--shadow-elevated)" }}
        >
          <div className="absolute inset-0 opacity-30 grid-bg" />
          <div className="absolute -inset-1 opacity-40 blur-3xl" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative">
            <h3 className="font-display text-3xl font-bold md:text-4xl">
              Let's build <span className="text-gradient">unbreakable</span> software together.
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Open to senior SDET, QE architect and AI-in-test roles. Always up for a conversation about test strategy and automation at scale.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href="mailto:kanishkamogha20@gmail.com"
                 className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-primary-foreground transition-transform hover:scale-105"
                 style={{ background: "var(--gradient-cyan-magenta)", boxShadow: "var(--shadow-glow-cyan)" }}>
                <Mail className="h-4 w-4" /> Get in touch
              </a>
              <a href="https://www.linkedin.com/in/kanishka-mogha-014729172/" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-6 py-3 font-medium hover:border-primary hover:text-primary">
                <Linkedin className="h-4 w-4" /> Connect on LinkedIn
              </a>
            </div>
          </div>
        </motion.section>

        <footer className="mt-12 text-center font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          © {new Date().getFullYear()} Kanishka Mogha · Crafted with care
        </footer>
      </div>
    </div>
  );
}

function Section({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <section className="mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex items-end justify-between gap-4"
      >
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">{eyebrow}</div>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">{title}</h2>
        </div>
        <div className="hidden h-px flex-1 md:block" style={{ background: "linear-gradient(90deg, var(--border), transparent)" }} />
      </motion.div>
      {children}
    </section>
  );
}

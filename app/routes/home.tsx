import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import EmbeddingVisualizer3D from "~/components/EmbeddingVisualizer3D";
import LossCurveTimeline from "~/components/LossCurveTimeline";
import "../styles/index.css";

export function meta() {
  return [
    { title: "Mathura Santhalingam | M2 AI student, XAI research" },
    {
      name: "description",
      content:
        "M2 AI student at Université Sorbonne Paris Nord and research intern at LIPN, working on the verification and explainability of LLMs.",
    },
  ];
}

// ============ SMALL HELPERS ============
// Apparition au scroll : chaque bloc s'anime seul (pas de propagation parent/enfant)
function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <h2 className="section-title">{title}</h2>
      {subtitle && (
        <p className="section-subtitle" style={{ marginBottom: 0 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ============ MAIN PAGE ============
export default function Index() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <NavBar />
        <WhoAmI />
        <Skills />

        <div id="repos" className="wrap">
          <EmbeddingVisualizer3D />
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <a
              href="https://github.com/mathura-snth"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              See all repositories on GitHub
            </a>
          </div>
        </div>

        <ResearchFocus />

        <div id="journey" className="wrap">
          <LossCurveTimeline />
        </div>

        <FeaturedProjects />
        <Footer />
      </div>
    </MotionConfig>
  );
}

// ============ NAVIGATION BAR ============
function NavBar() {
  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="nav-content">
        <motion.h1
          className="logo"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <a href="/">mathu.</a>
        </motion.h1>
        <ul className="nav-links">
          {["Research", "Projects"].map((item) => (
            <motion.li
              key={item}
              whileHover={{ color: "#4f7a64" }}
              transition={{ duration: 0.2 }}
            >
              <a href={`/#${item.toLowerCase()}`}>{item}</a>
            </motion.li>
          ))}
          <motion.li
            whileHover={{ color: "#4f7a64" }}
            transition={{ duration: 0.2 }}
          >
            <a href="/notes">Notes</a>
          </motion.li>
          <motion.li
            whileHover={{ color: "#4f7a64" }}
            transition={{ duration: 0.2 }}
          >
            <a 
              href="mailto:mathura.santhalingam@gmail.com" 
              className="btn btn-secondary"
              style={{ padding: "0rem 0.9rem", fontSize: "0.9rem", margin: 0 }}
            >
              Get in Touch
            </a>
          </motion.li>
        </ul>
      </div>
    </motion.nav>
  );
}

// ============ WHO I AM SECTION ============
const WHO_STATS = [
  {
    value: "1st",
    label: "Class rank",
    detail:
      "Top of my Master 1 class, with a double degree in Math & CS behind it.",
  },
  {
    value: "20+",
    label: "Projects",
    detail:
      "Beyond coursework, I keep building: RAG, agentic AI, route optimization, distributed systems.",
  },
  {
    value: "March 2027", 
    label: "Available",
    detail:
      "Actively looking for an M2 internship leadind to a CDI in Data / AI starting early March 2027.",
  },
];

// Entrée en CSS pur (keyframes slideInUp définies dans index.css)
const enter = (delay: number): React.CSSProperties => ({
  animation: "slideInUp 0.7s ease-out both",
  animationDelay: `${delay}s`,
});

function WhoAmI() {
  const [openStat, setOpenStat] = useState<number | null>(null);
  const last = WHO_STATS.length - 1;

  return (
    <section
      className="hero-section"
      style={{ minHeight: "auto", padding: "5rem 2rem" }}
    >
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="hero-content">
          <h2
            className="hero-title"
            style={{
              ...enter(0),
              textTransform: "uppercase",
              fontSize: "clamp(3rem, 9vw, 5.5rem)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            Who <span className="accent">I am</span>
          </h2>

          <p className="hero-subtitle" style={enter(0.1)}>
            M2 AI Student @ Université Sorbonne Paris Nord • Previously Research Intern @ LIPN • Seeking an M2 Internship • From data pipelines to AI-driven solutions
          </p>

          <p className="hero-description" style={enter(0.2)}>
            With a dual background in Mathematics and Computer Science,
            I specialize in building end-to-end data solutions.
            From engineering robust data pipelines and distributed systems
            to training predictive machine learning models,
            I am passionate about turning complex data into actionable insights.
          </p>

          <div
            className="stats"
            style={{
              ...enter(0.3),
              position: "relative",
              zIndex: 5,
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "clamp(0.5rem, 2vw, 1.5rem)",
            }}
          >
            {WHO_STATS.map((stat, i) => {
              const open = openStat === i;
              const middle = i > 0 && i < last;
              const side = i === 0 ? { left: 0 } : i === last ? { right: 0 } : { left: "50%" };

              return (
                <div
                  key={stat.label}
                  className="stat"
                  tabIndex={0}
                  aria-describedby={`stat-tip-${i}`}
                  onMouseEnter={() => setOpenStat(i)}
                  onMouseLeave={() => setOpenStat(null)}
                  onFocus={() => setOpenStat(i)}
                  onBlur={() => setOpenStat(null)}
                  style={{
                    position: "relative",
                    padding: "1.25rem 0.75rem",
                    cursor: "default",
                    transform: open ? "translateY(-3px)" : "none",
                    borderColor: open ? "var(--accent)" : undefined,
                    boxShadow: open
                      ? "0 8px 24px rgba(62, 90, 78, 0.15)"
                      : undefined,
                    transition:
                      "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
                  }}
                >
                  <div
                    className="stat-value"
                    style={{ fontSize: "clamp(1.4rem, 5vw, 2rem)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="stat-label">{stat.label}</div>

                  {/* Flèche */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "50%",
                      marginLeft: "-6px",
                      bottom: open ? "calc(100% + 6px)" : "calc(100% + 2px)",
                      width: "12px",
                      height: "12px",
                      background: "var(--accent-dark)",
                      transform: "rotate(45deg)",
                      opacity: open ? 1 : 0,
                      pointerEvents: "none",
                      transition: "opacity 0.2s, bottom 0.2s",
                    }}
                  />

                  {/* Infos au survol */}
                  <div
                    id={`stat-tip-${i}`}
                    role="tooltip"
                    style={{
                      position: "absolute",
                      ...side,
                      bottom: "calc(100% + 12px)",
                      width: "260px",
                      maxWidth: "calc(100vw - 4rem)",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.6rem",
                      background: "var(--accent-dark)",
                      color: "#fff",
                      fontSize: "0.85rem",
                      lineHeight: 1.5,
                      textAlign: "left",
                      boxShadow: "0 8px 24px rgba(62, 90, 78, 0.25)",
                      opacity: open ? 1 : 0,
                      visibility: open ? "visible" : "hidden",
                      pointerEvents: "none",
                      transform: `${middle ? "translateX(-50%) " : ""}translateY(${open ? 0 : 6}px)`,
                      transition: "opacity 0.2s, transform 0.2s, visibility 0.2s",
                    }}
                  >
                    {stat.detail}
                  </div>
                </div>
              );
            })}
          </div>
          <p
            style={{
              ...enter(0.5),
              marginTop: "1.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.7rem",
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
            }}
          >
            <span className="status-dot" aria-hidden="true" />
            Actively looking for an M2 internship starting early March 2027
          </p>
        </div>
      </div>
    </section>
  );
}

// ============ SKILLS & EXPERTISE ============
const SKILL_CATEGORIES = [
  {
    category: "Machine Learning",
    skills: ["PyTorch", "JAX", "Scikit-learn", "XGBoost", "Transformers"],
  },
  {
    category: "AI & XAI",
    skills: [
      "LLMs",
      "SHAP",
      "Attention Analysis",
      "Formal Verification",
      "Counterfactual Reasoning",
    ],
  },
  {
    category: "LLM Systems & Backend",
    skills: [
      "LangChain",
      "LangGraph",
      "RAG Systems",
      "Vector DBs",
      "FastAPI",
      "Flask",
      "PostgreSQL",
      "Docker",
    ],
  },
  {
    category: "Languages",
    skills: ["Python", "Java", "SQL", "TypeScript", "JavaScript"],
  },
];

function Skills() {
  return (
    <section id="skills" className="section">
      <div className="section-inner">
        <Reveal>
          <SectionHeading title="Skills & Expertise" />
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {SKILL_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.category} delay={i * 0.08} style={{ display: "flex" }}>
              <div className="surface-card" style={{ flex: 1 }}>
                <h3
                  style={{
                    color: "var(--accent-dark)",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                  }}
                >
                  {cat.category}
                </h3>
                <div className="tech-stack" style={{ marginBottom: 0 }}>
                  {cat.skills.map((skill) => (
                    <span key={skill} className="tag" style={{ fontSize: "0.82rem" }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ RESEARCH FOCUS ============
const INTERESTS = [
  {
    title: "Explainable AI (XAI)",
    text: "Making model decisions transparent and verifiable.",
  },
  {
    title: "Formal Methods",
    text: "Rigorous verification of AI system properties.",
  },
  {
    title: "Hallucination Detection",
    text: "Identifying when LLMs fabricate information.",
  },
  {
    title: "Trustworthy AI",
    text: "Building systems that are safe, interpretable and reliable.",
  },
];

function ResearchFocus() {
  return (
    <section id="research" className="section section-tint">
      <div className="section-inner" style={{ maxWidth: "860px" }}>
        <Reveal>
          <SectionHeading title="Research Focus" />
        </Reveal>

        <Reveal>
          <div
            className="surface-card"
            style={{
              borderLeft: "4px solid var(--accent-text)",
              padding: "2rem",
              marginBottom: "3rem",
            }}
          >
            <h3
              style={{
                color: "var(--text-primary)",
                fontSize: "1.35rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              CoVe: Counterfactual Verification
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                marginBottom: "1.25rem",
              }}
            >
              A framework for detecting hallucinated explanations in Large
              Language Models at scale. By leveraging counterfactual reasoning
              and formal verification techniques, CoVe identifies when an LLM
              gives an explanation that doesn't reflect how it actually
              decided.
            </p>
            <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.7rem",
                color: "var(--accent-dark)",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              <span className="status-dot" aria-hidden="true" />
              Conducted at LIPN (June - August 2026)
            </p>
          </div>
        </Reveal>

        <Reveal>
          <h3
            style={{
              color: "var(--accent-dark)",
              fontSize: "1.2rem",
              fontWeight: 700,
              marginBottom: "1.25rem",
            }}
          >
            Core research interests
          </h3>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem 2rem",
          }}
        >
          {INTERESTS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div
                style={{
                  borderLeft: "2px solid var(--accent)",
                  paddingLeft: "1rem",
                }}
              >
                <h4
                  style={{
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    marginBottom: "0.25rem",
                  }}
                >
                  {item.title}
                </h4>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ FEATURED PROJECTS ============
interface Project {
  title: string;
  category: string;
  description: string;
  tech: string[];
  href?: string;
}

const projects: Project[] = [
  {
    title: "CoVe - LLM Explanation Verification",
    category: "LLM Research",
    description:
      "Framework for verifying LLM explanations and detecting hallucinations at scale.",
    tech: ["PyTorch", "XAI", "LLMs"],
    href: "https://github.com/mathura-snth/XAI-LLM-CoVe_Verification",
  },
  {
    title: "DentaRAG",
    category: "LLM Applications",
    description:
      "Retrieval-Augmented Generation system for medical documentation, built with hybrid search.",
    tech: ["LangChain", "FastAPI", "PostgreSQL"],
    href: "https://github.com/mathura-snth/RAG_from_scratch",
  },
  {
    title: "Routes Optimization",
    category: "Algorithms & Systems",
    description:
      "Route planning engine on real OpenStreetMap data, from Dijkstra to Contraction Hierarchies.",
    tech: ["Dijkstra", "A*", "Contraction Hierarchies"],
    href: "https://github.com/mathura-snth/Advanced-Route-Optimization",
  },
];

function FeaturedProjects() {
  return (
    <section id="projects" className="projects-section">
      <div className="section-inner">
        <Reveal>
          <SectionHeading
            title="Featured Projects"
            subtitle="A selection of what I've built, from research code to full systems."
          />
        </Reveal>

        <div className="projects-grid">
          {projects.map((project, i) => {
            const Card: React.ElementType = project.href ? "a" : "div";
            const linkProps = project.href
              ? { href: project.href, target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
              <Reveal key={project.title} delay={i * 0.08} style={{ display: "flex" }}>
                <Card
                  className="project-card"
                  style={{ flex: 1, cursor: project.href ? "pointer" : "default" }}
                  {...linkProps}
                >
                  <span className="badge">{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tech-stack">
                    {project.tech.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                  {project.href && (
                    <span className="github-link">View on GitHub →</span>
                  )}
                </Card>
              </Reveal>
            );
          })}
        </div>

        <Reveal style={{ marginTop: "2.5rem" }}>
          <a
            href="/notes"
            className="surface-card"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem 2rem",
              textDecoration: "none",
            }}
          >
            <div style={{ maxWidth: "36rem" }}>
              <h3
                style={{
                  color: "var(--text-primary)",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  marginBottom: "0.4rem",
                }}
              >
                Study notes
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                My Master's course notes as PDFs: data structures, distributed
                systems, computability, compilation, NLP and more.
              </p>
            </div>
            <span className="github-link" style={{ marginTop: 0 }}>
              Browse the notes →
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// ============ FOOTER ============
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Mathu</h3>
            <p>M2 AI Student • XAI Researcher • Building trustworthy AI systems</p>
          </div>

          <div className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li>
                <a
                  href="https://github.com/mathura-snth"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/mathura-santhalingam/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p>
              <a href="mailto:mathura.santhalingam@gmail.com">mathura.santhalingam@gmail.com</a>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; 2026 Mathura. Built with React Router, Framer Motion &amp;
            Three.js.
          </p>
        </div>
      </div>
    </footer>
  );
}
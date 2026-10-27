import { useState } from "react";
import "../styles/index.css";

type CategoryId = "math" | "theory" | "systems" | "ai";

interface Note {
  id: string;
  title: string;
  category: CategoryId;
  path: string;
}

const CATEGORIES: { id: CategoryId; label: string; blurb: string }[] = [
  {
    id: "ai",
    label: "AI & NLP",
    blurb: "Natural language processing and retrieval-augmented generation.",
  },
  {
    id: "math",
    label: "Mathematics",
    blurb: "Linear algebra and mathematical analysis.",
  },
  {
    id: "theory",
    label: "Theory & Algorithms",
    blurb: "Data structures, computability, complexity, type systems and compilation.",
  },
  {
    id: "systems",
    label: "Systems & Data",
    blurb: "Distributed systems, software architecture and databases.",
  },
];

const NOTES: Note[] = [
  // Mathematics
  {
    id: "linear-algebra",
    title: "Linear Algebra",
    category: "math",
    path: "/pdfs/Algebra.pdf",
  },
  {
    id: "math-analysis",
    title: "Mathematical Analysis",
    category: "math",
    path: "/pdfs/Mathematical_Analysis.pdf",
  },

  // Theory & Algorithms
  {
    id: "advanced-data-structures",
    title: "Advanced Data Structures",
    category: "theory",
    path: "/pdfs/Advanced_Data_Structures.pdf",
  },
  {
    id: "computability-basics",
    title: "Computability Basics",
    category: "theory",
    path: "/pdfs/Computability_Basis.pdf",
  },
  {
    id: "computability-complexity",
    title: "Computability & Complexity",
    category: "theory",
    // TODO : vérifie ce nom exact (il était tronqué dans ta capture)
    path: "/pdfs/Computability_Complexity_compressed.pdf",
  },
  {
    id: "preuve-formelle",
    title: "Preuves Formelles",
    category: "theory",
    path: "/pdfs/Preuves_Formelles.pdf",
  },
  {
    id: "lambda-calculus",
    title: "Lambda Calculus",
    category: "theory",
    path: "/pdfs/Lambda_Calculus.pdf",
  },
  {
    id: "compilation",
    title: "Compilation",
    category: "theory",
    path: "/pdfs/Compilation.pdf",
  },

  // Systems & Data
  {
    id: "distributed-systems",
    title: "Distributed Systems",
    category: "systems",
    path: "/pdfs/Distributed_Systems.pdf",
  },
  {
    id: "software-architecture",
    title: "Software Architecture & Docker",
    category: "systems",
    path: "/pdfs/Software_Architecture_Docker.pdf",
  },
  {
    id: "sql-databases",
    title: "SQL & Relational Databases",
    category: "systems",
    path: "/pdfs/SQL_Relational_DB.pdf",
  },

  // AI & NLP
  {
    id: "nlp",
    title: "Natural Language Processing",
    category: "ai",
    path: "/pdfs/NLP.pdf",
  },
  {
    id: "rag",
    title: "Retrieval-Augmented Generation",
    category: "ai",
    path: "/pdfs/RAG.pdf",
  },
  {
    id: "pydantic",
    title: "Pydantic & LangChain",
    category: "ai",
    path: "/pdfs/Pydantic.pdf"
  }
];

function PdfIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  );
}

function pillStyle(active: boolean): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    background: active ? "var(--accent-dark)" : "transparent",
    color: active ? "#fff" : "var(--accent-dark)",
    padding: "0.5rem 1.1rem",
    border: "1px solid var(--accent-dark)",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.95rem",
    transition: "background 0.2s, color 0.2s",
  };
}

export default function Notes() {
  const [selected, setSelected] = useState<CategoryId | null>(null);

  const visibleNotes = selected
    ? NOTES.filter((n) => n.category === selected)
    : NOTES;
  const labelOf = (id: CategoryId) =>
    CATEGORIES.find((c) => c.id === id)?.label ?? id;

  return (
    <div style={{ padding: "clamp(2.5rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem)", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <a
          href="/"
          style={{
            display: "inline-block",
            color: "var(--accent-text)",
            fontWeight: 600,
            marginBottom: "1.5rem",
          }}
        >
          ← Back to portfolio
        </a>

        <h1
          style={{
            fontSize: "clamp(2.25rem, 7vw, 3.25rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "0.75rem",
            background:
              "linear-gradient(135deg, var(--accent-dark) 0%, var(--accent-text) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Study Notes
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.1rem",
            maxWidth: "40rem",
            marginBottom: "0.5rem",
          }}
        >
          Notes from my coursework in mathematics and computer science, as PDFs.
        </p>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.95rem",
            marginBottom: "2rem",
          }}
        >
          {NOTES.length} documents across {CATEGORIES.length} topics
        </p>

        {/* Filtres */}
        <div
          role="group"
          aria-label="Filter notes by topic"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "3rem",
          }}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-pressed={selected === null}
            style={pillStyle(selected === null)}
          >
            All <span style={{ opacity: 0.7 }}>{NOTES.length}</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              aria-pressed={selected === cat.id}
              style={pillStyle(selected === cat.id)}
            >
              {cat.label}{" "}
              <span style={{ opacity: 0.7 }}>
                {NOTES.filter((n) => n.category === cat.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Grille */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(250px, 100%), 1fr))",
            gap: "1.25rem",
          }}
        >
          {visibleNotes.map((note) => (
            <a
              key={note.id}
              href={note.path}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "2.75rem",
                    height: "2.75rem",
                    borderRadius: "0.6rem",
                    background: "rgb(var(--accent-rgb) / 0.2)",
                    color: "var(--accent-dark)",
                  }}
                >
                  <PdfIcon />
                </span>
                <span
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                  }}
                >
                  PDF
                </span>
              </div>

              <h3
                style={{
                  color: "var(--text-primary)",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  lineHeight: 1.35,
                }}
              >
                {note.title}
              </h3>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  marginTop: "auto",
                }}
              >
                <span className="tag" style={{ margin: 0 }}>
                  {labelOf(note.category)}
                </span>
                <span
                  style={{
                    color: "var(--accent-text)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  Open PDF →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
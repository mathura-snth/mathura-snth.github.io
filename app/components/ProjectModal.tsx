import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PROJECT_DETAILS } from "../data/projectDetails";

interface ModalProject {
  id: string;
  label: string;
  category: string;
  github: string;
  keywords: string[];
}

interface Props {
  project: ModalProject | null;
  color: string;
  onClose: () => void;
}

export default function ProjectModal({ project, color, onClose }: Props) {
  // Le portail ne doit exister que côté client (SSR de React Router)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Échap pour fermer + blocage du scroll de la page
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [project, onClose]);

  if (!mounted) return null;

  const detail = project ? PROJECT_DETAILS[project.id] : undefined;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={project.label}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>

            <span className="modal-badge" style={{ color, borderColor: color }}>
              {project.category}
            </span>
            <h3 className="modal-title">{project.label}</h3>

            {detail ? (
              <>
                <p className="modal-text">{detail.summary}</p>
                {detail.context && (
                  <p className="modal-text modal-context">{detail.context}</p>
                )}

                <h4>Key points</h4>
                <ul>
                  {detail.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>

                <h4>Stack</h4>
                <div className="modal-tags">
                  {detail.stack.map((s) => (
                    <span key={s} className="tag">
                      {s}
                    </span>
                  ))}
                </div>

                <h4>Typical questions</h4>
                {detail.qa.map((item) => (
                  <details key={item.q} className="qa">
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </>
            ) : (
              <>
                <div className="modal-tags">
                  {project.keywords.map((k) => (
                    <span key={k} className="tag">
                      {k}
                    </span>
                  ))}
                </div>
                <p className="modal-text">Details coming soon.</p>
              </>
            )}

            <a
              className="btn"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub →
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

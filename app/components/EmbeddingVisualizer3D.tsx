import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { CATEGORY_COLORS, GRID_COLORS } from "../components/theme";
import ProjectModal from "../components/ProjectModal";

interface DataPoint {
  id: string;
  x: number;
  y: number;
  z: number;
  category: string;
  label: string;
  github: string;
  keywords: string[];
}

// GitHub repositories data
const GITHUB_REPOS: DataPoint[] = [
  // --- AI & Large Language Models ---
  { id: "cove", x: -14, y: 8, z: 4, category: "AI & Large Language Models", label: "XAI-LLM-CoVe_Verification", github: "https://github.com/mathura-snth/XAI-LLM-CoVe_Verification", keywords: ["XAI", "LLM", "Counterfactual", "PyTorch"] },
  { id: "synthetic-bench", x: -10, y: 12, z: -3, category: "AI & Large Language Models", label: "Synthetic-Benchmark", github: "https://github.com/mathura-snth/Math-LLM-Verifier", keywords: ["Formal Methods", "Theorem Proving", "Dataset Design"] },
  { id: "dentarag", x: 6, y: -2, z: 13, category: "AI & Large Language Models", label: "DentaRAG", github: "https://github.com/mathura-snth/RAG_from_scratch", keywords: ["Hybrid Search", "LangChain", "FastAPI", "PostgreSQL"] },
  { id: "agentic-langgraph", x: 2, y: 2, z: 16, category: "AI & Large Language Models", label: "Agentic-AI-Langgraph", github: "https://github.com/mathura-snth/Agentic-AI-Langgraph", keywords: ["LangGraph", "Multi-Agent", "Agentic AI", "LLM"] },
  { id: "nlp-recommend", x: 13, y: 8, z: -7, category: "AI & Large Language Models", label: "NLP-Movie-Recommender", github: "https://github.com/mathura-snth/NLP-Movie-Recommender-DWL", keywords: ["TF-IDF", "Sentence-Transformers", "nDCG", "Flask"] },

  // --- Machine Learning & Data Engineering ---
  { id: "employee-perf", x: -12, y: -2, z: 8, category: "Machine Learning & Data Engineering", label: "Employee-Performance-Prediction", github: "https://github.com/mathura-snth/Employee-Perf-Prediction", keywords: ["SMOTE", "Balanced Random Forest", "XGBoost", "NumPy Pipeline"] },
  { id: "smartdata", x: -15, y: -5, z: 5, category: "Machine Learning & Data Engineering", label: "SmartDATA-Quality", github: "https://github.com/mathura-snth/bda", keywords: ["Oracle SQL", "Data Quality", "Anomaly Detection", "Embeddings"] },
  { id: "m1-ingenierie-donnees", x: -18, y: 0, z: 10, category: "Machine Learning & Data Engineering", label: "M1-Ingenierie_Donnees", github: "https://github.com/mathura-snth/M1-Ingenierie_Donnees", keywords: ["Data Engineering", "ETL"] },
  { id: "etics-toxicity", x: -11, y: 5, z: 9, category: "AI & Large Language Models", label: "ETICS-LLM-Contract-Analysis", github: "https://github.com/mathura-snth/ETICS-LLM-Contract-Analysis", keywords: ["LLM-as-a-Judge", "Data Engineering", "PostgreSQL", "NLP", "Ethics"] },
  // --- Distributed Systems & Architecture ---
  { id: "distributed-2pc", x: -1, y: -13, z: -9, category: "Distributed Systems & Architecture", label: "Distributed-System-2PC", github: "https://github.com/mathura-snth", keywords: ["Java", "2PC", "Sockets", "Multithreading"] },
  { id: "mpi-distributed", x: -4, y: -12, z: -14, category: "Distributed Systems & Architecture", label: "MPI-Distributed-Algorithms", github: "https://github.com/mathura-snth/MPI-Distributed-Algorithms", keywords: ["MPI", "Distributed Algorithms", "Parallel Computing"] },
  { id: "microservices-demo", x: 1, y: -9, z: -12, category: "Distributed Systems & Architecture", label: "Microservices-Architecture-Demo", github: "https://github.com/mathura-snth/Microservices-Architecture-Demo", keywords: ["Microservices", "Docker", "Architecture"] },

  // --- Algorithms & Optimization ---
  { id: "routes-optimization", x: -6, y: -8, z: -13, category: "Algorithms & Optimization", label: "Routes-Optimization", github: "https://github.com/mathura-snth/Advanced-Route-Optimization", keywords: ["Dijkstra", "A*", "Contraction Hierarchies", "CSR"] },
  { id: "knapsack", x: -9, y: -12, z: -8, category: "Algorithms & Optimization", label: "Knapsack", github: "https://github.com/mathura-snth/Knapsack", keywords: ["Knapsack Problem", "Optimization"] },
  { id: "tautologie-ocaml", x: 15, y: -6, z: 6, category: "Algorithms & Optimization", label: "Tautologie-OCaml", github: "https://github.com/mathura-snth/Tautologie-OCaml", keywords: ["OCaml", "Propositional Logic", "Functional"] },
  { id: "zork", x: 12, y: -11, z: 11, category: "Algorithms & Optimization", label: "Zork", github: "https://github.com/mathura-snth/Zork", keywords: ["Text Adventure", "Game Design"] },

  // --- Full-Stack Software Engineering ---
  // NB : l'id était en double ("nlp-recommend") ; renommé pour éviter les conflits de key et de fiche.
  { id: "nlp-recommend-web", x: 9, y: 13, z: 10, category: "Full-Stack Software Engineering", label: "NLP-Movie-Recommender", github: "https://github.com/mathura-snth/NLP-Movie-Recommender-DWL", keywords: ["TF-IDF", "Sentence-Transformers", "Flask", "Docker", "API"] },
  { id: "wikicomptines", x: 8, y: 15, z: 12, category: "Full-Stack Software Engineering", label: "Wikicomptines", github: "https://github.com/mathura-snth/Wikicomptines", keywords: ["Web", "React"] },
  { id: "microdon", x: 11, y: 12, z: 8, category: "Full-Stack Software Engineering", label: "Microdon", github: "https://github.com/mathura-snth/Microdon", keywords: ["Web App", "Full-Stack"] },
  { id: "robbie-lens", x: 5, y: 14, z: 15, category: "Full-Stack Software Engineering", label: "Robbie-Lens", github: "https://github.com/mathura-snth/Robbie-Lens", keywords: ["Portfolio", "Frontend"] },
];

// Seulement les catégories réellement utilisées
const USED_CATEGORIES = Array.from(new Set(GITHUB_REPOS.map((r) => r.category)));

function colorOf(category: string): string {
  return CATEGORY_COLORS[category] ?? "#92baa1";
}

function Legend() {
  return (
    <div className="legend">
      <h3>Categories</h3>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {USED_CATEGORIES.map((category) => (
          <div key={category} className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: colorOf(category) }}
            ></span>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              {category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectPoints({
  data,
  onSelect,
}: {
  data: DataPoint[];
  onSelect: (point: DataPoint) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<DataPoint | null>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {data.map((point) => {
        const isHovered = hoveredNode?.id === point.id;
        const color = colorOf(point.category);

        return (
          <group
            key={point.id}
            position={[point.x, point.y, point.z]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredNode(point);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              setHoveredNode(null);
              document.body.style.cursor = "auto";
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHoveredNode(null);
              document.body.style.cursor = "auto";
              onSelect(point);
            }}
          >
            {/* Core sphere */}
            <mesh>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>

            {/* Glow sphere */}
            <mesh>
              <sphereGeometry args={[isHovered ? 1.5 : 1.2, 16, 16]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={isHovered ? 0.35 : 0.18}
                depthWrite={false}
              />
            </mesh>

            {/* Tooltip on hover with keywords */}
            {isHovered && (
              <Html distanceFactor={40} center>
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: `1px solid ${color}`,
                    color: "#2b3a33",
                    width: "220px",
                    pointerEvents: "none",
                    backdropFilter: "blur(4px)",
                    boxShadow: "0 8px 32px rgba(62, 90, 78, 0.2)",
                  }}
                >
                  <strong>{point.label}</strong>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#5c6b63",
                      marginTop: "2px",
                      marginBottom: "8px",
                    }}
                  >
                    {point.category}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {point.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        style={{
                          background: "rgba(146, 186, 161, 0.2)",
                          color: "#3e5a4e",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                        }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default function EmbeddingVisualizer3D() {
  const [selected, setSelected] = useState<DataPoint | null>(null);

  return (
    <motion.div
      className="embedding-container"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="viz-header">
        <h2 className="section-title">GitHub Repository Space</h2>
        <p className="section-subtitle">
          3D visualization of my projects - rotate, zoom, hover, and click a point to see details
        </p>
      </div>

      <div className="canvas-wrapper">
        <Canvas
          camera={{ position: [0, 10, 40], fov: 60 }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.5} />
          <ProjectPoints data={GITHUB_REPOS} onSelect={setSelected} />
          <gridHelper
            args={[60, 20, GRID_COLORS.main, GRID_COLORS.secondary]}
            position={[0, -20, 0]}
          />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={10}
            maxDistance={80}
          />
        </Canvas>
      </div>

      <Legend />

      <div className="repos-list">
        <h3>Details</h3>
        <p className="section-subtitle" style={{ marginBottom: "1rem" }}>
          Click a project to see my notes, key points and typical questions.
        </p>
        <div className="repos-grid">
          {GITHUB_REPOS.map((repo) => (
            <motion.button
              key={repo.id}
              type="button"
              onClick={() => setSelected(repo)}
              className="repo-card"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <span
                className="badge"
                style={{
                  color: colorOf(repo.category),
                  borderColor: colorOf(repo.category),
                }}
              >
                {repo.category}
              </span>
              <h4>{repo.label}</h4>
              <p>View details →</p>
            </motion.button>
          ))}
        </div>
      </div>

      <ProjectModal
        project={selected}
        color={selected ? colorOf(selected.category) : "#92baa1"}
        onClose={() => setSelected(null)}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .embedding-container { width: 100%; padding: 3rem 2rem; background: rgb(var(--surface-rgb) / 0.6); border: 1px solid var(--border); border-radius: 1rem; margin-bottom: 3rem; }
        .viz-header { text-align: center; margin-bottom: 2rem; }
        .canvas-wrapper { width: 100%; height: 500px; border: 1px solid var(--border); border-radius: 0.75rem; overflow: hidden; margin-bottom: 2rem; background: var(--surface); cursor: grab; box-shadow: 0 2px 10px rgba(62, 90, 78, 0.06); }
        .canvas-wrapper:active { cursor: grabbing; }
        .legend { background: var(--surface); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem; }
        .legend h3 { margin-bottom: 1rem; color: var(--accent-dark); }
        .legend-item { display: flex; align-items: center; margin-bottom: 0.5rem; }
        .legend-color { width: 12px; height: 12px; border-radius: 50%; margin-right: 0.5rem; }
        .repos-list { margin-top: 2rem; }
        .repos-list h3 { color: var(--accent-dark); margin-bottom: 0.5rem; font-size: 1.3rem; }
        .repos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
        .repo-card { background: var(--surface); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1rem; transition: all 0.3s; cursor: pointer; text-decoration: none; display: block; text-align: left; font: inherit; width: 100%; box-shadow: 0 2px 10px rgba(62, 90, 78, 0.06); }
        .repo-card:hover { border-color: var(--accent); box-shadow: 0 8px 24px rgba(62, 90, 78, 0.12); }
        .repo-card .badge { display: inline-block; background: rgb(var(--accent-rgb) / 0.15); padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem; border: 1px solid transparent; }
        .repo-card h4 { color: var(--text-primary); margin-bottom: 0.5rem; font-size: 0.95rem; }
        .repo-card p { color: var(--accent-text); font-size: 0.85rem; margin: 0; }
        @media (max-width: 768px) { .embedding-container { padding: 2rem 1rem; } .canvas-wrapper { height: 350px; } .repos-grid { grid-template-columns: 1fr; } }

        /* ---- Modale de détails (rendue dans document.body via un portail) ---- */
        .modal-backdrop { position: fixed; inset: 0; z-index: 200; background: rgb(43 58 51 / 0.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .modal { position: relative; background: var(--surface); border: 1px solid var(--border); border-radius: 1rem; padding: 2rem; width: min(680px, 100%); max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(62, 90, 78, 0.25); }
        .modal-close { position: absolute; top: 0.75rem; right: 1rem; background: none; border: none; font-size: 1.75rem; line-height: 1; color: var(--text-secondary); cursor: pointer; }
        .modal-close:hover { color: var(--accent-dark); }
        .modal-badge { display: inline-block; background: rgb(var(--accent-rgb) / 0.15); padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600; border: 1px solid transparent; }
        .modal-title { color: var(--text-primary); font-size: 1.5rem; margin: 0.5rem 0 1rem; }
        .modal h4 { color: var(--accent-dark); margin: 1.25rem 0 0.5rem; }
        .modal ul { padding-left: 1.2rem; color: var(--text-secondary); line-height: 1.6; }
        .modal li { margin-bottom: 0.35rem; }
        .modal-text { color: var(--text-secondary); line-height: 1.7; }
        .modal-context { font-style: italic; margin-top: 0.5rem; }
        .modal-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .modal .btn { margin-top: 1.5rem; }
        .qa { border: 1px solid var(--border); border-radius: 0.5rem; padding: 0.75rem 1rem; margin-bottom: 0.5rem; }
        .qa summary { cursor: pointer; font-weight: 600; color: var(--text-primary); }
        .qa p { margin-top: 0.5rem; color: var(--text-secondary); line-height: 1.6; }
        @media (max-width: 768px) { .modal { padding: 1.5rem 1.25rem; max-height: 90vh; } }
      `,
        }}
      />
    </motion.div>
  );
}

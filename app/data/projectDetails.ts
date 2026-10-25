// app/data/projectDetails.ts
// Contenu des fiches projet. La clé = l'`id` du point dans GITHUB_REPOS.
// Les lignes marquées "TODO" sont à vérifier / compléter (notes illisibles ou absentes).

export interface ProjectDetail {
  summary: string;
  context?: string;
  highlights: string[];
  stack: string[];
  qa: { q: string; a: string }[];
}

// Fiche partagée par les deux entrées "NLP Movie Recommender" (voir plus bas)
const NLP_SEARCH: ProjectDetail = {
  summary:
    "Search engine and recommender over film scripts, built for an NLP course, then packaged as a deployable full-stack app (Flask API + frontend, Docker, cloud database).",
  context:
    "Scripts are stored as JSON, split into scenes with tags and metadata. The search engine needed query enrichment to match scenes better.",
  highlights: [
    "Compared two retrieval approaches: TF-IDF vs. sentence embeddings with chunking (Sentence-Transformers)",
    "Query enrichment with WordNet and pseudo-relevance feedback (PRF)",
    "Evaluation with recall, MAP and nDCG",
    "Docker packages the app with its dependencies in isolated containers; Docker Compose orchestrates two of them (backend API + frontend)",
    "Prebuilt images published on Docker Hub; TiDB Serverless as a MySQL-compatible cloud database",
    "Three test levels: unit (pytest, monkeypatch), integration (in-memory SQLite), end-to-end (Chromium simulating a real user journey)",
  ],
  stack: ["Python", "Flask", "TF-IDF", "Sentence-Transformers", "WordNet", "Docker", "Docker Compose", "TiDB Serverless", "pytest"],
  qa: [
    {
      q: "TF-IDF or embeddings: how did you compare them?",
      a: "Both were evaluated on the same queries with recall, MAP and nDCG. TF-IDF matches exact vocabulary; embeddings capture meaning, and chunking keeps each vector focused on a short passage.",
    },
    {
      q: "What is pseudo-relevance feedback?",
      a: "You assume the top results of a first search are relevant, extract their most characteristic terms, and add them to the query for a second pass. It improves recall, but can drift if the first results are poor.",
    },
    {
      q: "Why nDCG and MAP rather than accuracy?",
      a: "Search is a ranking problem: what matters is not only whether relevant items are returned, but how high they appear. MAP and nDCG reward good ordering.",
    },
    {
      q: "Why Docker Compose?",
      a: "The app has two services (API and frontend). Compose starts them together with a single reproducible configuration, and prebuilt images on Docker Hub avoid rebuilding everything on each machine.",
    },
    {
      q: "How did you test the app?",
      a: "Unit tests with pytest and monkeypatch to isolate functions; integration tests on the Flask API with an in-memory SQLite database; end-to-end tests with Chromium to simulate a real user path. The same code runs against SQLite in tests and TiDB in production.",
    },
  ],
};

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  // ---------------------------------------------------------------- AI & LLM
  cove: {
    summary:
      "Research internship on reducing LLM hallucinations with Chain-of-Verification (CoVe): the model checks its own answers by asking itself independent verification questions.",
    highlights: [
      "Pipeline in 4 steps: baseline analysis, verification planning, isolated execution, final answer",
      "Planning generates 3 verification questions (factored: each one stands alone)",
      "Each question is answered in isolation, without seeing the baseline",
      "Main difficulty: parsing, i.e. forcing the model to output only valid JSON",
    ],
    stack: ["Python", "PyTorch", "Qwen (free model)", "Claude", "Kaggle (GPU)"],
    qa: [
      {
        q: "How does CoVe work?",
        a: "The model first produces a baseline analysis. It then plans 3 verification questions targeting what may be hypothetical or wrong. Each question is answered independently, and a final answer is produced from the verified facts.",
      },
      {
        q: "Why answer the questions without showing the baseline?",
        a: "If the model sees its baseline, it tends to repeat its own mistakes. Isolated answers give an independent check.",
      },
      {
        q: "What was the hardest part?",
        a: "Parsing. The pipeline chains several model calls, so every output has to be valid JSON, otherwise the next step breaks.",
      },
      {
        q: "Which models and infrastructure did you use?",
        a: "A free Qwen model (plus Claude), running on Kaggle to get GPUs at no cost.",
      },
    ],
  },

  "synthetic-bench": {
    summary:
      "Benchmark built for the AAAI Student Program to check that CoVe holds on harder problems: mathematical reasoning, not just text retrieval.",
    highlights: [
      "Generate a copy (a worked solution), then inject typed errors into it",
      "Because the errors are injected, the ground truth is known by construction",
      "Generation script: implications.py",
      "Export the dataset and give it to the LLM to verify",
    ],
    stack: ["Python", "Formal methods", "Theorem proving", "Dataset design"],
    qa: [
      {
        q: "Why build a synthetic benchmark?",
        a: "To test CoVe on complex reasoning, where existing text-based evaluations don't apply, and to control exactly which errors are present.",
      },
      {
        q: "How do you get the ground truth?",
        a: "By injecting errors yourself: you know where each error is and what type it is, so no manual annotation is needed.",
      },
      {
        q: "Why use typed errors?",
        a: "Typing the errors lets you measure which kinds the verifier detects and which it misses, instead of one global score.",
      },
    ],
  },

  dentarag: {
    summary:
      "RAG assistant that answers questions about university theses with sources that are cited and verifiable, with a hallucination-checking step and automatic evaluation.",
    context:
      "Data: theses from the University of Geneva, about 400 pages, i.e. around 4,000 segments.",
    highlights: [
      "Ingestion: PDF parsing with PyMuPDF, chunking, embedding",
      "Storage in ChromaDB, an on-disk vector database",
      "Retrieval: the question is vectorized, compared with the chunks, and the top-k are returned",
      "CoVe chain adapted to RAG to check answers against the retrieved sources",
      "Evaluation with RAGAS (LLM-as-a-judge): faithfulness, relevancy, precision, recall, on a golden dataset; Groq acts as judge",
      "Planned next: evolve into an agent, with an MCP server giving access to tools",
    ],
    stack: ["Python", "FastAPI", "LangChain", "ChromaDB", "PyMuPDF", "Qwen via Groq", "RAGAS"],
    qa: [
      {
        q: "How does your RAG pipeline work?",
        a: "Ingest the PDFs, split them into chunks, embed and store them in ChromaDB. At query time, embed the question, retrieve the top-k most similar chunks, and have the LLM answer only from them, with citations.",
      },
      {
        q: "How do you reduce hallucinations?",
        a: "Answers must cite retrieved sources, and a CoVe step re-checks the claims. Evaluation with RAGAS then measures faithfulness to the sources.",
      },
      {
        q: "How do you evaluate a RAG system?",
        a: "RAGAS is a framework that uses an LLM as judge to score faithfulness, answer relevancy, context precision and context recall, on a golden dataset of reference questions.",
      },
      {
        q: "What is MCP and why add it?",
        a: "Model Context Protocol: a standard way for an MCP server to give an LLM access to tools. The goal is to turn the RAG into an agent that can decide which tool to call.",
      },
    ],
  },

  "agentic-langgraph": {
    summary:
      "Step-by-step learning project on LangGraph, aiming at a simple multi-agent architecture.",
    highlights: [
      "Step 1: structured data with Pydantic",
      "Step 2: a simple graph",
      "Step 3: a chatbot with multiple tools",
      "Next: the multi-agent system",
    ],
    stack: ["Python", "LangGraph", "Pydantic", "LLM"],
    qa: [
      {
        q: "Why LangGraph rather than a simple chain?",
        a: "Agents need loops, branching and shared state. LangGraph models the workflow as a graph of nodes with an explicit state, which makes these flows controllable.",
      },
      {
        q: "What is the role of Pydantic?",
        a: "It defines and validates the state and tool inputs and outputs, so the data passed between nodes has a guaranteed structure.",
      },
      {
        q: "What would the multi-agent step add?",
        a: "Specialised agents that cooperate, each with its own tools, coordinated by the graph.",
      },
    ],
  },

  "nlp-recommend": NLP_SEARCH,

  "etics-toxicity": {
    summary:
      "LLM pipeline analysing banking contracts to detect toxic clauses, in the name of transparency, by turning unstructured PDFs into structured data.",
    highlights: [
      "Steps: PDF extraction, cleaning, segmentation, output as JSON",
      "Goal: a data warehouse for general toxicity analysis",
      "Toxicity score evaluated against a golden dataset, with an LLM as judge",
      "Low temperature to reduce creativity; human in the loop to reduce hallucinations",
    ],
    stack: ["Python", "PyMuPDF", "pdfplumber", "Regex", "PostgreSQL", "SQL", "LLM"],
    qa: [
      {
        q: "Why a low temperature?",
        a: "The task is extraction and classification, not creative writing. A low temperature makes outputs more deterministic and less prone to invention.",
      },
      {
        q: "Why keep a human in the loop?",
        a: "Contract analysis has real consequences. A human validating borderline cases cuts hallucination risk and builds trust in the score.",
      },
      {
        q: "How do you evaluate a toxicity score?",
        a: "Compare it with a golden dataset of annotated clauses, using an LLM as judge to scale the comparison.",
      },
      {
        q: "What was the data challenge?",
        a: "Going from unstructured PDFs to clean structured segments: extraction, cleaning with regex, segmentation, then JSON stored in PostgreSQL.",
      },
    ],
  },

  // ------------------------------------------------ ML & Data Engineering
  "employee-perf": {
    summary:
      "Predicting employee performance on a heavily imbalanced dataset, comparing several rebalancing strategies and models, with a from-scratch NumPy pipeline.",
    highlights: [
      "Imbalance makes accuracy misleading, so the metric is macro-F1 (precision and recall per class)",
      "Stratified 80/20 split, same class proportions in train and test",
      "Rebalancing: class weights, undersampling (drop majority rows), SMOTE (synthetic rows built from nearest neighbours of rare ones)",
      "Balanced Random Forest: each tree trained on a sample where all classes have the same size",
      "XGBoost: each row weighted by its class in the loss; decision threshold shifted without adding information",
      "Softmax regression written in NumPy, gradient-checked and compared with scikit-learn; a tree model as non-linear comparison",
      "XGBoost tuning by testing hyperparameter combinations with cross-validation; final comparison with bootstrap",
    ],
    context:
      "Conclusion: before rebalancing, the model predicted the majority score for everyone. After, it detects more rare cases but also makes more mistakes: the classes are not distinguishable from the available variables, so shifting the threshold is a trade-off, not a fix.",
    stack: ["Python", "NumPy", "scikit-learn", "SMOTE", "Balanced Random Forest", "XGBoost"],
    qa: [
      {
        q: "Why not use accuracy?",
        a: "With imbalanced classes, predicting the majority class gives high accuracy and no value. Macro-F1 averages precision and recall across classes so rare ones count equally.",
      },
      {
        q: "How does SMOTE work, and what are its risks?",
        a: "It creates synthetic minority rows by interpolating between a rare example and its nearest neighbours. It must be applied on the training set only, otherwise synthetic data leaks into the test.",
      },
      {
        q: "Class weights, undersampling or SMOTE?",
        a: "Class weights keep all data but change the loss; undersampling discards majority rows; SMOTE adds synthetic minority rows. I compared them with macro-F1 rather than assuming one was best.",
      },
      {
        q: "What did you conclude?",
        a: "Rebalancing increased recall on rare classes at the cost of precision. The available features did not separate the classes, so no technique could fully fix it. Knowing when a model has no signal is a result in itself.",
      },
      {
        q: "Why implement softmax in NumPy?",
        a: "To understand the mechanics (loss, gradients) and validate them by gradient checking and by comparison with scikit-learn.",
      },
    ],
  },

  smartdata: {
    summary:
      "Data-quality toolkit in Oracle SQL to clean a database: duplicate detection and merging, normalisation and enrichment.",
    highlights: [
      "Studied several similarity algorithms (e.g. bigrams) depending on text vs. categorical fields",
      "Blocking: group rows by a key (first 3 characters) and compare only within blocks",
      "Merge step that keeps rules on which values survive",
      "Field normalisation, then enrichment by embeddings (with PRF), not applied to the whole base",
      "Functional dependencies leading to occurrence counts",
    ],
    stack: ["Oracle SQL", "Cursors", "Dynamic SQL", "Regex", "Python", "Embeddings"],
    qa: [
      {
        q: "Why use blocking?",
        a: "Comparing every row with every other is quadratic. A cheap blocking key (first 3 characters) restricts comparisons to likely candidates.",
      },
      {
        q: "How do you decide two rows are duplicates?",
        a: "A similarity measure (e.g. bigram-based) on the relevant fields, chosen per field type, with a threshold; then merge rules decide which values to keep.",
      },
      {
        q: "Why dynamic SQL and cursors?",
        a: "The same cleaning logic had to run on different tables and columns, so SQL statements are generated at run time and rows processed one by one when needed.",
      },
    ],
  },

  "m1-ingenierie-donnees": {
    summary:
      "Data engineering pipeline on a modern stack: collect, clean and make raw data usable, orchestrated and reproducible.",
    context: "Status: ingestion done; Docker and Airflow containerisation still to do.",
    highlights: [
      "ELT approach: load into the database first, then transform",
      "DuckDB as columnar storage",
      "dbt turns SQL queries into tables",
      "Airflow orchestrates the order of tasks",
      "Docker Compose for a reproducible environment",
      "GitHub Actions for continuous integration: every push triggers verification",
    ],
    stack: ["Python", "DuckDB", "dbt", "Airflow", "Docker Compose", "GitHub Actions"],
    qa: [
      {
        q: "ETL or ELT?",
        a: "ELT: raw data is loaded into the warehouse first and transformed there with SQL. It keeps raw data available and uses the database engine for the heavy lifting.",
      },
      {
        q: "What does each tool do?",
        a: "DuckDB stores and queries the data in columns; dbt manages SQL transformations as tables; Airflow schedules and orders the tasks.",
      },
      {
        q: "Why Docker Compose and GitHub Actions?",
        a: "Compose makes the environment reproducible on any machine; GitHub Actions checks the project automatically on each push.",
      },
    ],
  },

  // ------------------------------------------- Distributed systems (concepts)
  // TODO : pas de notes manuscrites pour ces projets, complète avec ce que tu as réellement fait.
  "distributed-2pc": {
    summary: "Java implementation of the Two-Phase Commit protocol, with processes communicating over sockets and multithreading.",
    highlights: ["Coordinator and participants communicating over sockets", "Multithreaded handling of participants"],
    stack: ["Java", "Sockets", "Multithreading", "2PC"],
    qa: [
      {
        q: "How does Two-Phase Commit work?",
        a: "Phase 1: the coordinator asks all participants to prepare and vote. Phase 2: if all vote yes it sends commit, otherwise abort. This guarantees atomicity across nodes.",
      },
      {
        q: "What is its main weakness?",
        a: "It is blocking: if the coordinator fails after participants voted yes, they must wait, holding their locks.",
      },
    ],
  },

  "mpi-distributed": {
    summary: "Distributed algorithms implemented with MPI for parallel computing.",
    highlights: ["Message-passing between processes"],
    stack: ["MPI", "Parallel computing"],
    qa: [
      {
        q: "What is MPI?",
        a: "A standard for message passing between processes that don't share memory, using point-to-point and collective operations.",
      },
    ],
  },

  "microservices-demo": {
    summary: "Demo of a microservices architecture packaged with Docker.",
    highlights: ["Independent services, each in its own container"],
    stack: ["Docker", "Microservices"],
    qa: [
      {
        q: "Microservices or monolith?",
        a: "Microservices let each service be deployed and scaled independently, at the cost of network communication and operational complexity. A monolith is simpler until the team or load grows.",
      },
    ],
  },

  // -------------------------------------------------- Algorithms & optimisation
  "routes-optimization": {
    summary: "Route optimisation comparing shortest-path algorithms on graphs.",
    highlights: ["Dijkstra, A* and Contraction Hierarchies", "Graph stored in CSR format"],
    stack: ["Dijkstra", "A*", "Contraction Hierarchies", "CSR"],
    qa: [
      {
        q: "Why is A* faster than Dijkstra?",
        a: "A* adds a heuristic estimate of the remaining distance, so it explores fewer nodes toward the target.",
      },
      {
        q: "What do Contraction Hierarchies do?",
        a: "They preprocess the graph by adding shortcuts, so queries become much faster on large road networks.",
      },
      {
        q: "Why CSR?",
        a: "Compressed Sparse Row stores the graph compactly in contiguous arrays, which is cache-friendly for large graphs.",
      },
    ],
  },

  knapsack: {
    summary: "Solving the knapsack optimisation problem.",
    highlights: ["Optimisation under a capacity constraint"],
    stack: ["Optimization", "Algorithms"],
    qa: [
      {
        q: "What is the complexity of the dynamic-programming solution?",
        a: "O(n·W) for n items and capacity W. It is pseudo-polynomial: the problem is NP-hard in general.",
      },
    ],
  },

  "tautologie-ocaml": {
    summary: "Tautology checker for propositional logic, written in OCaml.",
    highlights: ["Functional programming on logical formulas"],
    stack: ["OCaml", "Propositional logic"],
    qa: [
      {
        q: "How do you check that a formula is a tautology?",
        a: "Evaluate it under every assignment of its variables (truth table), or search for a falsifying assignment; if none exists, it is a tautology.",
      },
    ],
  },

  // The second "NLP Movie Recommender" entry (Full-Stack category)
  "nlp-recommend-web": NLP_SEARCH,
};

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
        q: "Qu'est-ce qu'une hallucination de LLM ?",
        a: "Une sortie fluide mais fausse ou non fondée. On distingue l'hallucination factuelle (contraire à la réalité), la fidélité (contraire au contexte fourni) et l'incohérence interne.",
      },
      {
        q: "Pourquoi les LLM hallucinent-ils ?",
        a: "Ils sont entraînés à prédire le token le plus probable, pas à dire le vrai. Données lacunaires, figées dans le temps ou bruitées, absence de grounding et décodage qui privilégie la fluidité favorisent l'erreur.",
      },
      {
        q: "Quelles sont les étapes de CoVe.",
        a: "1) Réponse initiale (baseline). 2) Planification de questions de vérification. 3) Réponse à chaque question de façon indépendante. 4) Réponse finale corrigée à partir des faits vérifiés.",
      },
      {
        q: "Pourquoi répondre aux questions de vérification sans voir la baseline ?",
        a: "Si le modèle voit sa réponse initiale, il tend à la confirmer et à répéter ses erreurs. L'isolation (« factored ») donne une vérification indépendante.",
      },
      {
        q: "Quelles sont les limites de CoVe ?",
        a: "Coût et latence (plusieurs appels), le modèle peut se tromper aussi en vérifiant, et il ne corrige pas une connaissance absente. La qualité dépend des questions générées.",
      },
      {
        q: "Différence avec self-consistency, self-refine, chain-of-thought ?",
        a: "Chain-of-thought : raisonner étape par étape. Self-consistency : échantillonner plusieurs raisonnements et voter. Self-refine : critiquer puis réécrire sa réponse. CoVe : vérifier des faits précis via des questions indépendantes.",
      },
      {
        q: "Quelle a été la principale difficulté technique ?",
        a: "Le parsing : le pipeline enchaîne plusieurs appels, donc chaque sortie doit être un JSON valide sinon l'étape suivante casse. Solution : prompt strict, validation du schéma, nouvelle tentative en cas d'échec.",
      },
      {
        q: "Comment il a été mesuré que CoVe améliore la fidélité ?",
        a: "Comparaison baseline vs CoVe sur le même benchmark, avec les mêmes métriques.",
      },
      {
        q: "Quelles méthodes d'explicabilité (XAI) y a t-il pour les LLM ?",
        a: "Self-attention, attributions par gradient, SHAP/LIME. Elles aident à comprendre où le modèle s'appuie, sans prouver la causalité.",
      },
    ],
  },

  "synthetic-bench": {
    summary:
      "Benchmark to check that CoVe holds on harder problems: mathematical reasoning, not just text retrieval.",
    highlights: [
      "Generate a copy (a student copy containing hypothesis in order to apply a theorem), then inject typical errors into it",
      "Because the errors are injected, the ground truth is known by construction",
      "The key strength of this benchmark is its complexity: it goes beyond simple calculations to assess the LLM’s logical reasoning. It tests the application of theorems, the identification of implicit assumptions, and the validation of implications (e.g., validating that A holds if A implies B), ensuring an evaluation of deep reasoning rather than keyword-based search.",
    ],
    stack: ["Python", "Formal methods", "Theorem proving", "Dataset design"],
    qa: [
      {
        q: "Comment ce benchmark a été conçu ?",
        a: "Je l'ai construit directement à partir de mes cours de mathématiques de licence. J'ai utilisé les théorèmes, les définitions et les exercices vus en classe pour garantir une vérité terrain parfaitement exacte et pertinente.",
      },
      {
        q: "Comment concevoir un benchmark valide ?",
        a: "Se baser sur des faits vérifiés, Couverture variée des cas, vérité terrain fiable, pas de contamination avec les données d'entraînement.",
      },
      {
        q: "Pourquoi un benchmark synthétique avec erreurs injectées ?",
        a: "La vérité terrain est connue par construction (position et type de l'erreur), sans annotation manuelle.",
      },
      {
        q: "Limites d'un benchmark synthétique ?",
        a: "Les erreurs injectées ne reflètent pas forcément les erreurs réelles d'un LLM, et le modèle peut repérer des artefacts de génération. D'où l'intérêt de le compléter par des cas réels.",
      },
      {
        q: "Comment mesurer la détection d'erreurs ?",
        a: "Rappel et précision par type d'erreur, plus la localisation de l'erreur. Le typage évite un score global qui cache les faiblesses.",
      },
    ],
  },

  dentarag: {
    summary:
      "RAG assistant that answers questions about university theses with sources that are cited and verifiable, with a hallucination-checking step and automatic evaluation.",
    context:
      "Data: theses from the University of Geneva, about 1400 pages, i.e. around 4000 segments.",
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
        q: "Description de l'architecture de bout en bout.",
        a: "PDF → extraction PyMuPDF → découpage en chunks (1 483 pages, 4 011 segments) → embeddings (dim. 384) → ChromaDB. À la requête : embedding de la question, top-k par similarité, prompt avec contexte et citations, génération (Qwen via Groq), puis vérification CoVe. Le tout exposé par une API FastAPI.",
      },
      {
        q: "Pourquoi « from scratch » ?",
        a: "Pour comprendre et maîtriser chaque brique (découpage, retrieval, évaluation) plutôt que de subir les abstractions d'un framework.",
      },
      {
        q: "Comment choisir la taille des chunks ?",
        a: "Compromis : trop petit, on perd le contexte ; trop grand, le vecteur dilue le sens et on consomme la fenêtre de contexte. Taille et overlap : ajustés sur la qualité de retrieval. Moyenne : environ 1 483 pages / 4 011 segments, soit 2 à 3 segments par page.",
      },
      {
        q: "Pourquoi ChromaDB et comment cherche-t-il ?",
        a: "Base vectorielle locale simple à intégrer. L'index est HNSW, un graphe de voisinage approximatif : recherche en temps quasi logarithmique au prix d'un léger rappel perdu. Alternatives : FAISS, Qdrant, pgvector.",
      },
      {
        q: "Cosinus, produit scalaire ou L2 ?",
        a: "Sur des vecteurs normalisés, cosinus et produit scalaire sont équivalents et L2 donne le même classement. Le cosinus ne dépend que de la direction, pas de la norme.",
      },
      {
        q: "Comment améliorer le retrieval ?",
        a: "Recherche hybride (BM25 + vecteur dense), reranker cross-encoder (plus précis qu'un bi-encoder mais plus lent, donc appliqué au top-k seulement), réécriture de requête, filtres sur métadonnées.",
      },
      {
        q: "Quelles sont les limites de PyMuPDF sur des thèses ?",
        a: "Les tableaux, figures, formules et mises en page à colonnes sont mal restitués, et les PDF scannés demandent de l'OCR.",
      },
      {
        q: "Comment fonctionne Ragas ?",
        a: "Un LLM juge calcule : faithfulness (les affirmations sont-elles soutenues par le contexte ?), answer relevancy, context precision (le contexte utile est-il bien classé ?) et context recall (a-t-on tout récupéré ?).",
      },
      {
        q: "Quels sont les biais d'un LLM juge ?",
        a: "Biais de position, de verbosité et d'auto-préférence. Mitigation : juge différent du générateur, jeu de référence validé à la main, plusieurs exécutions.",
      },
      {
        q: "Comment diagnostiquer une réponse fausse ?",
        a: "Séparer retrieval et génération : le bon passage est-il dans le top-k ? Sinon, problème de chunking, d'embedding ou de requête. Si oui, problème de prompt ou de génération.",
      },
      {
        q: "Que fait le système quand le corpus n'a pas la réponse ?",
        a: "Le prompt impose de répondre « je ne sais pas » si le contexte est insuffisant, et un seuil de similarité peut court-circuiter la génération.",
      },
      {
        q: "Qu'est-ce que MCP et en quoi diffère-t-il du function calling ?",
        a: "Model Context Protocol : permet d'exposer outils et données à un LLM via un serveur. Le function calling est la capacité du modèle à appeler des fonctions ; MCP standardise comment ces outils sont décrits et branchés, de façon réutilisable entre applications.",
      },
      {
        q: "RAG ou agent : quand choisir quoi ?",
        a: "Un RAG suffit pour répondre depuis un corpus. L'agent est utile quand il faut choisir entre plusieurs outils ou enchaîner des étapes, au prix de plus de coût, de latence et de risques (boucles, injection de prompt).",
      },
      {
        q: "Et pour la confidentialité des données ?",
        a: "Ici le corpus est public (les thèses). Avec des données sensibles : modèle auto-hébergé ou contrat conforme RGPD, anonymisation et contrôle d'accès.",
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
        q: "Qu'est-ce qu'un agent et la boucle ReAct ?",
        a: "Un LLM qui alterne raisonnement et actions (appels d'outils) en observant les résultats, jusqu'à pouvoir répondre.",
      },
      {
        q: "Quels sont les risques des agents ?",
        a: "Boucles infinies, appels d'outils non voulus, prompt injection via des contenus externes, coûts et latence. Mitigation : limites d'étapes, validation humaine, outils en lecture seule.",
      },
      {
        q: "LangChain vs LangGraph ?",
        a: "LangChain compose des chaînes linéaires et fournit des intégrations. LangGraph modélise des graphes d'état avec cycles et branchements, plus adaptés aux agents.",
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
      "Low temperature (to reduce creativity) and human in the loop to reduce hallucinations",
    ],
    stack: ["Python", "PyMuPDF", "pdfplumber", "Regex", "PostgreSQL", "SQL", "LLM"],
    qa: [
      {
        q: "Comment extraire les PDF et segmenter en clauses ?",
        a: "PyMuPDF avec détection de colonnes, nettoyage (en-têtes, numéros de page), puis segmentation par expressions régulières sur la numérotation des articles. Les regex sont rapides, déterministes et vérifiables, mais fragiles face aux formats atypiques.",
      },
      {
        q: "Comment forcer le LLM à sortir du JSON valide ?",
        a: "Schéma explicite dans le prompt (ou mode JSON / sortie structurée), validation avec Pydantic, nouvelle tentative en cas d'échec, température basse. Si le JSON reste invalide, l'élément est rejeté et journalisé.",
      },
      {
        q: "Qu'est-ce qu'une clause « toxique » et qui a défini la vérité terrain ?",
        a: "Clause abusive ou défavorable au client selon des critères définis à l'avance. Avec pour l'instant environ 20 contrats, la vérité terrain est petite et possiblement biaisée.",
      },
      {
        q: "Pourquoi prioriser le rappel ?",
        a: "Un faux négatif (clause toxique manquée) coûte plus cher qu'un faux positif (une clause en plus à relire par un humain). On accepte donc une précision plus faible.",
      },
      {
        q: "Précision, rappel, F1, matrice de confusion ?",
        a: "Précision = VP/(VP+FP). Rappel = VP/(VP+FN). F1 = moyenne harmonique des deux. La matrice de confusion croise classes prédites et réelles. En multiclasse : macro (classes à poids égal) ou micro (global).",
      },
      {
        q: "Qu'est-ce que LLM-as-a-judge et le contrôle d'ancrage ?",
        a: "Un LLM note une sortie par rapport à une référence ou à des critères. Le contrôle d'ancrage vérifie que chaque élément extrait ou justifié est bien présent dans le texte source.",
      },
      {
        q: "Pourquoi 5 entités dans le modèle conceptuel ?",
        a: "Chaque entité correspond à un concept distinct (contrat, clause, etc.) pour éviter la redondance (normalisation).",
      },
      {
        q: "Un LLM peut-il donner un avis juridique ?",
        a: "Non : c'est un outil d'aide à la détection et à la transparence. La décision reste humaine, d'où le human in the loop et la nécessité de justifications traçables.",
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
        q: "Quel est le jeu de données et la cible ?",
        a: "64 271 lignes, cible multiclasse (score de 1 à 5), fortement déséquilibrée. Répartition des classes : [À COMPLÉTER].",
      },
      {
        q: "Raconte la fuite de cible (F1 0,93 → 0,19).",
        a: "Une variable [À COMPLÉTER] encodait déjà l'information de la cible, d'où 0,93. Détection : score anormalement élevé et importance dominante de cette variable. Après retrait, 0,19 est le résultat honnête : les variables disponibles séparent mal les classes.",
      },
      {
        q: "Pourquoi macro-F1 plutôt qu'accuracy ?",
        a: "Avec des classes déséquilibrées, prédire la classe majoritaire donne une bonne accuracy sans valeur. Le macro-F1 donne le même poids à chaque classe.",
      },
      {
        q: "Où appliquer SMOTE par rapport à la validation croisée ?",
        a: "Uniquement sur le pli d'entraînement, à l'intérieur d'un pipeline. Appliqué avant le split, il crée des échantillons synthétiques proches de points de test : fuite et score gonflé.",
      },
      {
        q: "Quand SMOTE est-il peu adapté ?",
        a: "Données de grande dimension, variables catégorielles, classes qui se chevauchent : les points synthétiques créent alors du bruit.",
      },
      {
        q: "Comment fonctionne le gradient boosting / XGBoost ?",
        a: "Des arbres faibles ajoutés séquentiellement, chacun corrigeant l'erreur résiduelle (gradient de la perte) du précédent, avec régularisation. Hyperparamètres clés : learning rate, profondeur, nombre d'arbres, subsample. Optimisés par validation croisée à 5 plis (stratifiée).",
      },
      {
        q: "Écris la perte et le gradient de la régression softmax.",
        a: "Perte : entropie croisée L = −(1/n) Σ log p(y_i|x_i). Gradient : (1/n) Xᵀ(P − Y) avec P les probabilités softmax. Stabilité numérique : soustraire le max avant l'exponentielle (log-sum-exp).",
      },
      {
        q: "Comment as-tu vérifié le gradient ?",
        a: "Par différences finies centrées (f(θ+ε) − f(θ−ε)) / 2ε, comparées au gradient analytique : erreur relative de l'ordre de 1e-7 attendue.",
      },
      {
        q: "Explique le bootstrap et les différences appariées.",
        a: "On rééchantillonne avec remise pour estimer la variabilité d'une métrique, d'où un intervalle de confiance à 95 % (percentile). Les différences appariées comparent deux modèles sur les mêmes rééchantillons, ce qui annule la variance commune et donne un test plus puissant.",
      },
      {
        q: "Quelle conclusion tires-tu ?",
        a: "Le rééquilibrage augmente le rappel des classes rares au prix de la précision. Il ne crée pas d'information : savoir qu'un modèle n'a pas de signal est un résultat en soi.",
      },
      {
        q: "Comment traiter une cible ordinale (1 à 5) ?",
        a: "Régression ordinale ou régression avec arrondi, car la classification multiclasse ignore l'ordre. Métriques adaptées : erreur absolue moyenne, kappa pondéré.",
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
        q: "Que fait MERGE en SQL ?",
        a: "Une seule instruction qui fait un UPDATE si la ligne existe (clause MATCHED) et un INSERT sinon (NOT MATCHED). Pratique pour fusionner des doublons et dédupliquer.",
      },
      {
        q: "Compare les mesures de similarité (Levenshtein, Jaro-Winkler, Jaccard, Q-gram, embeddings).",
        a: "Levenshtein : nombre de modifications (O(n·m)), bon pour les fautes de frappe. Jaro-Winkler : favorise le préfixe commun, bon pour les noms. Jaccard / Q-gram : recouvrement de sous-chaînes ou de mots, robuste à l'ordre. Embeddings : similarité sémantique, mais plus coûteux et moins précis sur les identifiants.",
      },
      {
        q: "Pourquoi une clé de blocage ?",
        a: "Comparer toutes les paires est O(n²). Le blocage (ici 3 premiers caractères) ne compare qu'au sein d'un bloc. Compromis : un bloc trop strict fait manquer des doublons.",
      },
      {
        q: "Comment as-tu fixé tes 3 seuils ?",
        a: "Rejet en dessous du seuil bas, fusion automatique au-dessus du seuil haut, zone intermédiaire envoyée en révision manuelle. Valeurs calibrées sur des paires annotées : [À COMPLÉTER].",
      },
      {
        q: "Comment évaluer la déduplication ?",
        a: "Précision et rappel sur des paires connues (doublon / non doublon) : une fusion à tort est plus grave qu'un doublon manqué.",
      },
      {
        q: "Comment fonctionne la recherche « CTRL+F » à score hybride ?",
        a: "Score combiné : similarité lexicale (tolérante aux fautes de frappe, type Q-gram) pondérée avec une similarité sémantique par embeddings. Pondération : [À COMPLÉTER].",
      },
      {
        q: "Pourquoi PL/SQL et dynamic SQL ?",
        a: "Pour exécuter la même logique de nettoyage sur plusieurs tables et colonnes, avec des requêtes générées à l'exécution et des curseurs pour les traitements ligne à ligne.",
      },
      {
        q: "Comment as-tu travaillé en équipe de 5 ?",
        a: "Répartition par module, Git avec branches et revues, conventions communes. Ma part : [À COMPLÉTER].",
      },
      {
        q: "Comment dédoublonner à grande échelle ?",
        a: "MinHash / LSH ou SimHash pour trouver les quasi-doublons sans comparer toutes les paires.",
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
        q: "ETL vs ELT : pourquoi ELT ?",
        a: "ELT charge les données brutes dans l'entrepôt puis les transforme en SQL. On garde le brut, on rejoue les transformations et on profite de la puissance du moteur analytique.",
      },
      {
        q: "Qu'est-ce qu'un DAG Airflow et que veut dire idempotence ?",
        a: "Un graphe orienté acyclique de tâches avec dépendances. Idempotence : relancer une tâche donne le même résultat sans doublons, ce qui rend retries et backfills sûrs.",
      },
      {
        q: "Quel est le rôle de dbt et comment testes-tu les données ?",
        a: "dbt transforme des requêtes SQL en modèles (tables / vues) versionnés, avec tests (unique, not_null, relationships) et documentation.",
      },
      {
        q: "Pourquoi DuckDB ?",
        a: "Base analytique embarquée et colonnaire : rapide en agrégation, sans serveur à gérer. À la différence de PostgreSQL (orienté lignes, transactionnel).",
      },
      {
        q: "Que fait ta CI avec GitHub Actions ?",
        a: "À chaque push, elle installe l'environnement et lance les vérifications (tests dbt, lint) pour détecter les régressions. Détail exact : [À COMPLÉTER].",
      },
      {
        q: "Comment ce pipeline pourrait-il alimenter un système IA ?",
        a: "Il fournit des données propres et versionnées : tables de features pour du ML, ou documents nettoyés pour alimenter une base vectorielle dans un RAG.",
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

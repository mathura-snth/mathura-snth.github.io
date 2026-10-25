# mathu. - Personal Portfolio

Personal portfolio of Mathura Santhalingam, Master 2 Computer Science student (AI and Mathematics) at Institut Galilee, Universite Sorbonne Paris Nord. It presents my projects, my research interests (machine learning, AI agents, LLM reliability and explainability) and my study notes.

## Features

- **Interactive 3D project map**: every GitHub repository is a point in a 3D space (react-three-fiber). Points are colored by category, and the scene can be rotated and zoomed. Hovering a point shows its category and keywords; clicking it opens the project details.
- **Project details**: a "Details" section lists every project as a card. Each card opens a modal with a summary, key points, the technology stack, typical questions with answers, and a link to the GitHub repository.
- **Study notes**: a page of course notes (PDF) filtered by topic: AI and NLP, mathematics, theory and algorithms, systems and data.
- **Light sage theme**: colors defined as CSS variables, with matching hex values for the 3D scene.
- **Server-side rendering** and hot module replacement, provided by React Router.

## Tech stack

- [React Router](https://reactrouter.com/) (framework mode) with TypeScript
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/) v4, plus hand-written CSS for the theme
- [Three.js](https://threejs.org/) with [@react-three/fiber](https://r3f.docs.pmnd.rs/) and [@react-three/drei](https://drei.docs.pmnd.rs/)
- [Framer Motion](https://www.framer.com/motion/) for animations

## Getting started

### Prerequisites

- Node.js (a recent LTS version)
- npm

### Installation

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The site is then available at `http://localhost:5173`.

### Type checking

```bash
npm run typecheck
```

### Production build

```bash
npm run build
```

## Editing the content

### Projects on the 3D map

The projects are declared in the `GITHUB_REPOS` array of `EmbeddingVisualizer3D.tsx`. Each entry has:

| Field | Description |
| --- | --- |
| `id` | Unique identifier. It must be unique, and it links the project to its details. |
| `x`, `y`, `z` | Position in the 3D space. |
| `category` | One of the categories defined in `theme.ts`. |
| `label` | Name displayed on the card and in the tooltip. |
| `github` | URL of the repository. |
| `keywords` | Keywords shown in the tooltip. |

### Project details

The content of each modal lives in `projectDetails.ts`, as a record keyed by the project `id`:

```ts
"my-project": {
  summary: "What the project is, in two or three sentences.",
  context: "Optional: data or setting.",
  highlights: ["Key point", "Another key point"],
  stack: ["Python", "Docker"],
  qa: [{ q: "A typical question?", a: "The answer." }],
}
```

A project without an entry still opens a modal, showing its keywords and a link to the repository.

### Colors

Category colors and grid colors for the 3D scene are defined in `theme.ts` as hex values, because Three.js does not understand CSS variables. The rest of the site uses the CSS variables declared in `app.css`.

### Study notes

Notes are listed in the `NOTES` array of `notes.tsx`. The PDF files are served from `public/pdfs/`, and each entry points to its file with `path: "/pdfs/<file>.pdf"`.

## Deployment

### Docker

```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

The container can be deployed on any platform that supports Docker (Google Cloud Run, Fly.io, Railway, AWS ECS, Azure Container Apps, and others).

### Without Docker

The built-in server is production-ready. Deploy the output of `npm run build`:

```
package.json
package-lock.json
build/
  client/    # static assets
  server/    # server-side code
```

## Links

- GitHub: https://github.com/mathura-snth
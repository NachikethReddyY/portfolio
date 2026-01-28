# Nachiketh Reddy - Engineering Portfolio

> **"A centralized digital home for scattered engineering work."**

A high-performance, design-driven portfolio built to bridge the gap between academic theory, personal experiments, and real-world applications.

![Portfolio Preview](./public/mesquare.png)

## 📖 The "Why"
As a developer, my work was scattered—GitHub repos, local folders, PDF submissions. I needed a single source of truth that could:
1.  **Aggregate** diverse work (Case studies, code snippets, academic papers).
2.  **Contextualize** code with the "Why" and "How", not just the "What".
3.  **Demonstrate** my taste for clean architecture and premium user experiences.

This repository is the solution: A custom-built web application serving as a living archive of my engineering journey.

---

## 🛠️ Tech Stack & Architecture

Built on a modern, type-safe stack designed for performance, SEO, and maintainability.

### Core Foundation
-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router) - Utilizing Server Components for performance and SEO.
-   **Language**: **TypeScript** - For robust, self-documenting code and type safety.
-   **Styling**: **Tailwind CSS** - Utility-first styling with a custom design system.
-   **Component Library**: [Shadcn UI](https://ui.shadcn.com/) - Accessible, headless components styled with Tailwind.

### Data & Content layer
-   **Headless CMS**: [Sanity.io](https://www.sanity.io/)
    -   Used for managing Projects, Work Experience, and Skills without code deploys.
    -   **GROQ**: Powerful query language used to fetch and filter content.
    -   **Portable Text**: Rich text rendering for deep-dive case studies.

### UI/UX & Motion
-   **Animations**: [Framer Motion](https://www.framer.com/motion/) - fluid, hardware-accelerated transitions (Entry animations, layout shifts).
-   **Design Language**: "Apple-esque" minimalism.
    -   Glassmorphism (Backdrop blur)
    -   Inter Typography
    -   Subtle micro-interactions

---

## ✨ Key Features

### 1. The Project Archive (`/projects`)
A dedicated search engine for my work.
-   **Smart Search**: Filter by tech stack (e.g., "Python", "React") or category.
-   **Responsive Design**: Auto-adapts from a grid view on desktop to a touch-optimized list on mobile.
-   **Dynamic Metadata**: Each project page auto-generates SEO tags based on Sanity content.

### 2. "Hero" Project Cards
Treating code like a product release.
-   **Visual-First**: Large cover images.
-   **Quick Access**: Dedicated "GitHub" button for recruiters to jump straight to source code.
-   **Context**: Displays "Published Date" and "Category" tags immediately.

### 3. Integrated Timeline
A unified view of my professional and academic history, switchable via tabs.

---

## 🚀 Getting Started

To run this project locally:

### 1. Clone & Install
```bash
git clone https://github.com/NachikethReddyY/portfolio.git
cd portfolio
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=YourProjectID
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### 3. Run Development Server
```bash
npm run dev
# Server starts at http://localhost:3000
# Sanity Studio available at http://localhost:3000/studio
```

---

## 📂 Project Structure
```
src/
├── app/                 # Next.js App Router pages
│   ├── projects/        # Archive & Detail pages
│   ├── studio/          # Sanity CMS config
│   └── page.tsx         # Home Page
├── components/          # React Components
│   ├── home/            # Hero, Skills Grid
│   ├── projects/        # Searchable Grid, Cards
│   └── ui/              # Shadcn Primitives
├── lib/                 # Utility functions & Types
└── sanity/              # Schema definitions & Client
```

---

## 📄 License
This project is open-source and available under the MIT License.

*Built by Nachiketh Reddy for documentation of work and display. © 2026.*

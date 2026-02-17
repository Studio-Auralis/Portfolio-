import React from "react";
import "./ProjectsCarousel.css";

/* ============================================
   DONNÉES PROJETS
   ============================================ */
const projects = [
  {
    id: 1,
    title: "Global Conflict Tracker",
    category: "Data Visualization",
    tech: ["JavaScript", "GDELT", "UNHCR", "Data Viz"],
    image: "screenshots/conflict-tracker.webp",
    link: "https://conflit.studio-auralis.com",
  },
  {
    id: 2,
    title: "MotionUp Studio",
    category: "Site Client",
    tech: ["HTML5", "CSS3", "JavaScript", "SEO"],
    image: "screenshots/motionup.webp",
    link: "https://motionup-studio.com",
  },
  {
    id: 3,
    title: "AI Strategy Engine",
    category: "Multi-Agents",
    tech: ["Node.js", "Groq API", "SSE"],
    image: "screenshots/ai-strategy.webp",
    link: "agent-ia/public/index.html",
  },
  {
    id: 4,
    title: "Workflow Automatisé",
    category: "Automation",
    tech: ["n8n", "Claude", "API REST"],
    image: "screenshots/workflow.webp",
    link: "workflow-demo.html",
  },
  {
    id: 5,
    title: "Chatbot Avancé",
    category: "Chatbot IA",
    tech: ["React", "TypeScript", "Groq API"],
    image: "screenshots/chatbot.webp",
    link: "chatbot-demo.html",
  },
  {
    id: 6,
    title: "SubTitlesAI",
    category: "SaaS / IA",
    tech: ["React", "Node.js", "IA", "Whisper"],
    image: "screenshots/subtitlesai.webp",
    link: "#",
  },
  {
    id: 7,
    title: "Aménagement Extérieur 63",
    category: "Site Vitrine",
    tech: ["HTML5", "CSS3", "JavaScript"],
    image: "screenshots/amenagement-ext.webp",
    link: "https://studio-auralis.github.io/Site-Web-Am-nagement-Ext-rieur-63-/",
  },
  {
    id: 8,
    title: "Automatisation IA",
    category: "Automation IA",
    tech: ["Python", "OpenAI", "CRM"],
    image: "screenshots/workflow.webp",
    link: "#",
  },
];

/* ============================================
   COMPOSANT CARD PROJET
   ============================================ */
function ProjectCard({ project }) {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="carousel-card"
      aria-label={`Voir le projet ${project.title}`}
    >
      {/* Image avec overlay */}
      <div className="carousel-card__image">
        <img src={project.image} alt={project.title} loading="lazy" />
        <div className="carousel-card__overlay" />
      </div>

      {/* Contenu */}
      <div className="carousel-card__content">
        <span className="carousel-card__category">{project.category}</span>
        <h3 className="carousel-card__title">{project.title}</h3>

        <div className="carousel-card__tech">
          {project.tech.map((t) => (
            <span key={t} className="carousel-card__badge">
              {t}
            </span>
          ))}
        </div>

        <span className="carousel-card__cta">
          Voir le projet
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </a>
  );
}

/* ============================================
   COMPOSANT CARROUSEL INFINI
   ============================================ */
export default function ProjectsCarousel() {
  /* Dupliquer les projets pour le seamless loop */
  const row1 = [...projects, ...projects];
  const row2 = [...projects.slice().reverse(), ...projects.slice().reverse()];

  return (
    <section className="carousel-section" aria-label="Projets réalisés">
      {/* Titre de section */}
      <div className="carousel-header">
        <span className="carousel-header__label">Portfolio</span>
        <h2 className="carousel-header__title">
          Projets <span className="carousel-header__accent">Réalisés</span>
        </h2>
        <p className="carousel-header__subtitle">
          Une sélection de projets web, IA et automatisation
        </p>
      </div>

      {/* Carrousel */}
      <div className="carousel-wrapper">
        {/* Masques latéraux */}
        <div className="carousel-mask carousel-mask--left" />
        <div className="carousel-mask carousel-mask--right" />

        {/* Ligne 1 — droite vers gauche */}
        <div className="carousel-track carousel-track--left">
          <div className="carousel-track__inner">
            {row1.map((p, i) => (
              <ProjectCard key={`r1-${p.id}-${i}`} project={p} />
            ))}
          </div>
        </div>

        {/* Ligne 2 — gauche vers droite */}
        <div className="carousel-track carousel-track--right">
          <div className="carousel-track__inner">
            {row2.map((p, i) => (
              <ProjectCard key={`r2-${p.id}-${i}`} project={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

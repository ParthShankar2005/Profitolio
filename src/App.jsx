import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import FigmaSection from './components/FigmaSection'
import FeaturedProjects from './components/FeaturedProjects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProjectManager from './components/ProjectManager'
import portfolioConfig from './config/portfolioConfig'

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'figma', label: 'Figma' },
  { id: 'featured-projects', label: 'Featured' },
  { id: 'contact', label: 'Contact' },
]

const CUSTOM_PROJECTS_STORAGE_KEY = 'portfolio-custom-featured-projects-v4'

const normalizeStoredProject = (project, index) => {
  const title = String(project?.title || '').trim()
  const link = String(project?.link || '').trim()
  if (!title || !link) {
    return null
  }

  const rawLinks = Array.isArray(project?.deployedLinks)
    ? project.deployedLinks
    : project?.deployedLink
      ? [project.deployedLink]
      : []

  const deployedLinks = [...new Set([link, ...rawLinks].filter(Boolean))]

  return {
    id: project?.id || `${Date.now()}-${index}`,
    title,
    description: String(project?.description || '').trim(),
    technologies: Array.isArray(project?.technologies) ? project.technologies : [],
    link,
    deployedLinks,
  }
}

const readStoredProjects = () => {
  try {
    const raw = localStorage.getItem(CUSTOM_PROJECTS_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.map(normalizeStoredProject).filter(Boolean)
  } catch {
    return []
  }
}

function App() {
  const [customProjects, setCustomProjects] = useState(readStoredProjects)

  useEffect(() => {
    localStorage.setItem(CUSTOM_PROJECTS_STORAGE_KEY, JSON.stringify(customProjects))
  }, [customProjects])

  const featuredProjects = useMemo(
    () => [...customProjects, ...portfolioConfig.featuredProjects],
    [customProjects],
  )

  const handleAddProject = (project) => {
    setCustomProjects((previous) => [project, ...previous.filter((item) => item.id !== project.id)])
  }

  const handleUpdateProject = (updatedProject) => {
    setCustomProjects((previous) =>
      previous.map((project) => (project.id === updatedProject.id ? updatedProject : project)),
    )
  }

  const handleDeleteProject = (projectId) => {
    setCustomProjects((previous) => previous.filter((project) => project.id !== projectId))
  }

  return (
    <div className="relative overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-70">
        <div className="absolute left-[-12rem] top-[-8rem] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute bottom-[-10rem] right-[-9rem] h-72 w-72 rounded-full bg-blue-500/20 blur-3xl sm:h-[28rem] sm:w-[28rem]" />
      </div>

      <Navbar sections={sections} name={portfolioConfig.name} />

      <main className="space-y-20 pb-16 pt-24 md:space-y-24">
        <section id="home" className="section-shell">
          <Hero name={portfolioConfig.name} role={portfolioConfig.role} intro={portfolioConfig.intro} />
        </section>

        <section id="about" className="section-shell">
          <About bio={portfolioConfig.bio} aboutSummary={portfolioConfig.aboutSummary} />
        </section>

        <section id="skills" className="section-shell">
          <Skills skills={portfolioConfig.skills} />
        </section>

        <section id="figma" className="section-shell">
          <FigmaSection
            heading={portfolioConfig.figmaSection?.heading}
            summary={portfolioConfig.figmaSection?.summary}
            projects={portfolioConfig.figmaSection?.projects}
          />
        </section>

        <section id="featured-projects" className="section-shell">
          <ProjectManager
            settings={portfolioConfig.projectManager}
            customProjects={customProjects}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
          />
          <FeaturedProjects projects={featuredProjects} />
        </section>

        <section id="contact" className="section-shell">
          <Contact
            email={portfolioConfig.email}
            linkedin={portfolioConfig.linkedin}
            github={portfolioConfig.github}
          />
        </section>
      </main>

      <Footer name={portfolioConfig.name} />
    </div>
  )
}

export default App

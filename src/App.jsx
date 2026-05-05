import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProjectManager from './components/ProjectManager'
import WorkShowcase from './components/WorkShowcase'
import portfolioConfig from './config/portfolioConfig'
import {
  deleteFeaturedProject,
  deleteFigmaProject,
  loadFeaturedProjects,
  loadFigmaProjects,
  portfolioStoreReady,
  upsertFeaturedProject,
  upsertFigmaProject,
} from './lib/portfolioStore'

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]

const normalizeFeaturedProject = (project, index) => {
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

const normalizeFigmaProject = (project, index) => {
  const title = String(project?.title || '').trim()
  const link = String(project?.link || '').trim()
  if (!title || !link) {
    return null
  }

  return {
    id: project?.id || `figma-default-${index}`,
    title,
    type: String(project?.type || 'Figma Prototype').trim(),
    description: String(project?.description || '').trim(),
    link,
    embedUrl: String(project?.embedUrl || '').trim(),
  }
}

function App() {
  const defaultFeaturedProjects = useMemo(
    () => (portfolioConfig.featuredProjects || []).map(normalizeFeaturedProject).filter(Boolean),
    [],
  )

  const defaultFigmaProjects = useMemo(
    () => (portfolioConfig.figmaSection?.projects || []).map(normalizeFigmaProject).filter(Boolean),
    [],
  )

  const [customProjects, setCustomProjects] = useState(defaultFeaturedProjects)
  const [figmaProjects, setFigmaProjects] = useState(defaultFigmaProjects)

  useEffect(() => {
    let active = true

    const loadPortfolioData = async () => {
      if (!portfolioStoreReady) {
        return
      }

      const [featuredResponse, figmaResponse] = await Promise.all([
        loadFeaturedProjects(),
        loadFigmaProjects(),
      ])

      if (!active) {
        return
      }

      if (!featuredResponse.error && featuredResponse.data.length) {
        setCustomProjects(featuredResponse.data)
      }

      if (!figmaResponse.error && figmaResponse.data.length) {
        setFigmaProjects(figmaResponse.data)
      }
    }

    loadPortfolioData()
    return () => {
      active = false
    }
  }, [])

  const featuredProjects = useMemo(() => customProjects, [customProjects])

  const handleAddProject = async (project) => {
    const { error } = await upsertFeaturedProject(project)
    if (error) {
      return { ok: false, message: 'Unable to save project.' }
    }

    setCustomProjects((previous) => [project, ...previous.filter((item) => item.id !== project.id)])
    return { ok: true, message: 'Project added successfully.' }
  }

  const handleUpdateProject = async (updatedProject) => {
    const { error } = await upsertFeaturedProject(updatedProject)
    if (error) {
      return { ok: false, message: 'Unable to update project.' }
    }

    setCustomProjects((previous) =>
      previous.map((project) => (project.id === updatedProject.id ? updatedProject : project)),
    )
    return { ok: true, message: 'Project updated successfully.' }
  }

  const handleDeleteProject = async (projectId) => {
    const { error } = await deleteFeaturedProject(projectId)
    if (error) {
      return { ok: false, message: 'Unable to delete project.' }
    }

    setCustomProjects((previous) => previous.filter((project) => project.id !== projectId))
    return { ok: true, message: 'Project deleted successfully.' }
  }

  const handleAddFigmaProject = async (project) => {
    const { error } = await upsertFigmaProject(project)
    if (error) {
      return { ok: false, message: 'Unable to save Figma project.' }
    }

    setFigmaProjects((previous) => [project, ...previous.filter((item) => item.id !== project.id)])
    return { ok: true, message: 'Figma project added successfully.' }
  }

  const handleUpdateFigmaProject = async (updatedProject) => {
    const { error } = await upsertFigmaProject(updatedProject)
    if (error) {
      return { ok: false, message: 'Unable to update Figma project.' }
    }

    setFigmaProjects((previous) =>
      previous.map((project) => (project.id === updatedProject.id ? updatedProject : project)),
    )
    return { ok: true, message: 'Figma project updated successfully.' }
  }

  const handleDeleteFigmaProject = async (projectId) => {
    const { error } = await deleteFigmaProject(projectId)
    if (error) {
      return { ok: false, message: 'Unable to delete Figma project.' }
    }

    setFigmaProjects((previous) => previous.filter((project) => project.id !== projectId))
    return { ok: true, message: 'Figma project deleted successfully.' }
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

        <section id="work" className="section-shell">
          <ProjectManager
            settings={portfolioConfig.projectManager}
            customProjects={customProjects}
            figmaProjects={figmaProjects}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onAddFigmaProject={handleAddFigmaProject}
            onUpdateFigmaProject={handleUpdateFigmaProject}
            onDeleteFigmaProject={handleDeleteFigmaProject}
          />
          <WorkShowcase
            projects={featuredProjects}
            figmaConfig={portfolioConfig.figmaSection}
            figmaProjects={figmaProjects}
          />
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

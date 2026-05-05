import { useState } from 'react'
import { motion } from 'framer-motion'
import FeaturedProjects from './FeaturedProjects'
import FigmaSection from './FigmaSection'

const SHOWCASE_MODES = [
  { id: 'project', label: 'Projects' },
  { id: 'figma', label: 'Figma' },
]

function WorkShowcase({ projects = [], figmaConfig = {}, figmaProjects = [] }) {
  const [activeMode, setActiveMode] = useState('project')
  const showingProjects = activeMode === 'project'
  const hasItems = showingProjects ? projects.length > 0 : figmaProjects.length > 0

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h2 className="section-title">Projects & Figma</h2>
          <p className="section-copy">
            Top cards are the newest work. Use the selector to switch between development projects and Figma prototypes.
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="Choose showcase type"
          className="inline-flex w-fit rounded-xl border border-white/15 bg-slate-900/70 p-1"
        >
          {SHOWCASE_MODES.map((mode) => {
            const isActive = activeMode === mode.id

            return (
              <label
                key={mode.id}
                className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-cyan-400/25 text-cyan-100' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="showcase-mode"
                  value={mode.id}
                  checked={isActive}
                  onChange={(event) => setActiveMode(event.target.value)}
                  className="sr-only"
                />
                {mode.label}
              </label>
            )
          })}
        </div>
      </motion.div>

      {!hasItems && (
        <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-6 text-slate-200">
          {showingProjects ? 'No projects available yet.' : 'No Figma projects available yet.'}
        </div>
      )}

      {showingProjects && hasItems && (
        <div className="mt-8">
          <FeaturedProjects
            projects={projects}
            showHeader={false}
          />
        </div>
      )}

      {!showingProjects && hasItems && (
        <div className="mt-8">
          <FigmaSection
            heading={figmaConfig.heading}
            summary={figmaConfig.summary}
            projects={figmaProjects}
            showHeader={false}
          />
        </div>
      )}
    </div>
  )
}

export default WorkShowcase

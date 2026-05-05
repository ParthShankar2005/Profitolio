import { motion } from 'framer-motion'

const getProjectLinks = (project) => {
  const githubLink = project?.link || ''
  const rawLiveLinks = Array.isArray(project?.deployedLinks)
    ? project.deployedLinks
    : project?.deployedLink
      ? [project.deployedLink]
      : []

  const liveLinks = [...new Set(rawLiveLinks.filter(Boolean).filter((item) => item !== githubLink))]
  return { githubLink, liveLinks }
}

function FeaturedProjects({
  projects = [],
  showHeader = true,
  heading = 'Featured Projects',
  summary = 'Highlighted projects from your custom secure project manager.',
}) {
  return (
    <div>
      {showHeader && (
        <>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            className="section-title"
          >
            {heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ delay: 0.08 }}
            className="section-copy"
          >
            {summary}
          </motion.p>
        </>
      )}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {projects.map((project, index) => {
          const { githubLink, liveLinks } = getProjectLinks(project)

          return (
            <motion.div
              key={`${project.title}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="project-flip-card project-flip-card-auto"
            >
              <div className="project-flip-card-inner">
                <article className="project-flip-face project-flip-front glass-panel flex h-full flex-col p-5">
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                  <p className="mt-3 flex-grow text-sm text-slate-300">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(project.technologies || []).map((tech) => (
                      <span
                        key={`${project.title}-${tech}`}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-blue-100"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>

                <article className="project-flip-face project-flip-back glass-panel flex h-full flex-col items-center justify-center p-5 text-center">
                  <h4 className="text-lg font-semibold text-white">{project.title}</h4>
                  <p className="mt-2 text-xs text-slate-300">Project links</p>
                  <div className="mt-4 w-full max-w-sm space-y-2 overflow-y-auto">
                    {githubLink && (
                      <a
                        href={githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-xl border border-blue-300/30 bg-blue-300/10 px-3 py-2 text-xs font-semibold text-blue-100 transition hover:bg-blue-300/20"
                      >
                        GitHub Link
                      </a>
                    )}
                    {liveLinks.map((link, linkIndex) => (
                      <a
                        key={`${project.title}-live-${linkIndex}`}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-xl border border-emerald-300/35 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-300/20"
                      >
                        Live {linkIndex + 1}
                      </a>
                    ))}
                  </div>
                </article>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default FeaturedProjects

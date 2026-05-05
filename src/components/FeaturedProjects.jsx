import { motion } from 'framer-motion'

const uniqueLinks = (project) => {
  const links = [
    ...(project?.link ? [project.link] : []),
    ...(Array.isArray(project?.deployedLinks)
      ? project.deployedLinks
      : project?.deployedLink
        ? [project.deployedLink]
        : []),
  ]

  return [...new Set(links.filter(Boolean))]
}

function FeaturedProjects({ projects }) {
  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        className="section-title"
      >
        Featured Projects
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ delay: 0.08 }}
        className="section-copy"
      >
        Highlighted projects from your custom secure project manager.
      </motion.p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {projects.map((project, index) => {
          const links = uniqueLinks(project)

          return (
            <motion.div
              key={`${project.title}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="project-flip-card h-72"
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
                    {links.map((link, linkIndex) => (
                      <a
                        key={`${project.title}-link-${linkIndex}`}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                      >
                        Link {linkIndex + 1}
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

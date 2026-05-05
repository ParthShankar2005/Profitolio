import { motion } from 'framer-motion'

function FigmaSection({ heading, summary, projects }) {
  return (
    <div>
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(projects || []).map((project, index) => (
          <motion.article
            key={`${project.title}-${index}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            className="glass-panel flex h-full flex-col p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:shadow-glow"
          >
            <p className="inline-flex w-fit rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100">
              {project.type}
            </p>
            <h3 className="mt-4 text-lg font-semibold text-white">{project.title}</h3>
            <p className="mt-3 flex-grow text-sm leading-relaxed text-slate-300">{project.description}</p>
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              Open Figma File
            </a>
          </motion.article>
        ))}
      </div>
    </div>
  )
}

export default FigmaSection

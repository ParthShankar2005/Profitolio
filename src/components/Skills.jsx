import { motion } from 'framer-motion'

function Skills({ skills }) {
  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        className="section-title"
      >
        Skills
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.1 }}
        className="section-copy"
      >
        A focused stack for building clean interfaces, intuitive interactions, and scalable frontend systems.
      </motion.p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((skill, index) => (
          <motion.div
            key={skill}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            className="glass-panel flex h-full items-center justify-between gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/45 hover:shadow-glow"
          >
            <span className="font-medium text-white">{skill}</span>
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Skills

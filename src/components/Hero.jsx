import { motion } from 'framer-motion'

function Hero({ name, role, intro }) {
  const heroStats = [
    { label: 'Focus', value: 'UI + Frontend' },
    { label: 'Approach', value: 'Design to Code' },
    { label: 'Delivery', value: 'Responsive First' },
  ]

  return (
    <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1 text-sm font-medium text-cyan-100">
          Available for freelance and full-time roles
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          {name}
        </h1>
        <p className="mt-3 text-lg text-blue-100/90 sm:text-xl">{role}</p>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">{intro}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#featured-projects"
            className="rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 hover:shadow-glow"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
          >
            Contact Me
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="glass-panel grid gap-4 p-6 sm:p-7"
      >
        {heroStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/10 bg-slate-900/60 p-4 transition hover:border-blue-300/40 hover:shadow-glow"
          >
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
            <p className="mt-2 text-xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default Hero

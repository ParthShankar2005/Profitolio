import { motion } from 'framer-motion'

function About({ bio, aboutSummary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6 }}
      className="glass-panel p-8 sm:p-10"
    >
      <h2 className="section-title">About</h2>
      <p className="section-copy">{bio}</p>
      <p className="mt-5 max-w-3xl text-slate-300">{aboutSummary}</p>
    </motion.div>
  )
}

export default About

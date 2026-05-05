import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function Navbar({ sections, name }) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? 'home')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const targets = sections.map((section) => document.getElementById(section.id)).filter(Boolean)
    if (!targets.length) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: 0.01 },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [sections])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const linkClass = (sectionId) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
      activeSection === sectionId
        ? 'bg-blue-400/20 text-blue-100 shadow-glow'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`

  return (
    <motion.header
      initial={{ y: -36, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl"
    >
      <div className="section-shell">
        <div className="flex h-20 items-center justify-between">
          <a href="#home" className="font-display text-lg font-semibold tracking-tight text-white">
            {name}
          </a>

          <nav className="hidden items-center gap-2 md:flex">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className={linkClass(section.id)}>
                {section.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex rounded-xl border border-white/20 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 md:hidden"
            aria-label="Toggle navigation"
          >
            Menu
          </button>
        </div>

        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2 pb-4 md:hidden"
          >
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setIsOpen(false)}
                className={linkClass(section.id)}
              >
                {section.label}
              </a>
            ))}
          </motion.nav>
        )}
      </div>
    </motion.header>
  )
}

export default Navbar

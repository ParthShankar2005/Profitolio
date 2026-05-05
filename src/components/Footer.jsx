function Footer({ name }) {
  return (
    <footer className="section-shell border-t border-white/10 pb-10 pt-8">
      <p className="text-center text-sm text-slate-400">
        © {new Date().getFullYear()} {name}. Crafted with React, Tailwind CSS, and Framer Motion.
      </p>
    </footer>
  )
}

export default Footer

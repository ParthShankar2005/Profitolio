import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, supabaseConfigReady } from '../lib/supabaseClient'

const CONTACT_TABLE = 'contact_messages'

function Contact({ email, linkedin, github }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState({
    type: '',
    message: '',
  })

  const contacts = [
    { label: 'Email', value: email, href: `mailto:${email}` },
    { label: 'LinkedIn', value: linkedin, href: linkedin },
    { label: 'GitHub', value: github, href: github },
  ]

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!supabaseConfigReady || !supabase) {
      setStatus({
        type: 'error',
        message: 'Unable to send message right now.',
      })
      return
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
      created_at: new Date().toISOString(),
    }

    if (!payload.name || !payload.email || !payload.message) {
      setStatus({
        type: 'error',
        message: 'Please fill out all fields before submitting.',
      })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    const { error } = await supabase.from(CONTACT_TABLE).insert([payload])

    if (error) {
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again.',
      })
      setIsSubmitting(false)
      return
    }

    setFormData({
      name: '',
      email: '',
      message: '',
    })
    setStatus({
      type: 'success',
      message: 'Message sent successfully.',
    })
    setIsSubmitting(false)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        className="glass-panel p-8"
      >
        <h2 className="section-title">Contact</h2>
        <p className="section-copy">
          Let&apos;s collaborate on modern, high-impact products. Reach out directly or use the form.
        </p>

        <div className="mt-7 space-y-3">
          {contacts.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.label === 'Email' ? undefined : '_blank'}
              rel={item.label === 'Email' ? undefined : 'noreferrer'}
              className="glass-panel block rounded-xl p-4 transition hover:border-blue-300/40 hover:shadow-glow"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
              <p className="mt-1 break-all text-sm font-medium text-white">{item.value}</p>
            </a>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ delay: 0.08 }}
        className="glass-panel p-8"
      >
        <h3 className="font-display text-2xl font-semibold text-white">Contact Form</h3>
        <p className="mt-2 text-sm text-slate-300">Connected with backend.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="mb-2 block text-sm text-slate-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border border-white/20 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/70 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border border-white/20 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/70 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm text-slate-300">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border border-white/20 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/70 focus:outline-none"
            />
          </div>

          {status.message && (
            <p
              className={`text-sm ${
                status.type === 'error' ? 'text-rose-300' : 'text-emerald-300'
              }`}
            >
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 hover:shadow-glow"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default Contact

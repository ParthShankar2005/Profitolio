import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

const decodeBase32 = (base32Value) => {
  const clean = base32Value.toUpperCase().replace(/[^A-Z2-7]/g, '')
  if (!clean) {
    return null
  }

  let bits = ''
  for (const char of clean) {
    const index = BASE32_ALPHABET.indexOf(char)
    if (index < 0) {
      return null
    }
    bits += index.toString(2).padStart(5, '0')
  }

  const bytes = []
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(Number.parseInt(bits.slice(i, i + 8), 2))
  }

  return new Uint8Array(bytes)
}

const createCounterBytes = (counter) => {
  const bytes = new Uint8Array(8)
  let value = counter

  for (let i = 7; i >= 0; i -= 1) {
    bytes[i] = value & 255
    value = Math.floor(value / 256)
  }

  return bytes
}

const generateTotpCode = async (secret, timestamp, digits) => {
  const secretBytes = decodeBase32(secret)
  if (!secretBytes || !secretBytes.length) {
    return null
  }

  const counter = Math.floor(timestamp / 1000 / 30)
  const counterBytes = createCounterBytes(counter)

  const key = await crypto.subtle.importKey(
    'raw',
    secretBytes,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, counterBytes)
  const hash = new Uint8Array(signature)

  const offset = hash[hash.length - 1] & 0x0f
  const binary =
    ((hash[offset] & 0x7f) << 24) |
    (hash[offset + 1] << 16) |
    (hash[offset + 2] << 8) |
    hash[offset + 3]
  const code = binary % 10 ** digits

  return String(code).padStart(digits, '0')
}

const verifyTotpCode = async (secret, enteredCode, digits) => {
  const now = Date.now()
  const validCodes = await Promise.all([
    generateTotpCode(secret, now - 30_000, digits),
    generateTotpCode(secret, now, digits),
    generateTotpCode(secret, now + 30_000, digits),
  ])

  return validCodes.some((code) => code === enteredCode)
}

const normalizeUrl = (value) => {
  const clean = value.trim()
  if (!clean) {
    return ''
  }
  return /^https?:\/\//i.test(clean) ? clean : `https://${clean}`
}

const parseLinksText = (value) =>
  value
    .split(/\s+/)
    .map((item) => normalizeUrl(item))
    .filter(Boolean)

const emptyForm = {
  title: '',
  description: '',
  technologies: '',
  link: '',
  deployedLinksText: '',
}

function ProjectManager({ settings, customProjects = [], onAddProject, onUpdateProject, onDeleteProject }) {
  const [otpCode, setOtpCode] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [authError, setAuthError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [editingProjectId, setEditingProjectId] = useState('')
  const [formData, setFormData] = useState(emptyForm)

  const secret = settings?.totpSecret ?? ''
  const otpDigits = settings?.otpDigits ?? 6

  const isSecretConfigured = useMemo(() => {
    const normalized = secret.toUpperCase().replace(/[^A-Z2-7]/g, '')
    return normalized.length >= 16
  }, [secret])

  const unlockManager = async () => {
    if (!isSecretConfigured) {
      setAuthError('Authentication is not configured.')
      return
    }

    const cleanedCode = otpCode.trim()
    if (!/^\d{6}$/.test(cleanedCode)) {
      setAuthError('Enter a valid 6-digit code.')
      return
    }

    setUnlocking(true)
    setAuthError('')
    setStatusMessage('')

    try {
      const isValid = await verifyTotpCode(secret, cleanedCode, otpDigits)
      if (!isValid) {
        setAuthError('Invalid or expired code.')
        return
      }
      setIsUnlocked(true)
    } catch {
      setAuthError('Unable to validate code right now.')
    } finally {
      setUnlocking(false)
    }
  }

  const updateField = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingProjectId('')
  }

  const startEditProject = (project) => {
    const allProjectLinks = Array.isArray(project.deployedLinks) ? project.deployedLinks : []
    const extraLinks = allProjectLinks.filter((item) => item !== project.link)

    setEditingProjectId(project.id)
    setFormData({
      title: project.title || '',
      description: project.description || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      link: project.link || '',
      deployedLinksText: extraLinks.join(' '),
    })
    setStatusMessage('')
  }

  const submitProject = (event) => {
    event.preventDefault()

    const title = formData.title.trim()
    const description = formData.description.trim()
    const sourceLink = normalizeUrl(formData.link)
    const extraLinks = parseLinksText(formData.deployedLinksText)
    const technologies = formData.technologies
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    if (!title || !sourceLink) {
      setStatusMessage('Title and source project link are required.')
      return
    }

    const deployedLinks = [...new Set([sourceLink, ...extraLinks])]
    const project = {
      id: editingProjectId || `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      description: description || 'Project added from secure manager.',
      technologies: technologies.length ? technologies : ['General'],
      link: sourceLink,
      deployedLinks,
    }

    if (editingProjectId) {
      onUpdateProject(project)
      setStatusMessage('Project updated successfully.')
    } else {
      onAddProject(project)
      setStatusMessage('Project added successfully.')
    }

    resetForm()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="glass-panel mb-8 p-6 sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xl font-semibold text-white">Add Project (Secure)</h3>
      </div>

      <p className="mt-3 text-sm text-slate-300">Enter your 6-digit code to manage projects.</p>

      {!isUnlocked && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otpCode}
            onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6-digit code"
            className="w-full rounded-xl border border-white/20 bg-slate-900/80 px-4 py-3 text-sm tracking-[0.2em] text-white placeholder:tracking-normal placeholder:text-slate-500 focus:border-cyan-300/70 focus:outline-none sm:max-w-xs"
          />
          <button
            type="button"
            onClick={unlockManager}
            disabled={unlocking}
            className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-70"
          >
            {unlocking ? 'Verifying...' : 'Verify Code'}
          </button>
        </div>
      )}

      {authError && <p className="mt-3 text-sm text-rose-300">{authError}</p>}

      {isUnlocked && (
        <>
          {customProjects.length > 0 && (
            <div className="mt-5 rounded-xl border border-white/10 bg-slate-900/40 p-4">
              <p className="text-sm font-semibold text-white">Manage Added Projects</p>
              <div className="mt-3 space-y-2">
                {customProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-slate-900/60 p-3"
                  >
                    <p className="text-sm text-slate-200">{project.title}</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditProject(project)}
                        className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteProject(project.id)}
                        className="rounded-lg border border-rose-300/30 bg-rose-300/10 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-300/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={submitProject} className="mt-5 grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={updateField}
              placeholder="Project title"
              className="rounded-xl border border-white/20 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/70 focus:outline-none"
            />
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={updateField}
              placeholder="Source project link"
              className="rounded-xl border border-white/20 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/70 focus:outline-none"
            />
            <textarea
              name="deployedLinksText"
              rows="3"
              value={formData.deployedLinksText}
              onChange={updateField}
              placeholder="Deployed links (separate multiple links with spaces)"
              className="rounded-xl border border-white/20 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/70 focus:outline-none sm:col-span-2"
            />
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={updateField}
              placeholder="React, Tailwind, Node.js"
              className="rounded-xl border border-white/20 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/70 focus:outline-none sm:col-span-2"
            />
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={updateField}
              placeholder="Project description"
              className="rounded-xl border border-white/20 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/70 focus:outline-none sm:col-span-2"
            />
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                {editingProjectId ? 'Update Project' : 'Add Project'}
              </button>
              {editingProjectId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </>
      )}

      {statusMessage && <p className="mt-3 text-sm text-cyan-200">{statusMessage}</p>}
    </motion.div>
  )
}

export default ProjectManager

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))

const normalizeUrl = (value) => {
  if (!value) {
    return ''
  }

  const clean = value.trim()
  if (!clean) {
    return ''
  }

  return /^https?:\/\//i.test(clean) ? clean : `https://${clean}`
}

const resolveDeploymentUrl = (repo, githubUsername) => {
  const homepage = normalizeUrl(repo.homepage)
  if (homepage) {
    return homepage
  }

  if (repo.has_pages && githubUsername) {
    return `https://${githubUsername}.github.io/${repo.name}/`
  }

  return repo.html_url
}

function GithubProjects({ githubUsername, githubUrl }) {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('All')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchRepos() {
      if (!githubUsername || githubUsername === 'YOUR_GITHUB_USERNAME') {
        setRepos([])
        setLoading(false)
        setError('Set your GitHub username in portfolio config to load repositories.')
        return
      }

      setLoading(true)
      setError('')

      try {
        const endpoint = `https://api.github.com/users/${githubUsername}/repos?sort=updated`
        const response = await fetch(endpoint, {
          signal: controller.signal,
          headers: {
            Accept: 'application/vnd.github+json',
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('GitHub user not found. Please check the username in config.')
          }
          throw new Error('Unable to fetch repositories right now. Please try again later.')
        }

        const data = await response.json()
        const cleanRepos = data
          .filter((repo) => !repo.fork)
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .map((repo) => ({
            ...repo,
            deploymentUrl: resolveDeploymentUrl(repo, githubUsername),
          }))

        setRepos(cleanRepos)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Failed to load repositories.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
    return () => controller.abort()
  }, [githubUsername])

  const languages = useMemo(() => {
    const unique = [...new Set(repos.map((repo) => repo.language).filter(Boolean))]
    return ['All', ...unique.sort((a, b) => a.localeCompare(b))]
  }, [repos])

  const activeLanguage = languages.includes(selectedLanguage) ? selectedLanguage : 'All'

  const filteredRepos = useMemo(() => {
    if (activeLanguage === 'All') {
      return repos
    }
    return repos.filter((repo) => repo.language === activeLanguage)
  }, [activeLanguage, repos])

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h2 className="section-title">GitHub Projects</h2>
          <p className="section-copy">
            Live repository feed sorted by latest updates and filtered to hide forked projects.
          </p>
        </div>

        <label className="text-sm text-slate-300">
          Language:
          <select
            value={activeLanguage}
            onChange={(event) => setSelectedLanguage(event.target.value)}
            className="ml-2 rounded-lg border border-white/20 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-cyan-300/70 focus:outline-none"
          >
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </label>
      </motion.div>

      {loading && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="glass-panel h-72 animate-pulse p-5">
              <div className="h-4 w-2/3 rounded bg-white/20" />
              <div className="mt-4 h-3 w-full rounded bg-white/10" />
              <div className="mt-2 h-3 w-4/5 rounded bg-white/10" />
              <div className="mt-6 grid grid-cols-2 gap-2">
                <div className="h-14 rounded-lg bg-white/10" />
                <div className="h-14 rounded-lg bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="mt-8 rounded-2xl border border-rose-300/30 bg-rose-300/10 p-6 text-rose-100">
          <p className="text-sm sm:text-base">{error}</p>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex text-sm font-semibold text-rose-100 underline underline-offset-4"
          >
            Open GitHub Profile
          </a>
        </div>
      )}

      {!loading && !error && filteredRepos.length === 0 && (
        <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-6 text-slate-200">
          No repositories matched the selected filter.
        </div>
      )}

      {!loading && !error && filteredRepos.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredRepos.map((repo, index) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="project-flip-card h-72"
            >
              <div className="project-flip-card-inner">
                <article className="project-flip-face project-flip-front glass-panel flex h-full flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-white">{repo.name}</h3>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-slate-200">
                      ★ {repo.stargazers_count}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-300">
                    {repo.description || 'No description provided for this repository.'}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-white/10 bg-slate-900/70 p-2">
                      <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Language</p>
                      <p className="mt-1 text-xs font-semibold text-cyan-100">
                        {repo.language || 'Not Specified'}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-slate-900/70 p-2">
                      <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Updated</p>
                      <p className="mt-1 text-xs font-semibold text-slate-200">{formatDate(repo.updated_at)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {repo.deploymentUrl && (
                      <a
                        href={repo.deploymentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-lg bg-emerald-400/20 px-2.5 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-400/30"
                      >
                        Deployed Project
                      </a>
                    )}
                    {repo.deploymentUrl !== repo.html_url && (
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-lg border border-blue-300/35 bg-blue-300/10 px-2.5 py-1.5 text-xs font-semibold text-blue-100 transition hover:bg-blue-300/20"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </article>

                <article className="project-flip-face project-flip-back glass-panel flex h-full flex-col items-center justify-center p-4 text-center">
                  <h4 className="text-lg font-semibold text-white">{repo.name}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    {repo.description || 'No description provided for this repository.'}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    {repo.deploymentUrl && (
                      <a
                        href={repo.deploymentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-xl bg-emerald-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-300"
                      >
                        Open Deployed Project
                      </a>
                    )}
                    {repo.deploymentUrl !== repo.html_url && (
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                      >
                        Open GitHub
                      </a>
                    )}
                  </div>
                </article>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GithubProjects

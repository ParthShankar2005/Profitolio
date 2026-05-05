import { motion } from 'framer-motion'

const FIGMA_EMBED_HOST = 'parth-portfolio'

const isFigmaUrl = (url) => /(^|\.)figma\.com$/i.test(url.hostname)

const normalizeLegacyEmbedUrl = (url) => {
  if (url.pathname !== '/embed') {
    return url
  }

  const nestedUrl = url.searchParams.get('url')
  if (!nestedUrl) {
    return url
  }

  try {
    return new URL(decodeURIComponent(nestedUrl))
  } catch {
    return url
  }
}

const applyCommonEmbedParameters = (url) => {
  url.searchParams.set('embed-host', FIGMA_EMBED_HOST)
  url.searchParams.delete('embed_host')
  url.searchParams.set('footer', 'false')
  url.searchParams.set('viewport-controls', 'true')
}

const optimizePrototypeEmbed = (url) => {
  url.searchParams.set('show-proto-sidebar', 'false')
  url.searchParams.set('hotspot-hints', 'false')
  url.searchParams.set('device-frame', 'false')
  url.searchParams.set('scaling', 'scale-down-width')
  url.searchParams.set('content-scaling', 'fixed')
}

const optimizeFileEmbed = (url) => {
  url.searchParams.set('page-selector', 'false')
}

const resolvePreviewScale = (project) => {
  const parsed = Number(project?.previewScale)
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed
  }

  return 1.28
}

const getOptimizedEmbedUrl = (rawUrl, fallbackUrl = '') => {
  const input = rawUrl || fallbackUrl
  if (!input) {
    return ''
  }

  try {
    const parsedUrl = new URL(input)
    const normalizedSource = normalizeLegacyEmbedUrl(parsedUrl)

    if (!isFigmaUrl(normalizedSource)) {
      return input
    }

    const url = new URL(normalizedSource.toString())
    url.hostname = 'embed.figma.com'
    applyCommonEmbedParameters(url)

    if (url.pathname.startsWith('/proto/')) {
      optimizePrototypeEmbed(url)
    } else {
      optimizeFileEmbed(url)
    }

    return url.toString()
  } catch {
    return input
  }
}

function FigmaSection({
  heading = 'Figma Design Work',
  summary = 'This section showcases my interface design process, prototypes, and design systems built in Figma.',
  projects = [],
  showHeader = true,
}) {
  return (
    <div>
      {showHeader && (
        <>
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
        </>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {projects.map((project, index) => {
          const embedSrc = getOptimizedEmbedUrl(project.embedUrl, project.link)
          const previewScale = resolvePreviewScale(project)

          return (
            <motion.article
              key={`${project.title}-${index}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="rounded-2xl border border-white/10 bg-slate-900/85 p-5 shadow-glass transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:shadow-glow"
            >
              {embedSrc && (
                <div className="relative mb-4 h-[350px] overflow-hidden rounded-xl border border-white/15 bg-slate-900 sm:h-[390px] lg:h-[430px]">
                  <iframe
                    title={`${project.title} prototype preview`}
                    src={embedSrc}
                    className="absolute left-1/2 top-1/2 h-full w-full max-w-none"
                    style={{
                      border: 0,
                      transform: `translate(-50%, -50%) scale(${previewScale})`,
                      transformOrigin: 'center center',
                    }}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              )}
              <p className="inline-flex w-fit rounded-full border border-cyan-300/35 bg-slate-950/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100">
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
          )
        })}
      </div>
    </div>
  )
}

export default FigmaSection

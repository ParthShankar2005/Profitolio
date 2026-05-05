import { supabase, supabaseConfigReady } from './supabaseClient'

const FEATURED_PROJECTS_TABLE = 'featured_projects'
const FIGMA_PROJECTS_TABLE = 'figma_projects'

const normalizeTextArray = (value) =>
  Array.isArray(value)
    ? value
        .map((item) => String(item || '').trim())
        .filter(Boolean)
    : []

export const portfolioStoreReady = Boolean(supabaseConfigReady && supabase)

export const loadFeaturedProjects = async () => {
  if (!portfolioStoreReady) {
    return { data: [], error: 'Supabase is not configured.' }
  }

  const { data, error } = await supabase
    .from(FEATURED_PROJECTS_TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { data: [], error: error.message || 'Unable to load featured projects.' }
  }

  return {
    data: (data || []).map((row, index) => ({
      id: row.id || `featured-${Date.now()}-${index}`,
      title: row.title || '',
      description: row.description || '',
      technologies: normalizeTextArray(row.technologies),
      link: row.github_link || '',
      deployedLinks: [...new Set([row.github_link, ...normalizeTextArray(row.deployed_links)].filter(Boolean))],
    })),
    error: '',
  }
}

export const upsertFeaturedProject = async (project) => {
  if (!portfolioStoreReady) {
    return { error: 'Supabase is not configured.' }
  }

  const payload = {
    id: project.id,
    title: project.title,
    description: project.description,
    technologies: normalizeTextArray(project.technologies),
    github_link: project.link,
    deployed_links: normalizeTextArray(project.deployedLinks),
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from(FEATURED_PROJECTS_TABLE).upsert(payload, { onConflict: 'id' })
  return { error: error?.message || '' }
}

export const deleteFeaturedProject = async (projectId) => {
  if (!portfolioStoreReady) {
    return { error: 'Supabase is not configured.' }
  }

  const { error } = await supabase.from(FEATURED_PROJECTS_TABLE).delete().eq('id', projectId)
  return { error: error?.message || '' }
}

export const loadFigmaProjects = async () => {
  if (!portfolioStoreReady) {
    return { data: [], error: 'Supabase is not configured.' }
  }

  const { data, error } = await supabase
    .from(FIGMA_PROJECTS_TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { data: [], error: error.message || 'Unable to load Figma projects.' }
  }

  return {
    data: (data || []).map((row, index) => ({
      id: row.id || `figma-${Date.now()}-${index}`,
      title: row.title || '',
      type: row.type || 'Figma Prototype',
      description: row.description || '',
      link: row.link || '',
      embedUrl: row.embed_url || '',
    })),
    error: '',
  }
}

export const upsertFigmaProject = async (project) => {
  if (!portfolioStoreReady) {
    return { error: 'Supabase is not configured.' }
  }

  const payload = {
    id: project.id,
    title: project.title,
    type: project.type || 'Figma Prototype',
    description: project.description || '',
    link: project.link,
    embed_url: project.embedUrl || '',
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from(FIGMA_PROJECTS_TABLE).upsert(payload, { onConflict: 'id' })
  return { error: error?.message || '' }
}

export const deleteFigmaProject = async (projectId) => {
  if (!portfolioStoreReady) {
    return { error: 'Supabase is not configured.' }
  }

  const { error } = await supabase.from(FIGMA_PROJECTS_TABLE).delete().eq('id', projectId)
  return { error: error?.message || '' }
}


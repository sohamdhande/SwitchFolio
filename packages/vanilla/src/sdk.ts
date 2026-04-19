interface LoadOptions {
  apiKey: string
  username: string
  viewSlug: string
  baseUrl?: string
}

interface SwitchfolioProject {
  id: string
  title: string
  description: string
  techStack: string[]
  repoUrl: string | null
  liveUrl: string | null
  imageUrl: string | null
  createdAt: string
}

interface LoadResult {
  projects: SwitchfolioProject[]
}

const Switchfolio = {
  load: async (options: LoadOptions): Promise<LoadResult> => {
    const {
      apiKey,
      username,
      viewSlug,
      baseUrl = "https://switchfolio.app",
    } = options
    const url = `${baseUrl}/api/v1/projects?user=${encodeURIComponent(username)}&view=${encodeURIComponent(viewSlug)}`
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error ?? `HTTP ${response.status}`)
    }
    const projects: SwitchfolioProject[] = await response.json()
    return { projects }
  },
}

export default Switchfolio
export { Switchfolio }
export type { LoadOptions, SwitchfolioProject, LoadResult }

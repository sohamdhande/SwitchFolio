export interface SwitchfolioProject {
  id: string
  title: string
  description: string
  techStack: string[]
  repoUrl: string | null
  liveUrl: string | null
  imageUrl: string | null
  createdAt: string
}

export interface SwitchfolioOptions {
  apiKey: string
  username: string
  viewSlug: string
  baseUrl?: string
}

export interface SwitchfolioResult {
  data: SwitchfolioProject[]
  loading: boolean
  error: string | null
  refetch: () => void
}

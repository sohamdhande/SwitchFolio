export type Project = {
  id: string
  userId: string
  title: string
  description: string
  techStack: string[]
  repoUrl: string | null
  liveUrl: string | null
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export type ProjectFormData = {
  title: string
  description: string
  techStack: string[]
  repoUrl?: string | null
  liveUrl?: string | null
  imageUrl?: string | null
}

export type View = {
  id: string
  userId: string
  slug: string
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
  _count?: { projects: number }
}

export type ViewFormData = {
  name: string
  description: string
  slug: string
}

export type ViewProject = Project & {
  isVisible: boolean
  lexoRank: string
}

export type ApiKey = {
  id: string
  name: string
  prefix: string
  lastUsedAt: Date | null
  createdAt: Date
}



interface SwitchfolioProject {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    repoUrl: string | null;
    liveUrl: string | null;
    imageUrl: string | null;
    createdAt: string;
}
interface SwitchfolioOptions {
    apiKey: string;
    username: string;
    viewSlug: string;
    baseUrl?: string;
}
interface SwitchfolioResult {
    data: SwitchfolioProject[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

declare function useSwitchfolio(options: SwitchfolioOptions): SwitchfolioResult;

export { type SwitchfolioOptions, type SwitchfolioProject, type SwitchfolioResult, useSwitchfolio };

interface LoadOptions {
    apiKey: string;
    username: string;
    viewSlug: string;
    baseUrl?: string;
}
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
interface LoadResult {
    projects: SwitchfolioProject[];
}
declare const Switchfolio: {
    load: (options: LoadOptions) => Promise<LoadResult>;
};

export { type LoadOptions, type LoadResult, Switchfolio, type SwitchfolioProject, Switchfolio as default };

import { Info, Rocket, Bot, FolderOpen, LayoutGrid, Settings2, Key, Code2, FileCode2, Globe, HelpCircle } from "lucide-react";
import { TableOfContents } from "@/components/guide/TableOfContents";
import { CodeBlock } from "@/components/guide/CodeBlock";
import { SectionFeedback } from "@/components/guide/SectionFeedback";
import { BackToTop } from "@/components/guide/BackToTop";

const sections = [
  { id: "what-is-switchfolio", title: "1. What is Switchfolio" },
  { id: "quick-start", title: "2. Quick Start" },
  { id: "agentic-setup", title: "3. Agentic Setup" },
  { id: "managing-projects", title: "4. Managing Projects" },
  { id: "understanding-views", title: "5. Understanding Views" },
  { id: "the-view-manager", title: "6. The View Manager" },
  { id: "api-keys", title: "7. API Keys" },
  { id: "sdk-react", title: "8. SDK Integration — React" },
  { id: "sdk-vanilla", title: "9. SDK Integration — Vanilla JS" },
  { id: "public-api", title: "10. Public API Reference" },
  { id: "faq", title: "11. FAQ" },
];

export default function GuidePage() {
  return (
    <div className="flex flex-col md:flex-row gap-10 md:gap-16">
      {/* Sidebar TOC */}
      <TableOfContents sections={sections} />

      {/* Main Content Area */}
      <div className="flex-1 max-w-3xl prose prose-gray dark:prose-invert prose-headings:scroll-mt-28 pb-32">
        {/* HERO */}
        <div className="not-prose mb-16 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Switchfolio Documentation
          </h1>
          <p className="text-lg text-gray-500 dark:text-zinc-400 leading-relaxed">
            Everything you need to manage your portfolio, create views, and integrate with your frontend.
          </p>
        </div>

        {/* SECTION 1 */}
        <section id="what-is-switchfolio" className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <Info className="h-6 w-6 text-primary shrink-0" />
            <h2 className="text-2xl font-bold m-0">1. What is Switchfolio</h2>
          </div>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-6">~1 min read</p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Switchfolio is a headless portfolio CMS tailored specifically for developers. Instead of tightly coupling your projects to your frontend code, you build your portfolio&apos;s master list once. Switchfolio then manages the data via views and an API.
          </p>
          <div className="mt-4 p-4 bg-gray-100 dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800">
            <p className="font-medium text-gray-900 dark:text-zinc-100 m-0">
              We never touch your design. We are purely the data layer.
            </p>
          </div>
          <SectionFeedback />
        </section>

        {/* SECTION 2 */}
        <section id="quick-start" className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="h-6 w-6 text-primary shrink-0" />
            <h2 className="text-2xl font-bold m-0">2. Quick Start</h2>
          </div>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-6">~2 min read</p>
          <ol className="space-y-4 list-decimal pl-5 text-gray-700 dark:text-gray-300">
            <li><strong>Sign up</strong> at switchfolio.app to create your account.</li>
            <li><strong>Add your projects</strong> (title, description, tech stack, links) in the master Projects tab.</li>
            <li><strong>Create a View</strong> for a specific audience (e.g. &quot;Frontend Interviews&quot;).</li>
            <li><strong>Toggle visibility</strong> and drag to reorder projects specifically for that view.</li>
            <li><strong>Generate an API key</strong>, install the SDK in your frontend, and fetch your tailored portfolio instantly!</li>
          </ol>
          <SectionFeedback />
        </section>

        {/* SECTION 3 — Agentic Setup (visually distinct) */}
        <section id="agentic-setup" className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <Bot className="h-6 w-6 text-amber-500 shrink-0" />
            <h2 className="text-2xl font-bold m-0">3. Agentic Setup</h2>
          </div>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-6">~1 min read</p>
          <div className="bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-300 dark:border-amber-500/30 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-amber-800 dark:text-amber-400 m-0 mb-2">Fastest Setup — Use an AI Coding Agent</h3>
            <p className="text-amber-700 dark:text-amber-300/80 mb-6 m-0 mt-2">
              Skip the manual steps. Paste this prompt into Cursor, Windsurf, or any agentic IDE and it will integrate Switchfolio into your portfolio automatically.
            </p>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-4">
              Note: Replace MY_USERNAME and MY_VIEW_SLUG with your actual values from the Switchfolio dashboard.
            </p>
            
            <CodeBlock code={`Integrate Switchfolio into this portfolio project.

1. Install the SDK:
   npm install @switchfolio/react

2. Add to .env.local:
   NEXT_PUBLIC_SWITCHFOLIO_KEY=sk_live_xxxx
   (I will provide the actual key)

3. Find where projects are currently rendered in this codebase.
   Replace the static/hardcoded project data with the useSwitchfolio hook:

   import { useSwitchfolio } from '@switchfolio/react'

   const { data, loading, error } = useSwitchfolio({
     apiKey: process.env.NEXT_PUBLIC_SWITCHFOLIO_KEY!,
     username: 'MY_USERNAME',
     viewSlug: 'MY_VIEW_SLUG',
     baseUrl: 'https://switchfolio.app'
   })

4. Map over data using the existing project card component — 
   do not change the design, only replace the data source.

5. Add a loading state that matches the existing skeleton/spinner style.

6. Add an error state that fails silently (console.error only, 
   show existing projects or empty state).

The Switchfolio project data shape is:
{
  id: string
  title: string
  description: string
  techStack: string[]
  repoUrl: string | null
  liveUrl: string | null
  imageUrl: string | null
  createdAt: string
}

Do not change any styling, layout, or other parts of the codebase.
Only replace the data source for the projects section.`} />
          </div>
          <SectionFeedback />
        </section>

        {/* SECTION 4 */}
        <section id="managing-projects" className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="h-6 w-6 text-primary shrink-0" />
            <h2 className="text-2xl font-bold m-0">4. Managing Projects</h2>
          </div>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-6">~2 min read</p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The <strong>Projects</strong> tab is your master repository. Adding a project here makes it available across all your views.
          </p>
          <ul className="space-y-2 list-disc pl-5 text-gray-700 dark:text-gray-300">
            <li><strong>Fields:</strong> You can define the title, a rich description, repository links, and live demo links.</li>
            <li><strong>Tech Stack:</strong> Enter comma-separated values (e.g., &quot;React, Node, Tailwind&quot;). These are returned as an array and can be easily rendered as badges on your frontend.</li>
            <li><strong>Editing/Deleting:</strong> Click on any project card to edit it. Deleting a project removes it entirely from your account and all associated views.</li>
          </ul>
          <SectionFeedback />
        </section>

        {/* SECTION 5 */}
        <section id="understanding-views" className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <LayoutGrid className="h-6 w-6 text-primary shrink-0" />
            <h2 className="text-2xl font-bold m-0">5. Understanding Views</h2>
          </div>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-6">~2 min read</p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            A <strong>View</strong> is a specific lens into your master project list. It allows you to tailor what a specific employer, client, or audience sees without duplicating data.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <em>Example:</em> You might have a &quot;Frontend Interviews&quot; view and an &quot;ML Roles&quot; view. A project named &quot;React Dashboard&quot; can be ranked #1 in the Frontend view, but completely hidden in the ML view.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Every view generates a unique <strong>slug</strong> (e.g., <code>frontend-interviews</code>) which you will use in the API to fetch that specific configuration.
          </p>
          <SectionFeedback />
        </section>

        {/* SECTION 6 */}
        <section id="the-view-manager" className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <Settings2 className="h-6 w-6 text-primary shrink-0" />
            <h2 className="text-2xl font-bold m-0">6. The View Manager</h2>
          </div>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-6">~2 min read</p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Clicking into a view opens the View Manager. Here, projects are split into two sections: <strong>Visible</strong> and <strong>Hidden</strong>.
          </p>
          <ul className="space-y-2 list-disc pl-5 text-gray-700 dark:text-gray-300">
            <li><strong>Toggling:</strong> Click the eye icon to move a project between visible and hidden states.</li>
            <li><strong>Reordering:</strong> Click and drag the handle on any visible project to change its rank. Switchfolio uses an advanced LexoRank algorithm to ensure ordering is blazing fast.</li>
            <li><strong>Instant Updates:</strong> Any change you make in the View Manager is immediately reflected on your live portfolio. No redeployments needed!</li>
          </ul>
          <SectionFeedback />
        </section>

        {/* SECTION 7 */}
        <section id="api-keys" className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <Key className="h-6 w-6 text-primary shrink-0" />
            <h2 className="text-2xl font-bold m-0">7. API Keys</h2>
          </div>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-6">~1 min read</p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            API keys allow your frontend application to securely read your portfolio data. Navigate to <strong>Settings</strong> to manage them.
          </p>
          <ul className="space-y-2 list-disc pl-5 text-gray-700 dark:text-gray-300">
            <li><strong>One-time Reveal:</strong> When you generate a new key, copy it immediately. For security reasons, it will never be shown again.</li>
            <li><strong>Storage:</strong> Store your API key safely in your frontend&apos;s environment variables (e.g., <code>.env.local</code> as <code>NEXT_PUBLIC_SWITCHFOLIO_KEY</code>).</li>
            <li><strong>Revocation:</strong> If a key is compromised, you can delete it instantly from the dashboard to cut off access.</li>
          </ul>
          <SectionFeedback />
        </section>

        {/* SECTION 8 */}
        <section id="sdk-react" className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <Code2 className="h-6 w-6 text-primary shrink-0" />
            <h2 className="text-2xl font-bold m-0">8. SDK Integration — React</h2>
          </div>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-6">~3 min read</p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            For React and Next.js applications, we provide a lightweight hook to fetch your data.
          </p>
          <CodeBlock code={`npm install @switchfolio/react`} />
          <CodeBlock
            code={`import { useSwitchfolio } from '@switchfolio/react'

export default function Projects() {
  const { data, loading, error } = useSwitchfolio({
    apiKey: process.env.NEXT_PUBLIC_SWITCHFOLIO_KEY,
    username: 'your-username',
    viewSlug: 'frontend-interviews'
  })
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {data.map(project => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  )
}`}
          />
          <ul className="space-y-2 list-disc pl-5 text-gray-700 dark:text-gray-300 mt-6">
            <li><code>apiKey</code>: Your public API key from the dashboard.</li>
            <li><code>username</code>: Your unique Switchfolio username.</li>
            <li><code>viewSlug</code>: The slug of the specific view you want to render.</li>
          </ul>
          <SectionFeedback />
        </section>

        {/* SECTION 9 */}
        <section id="sdk-vanilla" className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <FileCode2 className="h-6 w-6 text-primary shrink-0" />
            <h2 className="text-2xl font-bold m-0">9. SDK Integration — Vanilla JS</h2>
          </div>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-6">~2 min read</p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            If you aren&apos;t using a framework, or just want to drop Switchfolio into a static HTML file, use our Vanilla JS CDN script.
          </p>
          <CodeBlock
            code={`<!-- Add this to your <head> -->
<script src="https://cdn.switchfolio.app/sdk.js"></script>

<!-- Add this before your closing </body> -->
<script>
  async function loadPortfolio() {
    const projects = await Switchfolio.load({
      apiKey: 'sk_live_your_key_here',
      username: 'your-username',
      viewSlug: 'frontend-interviews'
    });
    
    console.log("Loaded projects:", projects);
    // Render them to the DOM manually
  }
  
  loadPortfolio();
</script>`}
          />
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            Use this approach when injecting data into Webflow, Framer, Astro, or plain HTML/CSS sites.
          </p>
          <SectionFeedback />
        </section>

        {/* SECTION 10 */}
        <section id="public-api" className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-6 w-6 text-primary shrink-0" />
            <h2 className="text-2xl font-bold m-0">10. Public API Reference</h2>
          </div>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-6">~3 min read</p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Prefer to write your own fetch logic? Hit our REST API directly.
          </p>
          <CodeBlock code={`GET https://api.switchfolio.app/v1/projects?user=USERNAME&view=SLUG
Authorization: Bearer sk_live_xxxx`} />
          <p className="font-semibold text-gray-900 dark:text-zinc-100 mt-6 mb-2">Response Shape:</p>
          <CodeBlock
            code={`{
  "success": true,
  "data": [
    {
      "id": "proj_123",
      "title": "React Dashboard",
      "description": "A complex data visualization dashboard.",
      "techStack": ["React", "TypeScript", "Tailwind"],
      "githubUrl": "https://github.com/...",
      "liveUrl": "https://...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}`}
          />
          <ul className="space-y-2 list-disc pl-5 text-gray-700 dark:text-gray-300 mt-6">
            <li><strong>Cache Behavior:</strong> The API responds with a <code>Cache-Control: s-maxage=60, stale-while-revalidate</code> header.</li>
            <li><strong>401 Unauthorized:</strong> Invalid or missing API key.</li>
            <li><strong>403 Forbidden:</strong> Key is valid, but does not have access to this user.</li>
            <li><strong>404 Not Found:</strong> User or View slug does not exist.</li>
            <li><strong>429 Too Many Requests:</strong> Rate limit exceeded (100 req/min).</li>
          </ul>
          <SectionFeedback />
        </section>

        {/* SECTION 11 */}
        <section id="faq" className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="h-6 w-6 text-primary shrink-0" />
            <h2 className="text-2xl font-bold m-0">11. FAQ</h2>
          </div>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-6">~2 min read</p>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-zinc-100 mb-2">
                Do I need to redeploy when I change my view?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 m-0">
                No. As soon as you drag a project or toggle visibility in the dashboard, the changes are live. Your frontend will fetch the latest state on the next request.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-zinc-100 mb-2">
                Can I have multiple views?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 m-0">
                Yes, you can create an unlimited number of views for different audiences.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-zinc-100 mb-2">
                Is my portfolio design affected?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 m-0">
                Never. Switchfolio is entirely headless. We provide the data, and you maintain complete control over your CSS and HTML structure.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-zinc-100 mb-2">
                What happens if I delete a project?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 m-0">
                The project is deleted globally. It will instantly be removed from all views that were referencing it.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-zinc-100 mb-2">
                Can I use this without React?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 m-0">
                Absolutely. You can use the Vanilla SDK script tag, or fetch directly from the REST API in any language or framework (Astro, Svelte, Vue, Python, etc).
              </p>
            </div>
          </div>
          <SectionFeedback />
        </section>

      </div>

      {/* Back to top button */}
      <BackToTop />
    </div>
  );
}

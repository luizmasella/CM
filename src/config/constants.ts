[plugin:vite:import-analysis] Failed to resolve import "./config/constants" from "src/App.tsx". Does the file exist?
/project/workspace/src/App.tsx:20:56
29 |  import RelatoriosPage from "./components/RelatoriosPage";
30 |  import NotificacoesPage from "./components/NotificacoesPage";
31 |  import { statusConfig, tiposPericia } from "./config/constants";
   |                                              ^
32 |  export default function App() {
33 |    _s();
    at TransformPluginContext._formatLog (file:///project/workspace/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:42499:41)
    at TransformPluginContext.error (file:///project/workspace/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:42496:16)
    at normalizeUrl (file:///project/workspace/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:40475:23)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async file:///project/workspace/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:40594:37
    at async Promise.all (index 16)
    at async TransformPluginContext.transform (file:///project/workspace/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:40521:7)
    at async EnvironmentPluginContainer.transform (file:///project/workspace/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:42294:18)
    at async loadAndTransform (file:///project/workspace/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:35735:27)
    at async viteTransformMiddleware (file:///project/workspace/node_modules/.pnpm/vite@6.3.5/node_modules/vite/dist/node/chunks/dep-DBxKXgDP.js:37250:24
Click outside, press Esc key, or fix the code to dismiss.
You can also disable this overlay by setting server.hmr.overlay to false in vite.config.ts.

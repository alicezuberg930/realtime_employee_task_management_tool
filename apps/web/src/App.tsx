import { createRouter, RouterProvider } from "@tanstack/react-router"
import { routeTree } from './routeTree.gen'
import { getQueryClient } from "./lib/query-client"

export const router = createRouter({
  routeTree,
  context: { queryClient: getQueryClient() },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

export default function App() {
  return <RouterProvider router={router} />
}
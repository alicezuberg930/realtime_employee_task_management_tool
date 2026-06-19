import './index.css'
// i18n
import './lib/locales/i18n.ts'
import { AuthProvider } from './lib/auth/AuthProvider.tsx'
// react query provider with persistence
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { getQueryClient, createIDBPersister } from './lib/query-client.ts'
// theme provider
import { ThemeProvider } from '@yukikaze/ui'
// 
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App.tsx'

hydrateRoot(document.getElementById('root') as HTMLElement,
  <StrictMode>
    <PersistQueryClientProvider
      client={getQueryClient()}
      persistOptions={{
        persister: createIDBPersister(),
        maxAge: 1000 * 60 * 60 * 0.5, // cache get responses in indexdb for 30 mins
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="default"
        themes={['default', 'red', 'blue', 'green']}
        disableTransitionOnChange
      >
        <App />
      </ThemeProvider>
    </PersistQueryClientProvider>
  </StrictMode >
)
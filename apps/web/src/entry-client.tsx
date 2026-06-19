import './index.css'
// i18n
import './lib/locales/i18n.ts'
// redux provider config
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store.ts'
// authentication provider
import { AuthProvider } from './lib/auth/AuthProvider.tsx'
// react query provider with persistence
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { getQueryClient, createIDBPersister } from './lib/queryClient.ts'
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
        maxAge: 1000 * 60 * 60 * 1, // 1 hours
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="default"
        themes={['default', 'red', 'blue', 'green']}
        disableTransitionOnChange
      >
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </ReduxProvider>
      </ThemeProvider>
    </PersistQueryClientProvider>
  </StrictMode>
)
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { AlertProvider } from './contexts/AlertContext'
import AppRouter from './router/AppRouter'
import { queryClient } from './lib/queryClient'
import './i18n'

// Declare the global window object with our custom properties
declare global {
    interface Window {
        electronAPI: {
            platform: string
            versions: NodeJS.ProcessVersions
        }
        ipcRenderer: {
            send: (channel: string, args: unknown[]) => void
            on: (channel: string, func: (...args: unknown[]) => void) => () => void
            once: (channel: string, func: (...args: unknown[]) => void) => void
            invoke: (channel: string, args: unknown[]) => Promise<unknown>
        }
    }
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <LanguageProvider>
                    <AlertProvider>
                        <AppRouter />
                    </AlertProvider>
                </LanguageProvider>
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default App 
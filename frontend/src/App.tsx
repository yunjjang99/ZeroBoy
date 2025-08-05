import { useState, useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { AlertProvider } from './contexts/AlertContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import AccountsSection from './components/AccountsSection'
import TransactionsSection from './components/TransactionsSection'
import EventsSection from './components/EventsSection'
import BrowserProfilesSection from './components/BrowserProfilesSection'
import TradingSection from './components/TradingSection'
import AlertDemo from './components/AlertDemo'
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

function AppContent() {
    const [platform, setPlatform] = useState<string>('')
    const [versions, setVersions] = useState<NodeJS.ProcessVersions>({} as NodeJS.ProcessVersions)
    const [message, setMessage] = useState<string>('')
    const [activeSection, setActiveSection] = useState<string>('dashboard')

    useEffect(() => {
        // Access the exposed APIs from the preload script
        if (window.electronAPI) {
            setPlatform(window.electronAPI.platform)
            setVersions(window.electronAPI.versions)
        }

        // Listen for messages from the main process
        if (window.ipcRenderer) {
            const removeListener = window.ipcRenderer.on('main-process-message', (...args: unknown[]) => {
                const message = args[0] as string
                setMessage(message)
            })

            return () => {
                removeListener()
            }
        }
    }, [])

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar onSectionChange={setActiveSection} activeSection={activeSection} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6 no-drag">
                    {activeSection === 'dashboard' && (
                        <>
                            {/* Chart Section - Full Width */}
                            <div className="mb-6">

                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                {/* Accounts Section */}
                                <div className="lg:col-span-1">
                                    <AccountsSection />
                                </div>

                                {/* Transactions Section */}
                                <div className="lg:col-span-1">
                                    <TransactionsSection />
                                </div>
                            </div>

                            {/* Events Section */}
                            <div className="mb-6">
                                <EventsSection />
                            </div>
                        </>
                    )}

                    {activeSection === 'browser' && (
                        <BrowserProfilesSection />
                    )}

                    {activeSection === 'trading' && (
                        <TradingSection />
                    )}

                    {activeSection === 'analytics' && (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Analytics</h2>
                            <p className="text-gray-600 dark:text-gray-400">Analytics section coming soon...</p>
                        </div>
                    )}

                    {activeSection === 'transactions' && (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Transactions</h2>
                            <p className="text-gray-600 dark:text-gray-400">Transactions section coming soon...</p>
                        </div>
                    )}

                    {activeSection === 'members' && (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Team Members</h2>
                            <p className="text-gray-600 dark:text-gray-400">Team members section coming soon...</p>
                        </div>
                    )}

                    {activeSection === 'permissions' && (
                        <AlertDemo />
                    )}

                    {/* System Information (Hidden by default, can be toggled) */}
                    {message && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">System Information</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Platform:</span>
                                    <p className="font-medium text-gray-900 dark:text-white">{platform}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Node.js:</span>
                                    <p className="font-medium text-gray-900 dark:text-white">{versions.node}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Chromium:</span>
                                    <p className="font-medium text-gray-900 dark:text-white">{versions.chrome}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Electron:</span>
                                    <p className="font-medium text-gray-900 dark:text-white">{versions.electron}</p>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-blue-800 dark:text-blue-200 text-sm">{message}</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <LanguageProvider>
                    <AlertProvider>
                        <AppContent />
                    </AlertProvider>
                </LanguageProvider>
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default App 
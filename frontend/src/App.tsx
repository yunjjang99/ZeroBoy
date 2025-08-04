import { useState, useEffect } from 'react'

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
    const [platform, setPlatform] = useState<string>('')
    const [versions, setVersions] = useState<NodeJS.ProcessVersions>({} as NodeJS.ProcessVersions)
    const [message, setMessage] = useState<string>('')

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

    const handleOpenNewWindow = () => {
        if (window.ipcRenderer) {
            window.ipcRenderer.invoke('open-win', ['new-window'])
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 text-white font-sans">
            <div className="container mx-auto px-4 py-8">
                <header className="text-center animate-fade-in">
                    <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
                        ZeroBoy - Crypto Trading Bot
                    </h1>
                    <p className="text-xl mb-8 text-primary-100">
                        Welcome to the ZeroBoy desktop application!
                    </p>

                    <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20 animate-slide-up">
                        <h2 className="text-2xl font-semibold mb-6 text-white">System Information</h2>
                        <div className="space-y-3 text-left">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Platform:</span>
                                <span className="text-primary-200">{platform}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Node.js Version:</span>
                                <span className="text-primary-200">{versions.node}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Chromium Version:</span>
                                <span className="text-primary-200">{versions.chrome}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Electron Version:</span>
                                <span className="text-primary-200">{versions.electron}</span>
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className="max-w-2xl mx-auto bg-white/15 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/30 animate-slide-up">
                            <h3 className="text-xl font-semibold mb-3 text-white">Message from Main Process:</h3>
                            <p className="text-primary-100">{message}</p>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button
                            onClick={handleOpenNewWindow}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-300/50"
                        >
                            Open New Window
                        </button>
                    </div>
                </header>
            </div>
        </div>
    )
}

export default App 
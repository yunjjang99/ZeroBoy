import React from 'react'
import { ArrowRight } from 'lucide-react'

interface Event {
    title: string
    description: string
    progress: number
    target: string
    targetDate: string
    status: 'in-progress' | 'pending'
    statusColor: string
}

const events: Event[] = [
    {
        title: 'Emergency Fund',
        description: '3 months of expenses saved',
        progress: 65,
        target: '$15,000 target',
        targetDate: 'Target: Dec 2024',
        status: 'in-progress',
        statusColor: 'bg-blue-500'
    },
    {
        title: 'Stock Portfolio',
        description: 'Tech sector investment plan',
        progress: 30,
        target: '$50,000 target',
        targetDate: 'Target: Jun 2024',
        status: 'pending',
        statusColor: 'bg-orange-500'
    },
    {
        title: 'Debt Repayment',
        description: 'Student loan payoff plan',
        progress: 45,
        target: '$25,000 target',
        targetDate: 'Target: Mar 2025',
        status: 'in-progress',
        statusColor: 'bg-blue-500'
    }
]

const EventsSection: React.FC = () => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Events</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {events.map((event, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">{event.title}</h3>
                            <span
                                className={`px-2 py-1 text-xs font-medium text-white rounded-full ${event.statusColor}`}
                            >
                                {event.status === 'in-progress' ? 'In-progress' : 'Pending'}
                            </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">{event.description}</p>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{event.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${event.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="space-y-1 mb-4">
                            <p className="text-sm font-medium text-gray-900">{event.target}</p>
                            <p className="text-xs text-gray-600">{event.targetDate}</p>
                        </div>

                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                            <span>View Details</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EventsSection 
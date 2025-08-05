import React from 'react'
import { Wallet, Building2, TrendingUp, CreditCard, Plus, Send, ArrowUpRight, ArrowRight } from 'lucide-react'

interface Account {
    name: string
    description: string
    balance: string
    icon: React.ReactNode
    color: string
}

const accounts: Account[] = [
    {
        name: 'Main Savings',
        description: 'Personal savings',
        balance: '$8,459.45',
        icon: <Wallet size={20} />,
        color: 'text-green-600'
    },
    {
        name: 'Checking Account',
        description: 'Daily expenses',
        balance: '$2,850.00',
        icon: <Building2 size={20} />,
        color: 'text-blue-600'
    },
    {
        name: 'Investment Portfolio',
        description: 'Stock & ETFs',
        balance: '$15,230.80',
        icon: <TrendingUp size={20} />,
        color: 'text-purple-600'
    },
    {
        name: 'Credit Card',
        description: 'Pending charges',
        balance: '$1,200.00',
        icon: <CreditCard size={20} />,
        color: 'text-red-600'
    },
    {
        name: 'Savings Account',
        description: 'Emergency fund',
        balance: '$3,000.00',
        icon: <Wallet size={20} />,
        color: 'text-green-600'
    }
]

const AccountsSection: React.FC = () => {
    const totalBalance = accounts.reduce((sum, account) => {
        return sum + parseFloat(account.balance.replace('$', '').replace(',', ''))
    }, 0)

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Accounts</h2>
            </div>

            {/* Total Balance */}
            <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                <p className="text-3xl font-bold text-gray-900">${totalBalance.toLocaleString()}.00</p>
            </div>

            {/* Account List */}
            <div className="space-y-4 mb-6">
                <h3 className="text-sm font-medium text-gray-700">Your Accounts</h3>
                {accounts.map((account, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-gray-100 ${account.color}`}>
                                {account.icon}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{account.name}</p>
                                <p className="text-sm text-gray-600">{account.description}</p>
                            </div>
                        </div>
                        <p className="font-semibold text-gray-900">{account.balance}</p>
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus size={16} />
                    <span>Add</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Send size={16} />
                    <span>Send</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <ArrowUpRight size={16} />
                    <span>Top-up</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <span>More</span>
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    )
}

export default AccountsSection 
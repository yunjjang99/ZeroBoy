import React from 'react'
import { ShoppingCart, FileText, ArrowDown, ArrowUp, ArrowRight } from 'lucide-react'

interface Transaction {
    name: string
    time: string
    amount: string
    type: 'income' | 'expense'
    icon: React.ReactNode
}

const transactions: Transaction[] = [
    {
        name: 'Apple Store Purchase',
        time: 'Today, 2:45 PM',
        amount: '-$999.00',
        type: 'expense',
        icon: <ShoppingCart size={16} />
    },
    {
        name: 'Salary Deposit',
        time: 'Today, 9:00 AM',
        amount: '+$4,500.00',
        type: 'income',
        icon: <FileText size={16} />
    },
    {
        name: 'Netflix Subscription',
        time: 'Yesterday',
        amount: '-$15.99',
        type: 'expense',
        icon: <FileText size={16} />
    },
    {
        name: 'Supabase Subscription',
        time: 'Yesterday',
        amount: '-$15.99',
        type: 'expense',
        icon: <FileText size={16} />
    },
    {
        name: 'Vercel Subscription',
        time: 'Yesterday',
        amount: '-$15.99',
        type: 'expense',
        icon: <FileText size={16} />
    }
]

const TransactionsSection: React.FC = () => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                    <p className="text-sm text-gray-600">Recent Activity (23 transactions)</p>
                </div>
                <div className="text-sm text-gray-600">This Month</div>
            </div>

            {/* Transaction List */}
            <div className="space-y-4 mb-6">
                {transactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                                {transaction.icon}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{transaction.name}</p>
                                <p className="text-sm text-gray-600">{transaction.time}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span
                                className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {transaction.amount}
                            </span>
                            {transaction.type === 'income' ? (
                                <ArrowUp size={16} className="text-green-600" />
                            ) : (
                                <ArrowDown size={16} className="text-red-600" />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Button */}
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                <span>View All Transactions</span>
                <ArrowRight size={16} />
            </button>
        </div>
    )
}

export default TransactionsSection 
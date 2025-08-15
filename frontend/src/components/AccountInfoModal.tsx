import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useTranslation } from 'react-i18next'

interface AccountInfo {
  accountId: string
  memo: string
}

interface ExchangeAccountInfo {
  [exchangeName: string]: AccountInfo
}

interface AccountInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (accountInfo: ExchangeAccountInfo) => void
  exchangeA: string
  exchangeB: string
}

const AccountInfoModal: React.FC<AccountInfoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  exchangeA,
  exchangeB,
}) => {
  const { t } = useTranslation()
  const [accountInfo, setAccountInfo] = useState<ExchangeAccountInfo>({
    [exchangeA]: { accountId: '', memo: '' },
    [exchangeB]: { accountId: '', memo: '' },
  })

  const handleInputChange = (exchange: string, field: keyof AccountInfo, value: string) => {
    setAccountInfo(prev => ({
      ...prev,
      [exchange]: {
        ...prev[exchange],
        [field]: value,
      },
    }))
  }

  const handleConfirm = () => {
    // 필수 필드 검증
    const isValid = Object.values(accountInfo).every(info =>
      info.accountId.trim() !== '' && info.memo.trim() !== ''
    )

    if (!isValid) {
      alert(t('trading.accountInfo.required'))
      return
    }

    onConfirm(accountInfo)
    onClose()
  }

  const handleCancel = () => {
    setAccountInfo({
      [exchangeA]: { accountId: '', memo: '' },
      [exchangeB]: { accountId: '', memo: '' },
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal content */}
              <div className="relative bg-white dark:bg-black rounded-2xl shadow-2xl w-full sm:max-w-[700px] max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
                  <div className="px-8 pt-8 pb-4 text-center border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('trading.accountInfo.title')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {t('trading.accountInfo.description')}
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Exchange A */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-blue-200 dark:border-gray-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {exchangeA.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {exchangeA}
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor={`${exchangeA}-accountId`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('trading.accountInfo.accountId')}
                </label>
                <Input
                  id={`${exchangeA}-accountId`}
                  value={accountInfo[exchangeA]?.accountId || ''}
                  onChange={(e) => handleInputChange(exchangeA, 'accountId', e.target.value)}
                  placeholder={t('trading.accountInfo.accountIdPlaceholder')}
                  className="h-12 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label htmlFor={`${exchangeA}-memo`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('trading.accountInfo.memo')}
                </label>
                <Textarea
                  id={`${exchangeA}-memo`}
                  value={accountInfo[exchangeA]?.memo || ''}
                  onChange={(e) => handleInputChange(exchangeA, 'memo', e.target.value)}
                  placeholder={t('trading.accountInfo.memoPlaceholder')}
                  rows={3}
                  className="text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Exchange B */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-green-200 dark:border-gray-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {exchangeB.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {exchangeB}
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor={`${exchangeB}-accountId`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('trading.accountInfo.accountId')}
                </label>
                <Input
                  id={`${exchangeB}-accountId`}
                  value={accountInfo[exchangeB]?.accountId || ''}
                  onChange={(e) => handleInputChange(exchangeB, 'accountId', e.target.value)}
                  placeholder={t('trading.accountInfo.accountIdPlaceholder')}
                  className="h-12 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label htmlFor={`${exchangeB}-memo`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('trading.accountInfo.memo')}
                </label>
                <Textarea
                  id={`${exchangeB}-memo`}
                  value={accountInfo[exchangeB]?.memo || ''}
                  onChange={(e) => handleInputChange(exchangeB, 'memo', e.target.value)}
                  placeholder={t('trading.accountInfo.memoPlaceholder')}
                  rows={3}
                  className="text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={handleCancel}
                              className="px-6 py-2 text-base border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleConfirm}
              className="px-6 py-2 text-base bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {t('trading.accountInfo.confirm')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountInfoModal 
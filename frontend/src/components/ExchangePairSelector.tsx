import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Settings, ArrowLeftRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Exchange {
  name: string
  logo: string
}

interface ExchangePairSelectorProps {
  availableExchanges: { [key: string]: Exchange }
  activeKeys: { keyA: string; keyB: string }
  onSave: (newKeys: { keyA: string; keyB: string }) => void
}

export function ExchangePairSelector({
  availableExchanges,
  activeKeys,
  onSave
}: ExchangePairSelectorProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState(activeKeys)

  const handleSave = () => {
    onSave(selectedKeys)
    setIsOpen(false)
  }

  const exchangeOptions = Object.entries(availableExchanges).map(([key, { name }]) => ({
    value: key,
    label: name,
  }))

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <ArrowLeftRight className="h-4 w-4" />
          <span className="sr-only">{t('trading.pairSelector.changePair')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-lg flex items-center justify-center">
              <ArrowLeftRight className="text-white h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {t('trading.pairSelector.title')}
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                {t('trading.pairSelector.description')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exchange-a" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t('trading.pairSelector.exchange1')}
              </Label>
              <Select
                value={selectedKeys.keyA}
                onValueChange={(value: string) => setSelectedKeys((prev) => ({ ...prev, keyA: value }))}
              >
                <SelectTrigger id="exchange-a" className="border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  <SelectValue placeholder={t('trading.pairSelector.selectExchange')} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                  {exchangeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exchange-b" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t('trading.pairSelector.exchange2')}
              </Label>
              <Select
                value={selectedKeys.keyB}
                onValueChange={(value: string) => setSelectedKeys((prev) => ({ ...prev, keyB: value }))}
              >
                <SelectTrigger id="exchange-b" className="border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  <SelectValue placeholder={t('trading.pairSelector.selectExchange')} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                  {exchangeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={selectedKeys.keyA === selectedKeys.keyB}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('trading.pairSelector.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 
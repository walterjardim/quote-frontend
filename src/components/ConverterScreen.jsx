import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { ArrowUpDown } from 'lucide-react'
import CurrencySelector from './CurrencySelector.jsx'
import { DEFAULT_FROM_CURRENCY, DEFAULT_TO_CURRENCY, getCurrencyDisplayName } from '../data/currencies.js'

export default function ConverterScreen({ onSuccess }) {
  const [sendAmount, setSendAmount] = useState('')
  const [receiveAmount, setReceiveAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState(DEFAULT_FROM_CURRENCY)
  const [toCurrency, setToCurrency] = useState(DEFAULT_TO_CURRENCY)
  const [isLoading, setIsLoading] = useState(false)
  const [balance] = useState('0.000000')

  const handleConvert = async () => {
    if (!sendAmount || parseFloat(sendAmount) <= 0) {
      alert('Por favor, insira um valor válido')
      return
    }

    if (!fromCurrency || !toCurrency) {
      alert('Por favor, selecione as moedas de origem e destino')
      return
    }

    if (fromCurrency === toCurrency) {
      alert('As moedas de origem e destino devem ser diferentes')
      return
    }

    setIsLoading(true)

    try {
      // Importação dinâmica do serviço
      const { getQuote } = await import('../services/apiService.js')

      const result = await getQuote(sendAmount, fromCurrency, toCurrency)

      if (result.amount) {
        setReceiveAmount(result.amount.toString())

        if (result.fallback) {
          console.log('Usando fallback - API indisponível')
        } else {
          console.log('Cotação obtida com sucesso da API')
        }
      } else {
        throw new Error('Resposta inválida da API')
      }
    } catch (error) {
      console.error('Erro ao obter cotação:', error)
      alert('Erro ao obter cotação. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProceed = () => {
    if (receiveAmount && parseFloat(receiveAmount) > 0) {
      onSuccess({
        sendAmount,
        receiveAmount,
        fromCurrency,
        toCurrency,
        fromCurrencyDisplay: getCurrencyDisplayName(fromCurrency),
        toCurrencyDisplay: getCurrencyDisplayName(toCurrency)
      })
    }
  }

  const handleSwapCurrencies = () => {
    const tempFrom = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(tempFrom)

    // Limpar valores quando trocar moedas
    setSendAmount('')
    setReceiveAmount('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Conversor de Moedas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Send Amount Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">
                Send Amount <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Balance</span>
                <span>{balance}</span>
                <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                  Max
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="0"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="text-lg"
              />
              <CurrencySelector
                value={fromCurrency}
                onValueChange={setFromCurrency}
                placeholder="Selecionar moeda de origem..."
              />
            </div>
          </div>

          {/* Convert Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSwapCurrencies}
              variant="outline"
              size="icon"
              className="rounded-full border-2 hover:bg-gray-100"
              title="Trocar moedas"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Recipient Receives Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Recipient Receives <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="0"
                value={receiveAmount}
                readOnly
                className="text-lg bg-gray-50"
              />
              <CurrencySelector
                value={toCurrency}
                onValueChange={setToCurrency}
                placeholder="Selecionar moeda de destino..."
              />
            </div>
          </div>

          {/* Convert Button */}
          <Button
            onClick={handleConvert}
            disabled={isLoading || !sendAmount || !fromCurrency || !toCurrency}
            className="w-full"
          >
            {isLoading ? 'Convertendo...' : 'Converter'}
          </Button>

          {/* Proceed Button */}
          {receiveAmount && (
            <Button
              onClick={handleProceed}
              className="w-full"
              disabled={!receiveAmount || parseFloat(receiveAmount) <= 0}
            >
              Prosseguir com a Conversão
            </Button>
          )}

          {/* Info Section */}
          <div className="text-xs text-muted-foreground text-center">
            <p>Taxa de câmbio sujeita a variações do mercado</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

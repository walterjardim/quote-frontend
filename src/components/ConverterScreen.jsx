import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { ArrowUpDown } from 'lucide-react'
import CurrencySelector from './CurrencySelector.jsx'
import { DEFAULT_FROM_CURRENCY, DEFAULT_TO_CURRENCY, findCurrencyByCode } from '../data/currencies.js'

export default function ConverterScreen({ onSuccess }) {
  const [sendAmount, setSendAmount] = useState('')
  const [receiveAmount, setReceiveAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState(DEFAULT_FROM_CURRENCY)
  const [toCurrency, setToCurrency] = useState(DEFAULT_TO_CURRENCY)
  const [isLoading, setIsLoading] = useState(false)

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

      const requestBody = {
        source: createQuoteSourceBasedBody(sendAmount, fromCurrency),
        target: createQuoteSourceBasedBody(null, toCurrency),
      }

      const result = await getQuote(requestBody)

      if (result.id) {
        setReceiveAmount(result.target.amount);
        console.log('Cotação obtida com sucesso da API')
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

  const createQuoteSourceBasedBody = (sendAmount, currencyCode) => {
    const currency = findCurrencyByCode(currencyCode);

    const quoteBody = {
      asset: currency.asset
    }

    if (sendAmount) {
      quoteBody.amount = sendAmount
    }

    if (currency.category == 'crypto') {
      quoteBody.network = currency.network;
    }

    return quoteBody;
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
                Quantidade a ser enviada <span className="text-red-500">*</span>
              </label>
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
              Destinatário Recebe <span className="text-red-500">*</span>
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
        </CardContent>
      </Card>
    </div>
  )
}

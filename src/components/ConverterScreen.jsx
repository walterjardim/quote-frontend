import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { ArrowUpDown, AlertCircle } from 'lucide-react'
import CurrencySelector from './CurrencySelector.jsx'
import Timer from './Timer.jsx'
import { DEFAULT_FROM_CURRENCY, DEFAULT_TO_CURRENCY, findCurrencyByCode } from '../data/currencies.js'
import openDoorsLogo from '../assets/opendoors.png'

export default function ConverterScreen({ onSuccess }) {
  const [sendAmount, setSendAmount] = useState('')
  const [receiveAmount, setReceiveAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState(DEFAULT_FROM_CURRENCY)
  const [toCurrency, setToCurrency] = useState(DEFAULT_TO_CURRENCY)
  const [isLoading, setIsLoading] = useState(false)
  const [showTimer, setShowTimer] = useState(false)
  const [quoteData, setQuoteData] = useState(null)

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
        setReceiveAmount(result.target.amount)
        setQuoteData(result)
        setShowTimer(true)
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
    setShowTimer(false)
    setQuoteData(null)
  }

  const handleTimerExpire = () => {
    alert('A cotação expirou. Por favor, realize uma nova conversão.')
    setReceiveAmount('')
    setShowTimer(false)
    setQuoteData(null)
  }

  const handleProceed = () => {
    if (receiveAmount && parseFloat(receiveAmount) > 0 && quoteData) {
      const transactionData = {
        sendAmount,
        receiveAmount,
        fromCurrency,
        toCurrency,
        fromCurrencyData: findCurrencyByCode(fromCurrency),
        toCurrencyData: findCurrencyByCode(toCurrency),
        quoteData,
        timestamp: new Date().toISOString()
      }
      onSuccess(transactionData)
    }
  }

  const handleNewConversion = () => {
    setSendAmount('')
    setReceiveAmount('')
    setShowTimer(false)
    setQuoteData(null)
    setFromCurrency(DEFAULT_FROM_CURRENCY)
    setToCurrency(DEFAULT_TO_CURRENCY)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 fade-in">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* Logo da OpenDoors */}
          <div className="flex justify-center mb-4">
            <img 
              src={openDoorsLogo} 
              alt="OpenDoors Logo" 
              className="logo h-10 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-accent">
            Conversor de Moedas
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Converta seus <span className="text-accent">criptoativos</span> de forma segura
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Section - Aparece após conversão bem-sucedida */}
          {showTimer && (
            <div className="timer-container rounded-lg p-4 slide-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-300">
                    Cotação válida por:
                  </span>
                </div>
                <Timer 
                  initialSeconds={175}
                  onExpire={handleTimerExpire}
                  size="default"
                  className="text-green-400"
                />
              </div>
              <p className="text-xs text-green-300 mt-2">
                Após este tempo, será necessário realizar uma nova conversão.
              </p>
            </div>
          )}

          {/* Send Amount Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">
                Quantidade a ser enviada <span className="text-red-400">*</span>
              </label>
            </div>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="0"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="text-lg"
                disabled={showTimer}
              />
              <CurrencySelector
                value={fromCurrency}
                onValueChange={setFromCurrency}
                placeholder="Selecionar moeda de origem..."
                disabled={showTimer}
              />
            </div>
          </div>

          {/* Convert Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSwapCurrencies}
              variant="outline"
              size="icon"
              className="rounded-full border-2 hover:bg-secondary hover:border-primary"
              title="Trocar moedas"
              disabled={showTimer}
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Recipient Receives Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Destinatário Recebe <span className="text-red-400">*</span>
            </label>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="0"
                value={receiveAmount}
                readOnly
                className="text-lg bg-secondary/50"
              />
              <CurrencySelector
                value={toCurrency}
                onValueChange={setToCurrency}
                placeholder="Selecionar moeda de destino..."
                disabled={showTimer}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!showTimer ? (
              <Button
                onClick={handleConvert}
                disabled={isLoading || !sendAmount || !fromCurrency || !toCurrency}
                className="w-full btn-primary"
              >
                {isLoading ? 'Convertendo...' : 'Converter'}
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleProceed}
                  className="w-full btn-primary"
                  disabled={!receiveAmount || parseFloat(receiveAmount) <= 0}
                >
                  Prosseguir para Detalhes da Cotação
                </Button>
                <Button 
                  onClick={handleNewConversion}
                  variant="outline"
                  className="w-full hover:bg-secondary"
                >
                  Nova Conversão
                </Button>
              </>
            )}
          </div>

          {/* Info Section */}
          <div className="text-xs text-muted-foreground text-center">
            <p>Taxa de câmbio sujeita a variações do mercado</p>
            <p className="mt-1">Powered by <span className="text-accent">OpenDoors</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


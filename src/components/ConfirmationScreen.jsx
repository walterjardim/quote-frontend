import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import { getCurrencyIcon, getCurrencyDisplayName } from '../data/currencies.js'

export default function ConfirmationScreen({ transactionData, onBack }) {
  const fromIcon = getCurrencyIcon(transactionData?.fromCurrency)
  const toIcon = getCurrencyIcon(transactionData?.toCurrency)
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Transação Enviada com Sucesso!
          </CardTitle>
          <p className="text-muted-foreground">
            Sua solicitação de conversão foi processada
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm text-gray-700">Detalhes da Transação</h3>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Valor Enviado:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {transactionData?.sendAmount}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs">{fromIcon}</span>
                  <span className="text-sm font-medium">
                    {transactionData?.fromCurrencyDisplay || transactionData?.fromCurrency}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Valor Recebido:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {transactionData?.receiveAmount}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs">{toIcon}</span>
                  <span className="text-sm font-medium">
                    {transactionData?.toCurrencyDisplay || transactionData?.toCurrency}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className="text-sm font-medium text-green-600">Processando</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Data:</span>
              <span className="text-sm font-medium">
                {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-blue-800 mb-2">Informações Importantes</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• A conversão pode levar até 2 horas úteis</li>
              <li>• Você receberá uma confirmação por email</li>
              <li>• O valor pode variar devido à volatilidade do mercado</li>
              <li>• Taxas de rede podem ser aplicadas para criptomoedas</li>
            </ul>
          </div>

          {/* Exchange Rate Info */}
          {transactionData?.sendAmount && transactionData?.receiveAmount && (
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="text-xs text-gray-600 text-center">
                <span>Taxa de câmbio aproximada: </span>
                <span className="font-medium">
                  1 {transactionData?.fromCurrency} ≈ {' '}
                  {(parseFloat(transactionData?.receiveAmount) / parseFloat(transactionData?.sendAmount)).toFixed(6)} {' '}
                  {transactionData?.toCurrency}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={onBack} variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nova Conversão
            </Button>
            
            <Button className="w-full" variant="secondary">
              Acompanhar Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


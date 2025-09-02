import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Copy, Eye, ExternalLink, ArrowLeft, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import Timer from './Timer.jsx'
import { findCurrencyByCode } from '../data/currencies.js'
import { WALLET_CONFIG, APP_CONFIG } from '../config/environment.js'
import openDoorsLogo from '../assets/opendoors.png'
import qrCode from '../assets/qr-code.png'

export default function QuoteDetailsScreen({ transactionData, onBack, timer }) {
  const [copied, setCopied] = useState(false)
  const [currentStep, setCurrentStep] = useState(2)

  // Dados da wallet da empresa usando variáveis de ambiente
  const walletData = {
    address: WALLET_CONFIG.address,
    network: WALLET_CONFIG.network,
    minimum: WALLET_CONFIG.minAmount,
    maximum: WALLET_CONFIG.maxAmount,
    networkFees: WALLET_CONFIG.networkFees,
    receivingAddress: "Dcp6...S8kZ",
    orderId: "#ce581d65fe2687452937",
    createdAt: new Date().toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3.$2.$1')
  }

  const rate = transactionData?.quoteData?.rate ||
    (parseFloat(transactionData?.receiveAmount) / parseFloat(transactionData?.sendAmount))

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletData.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar endereço:', err)
    }
  }

  const handleSendFromWallet = () => {
    // Aqui seria implementada a lógica para abrir a wallet
    alert('Redirecionando para sua wallet...')
  }

  const handleContactSupport = () => {
    // Aqui seria implementada a lógica para contatar suporte
    window.open('mailto:support@opendoors.xyz', '_blank')
  }

  const handleCancelOrder = () => {
    if (confirm('Tem certeza que deseja cancelar esta ordem?')) {
      onBack()
    }
  }

  const steps = [
    { id: 1, title: "COTAÇÃO", status: "completed" },
    { id: 2, title: "TRANSAÇÃO", status: "current", icon: "₮" },
    //{ id: 3, title: "RECEIVE SOL", status: "pending", icon: "⚡" }
  ]

  return (
    <div className="min-h-screen p-4 fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header com Logo e Navegação */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <img
              src={openDoorsLogo}
              alt="OpenDoors Logo"
              className="logo h-8 w-auto"
            />
          </div>
          <Timer
            seconds={timer.seconds}
            size="large"
            className="text-primary"
          />
        </div>

        {/* Steps Progress */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  step.status === 'completed' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                  step.status === 'current' ? 'bg-primary/20 border-primary/50 text-primary' :
                  'bg-muted/20 border-muted/50 text-muted-foreground'
                }`}>
                  <span className="text-sm font-medium">
                    PASSO {step.id}: {step.title}
                  </span>
                  {step.icon && (
                    <span className="text-lg">{step.icon}</span>
                  )}
                  {step.status === 'completed' && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-px bg-border mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - QR Code and Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-center">
                AGUARDANDO PAGAMENTO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Code Placeholder */}
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center border-4 border-primary/20">
                  <div className="text-center">
                      <img
                        src={qrCode}
                        alt="QR Code"
                      />
                    
                  </div>
                </div>
              </div>

              {/* Wallet Address */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    PARA A CARTEIRA ABAIXO
                  </span>
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 break-all font-mono text-sm">
                  {walletData.address}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleCopyAddress}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? 'COPIADO!' : 'COPIAR ENDEREÇO'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Transaction Details */}
          <Card>
            <CardContent className="space-y-6 pt-6">
              {/* Rate Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    TAXA <ExternalLink className="w-3 h-3" />
                  </span>
                  <span className="font-medium">
                    1 {transactionData.fromCurrencyData?.asset} = {rate?.toFixed(4)} {transactionData.toCurrencyData?.asset}
                  </span>
                </div>
              </div>

              {/* Transaction Summary */}
              <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-lg">Resumo da Transação</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Você envia:</span>
                    <span className="font-medium">
                      {transactionData.sendAmount} {transactionData.fromCurrencyData?.asset}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Open Doors recebe:</span>
                    <span className="font-medium text-primary">
                      {transactionData.receiveAmount} {transactionData.toCurrencyData?.asset}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rede:</span>
                    <span className="font-medium">
                      {transactionData.fromCurrencyData?.network}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa:</span>
                    <span className="font-medium">
                      1 {transactionData.fromCurrencyData?.asset} = {rate?.toFixed(4)} {transactionData.toCurrencyData?.code}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data</span>
                  <span>{walletData.createdAt}</span>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Status Bar */}
        <div className="mt-6 bg-secondary/30 rounded-lg p-4">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span>Aguardando confirmação da transação...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

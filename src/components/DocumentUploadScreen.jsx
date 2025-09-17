import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Upload, FileText, CheckCircle, Loader2, ArrowRight } from 'lucide-react'
import { uploadDocument } from '../services/apiService.js'
import { debugLog, errorLog } from '../config/environment.js'
import openDoorsLogo from '../assets/opendoors.png'

export default function DocumentUploadScreen({ onSuccess }) {
  const [formData, setFormData] = useState({
    scope: 'transaction',
    type: 'invoice',
    purpose: 'transaction_justification',
    file: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [documentId, setDocumentId] = useState(null)
  const [error, setError] = useState(null)

  const scopeOptions = [
    { value: 'transaction', label: 'Transação' },
    { value: 'counterparty', label: 'Contraparte' },
    { value: 'customer', label: 'Cliente' }
  ]

  const typeOptions = [
    { value: 'invoice', label: 'Fatura' },
    { value: 'contract', label: 'Contrato' }
  ]

  const purposeOptions = [
    { value: 'transaction_justification', label: 'Justificativa da Transação' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validação básica do arquivo
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        setError('Arquivo muito grande. Tamanho máximo: 10MB')
        return
      }

      setFormData(prev => ({
        ...prev,
        file: file
      }))
      setError(null)
      debugLog('Arquivo selecionado:', file.name, 'Tamanho:', file.size)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Validação
    if (!formData.file) {
      setError('Por favor, selecione um arquivo')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      debugLog('Enviando documento:', formData)

      const result = await uploadDocument(formData)

      if (result.success) {
        setDocumentId(result.data.id)
        setUploadSuccess(true)
        debugLog('Upload realizado com sucesso. ID:', result.data.id)
      } else {
        throw new Error(result.error || 'Erro no upload do documento')
      }
    } catch (err) {
      errorLog('Erro no upload:', err)
      setError(err.message || 'Erro ao enviar documento. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProceed = () => {
    if (onSuccess && documentId) {
      onSuccess(documentId)
    }
  }

  if (uploadSuccess) {
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
              Upload de Documento
            </CardTitle>

            <p className="text-sm text-muted-foreground mt-2">
              Documento enviado com sucesso
            </p>

          </CardHeader>

          <Card className="bg-card/50 backdrop-blur-sm border-border shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <CardTitle className="text-xl text-foreground">
                Documento Enviado!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">
                  Seu documento foi processado com sucesso.
                </p>
                <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                  <Label className="text-sm text-muted-foreground">ID do Documento</Label>
                  <p className="text-lg font-mono font-semibold text-foreground mt-1">
                    {documentId}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Escopo:</span>
                  <span className="text-foreground font-medium">
                    {scopeOptions.find(opt => opt.value === formData.scope)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="text-foreground font-medium">
                    {typeOptions.find(opt => opt.value === formData.type)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Arquivo:</span>
                  <span className="text-foreground font-medium">
                    {formData.file?.name}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleProceed}
                className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-primary-foreground font-semibold py-3"
              >
                Prosseguir para Conversão
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

        </Card>

      </div>
    )
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
            Upload de Documento
          </CardTitle>

          <p className="text-sm text-muted-foreground mt-2">
            Envie a documentação necessária para prosseguir
          </p>

        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Escopo */}
            <div className="space-y-2">
              <Label htmlFor="scope" className="text-sm font-medium text-foreground">
                Escopo *
              </Label>
              <Select
                value={formData.scope}
                onValueChange={(value) => handleInputChange('scope', value)}
              >
                <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                  <SelectValue placeholder="Selecione o escopo" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {scopeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-foreground hover:bg-accent"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium text-foreground">
                Tipo *
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {typeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-foreground hover:bg-accent"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Propósito */}
            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-sm font-medium text-foreground">
                Propósito *
              </Label>
              <Select
                value={formData.purpose}
                onValueChange={(value) => handleInputChange('purpose', value)}
              >
                <SelectTrigger className="bg-secondary/50 border-border text-foreground">
                  <SelectValue placeholder="Selecione o propósito" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {purposeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-foreground hover:bg-accent"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Upload de Arquivo */}
            <div className="space-y-2">
              <Label htmlFor="file" className="text-sm font-medium text-foreground">
                Arquivo *
              </Label>
              <div className="relative">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                />
                <Label
                  htmlFor="file"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="text-center">
                    {formData.file ? (
                      <>
                        <FileText className="mx-auto h-8 w-8 text-primary mb-2" />
                        <p className="text-sm font-medium text-foreground">
                          {formData.file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium text-foreground">
                          Clique para selecionar arquivo
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
                        </p>
                      </>
                    )}
                  </div>
                </Label>
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Botão de Submit */}
            <Button
              type="submit"
              disabled={isLoading || !formData.file}
              className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-primary-foreground font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando Documento...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Enviar Documento
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

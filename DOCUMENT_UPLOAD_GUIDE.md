# Guia Completo da Tela de Upload de Documentos - OpenDoors Conversor

## Introdução

A tela de upload de documentos é uma nova funcionalidade do OpenDoors Conversor que permite aos usuários enviar documentos necessários antes de realizar conversões de moedas. Esta funcionalidade foi implementada para atender aos requisitos de compliance e documentação exigidos para transações financeiras.

## Visão Geral da Funcionalidade

### Objetivo

A tela de upload de documentos serve como o primeiro passo no fluxo da aplicação, permitindo que os usuários:

1. Classifiquem o tipo de documento sendo enviado
2. Especifiquem o escopo e propósito do documento
3. Façam upload de arquivos de forma segura
4. Recebam confirmação e ID único do documento
5. Prossigam para a conversão de moedas com o documento vinculado

### Posicionamento no Fluxo

A nova tela foi integrada como a primeira etapa do processo, criando o seguinte fluxo:

```
DocumentUploadScreen → ConverterScreen → QuoteDetailsScreen → ConfirmationScreen
```

## Especificações Técnicas

### Campos do Formulário

#### 1. Escopo (scope)
- **Tipo**: Combobox/Select
- **Opções**:
  - "Transação" (value: `transaction`) - Selecionado por padrão
  - "Contraparte" (value: `counterparty`)
  - "Cliente" (value: `customer`)
- **Campo enviado para backend**: `scope`
- **Obrigatório**: Sim

#### 2. Tipo (type)
- **Tipo**: Combobox/Select
- **Opções**:
  - "Fatura" (value: `invoice`) - Selecionado por padrão
  - "Contrato" (value: `contract`)
- **Campo enviado para backend**: `type`
- **Obrigatório**: Sim

#### 3. Propósito (purpose)
- **Tipo**: Combobox/Select
- **Opções**:
  - "Justificativa da Transação" (value: `transaction_justification`)
- **Campo enviado para backend**: `purpose`
- **Obrigatório**: Sim

#### 4. Arquivo (file)
- **Tipo**: Upload de arquivo
- **Formatos aceitos**: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT
- **Tamanho máximo**: 10MB
- **Campo enviado para backend**: `file`
- **Obrigatório**: Sim

### Integração com API

#### Endpoint
- **URL**: `https://api.opendoors.xyz/v1/documents`
- **Método**: POST
- **Content-Type**: `multipart/form-data`

#### Estrutura da Requisição

```javascript
const formData = new FormData()
formData.append('scope', 'transaction')
formData.append('type', 'invoice')
formData.append('purpose', 'transaction_justification')
formData.append('file', fileObject)
```

#### Resposta Esperada

```json
{
  "id": "doc_1693456789_abc123def",
  "scope": "transaction",
  "type": "invoice",
  "purpose": "transaction_justification",
  "fileName": "documento.pdf",
  "uploadedAt": "2025-08-30T19:14:00.000Z",
  "status": "uploaded"
}
```

## Implementação do Componente

### Estrutura do Arquivo

O componente `DocumentUploadScreen.jsx` está localizado em `src/components/` e segue a estrutura padrão dos outros componentes da aplicação.

### Estados do Componente

```javascript
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
```

### Validações Implementadas

#### Validação de Arquivo
- Verificação se um arquivo foi selecionado
- Validação de tamanho máximo (10MB)
- Verificação de tipos de arquivo permitidos

#### Validação de Campos
- Todos os campos são obrigatórios
- Valores padrão são definidos para facilitar o uso

### Interface do Usuário

#### Tela Principal (Formulário)

A tela principal apresenta:

1. **Cabeçalho**: Logo da OpenDoors e título
2. **Formulário**: Campos organizados verticalmente
3. **Upload Area**: Área visual para seleção de arquivos
4. **Botão de Envio**: Com estados de loading

#### Tela de Sucesso

Após o upload bem-sucedido, a tela exibe:

1. **Ícone de Sucesso**: CheckCircle verde
2. **ID do Documento**: Destacado em fonte mono
3. **Resumo dos Dados**: Escopo, tipo e nome do arquivo
4. **Botão Prosseguir**: Para ir à próxima tela

### Tratamento de Erros

#### Tipos de Erro Tratados

1. **Arquivo não selecionado**
2. **Arquivo muito grande** (> 10MB)
3. **Erro na API** (timeout, conexão, etc.)
4. **Resposta inválida da API**

#### Sistema de Fallback

Quando a API está indisponível, o sistema:

1. Detecta a falha na requisição
2. Gera um ID simulado único
3. Retorna uma resposta simulada
4. Permite que o usuário continue o fluxo

```javascript
const simulatedId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
```

## Integração com o Fluxo da Aplicação

### Atualização do App.jsx

O componente principal foi atualizado para incluir a nova tela:

```javascript
const [currentScreen, setCurrentScreen] = useState('documentUpload')
const [documentId, setDocumentId] = useState(null)

const handleDocumentUploadSuccess = (uploadedDocumentId) => {
  setDocumentId(uploadedDocumentId)
  setCurrentScreen('converter')
}
```

### Passagem de Dados Entre Telas

#### DocumentUploadScreen → ConverterScreen
- **Dado passado**: `documentId`
- **Método**: Callback `onSuccess`
- **Armazenamento**: Estado do App.jsx

#### ConverterScreen → QuoteDetailsScreen
- **Dados passados**: `transactionData` + `documentId`
- **Método**: Props do componente
- **Uso**: Exibição e referência

### Atualização do ConverterScreen

O ConverterScreen foi modificado para:

1. **Receber o documentId** como prop
2. **Exibir o ID do documento** na interface
3. **Incluir botão "Voltar"** para navegação
4. **Passar o documentId** para as próximas telas

```javascript
export default function ConverterScreen({ documentId, onSuccess, onBack }) {
  // Exibição do documento na interface
  {documentId && (
    <div className="mt-4 p-3 bg-secondary/30 rounded-lg border border-border">
      <div className="flex items-center justify-center space-x-2">
        <FileText className="h-4 w-4 text-primary" />
        <span className="text-sm text-muted-foreground">Documento:</span>
        <span className="text-sm font-mono font-semibold text-foreground">
          {documentId}
        </span>
      </div>
    </div>
  )}
}
```

## Estilo e Design

### Consistência Visual

A tela de upload mantém a identidade visual do OpenDoors:

- **Cores primárias**: Dourado (#f4c430) e laranja (#ff6b35)
- **Fundo**: Gradiente escuro com transparências
- **Cards**: Backdrop-blur com bordas sutis
- **Tipografia**: Inter font family

### Componentes Visuais

#### Upload Area
- **Design**: Área com borda tracejada
- **Estados**: Normal, hover, com arquivo selecionado
- **Ícones**: Upload, FileText (quando arquivo selecionado)
- **Feedback**: Nome e tamanho do arquivo

#### Comboboxes
- **Estilo**: Consistente com CurrencySelector
- **Cores**: Fundo translúcido, texto legível
- **Hover**: Estados visuais claros

#### Botões
- **Primário**: Gradiente dourado-laranja
- **Estados**: Normal, loading, disabled
- **Ícones**: Upload, Loader2 (loading), ArrowRight

### Responsividade

A tela é totalmente responsiva:

- **Desktop**: Layout centrado com largura máxima
- **Tablet**: Adaptação automática dos espaçamentos
- **Mobile**: Interface otimizada para toque
- **Orientação**: Funciona em portrait e landscape

## Configuração via Variáveis de Ambiente

### Variáveis Relacionadas ao Upload

```bash
# Endpoint base da API
VITE_API_BASE_URL=https://api.opendoors.xyz/v1

# Configurações de upload (futuras)
VITE_UPLOAD_MAX_SIZE=10485760  # 10MB em bytes
VITE_UPLOAD_ALLOWED_TYPES=.pdf,.doc,.docx,.jpg,.jpeg,.png,.txt

# Sistema de fallback
VITE_ENABLE_API_FALLBACK=true
```

### Configuração no environment.js

```javascript
export const UPLOAD_CONFIG = {
  maxSize: parseInt(import.meta.env.VITE_UPLOAD_MAX_SIZE) || 10485760,
  allowedTypes: import.meta.env.VITE_UPLOAD_ALLOWED_TYPES?.split(',') || 
    ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt'],
  endpoint: '/documents'
}
```

## Sistema de Logs e Debug

### Logs Implementados

#### Debug Logs
```javascript
debugLog('Enviando documento para:', url)
debugLog('Dados do documento:', {
  scope: documentData.scope,
  type: documentData.type,
  purpose: documentData.purpose,
  fileName: documentData.file?.name,
  fileSize: documentData.file?.size
})
```

#### Error Logs
```javascript
errorLog('Erro no upload do documento:', error)
```

#### Warn Logs
```javascript
warnLog('API indisponível, usando fallback para upload de documento')
```

### Informações Logadas

1. **URL do endpoint** sendo chamado
2. **Dados do formulário** (sem o arquivo binário)
3. **Nome e tamanho** do arquivo
4. **Status da resposta** da API
5. **Erros detalhados** quando ocorrem
6. **Ativação do fallback** quando necessário

## Testes e Validação

### Cenários de Teste

#### Teste de Upload Bem-sucedido
1. Preencher todos os campos
2. Selecionar arquivo válido
3. Clicar em "Enviar Documento"
4. Verificar loading state
5. Confirmar tela de sucesso
6. Verificar ID do documento
7. Clicar em "Prosseguir"
8. Confirmar navegação para ConverterScreen

#### Teste de Validação
1. Tentar enviar sem arquivo
2. Verificar mensagem de erro
3. Selecionar arquivo muito grande
4. Verificar validação de tamanho
5. Testar tipos de arquivo não permitidos

#### Teste de Fallback
1. Configurar API indisponível
2. Tentar fazer upload
3. Verificar ativação do fallback
4. Confirmar ID simulado gerado
5. Verificar continuidade do fluxo

#### Teste de Navegação
1. Usar botão "Voltar" no ConverterScreen
2. Verificar retorno ao DocumentUploadScreen
3. Testar fluxo completo múltiplas vezes
4. Verificar persistência de dados

### Validação de Responsividade

#### Desktop (1920x1080)
- Layout centrado
- Espaçamentos adequados
- Todos os elementos visíveis

#### Tablet (768x1024)
- Adaptação automática
- Touch targets adequados
- Scroll quando necessário

#### Mobile (375x667)
- Interface otimizada
- Botões grandes o suficiente
- Upload area acessível

## Segurança e Compliance

### Validações de Segurança

#### Client-side
1. **Validação de tipo de arquivo**
2. **Limitação de tamanho**
3. **Sanitização de nomes de arquivo**
4. **Timeout de requisições**

#### Preparação para Server-side
1. **Estrutura para validação de MIME type**
2. **Preparação para scan de vírus**
3. **Logs de auditoria**
4. **Controle de rate limiting**

### Compliance

#### Documentação de Transações
- Classificação por escopo
- Tipificação de documentos
- Propósito claramente definido
- Rastreabilidade via ID único

#### Auditoria
- Logs detalhados de uploads
- Timestamps precisos
- Identificação de usuário (futuro)
- Histórico de tentativas

## Manutenção e Evolução

### Melhorias Futuras

#### Funcionalidades
1. **Múltiplos arquivos** por upload
2. **Preview de documentos** antes do envio
3. **Drag & drop** mais avançado
4. **Progress bar** para uploads grandes
5. **Compressão automática** de imagens

#### Integrações
1. **Autenticação de usuário**
2. **Histórico de uploads**
3. **Notificações por email**
4. **Integração com storage cloud**

#### UX/UI
1. **Animações mais suaves**
2. **Feedback haptic** (mobile)
3. **Modo escuro/claro**
4. **Acessibilidade aprimorada**

### Monitoramento

#### Métricas Importantes
1. **Taxa de sucesso** de uploads
2. **Tempo médio** de upload
3. **Tipos de arquivo** mais comuns
4. **Erros mais frequentes**
5. **Uso do fallback**

#### Alertas
1. **Alta taxa de falhas** na API
2. **Uploads muito lentos**
3. **Arquivos rejeitados** frequentemente
4. **Uso excessivo do fallback**

## Conclusão

A implementação da tela de upload de documentos representa uma evolução significativa do OpenDoors Conversor, adicionando uma camada essencial de compliance e documentação ao processo de conversão de moedas. 

A solução foi desenvolvida com foco em:

- **Usabilidade**: Interface intuitiva e responsiva
- **Robustez**: Sistema de fallback e tratamento de erros
- **Flexibilidade**: Configuração via variáveis de ambiente
- **Manutenibilidade**: Código bem estruturado e documentado
- **Escalabilidade**: Preparação para futuras melhorias

A integração com o fluxo existente foi feita de forma não-disruptiva, mantendo a experiência do usuário fluida enquanto adiciona a funcionalidade necessária de documentação.

---

*Documentação criada para OpenDoors Conversor v3.0.0*
*Última atualização: 16/09/2025*
*Autor: Manus AI*


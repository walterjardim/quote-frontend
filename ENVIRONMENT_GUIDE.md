# Guia Completo de Variáveis de Ambiente - OpenDoors Conversor

## Introdução

O OpenDoors Conversor utiliza um sistema robusto de variáveis de ambiente baseado no Vite, permitindo configurações flexíveis para diferentes ambientes de desenvolvimento e produção. Este sistema oferece controle granular sobre APIs, configurações de timer, dados da wallet, logs e muito mais.

## Estrutura de Arquivos de Ambiente

### Hierarquia de Carregamento

O Vite carrega os arquivos de ambiente na seguinte ordem de prioridade:

1. `.env.local` - Configurações locais (sempre carregado, exceto em test)
2. `.env.[mode]` - Configurações específicas do modo (development/production)
3. `.env` - Configurações padrão

### Arquivos Disponíveis

#### `.env.local`
Configurações específicas da máquina local. Este arquivo não deve ser commitado no repositório.

```bash
# Configurações da API
VITE_API_BASE_URL=https://api.opendoors.xyz/v1
VITE_API_QUOTE_ENDPOINT=/quote
VITE_API_TIMEOUT=10000

# Configurações da Aplicação
VITE_APP_NAME=OpenDoors Conversor
VITE_APP_VERSION=2.0.0
VITE_APP_ENVIRONMENT=development

# Configurações do Timer
VITE_TIMER_DURATION=175

# Configurações da Wallet
VITE_WALLET_ADDRESS=0xa8ED07B214000060980B299998b5128b76A3b4D1
VITE_WALLET_NETWORK=TETHER (ETHEREUM)
VITE_WALLET_MIN_AMOUNT=5 USDT
VITE_WALLET_MAX_AMOUNT=60000 USDT
VITE_WALLET_NETWORK_FEES=$0.04

# Configurações de Debug
VITE_DEBUG_MODE=true
VITE_ENABLE_CONSOLE_LOGS=true

# Configurações de Fallback
VITE_ENABLE_API_FALLBACK=true
VITE_FALLBACK_RATE_USD_BRL=5.85
VITE_FALLBACK_RATE_USD_EUR=0.92
```

#### `.env.development`
Configurações específicas para o ambiente de desenvolvimento.

```bash
# Configurações para Ambiente de Desenvolvimento
VITE_APP_ENVIRONMENT=development
VITE_API_BASE_URL=https://api.opendoors.xyz/v1
VITE_DEBUG_MODE=true
VITE_ENABLE_CONSOLE_LOGS=true
VITE_ENABLE_API_FALLBACK=true
```

#### `.env.production`
Configurações específicas para o ambiente de produção.

```bash
# Configurações para Ambiente de Produção
VITE_APP_ENVIRONMENT=production
VITE_API_BASE_URL=https://api.opendoors.xyz/v1
VITE_DEBUG_MODE=false
VITE_ENABLE_CONSOLE_LOGS=false
VITE_ENABLE_API_FALLBACK=true
```

## Sistema de Configuração Centralizada

### Arquivo `src/config/environment.js`

Este arquivo centraliza todas as configurações e oferece uma interface limpa para acessar as variáveis de ambiente:

```javascript
// Configurações da API
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.opendoors.xyz/v1',
  quoteEndpoint: import.meta.env.VITE_API_QUOTE_ENDPOINT || '/quote',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
}

// Configurações da Aplicação
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'OpenDoors Conversor',
  version: import.meta.env.VITE_APP_VERSION || '2.0.0',
  environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
}

// Configurações do Timer
export const TIMER_CONFIG = {
  duration: parseInt(import.meta.env.VITE_TIMER_DURATION) || 175,
}

// Configurações da Wallet
export const WALLET_CONFIG = {
  address: import.meta.env.VITE_WALLET_ADDRESS || '0xa8ED07B214000060980B299998b5128b76A3b4D1',
  network: import.meta.env.VITE_WALLET_NETWORK || 'TETHER (ETHEREUM)',
  minAmount: import.meta.env.VITE_WALLET_MIN_AMOUNT || '5 USDT',
  maxAmount: import.meta.env.VITE_WALLET_MAX_AMOUNT || '60000 USDT',
  networkFees: import.meta.env.VITE_WALLET_NETWORK_FEES || '$0.04',
}
```

## Variáveis de Ambiente Disponíveis

### Configurações da API

| Variável | Descrição | Padrão | Exemplo |
|----------|-----------|---------|---------|
| `VITE_API_BASE_URL` | URL base da API | `https://api.opendoors.xyz/v1` | `http://localhost:8090/v1` |
| `VITE_API_QUOTE_ENDPOINT` | Endpoint para cotações | `/quote` | `/quotes` |
| `VITE_API_TIMEOUT` | Timeout das requisições (ms) | `10000` | `5000` |

### Configurações da Aplicação

| Variável | Descrição | Padrão | Exemplo |
|----------|-----------|---------|---------|
| `VITE_APP_NAME` | Nome da aplicação | `OpenDoors Conversor` | `Meu Conversor` |
| `VITE_APP_VERSION` | Versão da aplicação | `2.0.0` | `1.5.2` |
| `VITE_APP_ENVIRONMENT` | Ambiente atual | `development` | `production` |

### Configurações do Timer

| Variável | Descrição | Padrão | Exemplo |
|----------|-----------|---------|---------|
| `VITE_TIMER_DURATION` | Duração do timer (segundos) | `175` | `300` |

### Configurações da Wallet

| Variável | Descrição | Padrão | Exemplo |
|----------|-----------|---------|---------|
| `VITE_WALLET_ADDRESS` | Endereço da wallet | `0xa8ED07B214000060980B299998b5128b76A3b4D1` | `0x123...` |
| `VITE_WALLET_NETWORK` | Rede da wallet | `TETHER (ETHEREUM)` | `USDC (POLYGON)` |
| `VITE_WALLET_MIN_AMOUNT` | Valor mínimo | `5 USDT` | `10 USDT` |
| `VITE_WALLET_MAX_AMOUNT` | Valor máximo | `60000 USDT` | `100000 USDT` |
| `VITE_WALLET_NETWORK_FEES` | Taxa da rede | `$0.04` | `$0.10` |

### Configurações de Debug

| Variável | Descrição | Padrão | Exemplo |
|----------|-----------|---------|---------|
| `VITE_DEBUG_MODE` | Modo debug ativo | `true` | `false` |
| `VITE_ENABLE_CONSOLE_LOGS` | Logs no console | `true` | `false` |

### Configurações de Fallback

| Variável | Descrição | Padrão | Exemplo |
|----------|-----------|---------|---------|
| `VITE_ENABLE_API_FALLBACK` | Fallback quando API falha | `true` | `false` |
| `VITE_FALLBACK_RATE_USD_BRL` | Taxa USD para BRL | `5.85` | `6.00` |
| `VITE_FALLBACK_RATE_USD_EUR` | Taxa USD para EUR | `0.92` | `0.90` |

## Sistema de Logs Inteligente

### Funções de Log Disponíveis

```javascript
import { debugLog, errorLog, warnLog } from '../config/environment.js'

// Log de debug (apenas em desenvolvimento com DEBUG_MODE=true)
debugLog('Informação de debug', { data: 'exemplo' })

// Log de erro (sempre ativo quando ENABLE_CONSOLE_LOGS=true)
errorLog('Erro crítico', error)

// Log de aviso (ativo quando ENABLE_CONSOLE_LOGS=true)
warnLog('Aviso importante', 'detalhes')
```

### Controle Condicional

Os logs são controlados pelas variáveis de ambiente:

- **debugLog**: Só funciona quando `VITE_DEBUG_MODE=true` E `VITE_ENABLE_CONSOLE_LOGS=true`
- **errorLog**: Funciona quando `VITE_ENABLE_CONSOLE_LOGS=true`
- **warnLog**: Funciona quando `VITE_ENABLE_CONSOLE_LOGS=true`

## Uso nos Componentes

### Timer Component

```javascript
import { TIMER_CONFIG } from '../config/environment.js'

export default function Timer({ 
  initialSeconds = TIMER_CONFIG.duration, // Usa variável de ambiente
  onExpire, 
  // ...
}) {
  // Implementação do timer
}
```

### API Service

```javascript
import { API_CONFIG, debugLog, errorLog } from '../config/environment.js'

const API_SETTINGS = {
  baseUrl: API_CONFIG.baseUrl,
  endpoints: {
    quote: API_CONFIG.quoteEndpoint
  },
  timeout: API_CONFIG.timeout
}

export const getQuote = async (requestBody) => {
  try {
    const url = `${API_SETTINGS.baseUrl}${API_SETTINGS.endpoints.quote}`
    debugLog('Enviando requisição para:', url)
    
    // Implementação da requisição
  } catch (error) {
    errorLog('Erro na requisição da API:', error)
    throw error
  }
}
```

### Quote Details Screen

```javascript
import { WALLET_CONFIG } from '../config/environment.js'

export default function QuoteDetailsScreen({ transactionData, onBack }) {
  const walletData = {
    address: WALLET_CONFIG.address,
    network: WALLET_CONFIG.network,
    minimum: WALLET_CONFIG.minAmount,
    maximum: WALLET_CONFIG.maxAmount,
    networkFees: WALLET_CONFIG.networkFees,
    // ...
  }
  
  // Implementação do componente
}
```

## Configuração por Ambiente

### Desenvolvimento Local

Para desenvolvimento local, edite `.env.local`:

```bash
# API local para desenvolvimento
VITE_API_BASE_URL=http://localhost:8090/v1
VITE_DEBUG_MODE=true
VITE_ENABLE_CONSOLE_LOGS=true

# Timer mais longo para testes
VITE_TIMER_DURATION=300

# Wallet de teste
VITE_WALLET_ADDRESS=0xTEST123...
```

### Staging/Homologação

Para ambiente de staging, edite `.env.staging`:

```bash
# API de staging
VITE_API_BASE_URL=https://staging-api.opendoors.xyz/v1
VITE_DEBUG_MODE=true
VITE_ENABLE_CONSOLE_LOGS=true

# Configurações de teste
VITE_WALLET_ADDRESS=0xSTAGING123...
```

### Produção

Para produção, edite `.env.production`:

```bash
# API de produção
VITE_API_BASE_URL=https://api.opendoors.xyz/v1
VITE_DEBUG_MODE=false
VITE_ENABLE_CONSOLE_LOGS=false

# Configurações reais
VITE_WALLET_ADDRESS=0xPROD123...
```

## Funções Utilitárias

### Verificação de Ambiente

```javascript
import { isDevelopment, isProduction } from '../config/environment.js'

if (isDevelopment()) {
  console.log('Rodando em desenvolvimento')
}

if (isProduction()) {
  console.log('Rodando em produção')
}
```

### Configuração Completa

```javascript
import { ENV_CONFIG } from '../config/environment.js'

// Acesso a todas as configurações
console.log('Configurações carregadas:', ENV_CONFIG)
```

## Build e Deploy

### Comandos de Build

```bash
# Build para desenvolvimento
npm run build

# Build para produção
npm run build --mode production

# Build para staging
npm run build --mode staging
```

### Verificação de Variáveis

Para verificar quais variáveis estão sendo carregadas:

```javascript
// No console do navegador (apenas em desenvolvimento)
console.log('Variáveis de ambiente:', import.meta.env)
```

## Segurança

### Prefixo VITE_

**IMPORTANTE**: Apenas variáveis com prefixo `VITE_` são expostas no cliente. Isso é uma medida de segurança do Vite.

```bash
# ✅ Será exposta no cliente
VITE_API_URL=https://api.example.com

# ❌ NÃO será exposta no cliente
SECRET_KEY=abc123
```

### Dados Sensíveis

Nunca coloque dados sensíveis em variáveis `VITE_`:

- Chaves de API privadas
- Senhas
- Tokens de autenticação
- Informações confidenciais

## Troubleshooting

### Variável Não Carrega

1. Verifique se tem o prefixo `VITE_`
2. Reinicie o servidor de desenvolvimento
3. Verifique se o arquivo `.env` está na raiz do projeto
4. Confirme que não há espaços ao redor do `=`

### Logs Não Aparecem

1. Verifique `VITE_ENABLE_CONSOLE_LOGS=true`
2. Para debug logs, confirme `VITE_DEBUG_MODE=true`
3. Verifique se está importando as funções corretas

### Configuração Não Aplica

1. Confirme que está importando de `../config/environment.js`
2. Verifique se o componente está usando a configuração
3. Reinicie o servidor após mudanças no `.env`

## Exemplos Práticos

### Mudança de API

Para mudar a API de desenvolvimento para produção:

```bash
# .env.local (desenvolvimento)
VITE_API_BASE_URL=http://localhost:8090/v1

# .env.production (produção)
VITE_API_BASE_URL=https://api.opendoors.xyz/v1
```

### Timer Personalizado

Para diferentes durações de timer:

```bash
# Desenvolvimento (timer longo para testes)
VITE_TIMER_DURATION=600

# Produção (timer padrão)
VITE_TIMER_DURATION=175
```

### Debug Condicional

Para ativar/desativar logs:

```bash
# Desenvolvimento
VITE_DEBUG_MODE=true
VITE_ENABLE_CONSOLE_LOGS=true

# Produção
VITE_DEBUG_MODE=false
VITE_ENABLE_CONSOLE_LOGS=false
```

## Conclusão

O sistema de variáveis de ambiente do OpenDoors Conversor oferece flexibilidade total para configurar a aplicação em diferentes ambientes. Com controle granular sobre APIs, logs, timer e dados da wallet, é possível adaptar a aplicação para qualquer cenário de uso.

A estrutura centralizada em `src/config/environment.js` garante que todas as configurações sejam facilmente acessíveis e modificáveis, enquanto o sistema de logs inteligente permite debugging eficiente em desenvolvimento e operação limpa em produção.

---

*Guia criado para OpenDoors Conversor v2.0.0*
*Última atualização: 30/08/2025*


/**
 * Configurações de Ambiente
 *
 * Este arquivo centraliza todas as variáveis de ambiente da aplicação.
 * As variáveis são carregadas automaticamente pelo Vite baseado no ambiente atual.
 *
 * Prefixo VITE_ é obrigatório para que as variáveis sejam expostas no cliente.
 */

// Configurações da API
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.opendoors.xyz/v1',
  quoteEndpoint: import.meta.env.VITE_API_QUOTE_ENDPOINT || '/quotes',
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

// Configurações de Debug
export const DEBUG_CONFIG = {
  enabled: import.meta.env.VITE_DEBUG_MODE === 'true',
  enableConsoleLogs: import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true',
}

// Configurações de Fallback
export const FALLBACK_CONFIG = {
  enabled: import.meta.env.VITE_ENABLE_API_FALLBACK === 'true',
  rates: {
    usdToBrl: parseFloat(import.meta.env.VITE_FALLBACK_RATE_USD_BRL) || 5.85,
    usdToEur: parseFloat(import.meta.env.VITE_FALLBACK_RATE_USD_EUR) || 0.92,
  }
}

// Função utilitária para verificar se está em desenvolvimento
export const isDevelopment = () => APP_CONFIG.environment === 'development'

// Função utilitária para verificar se está em produção
export const isProduction = () => APP_CONFIG.environment === 'production'

// Função utilitária para logs condicionais
export const debugLog = (...args) => {
  if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.enableConsoleLogs) {
    console.log('[DEBUG]', ...args)
  }
}

// Função utilitária para logs de erro
export const errorLog = (...args) => {
  if (DEBUG_CONFIG.enableConsoleLogs) {
    console.error('[ERROR]', ...args)
  }
}

// Função utilitária para logs de aviso
export const warnLog = (...args) => {
  if (DEBUG_CONFIG.enableConsoleLogs) {
    console.warn('[WARN]', ...args)
  }
}

// Exportação de todas as configurações
export const ENV_CONFIG = {
  API: API_CONFIG,
  APP: APP_CONFIG,
  TIMER: TIMER_CONFIG,
  WALLET: WALLET_CONFIG,
  DEBUG: DEBUG_CONFIG,
  FALLBACK: FALLBACK_CONFIG,
}

// Log das configurações carregadas (apenas em desenvolvimento)
if (isDevelopment()) {
  debugLog('Configurações de ambiente carregadas:', ENV_CONFIG)
}

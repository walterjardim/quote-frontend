import { API_CONFIG, FALLBACK_CONFIG, debugLog, errorLog, warnLog } from '../config/environment.js'

// Configuração da API usando variáveis de ambiente
const API_SETTINGS = {
  baseUrl: API_CONFIG.baseUrl,
  endpoints: {
    quote: API_CONFIG.quoteEndpoint
  },
  timeout: API_CONFIG.timeout
}

// Taxas simuladas para fallback (valores aproximados para demonstração)
const SIMULATED_RATES = {
  // Crypto para Fiat
  'USDT_ETH_BRL': 5.85,
  'USDT_TRX_BRL': 5.83,
  'USDC_ETH_BRL': 5.84,
  'USDC_SOL_BRL': 5.82,
  'USDC_POL_BRL': 5.81,
  'USDC_BASE_BRL': 5.83,

  'USDT_ETH_USD': 1.00,
  'USDT_TRX_USD': 0.998,
  'USDC_ETH_USD': 0.999,
  'USDC_SOL_USD': 0.997,
  'USDC_POL_USD': 0.996,
  'USDC_BASE_USD': 0.998,

  'USDT_ETH_EUR': 0.92,
  'USDT_TRX_EUR': 0.918,
  'USDC_ETH_EUR': 0.919,
  'USDC_SOL_EUR': 0.917,
  'USDC_POL_EUR': 0.916,
  'USDC_BASE_EUR': 0.918,

  'USDT_ETH_COP': 4250.00,
  'USDT_TRX_COP': 4240.00,
  'USDC_ETH_COP': 4245.00,
  'USDC_SOL_COP': 4235.00,
  'USDC_POL_COP': 4230.00,
  'USDC_BASE_COP': 4242.00,

  'USDT_ETH_MXN': 20.15,
  'USDT_TRX_MXN': 20.10,
  'USDC_ETH_MXN': 20.12,
  'USDC_SOL_MXN': 20.08,
  'USDC_POL_MXN': 20.05,
  'USDC_BASE_MXN': 20.11,

  // Fiat para Crypto (inverso aproximado)
  'BRL_USDT_ETH': 0.171,
  'BRL_USDT_TRX': 0.172,
  'BRL_USDC_ETH': 0.171,
  'BRL_USDC_SOL': 0.172,
  'BRL_USDC_POL': 0.173,
  'BRL_USDC_BASE': 0.172,

  'USD_USDT_ETH': 1.00,
  'USD_USDT_TRX': 1.002,
  'USD_USDC_ETH': 1.001,
  'USD_USDC_SOL': 1.003,
  'USD_USDC_POL': 1.004,
  'USD_USDC_BASE': 1.002,

  // Fiat para Fiat
  'USD_BRL': 5.85,
  'BRL_USD': 0.171,
  'EUR_BRL': 6.35,
  'BRL_EUR': 0.157,
  'USD_EUR': 0.92,
  'EUR_USD': 1.087,
  'USD_COP': 4250.00,
  'COP_USD': 0.000235,
  'USD_MXN': 20.15,
  'MXN_USD': 0.0496,
  'EUR_COP': 4620.00,
  'COP_EUR': 0.000216,
  'EUR_MXN': 21.90,
  'MXN_EUR': 0.0457,
  'BRL_COP': 726.50,
  'COP_BRL': 0.00138,
  'BRL_MXN': 3.44,
  'MXN_BRL': 0.291,
  'COP_MXN': 0.00474,
  'MXN_COP': 211.00
}

/**
 * Normaliza o código da moeda para o formato usado nas taxas simuladas
 */
const normalizeCurrencyCode = (code) => {
  // Mapear códigos compostos para formato de taxa
  const mapping = {
    'USDC_SOL': 'USDC_SOL',
    'USDC_POL': 'USDC_POL',
    'USDC_BASE': 'USDC_BASE',
    'USDC_ETH': 'USDC_ETH',
    'USDT_ETH': 'USDT_ETH',
    'USDT_TRX': 'USDT_TRX'
  }

  return mapping[code] || code
}

/**
 * Serviço para obter cotação de conversão de moedas
 * @param {Object} requestBody - Dados da requisição
 * @returns {Promise<Object>} Resposta da API com a cotação
 */
export const getQuote = async (requestBody) => {
  try {
    const url = `${API_SETTINGS.baseUrl}${API_SETTINGS.endpoints.quote}`

    debugLog('Enviando requisição para:', url)
    debugLog('Dados da requisição:', requestBody)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_SETTINGS.timeout)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    const quote = await response.json()

    debugLog('Status da resposta:', response.status)
    debugLog('Resposta completa da API:', quote)

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`)
    }

    return quote;

  } catch (error) {
    errorLog('Erro na requisição da API:', error)

    // Se o fallback estiver habilitado, pode implementar lógica de fallback aqui
    if (FALLBACK_CONFIG.enabled) {
      warnLog('API indisponível, considere implementar fallback')
    }

    throw new Error(error);
  }
}

/**
 * Atualiza a configuração da API (útil para mudanças de endpoint)
 * @param {Object} newConfig - Nova configuração
 */
export const updateApiConfig = (newConfig) => {
  Object.assign(API_SETTINGS, newConfig)
  debugLog('Configuração da API atualizada:', API_SETTINGS)
}

/**
 * Obtém a configuração atual da API
 * @returns {Object} Configuração atual
 */
export const getApiConfig = () => {
  return { ...API_SETTINGS }
}

/**
 * Obtém todas as taxas simuladas disponíveis
 * @returns {Object} Objeto com todas as taxas
 */
export const getSimulatedRates = () => {
  return { ...SIMULATED_RATES }
}

/**
 * Adiciona ou atualiza uma taxa simulada
 * @param {string} from - Moeda de origem
 * @param {string} to - Moeda de destino
 * @param {number} rate - Taxa de conversão
 */
export const updateSimulatedRate = (from, to, rate) => {
  const rateKey = `${from}_${to}`
  SIMULATED_RATES[rateKey] = rate
  debugLog(`Taxa simulada atualizada: ${rateKey} = ${rate}`)
}

/**
 * Faz upload de documento para a API
 * @param {Object} documentData - Dados do documento
 * @param {string} documentData.scope - Escopo do documento
 * @param {string} documentData.type - Tipo do documento
 * @param {string} documentData.purpose - Propósito do documento
 * @param {File} documentData.file - Arquivo a ser enviado
 * @returns {Promise<Object>} Resposta da API com o ID do documento
 */
export const uploadDocument = async (documentData) => {
  try {
    const url = `${API_SETTINGS.baseUrl}/documents`

    debugLog('Enviando documento para:', url)
    debugLog('Dados do documento:', {
      scope: documentData.scope,
      type: documentData.type,
      purpose: documentData.purpose,
      fileName: documentData.file?.name,
      fileSize: documentData.file?.size
    })

    // Criar FormData para multipart/form-data
    const formData = new FormData()
    formData.append('scope', documentData.scope)
    formData.append('type', documentData.type)
    formData.append('purpose', documentData.purpose)
    formData.append('file', documentData.file)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_SETTINGS.timeout)

    const response = await fetch(url, {
      method: 'POST',
      body: formData, // Não definir Content-Type, o browser define automaticamente para multipart/form-data
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    debugLog('Status da resposta:', response.status)

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} - ${response.statusText}`)
    }

    const result = await response.json()
    debugLog('Resposta completa da API:', result)

    return {
      success: true,
      data: result
    }

  } catch (error) {
    errorLog('Erro no upload do documento:', error)

    // Se o fallback estiver habilitado, simular resposta
    if (FALLBACK_CONFIG.enabled) {
      warnLog('API indisponível, usando fallback para upload de documento')

      // Simular um ID de documento
      const simulatedId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return {
        success: true,
        data: {
          id: simulatedId,
          scope: documentData.scope,
          type: documentData.type,
          purpose: documentData.purpose,
          fileName: documentData.file?.name,
          uploadedAt: new Date().toISOString(),
          status: 'uploaded'
        }
      }
    }

    return {
      success: false,
      error: error.message || 'Erro ao fazer upload do documento'
    }
  }
}

export default {
  getQuote,
  uploadDocument,
  updateApiConfig,
  getApiConfig,
  getSimulatedRates,
  updateSimulatedRate
}

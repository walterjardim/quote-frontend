// Configuração da API - fácil de alterar no futuro
const API_CONFIG = {
  baseUrl: 'https://api.opendoors.xyz/v1',
  endpoints: {
    quote: '/quote'
  }
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
 * Obtém a taxa simulada para um par de moedas
 */
const getSimulatedRate = (from, to) => {
  const normalizedFrom = normalizeCurrencyCode(from)
  const normalizedTo = normalizeCurrencyCode(to)
  const rateKey = `${normalizedFrom}_${normalizedTo}`
  
  // Tentar taxa direta
  if (SIMULATED_RATES[rateKey]) {
    return SIMULATED_RATES[rateKey]
  }
  
  // Tentar taxa inversa
  const inverseKey = `${normalizedTo}_${normalizedFrom}`
  if (SIMULATED_RATES[inverseKey]) {
    return 1 / SIMULATED_RATES[inverseKey]
  }
  
  // Taxa padrão se não encontrar
  console.warn(`Taxa não encontrada para ${from} -> ${to}, usando taxa padrão`)
  return 1.0
}

/**
 * Serviço para obter cotação de conversão de moedas
 * @param {number} amount - Valor a ser convertido
 * @param {string} from - Moeda de origem
 * @param {string} to - Moeda de destino
 * @returns {Promise<Object>} Resposta da API com a cotação
 */
export const getQuote = async (amount, from, to) => {
  try {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.quote}`
    
    const requestBody = {
      amount: parseFloat(amount),
      from: from,
      to: to
    }

    console.log('Enviando requisição para:', url)
    console.log('Dados da requisição:', requestBody)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const data = await response.json()
    
    console.log('Status da resposta:', response.status)
    console.log('Resposta completa da API:', data)

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} - ${data.message || 'Erro desconhecido'}`)
    }

    return {
      success: true,
      data: data,
      amount: data.amount || data.result || data.value,
      rate: data.rate,
      timestamp: data.timestamp || new Date().toISOString()
    }

  } catch (error) {
    console.error('Erro na requisição da API:', error)
    
    // Fallback com taxa simulada para demonstração
    const simulatedRate = getSimulatedRate(from, to)
    const simulatedAmount = (parseFloat(amount) * simulatedRate).toFixed(6)
    
    console.log('Usando fallback com taxa simulada:', {
      originalAmount: amount,
      from: from,
      to: to,
      rate: simulatedRate,
      convertedAmount: simulatedAmount
    })

    return {
      success: false,
      error: error.message,
      fallback: true,
      data: {
        amount: simulatedAmount,
        rate: simulatedRate,
        from: from,
        to: to
      },
      amount: simulatedAmount,
      rate: simulatedRate,
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Atualiza a configuração da API (útil para mudanças de endpoint)
 * @param {Object} newConfig - Nova configuração
 */
export const updateApiConfig = (newConfig) => {
  Object.assign(API_CONFIG, newConfig)
  console.log('Configuração da API atualizada:', API_CONFIG)
}

/**
 * Obtém a configuração atual da API
 * @returns {Object} Configuração atual
 */
export const getApiConfig = () => {
  return { ...API_CONFIG }
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
  console.log(`Taxa simulada atualizada: ${rateKey} = ${rate}`)
}

export default {
  getQuote,
  updateApiConfig,
  getApiConfig,
  getSimulatedRates,
  updateSimulatedRate
}


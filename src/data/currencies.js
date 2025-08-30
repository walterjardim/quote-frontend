// Dados das moedas organizadas por categoria
export const CURRENCIES = {
  fiat: [
    {
      code: 'BRL',
      name: 'Real',
      fullName: 'Brazilian Real',
      flag: '🇧🇷',
      color: 'bg-green-500'
    },
    {
      code: 'COP',
      name: 'Peso Colombiano',
      fullName: 'Colombian Peso',
      flag: '🇨🇴',
      color: 'bg-yellow-500'
    },
    {
      code: 'EUR',
      name: 'Euro',
      fullName: 'Euro',
      flag: '🇪🇺',
      color: 'bg-blue-500'
    },
    {
      code: 'MXN',
      name: 'Peso Mexicano',
      fullName: 'Mexican Peso',
      flag: '🇲🇽',
      color: 'bg-red-500'
    },
    {
      code: 'USD',
      name: 'Dólar Americano',
      fullName: 'US Dollar',
      flag: '🇺🇸',
      color: 'bg-green-600'
    }
  ],
  crypto: [
    {
      code: 'USDC_SOL',
      name: 'USDC (SOL)',
      fullName: 'USD Coin on Solana',
      network: 'SOL',
      description: 'USD',
      icon: '💰',
      color: 'bg-purple-500'
    },
    {
      code: 'USDC_POL',
      name: 'USDC (POL)',
      fullName: 'USD Coin on Polygon',
      network: 'POL',
      description: 'USD',
      icon: '💰',
      color: 'bg-purple-600'
    },
    {
      code: 'USDC_BASE',
      name: 'USDC (BASE)',
      fullName: 'USD Coin on Base',
      network: 'BASE',
      description: 'USD',
      icon: '💰',
      color: 'bg-blue-600'
    },
    {
      code: 'USDC_ETH',
      name: 'USDC (ETH)',
      fullName: 'USD Coin on Ethereum',
      network: 'ETH',
      description: 'USD',
      icon: '💰',
      color: 'bg-blue-500'
    },
    {
      code: 'USDT_ETH',
      name: 'USDT (ETH)',
      fullName: 'Tether on Ethereum',
      network: 'ETH',
      description: 'Tether',
      icon: '₮',
      color: 'bg-green-500'
    },
    {
      code: 'USDT_TRX',
      name: 'USDT (TRX)',
      fullName: 'Tether on Tron',
      network: 'TRX',
      description: 'Tether',
      icon: '₮',
      color: 'bg-red-500'
    }
  ]
}

// Função para obter todas as moedas em uma lista plana
export const getAllCurrencies = () => {
  return [
    ...CURRENCIES.fiat.map(currency => ({ ...currency, category: 'fiat' })),
    ...CURRENCIES.crypto.map(currency => ({ ...currency, category: 'crypto' }))
  ]
}

// Função para encontrar uma moeda pelo código
export const findCurrencyByCode = (code) => {
  const allCurrencies = getAllCurrencies()
  return allCurrencies.find(currency => currency.code === code)
}

// Função para obter o display name de uma moeda
export const getCurrencyDisplayName = (code) => {
  const currency = findCurrencyByCode(code)
  if (!currency) return code
  
  if (currency.category === 'fiat') {
    return `${currency.code} | ${currency.name}`
  } else {
    return `${currency.name} | ${currency.description}`
  }
}

// Função para obter o ícone/flag de uma moeda
export const getCurrencyIcon = (code) => {
  const currency = findCurrencyByCode(code)
  if (!currency) return '💱'
  
  return currency.flag || currency.icon || '💱'
}

// Moedas padrão
export const DEFAULT_FROM_CURRENCY = 'USDT_ETH'
export const DEFAULT_TO_CURRENCY = 'BRL'


// Dados das moedas organizadas por categoria
export const CURRENCIES = {
  fiat: [
    {
      code: 'BRL',
      name: 'Real',
      fullName: 'Brazilian Real',
      flag: '🇧🇷',
      color: 'bg-green-500',
      asset: 'BRL'
    },
    {
      code: 'COP',
      name: 'Peso Colombiano',
      fullName: 'Colombian Peso',
      flag: '🇨🇴',
      color: 'bg-yellow-500',
      asset: 'COP'
    },
    {
      code: 'EUR',
      name: 'Euro',
      fullName: 'Euro',
      flag: '🇪🇺',
      color: 'bg-blue-500',
      asset: 'EUR'
    },
    {
      code: 'MXN',
      name: 'Peso Mexicano',
      fullName: 'Mexican Peso',
      flag: '🇲🇽',
      color: 'bg-red-500',
      asset: 'MXN'
    },
    {
      code: 'USD',
      name: 'Dólar Americano',
      fullName: 'US Dollar',
      flag: '🇺🇸',
      color: 'bg-green-600',
      asset: 'USD'
    }
  ],
  crypto: [
    {
      code: 'USDC_SOL',
      name: 'USDC (SOL)',
      fullName: 'USD Coin on Solana',
      network: 'solana',
      description: 'USD',
      icon: '💰',
      color: 'bg-purple-500',
      asset: 'USDC'
    },
    {
      code: 'USDC_POL',
      name: 'USDC (POL)',
      fullName: 'USD Coin on Polygon',
      network: 'polygon',
      description: 'USD',
      icon: '💰',
      color: 'bg-purple-600',
      asset: 'USDC'
    },
    {
      code: 'USDC_BASE',
      name: 'USDC (BASE)',
      fullName: 'USD Coin on Base',
      network: 'base',
      description: 'USD',
      icon: '💰',
      color: 'bg-blue-600',
      asset: 'USDC'
    },
    {
      code: 'USDC_ETH',
      name: 'USDC (ETH)',
      fullName: 'USD Coin on Ethereum',
      network: 'ethereum',
      description: 'USD',
      icon: '💰',
      color: 'bg-blue-500',
      asset: 'USDC'
    },
    {
      code: 'USDT_ETH',
      name: 'USDT (ETH)',
      fullName: 'Tether on Ethereum',
      network: 'ethereum',
      description: 'Tether',
      icon: '₮',
      color: 'bg-green-500',
      asset: 'USDT'
    },
    {
      code: 'USDT_TRX',
      name: 'USDT (TRX)',
      fullName: 'Tether on Tron',
      network: 'tron',
      description: 'Tether',
      icon: '₮',
      color: 'bg-red-500',
      asset: 'USDT'
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

export const getCurrencyNetwork = (code) => {
  const currency = findCurrencyByCode(code)
  if (!currency) return ''

  let network = '';

  if (currency.category === 'crypto') {
    network = currency.network;
  }

  return network;
}

export const getCurrencyCategory = (code) => {
  const currency = findCurrencyByCode(code)
  if (!currency) return ''

  return currency.category;
}

// Moedas padrão
export const DEFAULT_FROM_CURRENCY = 'USDT_ETH'
export const DEFAULT_TO_CURRENCY = 'BRL'

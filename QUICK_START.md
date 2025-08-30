# 🚀 Guia de Início Rápido - Conversor Multi-Currency

## ⚡ Execução Rápida (2 minutos)

```bash
# 1. Entre no diretório
cd usdt-brl-converter

# 2. Instale dependências
pnpm install

# 3. Execute a aplicação
pnpm run dev

# 4. Abra http://localhost:5173
```

## 🎯 Teste Rápido das Funcionalidades

### 1. **Teste Básico de Conversão**
- Selecione **USDT (ETH)** como moeda de origem
- Selecione **BRL** como moeda de destino  
- Digite **100** no campo de valor
- Clique em **"Converter"**
- Resultado esperado: ~**585.00 BRL**

### 2. **Teste de Múltiplas Moedas**
- Clique no combobox da moeda de origem
- Veja as categorias **Fiat** e **Crypto**
- Teste busca digitando "USD"
- Selecione **USD | Dólar Americano**
- Mude destino para **EUR | Euro**
- Converta **100 USD** → **~92.00 EUR**

### 3. **Teste de Troca de Moedas**
- Clique no botão de setas ↕️ no meio
- Veja as moedas trocarem de posição
- Valores são limpos automaticamente

### 4. **Teste do Fluxo Completo**
- Faça uma conversão qualquer
- Clique em **"Prosseguir com a Conversão"**
- Veja a tela de confirmação
- Clique em **"Nova Conversão"** para voltar

## 🔍 Verificação de Logs

Abra o **Console do Navegador** (F12) e veja:
```
✅ Enviando requisição para: https://api.opendoors.xyz/v1/quote
✅ Dados da requisição: {amount: 100, from: "USD", to: "EUR"}
⚠️  Usando fallback com taxa simulada: {rate: 0.92, convertedAmount: "92.000000"}
```

## 📱 Moedas Disponíveis para Teste

### Fiat (5 moedas)
- 🇧🇷 **BRL** | Real
- 🇨🇴 **COP** | Peso Colombiano  
- 🇪🇺 **EUR** | Euro
- 🇲🇽 **MXN** | Peso Mexicano
- 🇺🇸 **USD** | Dólar Americano

### Crypto (6 moedas)
- 💰 **USDC (SOL)** | USD
- 💰 **USDC (POL)** | USD
- 💰 **USDC (BASE)** | USD
- 💰 **USDC (ETH)** | USD
- ₮ **USDT (ETH)** | Tether
- ₮ **USDT (TRX)** | Tether

## 🧪 Combinações de Teste Sugeridas

| De | Para | Valor | Resultado Esperado |
|----|------|-------|-------------------|
| USD | BRL | 100 | ~585.00 |
| EUR | USD | 100 | ~108.70 |
| USDT_ETH | BRL | 50 | ~292.50 |
| BRL | USD | 585 | ~100.00 |
| USDC_SOL | EUR | 100 | ~91.70 |

## ⚠️ Problemas Comuns

**Combobox não abre?**
- Clique diretamente no botão da moeda
- Aguarde carregamento completo da página

**Conversão não funciona?**
- Verifique se inseriu um valor válido
- Confirme que selecionou moedas diferentes
- API externa pode estar indisponível (fallback ativará)

**Build não funciona?**
```bash
# Limpe e reinstale
rm -rf node_modules
pnpm install
pnpm run build
```

## 🚀 Deploy Rápido na AWS

```bash
# Configure AWS (uma vez)
aws configure

# Deploy automático
./deploy.sh

# Ou manual
pnpm run build
aws s3 sync dist/ s3://seu-bucket --delete
aws s3 website s3://seu-bucket --index-document index.html
```

## 📊 Verificação de Funcionamento

### ✅ Checklist de Teste
- [ ] Aplicação carrega em http://localhost:5173
- [ ] Comboboxes abrem e mostram moedas
- [ ] Busca funciona nos comboboxes
- [ ] Conversão retorna resultado numérico
- [ ] Tela de confirmação aparece
- [ ] Navegação entre telas funciona
- [ ] Console mostra logs detalhados
- [ ] Interface é responsiva (teste mobile)

### 🎯 Tempo Total de Teste: ~5 minutos

---

**💡 Dica**: Mantenha o console aberto para ver todos os logs da aplicação!


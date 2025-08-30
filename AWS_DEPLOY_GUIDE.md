# Guia Completo de Deploy na AWS S3

Este guia fornece instruções detalhadas para fazer o deploy da aplicação Conversor USDT para BRL na Amazon Web Services (AWS) usando S3 para hospedagem de sites estáticos.

## 📋 Pré-requisitos

### Conta AWS
- Conta ativa na AWS (nível gratuito é suficiente)
- Acesso ao Console AWS ou AWS CLI configurado
- Cartão de crédito válido (mesmo para tier gratuito)

### Ferramentas Locais
- AWS CLI instalado e configurado (opcional, mas recomendado)
- Build da aplicação gerado (`dist/` folder)

## 🏗️ Passo 1: Preparação do Build

### 1.1 Gerar Build de Produção

No diretório do projeto, execute:

```bash
# Instalar dependências (se necessário)
pnpm install

# Gerar build otimizado
pnpm run build
```

### 1.2 Verificar Arquivos Gerados

Confirme que a pasta `dist/` contém:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   ├── index-[hash].js
│   └── apiService-[hash].js
└── favicon.ico (se existir)
```

### 1.3 Testar Build Localmente (Opcional)

```bash
pnpm run preview
```

Acesse `http://localhost:4173` para verificar se tudo funciona corretamente.

## 🪣 Passo 2: Criação do Bucket S3

### 2.1 Acessar Console AWS

1. Faça login no [Console AWS](https://console.aws.amazon.com)
2. Navegue para **S3** (Simple Storage Service)
3. Clique em **"Create bucket"**

### 2.2 Configurar Bucket

#### Nome do Bucket
- **Bucket name**: `usdt-brl-converter-[seu-nome]` 
  - Exemplo: `usdt-brl-converter-joao2025`
  - ⚠️ **Importante**: Nomes devem ser únicos globalmente

#### Região
- **AWS Region**: Escolha a região mais próxima dos usuários
  - Brasil: `sa-east-1` (São Paulo)
  - EUA: `us-east-1` (N. Virginia) - mais barato
  - Europa: `eu-west-1` (Irlanda)

#### Configurações de Acesso Público
- **Desmarque** "Block all public access"
- **Marque** a confirmação de que entende os riscos
- Isso é necessário para hospedagem web pública

#### Outras Configurações
- **Bucket Versioning**: Disabled (para economizar)
- **Tags**: Opcional (ex: `Project: USDT-Converter`)
- **Default encryption**: Disabled (para economizar)

### 2.3 Criar Bucket

Clique em **"Create bucket"** para finalizar.

## 📤 Passo 3: Upload dos Arquivos

### 3.1 Via Console AWS (Método Visual)

1. **Abra o bucket criado**
2. **Clique em "Upload"**
3. **Arraste todos os arquivos da pasta `dist/`**
   - Inclua `index.html`
   - Inclua toda a pasta `assets/`
   - Mantenha a estrutura de pastas
4. **Clique em "Upload"**

### 3.2 Via AWS CLI (Método Avançado)

```bash
# Configurar AWS CLI (se não configurado)
aws configure

# Sincronizar pasta dist com bucket
aws s3 sync dist/ s3://usdt-brl-converter-[seu-nome] --delete

# Definir tipo de conteúdo correto
aws s3 cp dist/index.html s3://usdt-brl-converter-[seu-nome]/index.html --content-type "text/html"
```

## 🌐 Passo 4: Configurar Hospedagem Web

### 4.1 Habilitar Static Website Hosting

1. **No bucket S3, vá para a aba "Properties"**
2. **Role até "Static website hosting"**
3. **Clique em "Edit"**
4. **Selecione "Enable"**
5. **Configure:**
   - **Index document**: `index.html`
   - **Error document**: `index.html` (para SPA routing)
6. **Clique em "Save changes"**

### 4.2 Anotar URL do Website

Após salvar, você verá:
- **Bucket website endpoint**: `http://usdt-brl-converter-[seu-nome].s3-website-[região].amazonaws.com`
- ⚠️ **Anote esta URL** - é o endereço do seu site

## 🔓 Passo 5: Configurar Permissões Públicas

### 5.1 Criar Política de Bucket

1. **Vá para a aba "Permissions"**
2. **Role até "Bucket policy"**
3. **Clique em "Edit"**
4. **Cole a seguinte política JSON:**

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::usdt-brl-converter-[seu-nome]/*"
        }
    ]
}
```

⚠️ **Substitua `[seu-nome]` pelo nome real do seu bucket**

### 5.2 Salvar Política

Clique em **"Save changes"**

## ✅ Passo 6: Testar Deployment

### 6.1 Acessar Site

1. **Abra o URL do website** (anotado no Passo 4.2)
2. **Verifique se a aplicação carrega corretamente**
3. **Teste a funcionalidade de conversão**

### 6.2 Verificar Funcionalidades

- [ ] Interface carrega sem erros
- [ ] Campos de entrada funcionam
- [ ] Botão de conversão executa
- [ ] Tela de confirmação aparece
- [ ] Navegação entre telas funciona
- [ ] Console não mostra erros críticos

## 💰 Estimativa de Custos (Tier Gratuito)

### S3 Free Tier (12 meses)
- **5 GB** de armazenamento padrão
- **20.000** requisições GET
- **2.000** requisições PUT/COPY/POST/LIST
- **15 GB** de transferência de dados por mês

### Custos Após Free Tier
- **Armazenamento**: ~$0.023 por GB/mês
- **Requisições GET**: $0.0004 por 1.000 requisições
- **Transferência**: $0.09 por GB (primeiros 10 TB)

### Estimativa para Site Pequeno
- **Armazenamento**: < 1 GB = **~$0.02/mês**
- **Tráfego moderado**: 1000 visitas/mês = **~$0.10/mês**
- **Total estimado**: **< $0.15/mês**

## 🚀 Passo 7: CloudFront CDN (Opcional - HTTPS e Performance)

### 7.1 Quando Usar CloudFront

**Vantagens:**
- HTTPS gratuito com certificado SSL
- Cache global para melhor performance
- Domínio personalizado possível
- Proteção DDoS básica

**Desvantagens:**
- Configuração mais complexa
- Custo adicional (mínimo ~$0.50/mês)
- Tempo de propagação de mudanças (15 minutos)

### 7.2 Configurar CloudFront

1. **Acesse CloudFront no Console AWS**
2. **Clique em "Create Distribution"**
3. **Configure Origin:**
   - **Origin Domain**: URL do S3 website (sem http://)
   - **Protocol**: HTTP only
4. **Configure Default Cache Behavior:**
   - **Viewer Protocol Policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP Methods**: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
5. **Configure Settings:**
   - **Price Class**: Use Only U.S., Canada and Europe (mais barato)
   - **Default Root Object**: `index.html`
6. **Clique em "Create Distribution"**

### 7.3 Configurar Error Pages (SPA)

1. **Após criação, edite a distribuição**
2. **Vá para "Error Pages"**
3. **Adicione Custom Error Response:**
   - **HTTP Error Code**: 404
   - **Response Page Path**: `/index.html`
   - **HTTP Response Code**: 200

### 7.4 Obter URL CloudFront

- URL será algo como: `https://d1234567890.cloudfront.net`
- Propagação leva 15-20 minutos

## 🔄 Passo 8: Atualizações Futuras

### 8.1 Processo de Atualização

1. **Fazer alterações no código**
2. **Gerar novo build:**
   ```bash
   pnpm run build
   ```
3. **Upload para S3:**
   ```bash
   aws s3 sync dist/ s3://usdt-brl-converter-[seu-nome] --delete
   ```
4. **Se usando CloudFront, invalidar cache:**
   ```bash
   aws cloudfront create-invalidation --distribution-id [ID] --paths "/*"
   ```

### 8.2 Automação com GitHub Actions (Avançado)

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to S3
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '20'
    - run: npm install
    - run: npm run build
    - uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: sa-east-1
    - run: aws s3 sync dist/ s3://usdt-brl-converter-[seu-nome] --delete
```

## 🛡️ Segurança e Melhores Práticas

### 8.1 Segurança do Bucket

- **Nunca** torne o bucket inteiro público
- Use **apenas** a política de leitura pública para objetos
- **Monitore** logs de acesso regularmente
- **Configure** alertas de billing

### 8.2 Performance

- **Comprima** assets antes do upload
- **Use** CloudFront para sites com tráfego internacional
- **Configure** headers de cache apropriados
- **Monitore** métricas de performance

### 8.3 Backup

- **Habilite** versionamento se necessário
- **Mantenha** backups do código fonte
- **Documente** configurações importantes

## 🔧 Solução de Problemas

### Erro 403 Forbidden
- Verifique se a política do bucket está correta
- Confirme se "Block public access" está desabilitado
- Verifique se os arquivos foram uploadados corretamente

### Site não carrega
- Confirme se "Static website hosting" está habilitado
- Verifique se `index.html` existe na raiz
- Teste o URL do website endpoint

### Erro 404 em rotas
- Configure error document como `index.html`
- Se usando CloudFront, configure custom error pages

### Custos inesperados
- Monitore dashboard de billing
- Configure alertas de custo
- Verifique se não há loops de requisições

## 📞 Suporte

### Recursos AWS
- [Documentação S3](https://docs.aws.amazon.com/s3/)
- [Guia Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [Suporte AWS](https://aws.amazon.com/support/)

### Comunidade
- [Stack Overflow - AWS](https://stackoverflow.com/questions/tagged/amazon-web-services)
- [Reddit r/aws](https://reddit.com/r/aws)
- [AWS Forums](https://forums.aws.amazon.com/)

---

**🎉 Parabéns! Sua aplicação está agora hospedada na AWS S3 com acesso global via HTTPS (se usando CloudFront).**


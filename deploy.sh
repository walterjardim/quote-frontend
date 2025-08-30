#!/bin/bash

# Script de Deploy Automatizado para AWS S3
# Conversor USDT para BRL

set -e  # Parar execução em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações (edite conforme necessário)
BUCKET_NAME="usdt-brl-converter-deploy"
AWS_REGION="sa-east-1"
CLOUDFRONT_DISTRIBUTION_ID=""  # Opcional: adicione se usar CloudFront

echo -e "${BLUE}🚀 Iniciando deploy do Conversor USDT para BRL${NC}"
echo "=================================================="

# Verificar se AWS CLI está instalado
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI não encontrado. Instale primeiro:${NC}"
    echo "   curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip'"
    echo "   unzip awscliv2.zip"
    echo "   sudo ./aws/install"
    exit 1
fi

# Verificar se AWS está configurado
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS CLI não configurado. Execute:${NC}"
    echo "   aws configure"
    exit 1
fi

# Verificar se pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm não encontrado. Usando npm...${NC}"
    PACKAGE_MANAGER="npm"
else
    PACKAGE_MANAGER="pnpm"
fi

echo -e "${BLUE}📦 Instalando dependências...${NC}"
$PACKAGE_MANAGER install

echo -e "${BLUE}🏗️  Gerando build de produção...${NC}"
$PACKAGE_MANAGER run build

# Verificar se build foi criado
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Pasta dist/ não encontrada. Build falhou.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build gerado com sucesso${NC}"
echo "   Arquivos:"
ls -la dist/

# Verificar se bucket existe
echo -e "${BLUE}🪣 Verificando bucket S3...${NC}"
if aws s3 ls "s3://$BUCKET_NAME" 2>/dev/null; then
    echo -e "${GREEN}✅ Bucket $BUCKET_NAME encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  Bucket $BUCKET_NAME não encontrado${NC}"
    read -p "Deseja criar o bucket? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}🏗️  Criando bucket...${NC}"
        aws s3 mb "s3://$BUCKET_NAME" --region $AWS_REGION
        
        # Configurar website hosting
        aws s3 website "s3://$BUCKET_NAME" --index-document index.html --error-document index.html
        
        # Aplicar política pública
        cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF
        
        aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
        rm bucket-policy.json
        
        echo -e "${GREEN}✅ Bucket criado e configurado${NC}"
    else
        echo -e "${RED}❌ Deploy cancelado${NC}"
        exit 1
    fi
fi

# Upload dos arquivos
echo -e "${BLUE}📤 Fazendo upload dos arquivos...${NC}"
aws s3 sync dist/ "s3://$BUCKET_NAME" --delete --exact-timestamps

# Definir content-type correto para HTML
aws s3 cp dist/index.html "s3://$BUCKET_NAME/index.html" --content-type "text/html" --metadata-directive REPLACE

echo -e "${GREEN}✅ Upload concluído${NC}"

# Invalidar CloudFront se configurado
if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo -e "${BLUE}🌐 Invalidando cache do CloudFront...${NC}"
    aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
    echo -e "${GREEN}✅ Cache invalidado${NC}"
fi

# Mostrar URLs
echo ""
echo -e "${GREEN}🎉 Deploy concluído com sucesso!${NC}"
echo "=================================================="
echo -e "${BLUE}📍 URLs de acesso:${NC}"
echo "   S3 Website: http://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com"

if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id $CLOUDFRONT_DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)
    echo "   CloudFront: https://$CLOUDFRONT_DOMAIN"
fi

echo ""
echo -e "${BLUE}📊 Informações do deploy:${NC}"
echo "   Bucket: $BUCKET_NAME"
echo "   Região: $AWS_REGION"
echo "   Data: $(date)"
echo "   Arquivos enviados: $(find dist -type f | wc -l)"

echo ""
echo -e "${YELLOW}💡 Próximos passos:${NC}"
echo "   1. Teste a aplicação no navegador"
echo "   2. Configure domínio personalizado (opcional)"
echo "   3. Configure CloudFront para HTTPS (opcional)"
echo "   4. Configure monitoramento e alertas"

echo ""
echo -e "${GREEN}✨ Deploy finalizado!${NC}"


#!/bin/bash

# Script de inicialização do projeto WhatsApp AI Backend

echo "🚀 Inicializando projeto WhatsApp AI Backend..."

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verifica se o npm está instalado
if ! command -v npm &> /dev/null
then
    echo "❌ npm não está instalado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "✅ Node.js e npm encontrados"

# Instala dependências
echo "📦 Instalando dependências..."
npm install

# Verifica se o arquivo .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando a partir do .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Arquivo .env criado. Por favor, configure suas variáveis de ambiente."
    else
        echo "❌ Arquivo .env.example não encontrado."
        exit 1
    fi
fi

echo "✅ Inicialização concluída!"
echo ""
echo "Para iniciar o servidor, execute:"
echo "  npm run dev"
echo ""


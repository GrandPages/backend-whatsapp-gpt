@echo off
REM Script de inicialização do projeto WhatsApp AI Backend (Windows)

echo 🚀 Inicializando projeto WhatsApp AI Backend...

REM Verifica se o Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não está instalado. Por favor, instale o Node.js primeiro.
    exit /b 1
)

REM Verifica se o npm está instalado
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm não está instalado. Por favor, instale o npm primeiro.
    exit /b 1
)

echo ✅ Node.js e npm encontrados

REM Instala dependências
echo 📦 Instalando dependências...
call npm install

REM Verifica se o arquivo .env existe
if not exist .env (
    echo ⚠️  Arquivo .env não encontrado. Criando a partir do .env.example...
    if exist .env.example (
        copy .env.example .env
        echo ✅ Arquivo .env criado. Por favor, configure suas variáveis de ambiente.
    ) else (
        echo ❌ Arquivo .env.example não encontrado.
        exit /b 1
    )
)

echo ✅ Inicialização concluída!
echo.
echo Para iniciar o servidor, execute:
echo   npm run dev
echo.

pause


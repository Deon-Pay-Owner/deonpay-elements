#!/bin/bash

echo "=== NPM Login Process ==="
echo ""
echo "Por favor, ingresa tus credenciales de NPM:"
echo ""

# Intentar login con npm adduser (legacy auth)
npm adduser --registry https://registry.npmjs.org/

# Verificar el resultado
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Login exitoso!"
    npm whoami
else
    echo ""
    echo "❌ Login falló. Intentando método alternativo..."
    npm login
fi

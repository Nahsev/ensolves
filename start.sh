#!/bin/bash

# 1. Instalar dependencias del Backend y levantarlo
echo "Configurando Backend..."
cd backend
npm install
# Suponiendo que usas nodemon o node index.js
npm start & 

# 2. Instalar dependencias del Frontend y levantarlo
echo "Configurando Frontend..."
cd ../frontend
npm install
npm start
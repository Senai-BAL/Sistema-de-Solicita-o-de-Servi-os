#!/usr/bin/env node

/**
 * Script de validação de sintaxe JavaScript
 * Valida todos os arquivos .js do projeto
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

console.log(`${colors.blue}🔍 Validando sintaxe JavaScript...${colors.reset}\n`);

let totalFiles = 0;
let errorCount = 0;
const errors = [];

/**
 * Encontra todos os arquivos .js recursivamente
 */
function findJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Ignorar node_modules e .git
      if (file !== 'node_modules' && file !== '.git' && file !== 'scripts') {
        findJsFiles(filePath, fileList);
      }
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Valida sintaxe de um arquivo JavaScript
 */
function validateFile(filePath) {
  try {
    execSync(`node -c "${filePath}"`, { stdio: 'pipe' });
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error.stderr ? error.stderr.toString() : error.message
    };
  }
}

// Encontrar todos os arquivos JS
const jsFiles = findJsFiles('public');
totalFiles = jsFiles.length;

console.log(`Encontrados ${totalFiles} arquivos JavaScript\n`);

// Validar cada arquivo
jsFiles.forEach(file => {
  const relativePath = path.relative(process.cwd(), file);
  const result = validateFile(file);

  if (result.valid) {
    console.log(`${colors.green}✓${colors.reset} ${relativePath}`);
  } else {
    console.log(`${colors.red}✗${colors.reset} ${relativePath}`);
    errors.push({ file: relativePath, error: result.error });
    errorCount++;
  }
});

// Resumo
console.log(`\n${'='.repeat(50)}`);
console.log(`${colors.blue}📊 Resumo da Validação${colors.reset}`);
console.log(`${'='.repeat(50)}`);
console.log(`Total de arquivos: ${totalFiles}`);
console.log(`${colors.green}Válidos: ${totalFiles - errorCount}${colors.reset}`);
console.log(`${colors.red}Com erros: ${errorCount}${colors.reset}`);

// Mostrar erros detalhados
if (errorCount > 0) {
  console.log(`\n${colors.red}❌ Erros encontrados:${colors.reset}\n`);
  errors.forEach(({ file, error }) => {
    console.log(`${colors.yellow}Arquivo:${colors.reset} ${file}`);
    console.log(`${colors.red}Erro:${colors.reset} ${error}\n`);
  });

  process.exit(1);
} else {
  console.log(`\n${colors.green}✅ Todos os arquivos JavaScript são válidos!${colors.reset}`);
  process.exit(0);
}

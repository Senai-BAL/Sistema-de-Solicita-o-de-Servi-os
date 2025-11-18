#!/usr/bin/env node

/**
 * Script de testes básicos do projeto
 * Valida estrutura, arquivos essenciais e configurações
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

console.log(`${colors.blue}🧪 Executando testes básicos...${colors.reset}\n`);

let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

/**
 * Função auxiliar de teste
 */
function test(description, fn) {
  testsRun++;
  try {
    fn();
    console.log(`${colors.green}✓${colors.reset} ${description}`);
    testsPassed++;
    return true;
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  ${colors.red}Erro: ${error.message}${colors.reset}`);
    testsFailed++;
    return false;
  }
}

/**
 * Assert helpers
 */
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertFileExists(filePath) {
  assert(fs.existsSync(filePath), `Arquivo não encontrado: ${filePath}`);
}

function assertDirExists(dirPath) {
  assert(fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory(),
    `Diretório não encontrado: ${dirPath}`);
}

// ============================================
// TESTES
// ============================================

console.log(`${colors.cyan}📁 Testando estrutura de arquivos...${colors.reset}\n`);

// Arquivos HTML essenciais
test('index.html existe', () => assertFileExists('public/index.html'));
test('admin.html existe', () => assertFileExists('public/admin.html'));
test('tracking.html existe', () => assertFileExists('public/tracking.html'));

// Arquivos de configuração
test('firebase.json existe', () => assertFileExists('firebase.json'));
test('package.json existe', () => assertFileExists('package.json'));

// Estrutura de diretórios
console.log(`\n${colors.cyan}📂 Testando estrutura de diretórios...${colors.reset}\n`);

test('public/assets/js existe', () => assertDirExists('public/assets/js'));
test('public/assets/css existe', () => assertDirExists('public/assets/css'));
test('public/shared existe', () => assertDirExists('public/shared'));

// Arquivos JavaScript essenciais
console.log(`\n${colors.cyan}🔧 Testando arquivos JavaScript essenciais...${colors.reset}\n`);

test('firebase-service.js existe', () => assertFileExists('public/shared/firebase-service.js'));
test('constants.js existe', () => assertFileExists('public/shared/constants.js'));
test('async-operation.js existe', () => assertFileExists('public/shared/async-operation.js'));

// Arquivos de documentação
console.log(`\n${colors.cyan}📚 Testando documentação...${colors.reset}\n`);

test('README.md existe', () => assertFileExists('README.md'));
test('docs/CODIGO_DUPLICADO.md existe', () => assertFileExists('docs/CODIGO_DUPLICADO.md'));

// Validação de conteúdo
console.log(`\n${colors.cyan}📄 Testando conteúdo de arquivos...${colors.reset}\n`);

test('index.html contém versão', () => {
  const content = fs.readFileSync('public/index.html', 'utf8');
  assert(content.includes('content="v'), 'Versão não encontrada em index.html');
});

test('firebase.json está configurado corretamente', () => {
  const config = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
  assert(config.hosting, 'Configuração de hosting não encontrada');
  assert(config.hosting.public, 'Diretório public não configurado');
});

test('package.json tem scripts configurados', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert(pkg.scripts, 'Scripts não encontrados em package.json');
  assert(pkg.scripts.test, 'Script de test não configurado');
  assert(pkg.scripts.validate, 'Script de validate não configurado');
});

// Validação de helpers criados na Semana 2
console.log(`\n${colors.cyan}🛠️ Testando helpers da Semana 2...${colors.reset}\n`);

test('constants.js define SERVICE_NAMES', () => {
  const content = fs.readFileSync('public/shared/constants.js', 'utf8');
  assert(content.includes('SERVICE_NAMES'), 'SERVICE_NAMES não encontrado');
});

test('constants.js define STATUS_CONFIG', () => {
  const content = fs.readFileSync('public/shared/constants.js', 'utf8');
  assert(content.includes('STATUS_CONFIG'), 'STATUS_CONFIG não encontrado');
});

test('constants.js define DDD_VALIDOS', () => {
  const content = fs.readFileSync('public/shared/constants.js', 'utf8');
  assert(content.includes('DDD_VALIDOS'), 'DDD_VALIDOS não encontrado');
});

test('async-operation.js define AsyncOperation', () => {
  const content = fs.readFileSync('public/shared/async-operation.js', 'utf8');
  assert(content.includes('class AsyncOperation'), 'Classe AsyncOperation não encontrada');
});

// Validação de segurança básica
console.log(`\n${colors.cyan}🔒 Testando segurança básica...${colors.reset}\n`);

test('Nenhuma senha hardcoded em config.js', () => {
  const configPath = 'public/assets/js/admin/config.js';
  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, 'utf8');
    assert(!content.includes("password: '"),
      'Senha hardcoded encontrada em config.js');
  }
});

test('showStatus() foi depreciado corretamente', () => {
  const content = fs.readFileSync('public/assets/js/frontend/showStatus.js', 'utf8');
  assert(content.includes('@deprecated'),
    'showStatus() não está marcado como deprecated');
});

// ============================================
// RESUMO
// ============================================

console.log(`\n${'='.repeat(50)}`);
console.log(`${colors.blue}📊 Resumo dos Testes${colors.reset}`);
console.log(`${'='.repeat(50)}`);
console.log(`Total de testes: ${testsRun}`);
console.log(`${colors.green}Passou: ${testsPassed}${colors.reset}`);
console.log(`${colors.red}Falhou: ${testsFailed}${colors.reset}`);

if (testsFailed > 0) {
  console.log(`\n${colors.red}❌ Alguns testes falharam!${colors.reset}`);
  process.exit(1);
} else {
  console.log(`\n${colors.green}✅ Todos os testes passaram!${colors.reset}`);
  process.exit(0);
}

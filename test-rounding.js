// Teste manual do arredondamento inteligente
function smartRoundPrice(value) {
  if (value < 5) {
    return Math.round(value * 100) / 100;
  }
  const rounded = Math.round(value / 5) * 5;
  return rounded;
}

console.log('🧪 Testando Arredondamento Inteligente\n');

const tests = [
  { input: 23.26, expected: 25, description: '23.26 → 25.00' },
  { input: 72.11, expected: 70, description: '72.11 → 70.00' },
  { input: 78.21, expected: 80, description: '78.21 → 80.00' },
  { input: 47.80, expected: 50, description: '47.80 → 50.00' },
  { input: 12.30, expected: 10, description: '12.30 → 10.00' },
  { input: 3.47, expected: 3.47, description: '3.47 → 3.47 (menor que 5)' },
  { input: 34.50, expected: 35, description: '34.50 → 35.00' },
  { input: 123.45, expected: 125, description: '123.45 → 125.00' },
  { input: 498.20, expected: 500, description: '498.20 → 500.00' },
  { input: 99.99, expected: 100, description: '99.99 → 100.00' },
];

let passed = 0;
let failed = 0;

tests.forEach(({ input, expected, description }) => {
  const result = smartRoundPrice(input);
  const isCorrect = result === expected;

  if (isCorrect) {
    console.log(`✅ ${description} = R$ ${result.toFixed(2)}`);
    passed++;
  } else {
    console.log(`❌ ${description} = R$ ${result.toFixed(2)} (esperado: R$ ${expected.toFixed(2)})`);
    failed++;
  }
});

console.log(`\n📊 Resultados: ${passed} ✅  ${failed} ❌`);
console.log(failed === 0 ? '🎉 Todos os testes passaram!' : '⚠️ Alguns testes falharam');

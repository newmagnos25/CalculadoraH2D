import { smartRoundPrice } from '../calculator';

describe('smartRoundPrice', () => {
  test('arredonda 23.26 para 25.00', () => {
    expect(smartRoundPrice(23.26)).toBe(25);
  });

  test('arredonda 72.11 para 70.00', () => {
    expect(smartRoundPrice(72.11)).toBe(70);
  });

  test('arredonda 78.21 para 80.00', () => {
    expect(smartRoundPrice(78.21)).toBe(80);
  });

  test('arredonda 47.80 para 50.00', () => {
    expect(smartRoundPrice(47.80)).toBe(50);
  });

  test('arredonda 12.30 para 10.00', () => {
    expect(smartRoundPrice(12.30)).toBe(10);
  });

  test('mantém valores menores que 5 com 2 casas decimais', () => {
    expect(smartRoundPrice(3.47)).toBe(3.47);
    expect(smartRoundPrice(4.99)).toBe(4.99);
  });

  test('arredonda valores próximos de múltiplos de 5', () => {
    expect(smartRoundPrice(34.50)).toBe(35);
    expect(smartRoundPrice(34.49)).toBe(35);
    expect(smartRoundPrice(37.51)).toBe(40);
  });

  test('arredonda valores grandes corretamente', () => {
    expect(smartRoundPrice(123.45)).toBe(125);
    expect(smartRoundPrice(498.20)).toBe(500);
    expect(smartRoundPrice(1234.56)).toBe(1235);
  });
});

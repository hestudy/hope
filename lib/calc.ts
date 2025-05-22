// 计算移动平均线（MA）
export function MA(data: number[], period: number): number[] {
  if (period <= 0 || data.length < period) return [];
  const result: number[] = [];
  for (let i = 0; i <= data.length - period; i++) {
    const sum = data.slice(i, i + period).reduce((a, b) => a + b, 0);
    result.push(sum / period);
  }
  return result;
}

// 计算简单移动平均线（SMA）
export function SMA(data: number[], period: number): number[] {
  if (period <= 0 || data.length < period) return [];
  const result: number[] = [];
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
    if (i >= period) {
      sum -= data[i - period];
    }
    if (i >= period - 1) {
      result.push(sum / period);
    }
  }
  return result;
}

// 计算指数移动平均线（EMA）
export function EMA(data: number[], period: number): number[] {
  if (period <= 0 || data.length < period) return [];
  const result: number[] = [];
  const k = 2 / (period + 1);
  let ema = data[0];
  result.push(ema);
  for (let i = 1; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
    result.push(ema);
  }
  return result;
}

// 计算相对强弱指数（RSI）
export function RSI(data: number[], period: number): number[] {
  if (period <= 0 || data.length <= period) return [];
  const result: number[] = [];
  for (let i = period; i < data.length; i++) {
    let gain = 0,
      loss = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const diff = data[j] - data[j - 1];
      if (diff > 0) gain += diff;
      else loss -= diff;
    }
    const avgGain = gain / period;
    const avgLoss = loss / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);
    result.push(rsi);
  }
  return result;
}

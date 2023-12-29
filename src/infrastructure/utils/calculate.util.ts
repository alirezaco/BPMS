export class CalculateUtil {
  public static calculate(func: string, left: number, right?: number): number {
    switch (func) {
      case 'sum':
        return left + right;
      case 'sub':
        return left - right;
      case 'mul':
        return left * right;
      case 'div':
        return left / right;
      case 'mod':
        return left % right;
      case 'pow':
        return Math.pow(left, right);
      case 'sqrt':
        return Math.sqrt(left);
      case 'abs':
        return Math.abs(left);
      case 'exp':
        return Math.exp(left);
      case 'log':
        return Math.log(left);
      case 'round':
        return Math.round(left);
      case 'ceil':
        return Math.ceil(left);
    }
  }
}

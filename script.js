let expression = '';

//Button Press
function press(value) {
  expression += value;
  document.getElementById('display').value = expression;
}

//Clear Display
function clearDisplay() {
  expression = '';
  document.getElementById('display').value = expression;
}

//Calc Result
function calculate() {
  try {
    if (isInvalidExpression(expression)) {
      throw new Error("Invalid Expression");
    }

    const result = evaluateExpression(expression);
    document.getElementById('display').value = result;
    expression = result.toString();
  } catch (error) {
    document.getElementById('display').value = error.message || 'Error';
  }
}

// Recursive Method for Evaluate Func
function evaluateExpression(expr) {
  while (expr.includes('(')) {
    const startIdx = expr.lastIndexOf('(');
    const endIdx = expr.indexOf(')', startIdx);

    if (endIdx === -1) throw new Error("Mismatched Parentheses");

    const innerExpr = expr.substring(startIdx + 1, endIdx);
    const innerResult = evaluateSimpleExpression(innerExpr);
    expr = expr.substring(0, startIdx) + innerResult + expr.substring(endIdx + 1);
  }

  //recusive use of evaluation
  return evaluateSimpleExpression(expr);
}

function evaluateSimpleExpression(expr) {
  //Trig + sqrt functions
  expr = expr.replace(/(sqrt|sin|cos|tan)\s*\(([^)]+)\)/g, (match, func, arg) => {
    const value = parseFloat(evaluateSimpleExpression(arg));
    if (isNaN(value)) throw new Error(`Invalid argument for ${func}`);
    switch (func) {
      case 'sqrt': return Math.sqrt(value);
      case 'sin': return Math.sin(value * Math.PI / 180);
      case 'cos': return Math.cos(value * Math.PI / 180);
      case 'tan': return Math.tan(value * Math.PI / 180); 
      default: throw new Error(`Unknown function: ${func}`);
    }
  });

  //Multi And Division
  expr = expr.replace(/(-?\d+\.?\d*)\s*([*/])\s*(-?\d+\.?\d*)/g, (match, p1, operator, p2) => {
    const num1 = parseFloat(p1);
    const num2 = parseFloat(p2);
    if (operator === '*') return num1 * num2;
    if (operator === '/') {
      if (num2 === 0) throw new Error("Division by Zero");
      return num1 / num2;
    }
  });

  //Addition and Subtraction
  expr = expr.replace(/(-?\d+\.?\d*)\s*([+-])\s*(-?\d+\.?\d*)/g, (match, p1, operator, p2) => {
    const num1 = parseFloat(p1);
    const num2 = parseFloat(p2);
    return operator === '+' ? num1 + num2 : num1 - num2;
  });

  return parseFloat(expr);
}

function isInvalidExpression(expr) {
  //Invalid Chars
  if (/[^0-9+\-*/().\sincostansqrt]/.test(expr)) return true;

  //Consec Operators
  if (/[+\-*/]{2,}/.test(expr)) return true;

  const openCount = (expr.match(/\(/g) || []).length;
  const closeCount = (expr.match(/\)/g) || []).length;
  if (openCount !== closeCount) return true;

  if (/sqrt\(|sin\(|cos\(|tan\(/.test(expr) && !/\)/.test(expr)) return true;

  return false;
}

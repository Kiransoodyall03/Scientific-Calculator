let expression = '';  // This will store the input expression

// Function to handle button presses
function press(value) {
  // Handle inputs and append them to the expression
  expression += value;
  document.getElementById('display').value = expression;
}

// Function to clear the display
function clearDisplay() {
  expression = '';
  document.getElementById('display').value = expression;
}

// Function to calculate the result
function calculate() {
  try {
    // Check for invalid input
    if (isInvalidExpression(expression)) {
      throw new Error("Input Error");
    }

    // Parse the expression and perform the calculation
    let result = evaluateExpression(expression);
    document.getElementById('display').value = result;
    expression = result; // Save result for further calculations
  } catch (error) {
    // Show error message if invalid or calculation fails
    document.getElementById('display').value = 'Input Error';
  }
}

// Function to evaluate the expression (handling basic arithmetic, sqrt, and brackets)
function evaluateExpression(expr) {
  // Handle parentheses first
  while (expr.includes('(')) {
    // Find the innermost bracket expression
    let startIdx = expr.lastIndexOf('(');
    let endIdx = expr.indexOf(')', startIdx);

    // Get the substring inside the parentheses
    let innerExpr = expr.substring(startIdx + 1, endIdx);
    
    // Calculate the result of the inner expression
    let innerResult = evaluateSimpleExpression(innerExpr);
    
    // Replace the inner expression with its result in the original expression
    expr = expr.substring(0, startIdx) + innerResult + expr.substring(endIdx + 1);
  }

  // Now, evaluate the rest of the expression without parentheses
  return evaluateSimpleExpression(expr);
}

// A helper function to evaluate the simple expression (without parentheses)
function evaluateSimpleExpression(expr) {
  // Handle square root (sqrt) function
  if (expr.includes('sqrt')) {
    return Math.sqrt(parseFloat(expr.replace('sqrt', '')));
  }

  // Handle basic arithmetic operations: +, -, *, /
  // First, we handle multiplication and division
  expr = expr.replace(/(\d+)\s*\*\s*(\d+)/g, (match, p1, p2) => parseFloat(p1) * parseFloat(p2));
  expr = expr.replace(/(\d+)\s*\/\s*(\d+)/g, (match, p1, p2) => parseFloat(p1) / parseFloat(p2));

  // Then, handle addition and subtraction
  expr = expr.replace(/(\d+)\s*\+\s*(\d+)/g, (match, p1, p2) => parseFloat(p1) + parseFloat(p2));
  expr = expr.replace(/(\d+)\s*\-\s*(\d+)/g, (match, p1, p2) => parseFloat(p1) - parseFloat(p2));

  return parseFloat(expr);
}

// Function to check if the expression is invalid
function isInvalidExpression(expr) {
  // Check if the expression ends with an operator
  if (/[+\-*/]$/.test(expr)) {
    return true;
  }

  // Check for invalid characters (anything that's not a number, operator, or parentheses)
  if (/[^0-9+\-*/().sqrt\s]/.test(expr)) {
    return true;
  }

  // Check if there are incomplete function calls (like sqrt without a number)
  if (/sqrt\($/.test(expr) || /sqrt\s+\(/.test(expr)) {
    return true;
  }

  // Check if there is a number or parentheses missing after sqrt
  if (/sqrt\s*(?!\()/g.test(expr)) {
    return true;
  }

  // Check if there are parentheses mismatched
  let openCount = (expr.match(/\(/g) || []).length;
  let closeCount = (expr.match(/\)/g) || []).length;
  if (openCount !== closeCount) {
    return true;
  }

  return false;
}
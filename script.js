class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.hasCalculated = false;
    }

    delete() {
        if (this.currentOperand === '0' || this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.hasCalculated) {
            this.currentOperand = number;
            this.hasCalculated = false;
            return;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.calculate();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Format to avoid floating point precision issues
        this.currentOperand = this.formatResult(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.hasCalculated = true;
    }

    formatResult(number) {
        // If it's an integer, don't show decimal places
        if (Number.isInteger(number)) {
            return number.toString();
        }
        
        // Otherwise, limit to 10 decimal places
        const rounded = Math.round(number * 10000000000) / 10000000000;
        return rounded.toString();
    }

    getDisplayNumber(number) {
        if (number === '') return '';
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = 
            this.getDisplayNumber(this.currentOperand) || '0';
        
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// DOM Elements
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-action="calculate"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const clearButton = document.querySelector('[data-action="clear"]');
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');

// Create calculator instance
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Event Listeners for number buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.getAttribute('data-number'));
        calculator.updateDisplay();
        
        // Add click effect
        button.classList.add('active');
        setTimeout(() => button.classList.remove('active'), 150);
    });
});

// Event Listeners for operation buttons
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.getAttribute('data-operation'));
        calculator.updateDisplay();
        
        // Add click effect
        button.classList.add('active');
        setTimeout(() => button.classList.remove('active'), 150);
    });
});

// Equals button
equalsButton.addEventListener('click', () => {
    calculator.calculate();
    calculator.updateDisplay();
    
    // Add click effect
    equalsButton.classList.add('active');
    setTimeout(() => equalsButton.classList.remove('active'), 150);
});

// Clear button
clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
    
    // Add click effect
    clearButton.classList.add('active');
    setTimeout(() => clearButton.classList.remove('active'), 150);
});

// Delete button
deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
    
    // Add click effect
    deleteButton.classList.add('active');
    setTimeout(() => deleteButton.classList.remove('active'), 150);
});

// Keyboard support
document.addEventListener('keydown', (event) => {
    let keyPressed = event.key;
    
    // Prevent default behavior for calculator keys
    if (/[\d\.\+\-\*\/=]|Enter|Backspace|Delete|Escape/.test(keyPressed)) {
        event.preventDefault();
    }
    
    // Number keys (0-9)
    if (/[\d\.]/.test(keyPressed)) {
        calculator.appendNumber(keyPressed);
        calculator.updateDisplay();
    }
    
    // Operation keys
    if (/[\+\-\*\/]/.test(keyPressed)) {
        // Convert * to × and / to ÷ for display
        const operation = keyPressed === '*' ? '×' : keyPressed === '/' ? '÷' : keyPressed;
        calculator.chooseOperation(operation);
        calculator.updateDisplay();
    }
    
    // Equals/Enter
    if (keyPressed === '=' || keyPressed === 'Enter') {
        calculator.calculate();
        calculator.updateDisplay();
    }
    
    // Clear (Escape)
    if (keyPressed === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }
    
    // Delete (Backspace/Delete)
    if (keyPressed === 'Backspace' || keyPressed === 'Delete') {
        calculator.delete();
        calculator.updateDisplay();
    }
});

// Add active class for button press effect
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mousedown', () => {
        button.classList.add('active');
    });
    
    button.addEventListener('mouseup', () => {
        setTimeout(() => button.classList.remove('active'), 150);
    });
    
    button.addEventListener('mouseleave', () => {
        button.classList.remove('active');
    });
});

// Initialize display
calculator.updateDisplay();

// Add a welcome message in console
console.log('%c🔐 Calculator with Security Theme 🔐', 'color: #64dfdf; font-size: 16px; font-weight: bold;');
console.log('%cBasic operations: +, -, ×, ÷', 'color: #ff7b54;');
console.log('%cSupports keyboard input!', 'color: #5cd85a;');
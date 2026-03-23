// Standalone Calculator Logic

let display = document.getElementById('display');
let currentInput = '0';
let previousInput = null;
let operation = null;
let waitingForNewInput = false;

function updateDisplay() {
    display.value = currentInput;
}

function clear() {
    currentInput = '0';
    previousInput = null;
    operation = null;
    waitingForNewInput = false;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function inputNumber(num) {
    if (waitingForNewInput) {
        currentInput = num;
        waitingForNewInput = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    updateDisplay();
}

function inputDecimal() {
    if (waitingForNewInput) {
        currentInput = '0.';
        waitingForNewInput = false;
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    updateDisplay();
}

function handleOperator(nextOperation) {
    let inputValue = parseFloat(currentInput);

    if (previousInput === null) {
        previousInput = inputValue;
    } else if (operation) {
        let currentValue = previousInput || 0;
        if (isNaN(currentValue)) currentValue = 0;

        if (operation === 'add') {
            previousInput = currentValue + inputValue;
        } else if (operation === 'subtract') {
            previousInput = currentValue - inputValue;
        } else if (operation === 'multiply') {
            previousInput = currentValue * inputValue;
        } else if (operation === 'divide') {
            if (inputValue !== 0) {
                previousInput = currentValue / inputValue;
            } else {
                alert('Cannot divide by zero!');
                return;
            }
        }
    }

    waitingForNewInput = true;
    operation = nextOperation;
    updateDisplay();
}

function calculate() {
    let inputValue = parseFloat(currentInput);

    if (previousInput !== null && operation) {
        if (waitingForNewInput) return;

        if (operation === 'add') {
            currentInput = (previousInput + inputValue).toString();
        } else if (operation === 'subtract') {
            currentInput = (previousInput - inputValue).toString();
        } else if (operation === 'multiply') {
            currentInput = (previousInput * inputValue).toString();
        } else if (operation === 'divide') {
            if (inputValue !== 0) {
                currentInput = (previousInput / inputValue).toString();
            } else {
                currentInput = 'Error';
            }
        }

        previousInput = null;
        operation = null;
        waitingForNewInput = true;
        updateDisplay();
    }
}

// Add event listeners to all buttons
document.querySelectorAll('.btn.number').forEach(btn => {
    btn.addEventListener('click', () => inputNumber(btn.textContent));
});

document.querySelectorAll('.btn.operator').forEach(btn => {
    btn.addEventListener('click', () => handleOperator(btn.id));
});

document.getElementById('clear').addEventListener('click', clear);
document.getElementById('delete').addEventListener('click', deleteLast);
document.getElementById('equals').addEventListener('click', calculate);
document.getElementById('decimal').addEventListener('click', inputDecimal);

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key >= '0' && key <= '9') inputNumber(key);
    else if (key === '.') inputDecimal();
    else if (key === '+') handleOperator('add');
    else if (key === '-') handleOperator('subtract');
    else if (key === '*') handleOperator('multiply');
    else if (key === '/') handleOperator('divide');
    else if (key === 'Enter' || key === '=') calculate();
    else if (key === 'Escape') clear();
});

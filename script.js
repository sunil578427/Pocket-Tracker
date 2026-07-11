const mainBalance = document.getElementById('main-balance');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const list = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const textInput = document.getElementById('text-input');
const amountInput = document.getElementById('amount-input');

// Inline Custom State Trackers
let currentType = 'expense';
const signIndicator = document.getElementById('amount-sign-indicator');
const btnInc = document.getElementById('btn-inc');
const btnExp = document.getElementById('btn-exp');

// Local Storage Setup
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Runtime type controller (Income vs Expense Buttons Toggle)
function setTxType(type) {
    currentType = type;
    if (type === 'income') {
        btnInc.classList.add('active');
        btnExp.classList.remove('active');
        signIndicator.innerText = '+';
        signIndicator.className = 'sign-indicator plus-color';
    } else {
        btnExp.classList.add('active');
        btnInc.classList.remove('active');
        signIndicator.innerText = '-';
        signIndicator.className = 'sign-indicator minus-color';
    }
}

// Form Submission intercept engine
function addTransaction(e) {
    e.preventDefault();

    const amountValue = parseFloat(amountInput.value);
    // Evaluates calculation constraints based on toggled indicator
    const absoluteAmount = currentType === 'expense' ? -Math.abs(amountValue) : Math.abs(amountValue);

    const transaction = {
        id: generateID(),
        text: textInput.value,
        amount: absoluteAmount
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    // Field Reset parameters
    textInput.value = '';
    amountInput.value = '';
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Renders dynamic layout structures into the HTML view
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    item.className = transaction.amount < 0 ? 'minus' : 'plus';
    item.innerHTML = `
        ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">❌</button>
    `;

    list.appendChild(item);
}

// Calculates dynamic variables balances
function updateValues() {
    const amounts = transactions.map(t => t.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    mainBalance.innerText = `₹${total}`;
    totalIncome.innerText = `₹${income}`;
    totalExpense.innerText = `₹${expense}`;
}

// Removes a targeted transaction row entry
function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Main initial compilation block
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();
form.addEventListener('submit', addTransaction);

// DOM Elements
const incomeAmountInput = document.getElementById('incomeAmount');
const incomeSourceInput = document.getElementById('incomeSource');
const incomeCategoryInput = document.getElementById('incomeCategory');
const expenseAmountInput = document.getElementById('expenseAmount');
const expenseSourceInput = document.getElementById('expenseSource');
const expenseCategoryInput = document.getElementById('expenseCategory');
const addIncomeBtn = document.getElementById('addIncomeBtn');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const clearBtn = document.getElementById('clearBtn');
const totalBalanceEl = document.getElementById('totalBalance');
const incomeTotalEl = document.getElementById('incomeTotal');
const expenseTotalEl = document.getElementById('expenseTotal');
const transactionsList = document.getElementById('transactionsList');
const themeToggle = document.getElementById('themeToggle');

// Initialize transactions
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Initialize the app
function initApp() {
    updateUI();
    attachEventListeners();
}

// Update UI with current data
function updateUI() {
    // Calculate totals
    const incomeTotal = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenseTotal = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = incomeTotal - expenseTotal;
    
    // Update totals display
    incomeTotalEl.textContent = `₹${incomeTotal.toFixed(2)}`;
    expenseTotalEl.textContent = `₹${expenseTotal.toFixed(2)}`;
    totalBalanceEl.textContent = `₹${balance.toFixed(2)}`;
    
    // Update balance color based on value
    totalBalanceEl.style.color = balance >= 0 ? 'var(--income)' : 'var(--expense)';
    
    // Render transactions
    renderTransactions();
    
    // Save to localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Render transactions list
function renderTransactions() {
    if (transactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exchange-alt"></i>
                <p>No transactions yet</p>
            </div>
        `;
        return;
    }
    
    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(b.date) - new Date(a.date));
    
    // Generate transactions HTML
    transactionsList.innerHTML = sortedTransactions.map((transaction, index) => `
        <div class="transaction-item ${transaction.type}-item">
            <div class="transaction-info">
                <div class="transaction-name">${transaction.source}</div>
                <div class="transaction-category">${transaction.category}</div>
            </div>
            <div class="transaction-amount">₹${transaction.amount.toFixed(2)}</div>
            <div class="transaction-actions">
                <button class="action-btn edit-btn" data-id="${index}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${index}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editTransaction(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteTransaction(btn.dataset.id));
    });
}

// Add income transaction
function addIncome() {
    const amount = parseFloat(incomeAmountInput.value);
    const source = incomeSourceInput.value.trim();
    const category = incomeCategoryInput.value;
    
    if (!amount || amount <= 0 || !source) {
        alert('Please enter a valid amount and source');
        return;
    }
    
    transactions.push({
        id: Date.now(),
        type: 'income',
        amount,
        source,
        category,
        date: new Date().toISOString()
    });
    
    // Clear inputs
    incomeAmountInput.value = '';
    incomeSourceInput.value = '';
    
    updateUI();
}

// Add expense transaction
function addExpense() {
    const amount = parseFloat(expenseAmountInput.value);
    const source = expenseSourceInput.value.trim();
    const category = expenseCategoryInput.value;
    
    if (!amount || amount <= 0 || !source) {
        alert('Please enter a valid amount and description');
        return;
    }
    
    transactions.push({
        id: Date.now(),
        type: 'expense',
        amount,
        source,
        category,
        date: new Date().toISOString()
    });
    
    // Clear inputs
    expenseAmountInput.value = '';
    expenseSourceInput.value = '';
    
    updateUI();
}

// Edit transaction
function editTransaction(index) {
    const transaction = transactions[index];
    
    if (transaction.type === 'income') {
        incomeAmountInput.value = transaction.amount;
        incomeSourceInput.value = transaction.source;
        incomeCategoryInput.value = transaction.category;
        
        // Scroll to income form
        incomeAmountInput.scrollIntoView({ behavior: 'smooth' });
    } else {
        expenseAmountInput.value = transaction.amount;
        expenseSourceInput.value = transaction.source;
        expenseCategoryInput.value = transaction.category;
        
        // Scroll to expense form
        expenseAmountInput.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Remove the transaction from the array
    transactions.splice(index, 1);
    updateUI();
}

// Delete transaction
function deleteTransaction(index) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions.splice(index, 1);
        updateUI();
    }
}

// Clear all data
function clearData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        transactions = [];
        localStorage.removeItem('transactions');
        updateUI();
    }
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDarkMode ? 
        '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('darkMode', isDarkMode);
}

// Attach event listeners
function attachEventListeners() {
    addIncomeBtn.addEventListener('click', addIncome);
    addExpenseBtn.addEventListener('click', addExpense);
    clearBtn.addEventListener('click', clearData);
    themeToggle.addEventListener('click', toggleDarkMode);
    
    // Also allow adding with Enter key
    incomeSourceInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addIncome();
    });
    
    expenseSourceInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addExpense();
    });
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Initialize the application
initApp();

// DOM Elements
const incomeAmountInput = document.getElementById('incomeAmount');
const incomeSourceInput = document.getElementById('incomeSource');
const incomeCategoryInput = document.getElementById('incomeCategory');
const expenseAmountInput = document.getElementById('expenseAmount');
const expenseSourceInput = document.getElementById('expenseSource');
const expenseCategoryInput = document.getElementById('expenseCategory');
const owedAmountInput = document.getElementById('owedAmount');
const owedByInput = document.getElementById('owedBy');
const owedReasonInput = document.getElementById('owedReason');
const owedDueDateInput = document.getElementById('owedDueDate');
const oweAmountInput = document.getElementById('oweAmount');
const oweToInput = document.getElementById('oweTo');
const oweReasonInput = document.getElementById('oweReason');
const oweDueDateInput = document.getElementById('oweDueDate');

const addIncomeBtn = document.getElementById('addIncomeBtn');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const addOwedToMeBtn = document.getElementById('addOwedToMeBtn');
const addIOweBtn = document.getElementById('addIOweBtn');
const clearBtn = document.getElementById('clearBtn');

const totalBalanceEl = document.getElementById('totalBalance');
const incomeTotalEl = document.getElementById('incomeTotal');
const expenseTotalEl = document.getElementById('expenseTotal');
const owedToMeTotalEl = document.getElementById('owedToMeTotal');
const ioweTotalEl = document.getElementById('ioweTotal');

const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

const recentTransactionsList = document.getElementById('recentTransactionsList');
const allTransactionsList = document.getElementById('allTransactionsList');
const owedToMeList = document.getElementById('owedToMeList');
const iOweList = document.getElementById('iOweList');
const upcomingPaymentsList = document.getElementById('upcomingPaymentsList');

const themeToggle = document.getElementById('themeToggle');

// Initialize data
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let debts = JSON.parse(localStorage.getItem('debts')) || [];

// Initialize the app
function initApp() {
    updateUI();
    attachEventListeners();
    activateTab('dashboard');
}

// Tab functionality
function activateTab(tabName) {
    // Remove active class from all tabs
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
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
    
    const owedToMeTotal = debts
        .filter(d => d.type === 'owed-to-me' && d.status !== 'paid')
        .reduce((sum, d) => sum + d.amount, 0);
    
    const ioweTotal = debts
        .filter(d => d.type === 'i-owe' && d.status !== 'paid')
        .reduce((sum, d) => sum + d.amount, 0);
    
    const balance = incomeTotal - expenseTotal + owedToMeTotal - ioweTotal;
    
    // Update totals display
    incomeTotalEl.textContent = `₹${incomeTotal.toFixed(2)}`;
    expenseTotalEl.textContent = `₹${expenseTotal.toFixed(2)}`;
    owedToMeTotalEl.textContent = `₹${owedToMeTotal.toFixed(2)}`;
    ioweTotalEl.textContent = `₹${ioweTotal.toFixed(2)}`;
    totalBalanceEl.textContent = `₹${balance.toFixed(2)}`;
    
    // Update balance color based on value
    totalBalanceEl.style.color = balance >= 0 ? 'var(--income)' : 'var(--expense)';
    
    // Render lists
    renderRecentTransactions();
    renderAllTransactions();
    renderOwedToMe();
    renderIOwe();
    renderUpcomingPayments();
    
    // Save to localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('debts', JSON.stringify(debts));
}

// Render recent transactions (5 most recent)
function renderRecentTransactions() {
    if (transactions.length === 0) {
        recentTransactionsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exchange-alt"></i>
                <p>No recent transactions</p>
            </div>
        `;
        return;
    }
    
    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(b.date) - new Date(a.date));
    
    // Get only the first 5
    const recentTransactions = sortedTransactions.slice(0, 5);
    
    // Generate transactions HTML
    recentTransactionsList.innerHTML = recentTransactions.map((transaction, index) => `
        <div class="transaction-item ${transaction.type}-item">
            <div class="transaction-info">
                <div class="transaction-name">${transaction.source}</div>
                <div class="transaction-meta">
                    <span class="transaction-category">${transaction.category}</span>
                    <span>${formatDate(transaction.date)}</span>
                </div>
            </div>
            <div class="transaction-amount">₹${transaction.amount.toFixed(2)}</div>
        </div>
    `).join('');
}

// Render all transactions
function renderAllTransactions() {
    if (transactions.length === 0) {
        allTransactionsList.innerHTML = `
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
    allTransactionsList.innerHTML = sortedTransactions.map((transaction, index) => `
        <div class="transaction-item ${transaction.type}-item">
            <div class="transaction-info">
                <div class="transaction-name">${transaction.source}</div>
                <div class="transaction-meta">
                    <span class="transaction-category">${transaction.category}</span>
                    <span>${formatDate(transaction.date)}</span>
                </div>
            </div>
            <div class="transaction-amount">₹${transaction.amount.toFixed(2)}</div>
            <div class="transaction-actions">
                <button class="action-btn delete-btn" data-id="${index}" data-type="transaction">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Render money owed to me
function renderOwedToMe() {
    const owedToMe = debts.filter(d => d.type === 'owed-to-me');
    
    if (owedToMe.length === 0) {
        owedToMeList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-hand-holding-usd"></i>
                <p>No debts owed to you</p>
            </div>
        `;
        return;
    }
    
    owedToMeList.innerHTML = owedToMe.map((debt, index) => {
        const dueDate = new Date(debt.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let status = 'pending';
        let statusClass = 'status-pending';
        let statusText = 'Pending';
        
        if (debt.status === 'paid') {
            status = 'paid';
            statusClass = 'status-paid';
            statusText = 'Paid';
        } else if (dueDate < today) {
            status = 'overdue';
            statusClass = 'status-overdue';
            statusText = 'Overdue';
        }
        
        return `
        <div class="transaction-item owed-to-me-item">
            <div class="transaction-info">
                <div class="transaction-name">${debt.person} - ${debt.reason}</div>
                <div class="transaction-meta">
                    <span>Due: ${formatDate(debt.dueDate)}</span>
                    <span class="${statusClass} status-badge">${statusText}</span>
                </div>
            </div>
            <div class="transaction-amount">₹${debt.amount.toFixed(2)}</div>
            <div class="transaction-actions">
                <button class="action-btn ${status === 'pending' ? 'edit-btn' : ''}" 
                    data-id="${index}" data-type="debt" ${status !== 'pending' ? 'disabled' : ''}>
                    <i class="fas fa-${status === 'pending' ? 'edit' : 'check'}"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${index}" data-type="debt">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
        `;
    }).join('');
}

// Render money I owe
function renderIOwe() {
    const iOwe = debts.filter(d => d.type === 'i-owe');
    
    if (iOwe.length === 0) {
        iOweList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-hand-holding-usd"></i>
                <p>You don't owe anyone money</p>
            </div>
        `;
        return;
    }
    
    iOweList.innerHTML = iOwe.map((debt, index) => {
        const dueDate = new Date(debt.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let status = 'pending';
        let statusClass = 'status-pending';
        let statusText = 'Pending';
        
        if (debt.status === 'paid') {
            status = 'paid';
            statusClass = 'status-paid';
            statusText = 'Paid';
        } else if (dueDate < today) {
            status = 'overdue';
            statusClass = 'status-overdue';
            statusText = 'Overdue';
        }
        
        return `
        <div class="transaction-item i-owe-item">
            <div class="transaction-info">
                <div class="transaction-name">${debt.person} - ${debt.reason}</div>
                <div class="transaction-meta">
                    <span>Due: ${formatDate(debt.dueDate)}</span>
                    <span class="${statusClass} status-badge">${statusText}</span>
                </div>
            </div>
            <div class="transaction-amount">₹${debt.amount.toFixed(2)}</div>
            <div class="transaction-actions">
                <button class="action-btn ${status === 'pending' ? 'edit-btn' : ''}" 
                    data-id="${index}" data-type="debt" ${status !== 'pending' ? 'disabled' : ''}>
                    <i class="fas fa-${status === 'pending' ? 'edit' : 'check'}"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${index}" data-type="debt">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
        `;
    }).join('');
}

// Render upcoming payments
function renderUpcomingPayments() {
    const upcomingDebts = debts.filter(d => {
        if (d.status === 'paid') return false;
        
        const dueDate = new Date(d.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Show debts due in the next 7 days
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        return dueDate >= today && dueDate <= nextWeek;
    });
    
    if (upcomingDebts.length === 0) {
        upcomingPaymentsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-check"></i>
                <p>No upcoming payments</p>
            </div>
        `;
        return;
    }
    
    // Sort by due date (earliest first)
    upcomingDebts.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    upcomingPaymentsList.innerHTML = upcomingDebts.map(debt => {
        const type = debt.type === 'i-owe' ? 'You owe' : 'Owes you';
        const color = debt.type === 'i-owe' ? 'var(--i-owe)' : 'var(--owed-to-me)';
        
        return `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-name" style="color: ${color}">
                    ${type}: ${debt.person} - ${debt.reason}
                </div>
                <div class="transaction-meta">
                    <span>Due: ${formatDate(debt.dueDate)}</span>
                    <span>Amount: ₹${debt.amount.toFixed(2)}</span>
                </div>
            </div>
        </div>
        `;
    }).join('');
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

// Add debt owed to me
function addOwedToMe() {
    const amount = parseFloat(owedAmountInput.value);
    const person = owedByInput.value.trim();
    const reason = owedReasonInput.value.trim();
    const dueDate = owedDueDateInput.value;
    
    if (!amount || amount <= 0 || !person || !reason || !dueDate) {
        alert('Please fill all fields with valid data');
        return;
    }
    
    debts.push({
        id: Date.now(),
        type: 'owed-to-me',
        amount,
        person,
        reason,
        dueDate,
        status: 'pending',
        date: new Date().toISOString()
    });
    
    // Clear inputs
    owedAmountInput.value = '';
    owedByInput.value = '';
    owedReasonInput.value = '';
    owedDueDateInput.value = '';
    
    updateUI();
}

// Add money I owe
function addIOwe() {
    const amount = parseFloat(oweAmountInput.value);
    const person = oweToInput.value.trim();
    const reason = oweReasonInput.value.trim();
    const dueDate = oweDueDateInput.value;
    
    if (!amount || amount <= 0 || !person || !reason || !dueDate) {
        alert('Please fill all fields with valid data');
        return;
    }
    
    debts.push({
        id: Date.now(),
        type: 'i-owe',
        amount,
        person,
        reason,
        dueDate,
        status: 'pending',
        date: new Date().toISOString()
    });
    
    // Clear inputs
    oweAmountInput.value = '';
    oweToInput.value = '';
    oweReasonInput.value = '';
    oweDueDateInput.value = '';
    
    updateUI();
}

// Delete item
function deleteItem(id, type) {
    if (confirm('Are you sure you want to delete this item?')) {
        if (type === 'transaction') {
            transactions.splice(id, 1);
        } else if (type === 'debt') {
            debts.splice(id, 1);
        }
        updateUI();
    }
}

// Clear all data
function clearData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        transactions = [];
        debts = [];
        localStorage.removeItem('transactions');
        localStorage.removeItem('debts');
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

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Attach event listeners
function attachEventListeners() {
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            activateTab(tab.dataset.tab);
        });
    });
    
    // Form submissions
    addIncomeBtn.addEventListener('click', addIncome);
    addExpenseBtn.addEventListener('click', addExpense);
    addOwedToMeBtn.addEventListener('click', addOwedToMe);
    addIOweBtn.addEventListener('click', addIOwe);
    clearBtn.addEventListener('click', clearData);
    themeToggle.addEventListener('click', toggleDarkMode);
    
    // Also allow adding with Enter key
    incomeSourceInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addIncome();
    });
    
    expenseSourceInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addExpense();
    });
    
    owedByInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addOwedToMe();
    });
    
    oweToInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addIOwe();
    });
    
    // Delete buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const btn = e.target.closest('.delete-btn');
            const id = parseInt(btn.dataset.id);
            const type = btn.dataset.type;
            deleteItem(id, type);
        }
    });
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Initialize the application
initApp();

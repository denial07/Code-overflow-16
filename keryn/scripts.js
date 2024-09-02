document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transaction-form');
    const transactionList = document.getElementById('transaction-list');
    const dateInput = document.getElementById('date');
    let editIndex = -1; // To track which transaction is being edited

    // Category class mapping
    const categoryClasses = {
        'Food': 'food',
        'Transport': 'transport',
        'Entertainment': 'entertainment',
        'Utilities': 'utilities',
        'Others': 'other'
    };

    // Function to load transactions from Local Storage
    function loadTransactions() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactionList.innerHTML = transactions.map((tx, index) => 
            `<li class="${categoryClasses[tx.category] || 'other'}">
                <span class="category">${tx.category}</span>: 
                ${tx.type}: $${tx.amount} - ${tx.description} (Date: ${tx.date})
                <div class="action-buttons">
                    <button onclick="editTransaction(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteTransaction(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </li>`
        ).join('');
    }
    loadTransactions();

    // Function to calculate spending for a given month and year
    function calculateMonthlySpending(year, month) {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        return transactions.reduce((total, tx) => {
            const txDate = new Date(tx.date);
            if (tx.type === 'expense' && txDate.getFullYear() === year && txDate.getMonth() === month) {
                return total + tx.amount;
            }
            return total;
        }, 0);
    }

    // Function to display spending comparison
    function displaySpendingComparison() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const currentMonthSpending = calculateMonthlySpending(currentYear, currentMonth);
        const previousMonthSpending = calculateMonthlySpending(previousMonthYear, previousMonth);

        document.getElementById('current-month-spending').textContent = `Spending this month: $${currentMonthSpending.toFixed(2)}`;
        document.getElementById('previous-month-spending').textContent = `Spending last month: $${previousMonthSpending.toFixed(2)}`;
    }

    // Function to set the default date to today
    function setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    // Handle form submission to add or update a transaction
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.getElementById('type').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value || new Date().toISOString().split('T')[0]; // Default to current date if not provided
        const category = document.getElementById('category').value; // New category input

        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

        if (editIndex > -1) {
            // Update existing transaction
            transactions[editIndex] = { type, amount, description, date, category };
            editIndex = -1; // Reset editIndex
        } else {
            // Add new transaction
            transactions.push({ type, amount, description, date, category });
        }

        localStorage.setItem('transactions', JSON.stringify(transactions));
        form.reset();
        setDefaultDate(); // Reset date to today
        loadTransactions();
        displaySpendingComparison();
    });

    // Initialize the form with today's date
    setDefaultDate();
    
    // Initial display of spending comparison
    displaySpendingComparison();

    // Edit a transaction
    window.editTransaction = function(index) {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const tx = transactions[index];

        document.getElementById('type').value = tx.type;
        document.getElementById('amount').value = tx.amount;
        document.getElementById('description').value = tx.description;
        document.getElementById('date').value = tx.date;
        document.getElementById('category').value = tx.category; // Set category field

        editIndex = index; // Set the index of the transaction being edited
    }

    // Delete a transaction
    window.deleteTransaction = function(index) {
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions = transactions.filter((_, i) => i !== index); // Remove the transaction at the given index

        localStorage.setItem('transactions', JSON.stringify(transactions));
        loadTransactions();
        displaySpendingComparison();
    }
});

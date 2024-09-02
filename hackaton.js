// Load data from localStorage
function loadFromLocalStorage() {
    const savedBudget = localStorage.getItem('budget');
    const savedExpenses = localStorage.getItem('totalExpenses');
    
    if (savedBudget) {
        budget = parseFloat(savedBudget);
        document.getElementById('monthly-budget').value = budget.toFixed(2);
    }
    
    if (savedExpenses) {
        totalExpenses = parseFloat(savedExpenses);
    }
    
    updateDisplay();
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('budget', budget.toFixed(2));
    localStorage.setItem('totalExpenses', totalExpenses.toFixed(2));
}

function updateDisplay() {
    const remainingBudget = budget - totalExpenses;
    document.getElementById('budget-amount').textContent = budget.toFixed(2);
    document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
    document.getElementById('remaining-budget').textContent = remainingBudget.toFixed(2);

    if (remainingBudget < 0) {
        document.getElementById('alert-message').textContent = 'You’re broke! Stop spending.';
    } else {
        document.getElementById('alert-message').textContent = '';
    }

    // Save the current state to localStorage
    saveToLocalStorage();
}

function addExpense() {
    const expenseInput = document.getElementById('expense').value;
    const expense = parseFloat(expenseInput);

    if (isNaN(expense) || expense <= 0) {
        alert('Please enter a valid expense amount.');
        return;
    }

    if (budget <= 0) {
        alert('Please set a budget first.');
        return;
    }

    totalExpenses += expense;
    updateDisplay();
}

// Event listeners
document.getElementById('monthly-budget').addEventListener('change', function() {
    const budgetInput = this.value;
    budget = parseFloat(budgetInput);

    if (isNaN(budget) || budget <= 0) {
        alert('Please enter a valid budget amount.');
        return;
    }

    totalExpenses = 0; // Reset expenses when the budget is updated
    updateDisplay();
});

document.getElementById('expense').addEventListener('input', function() {
    // Remove any previous error message
    document.getElementById('alert-message').textContent = '';
});

// Load saved data when the page is loaded
window.onload = function() {
    loadFromLocalStorage();
};


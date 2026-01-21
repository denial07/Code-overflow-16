// Get DOM elements
const incomeInput = document.getElementById('income');
const subscriptionInput = document.getElementById('subscription');
const savingsInput = document.getElementById('savings');
const calculateBudgetBtn = document.getElementById('calculate-budget');
const suggestedBudgetBtn = document.getElementById('suggested-budget');
const customBudgetBtn = document.getElementById('custom-budget');
const applyCustomBudgetBtn = document.getElementById('apply-custom-budget');
const backToSuggestedBudgetBtn = document.getElementById('back-to-suggested-budget');
const foodBudgetInput = document.getElementById('food-budget');
const transportBudgetInput = document.getElementById('transport-budget');
const entertainmentBudgetInput = document.getElementById('entertainment-budget');
const fashionBudgetInput = document.getElementById('fashion-budget');
const othersBudgetInput = document.getElementById('others-budget');
const addExpenseBtn = document.getElementById('add-expense');
const productTitleInput = document.getElementById('product-title');
const userAmountInput = document.getElementById('user-amount');
const categorySelect = document.getElementById('category-select');
const listContainer = document.getElementById('list');
const foodCategorySpent = document.getElementById('food-category-spent');
const transportCategorySpent = document.getElementById('transport-category-spent');
const entertainmentCategorySpent = document.getElementById('entertainment-category-spent');
const fashionCategorySpent = document.getElementById('fashion-category-spent');
const othersCategorySpent = document.getElementById('others-category-spent');
const budgetOutput = document.getElementById('budget');
const amountOutput = document.getElementById('amount');
const expenditureValueOutput = document.getElementById('expenditure-value');
const balanceAmountOutput = document.getElementById('balance-amount');
const alertBox = document.getElementById('alert-box');
const timerElement = document.getElementById('timer'); 

// Initialize budget and expenses
let budget = 0;
let expenses = {
    food: 0,
    transport: 0,
    entertainment: 0,
    fashion: 0,
    others: 0
};

function loadFromLocalStorage() {
    const savedData = JSON.parse(localStorage.getItem('budgetAppData')) || {};
    budget = savedData.budget || 0;
    expenses = savedData.expenses || expenses;

    // Set DOM elements with saved data
    budgetOutput.textContent = budget.toFixed(2);
    updateCategorySpending();
    updateBalance();
    updateExpenseList();
    updateOverallExpenseList(); // Add this line

    // Load disabled state
    const inputsDisabled = localStorage.getItem('inputsDisabled') === 'true';
    incomeInput.disabled = inputsDisabled;
    subscriptionInput.disabled = inputsDisabled;
    savingsInput.disabled = inputsDisabled;
    calculateBudgetBtn.disabled = inputsDisabled;
}


// Save data to localStorage
function saveToLocalStorage() {
    const data = {
        budget: budget,
        expenses: expenses
    };
    localStorage.setItem('budgetAppData', JSON.stringify(data));
}

// Update category spending in DOM
function updateCategorySpending() {
    foodCategorySpent.textContent = expenses.food.toFixed(2);
    transportCategorySpent.textContent = expenses.transport.toFixed(2);
    entertainmentCategorySpent.textContent = expenses.entertainment.toFixed(2);
    fashionCategorySpent.textContent = expenses.fashion.toFixed(2);
    othersCategorySpent.textContent = expenses.others.toFixed(2);
    updateBalance();
}

// Update balance and total amount in DOM
function updateBalance() {
    const totalExpenses = Object.values(expenses).reduce((a, b) => a + b, 0);
    expenditureValueOutput.textContent = totalExpenses.toFixed(2);
    balanceAmountOutput.textContent = (budget - totalExpenses).toFixed(2);
    amountOutput.textContent = budget.toFixed(2);
}

// Update expense list in DOM
function updateExpenseList() {
    const savedList = JSON.parse(localStorage.getItem('expenseList')) || [];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    listContainer.innerHTML = ''; // Clear existing entries

    savedList.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
            const expenseEntry = document.createElement('div');
            expenseEntry.className = 'expense-entry';
            expenseEntry.innerHTML = `
                <span>${entry.category.charAt(0).toUpperCase() + entry.category.slice(1)} - ${entry.title} - $${entry.amount.toFixed(2)} - ${entry.date}</span>
                <button class="edit" onclick="editExpense(this)"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="delete" onclick="deleteExpense(this)"><i class="fa-solid fa-trash-can"></i></button>
            `;
            listContainer.appendChild(expenseEntry);
        }
    });
}


// Calculate and display budget
function calculateBudget() {
    const income = parseFloat(incomeInput.value) || 0;
    const subscription = parseFloat(subscriptionInput.value) || 0;
    const savings = parseFloat(savingsInput.value) || 0;
    budget = income - subscription - savings;
    budgetOutput.textContent = budget.toFixed(2);
    updateBalance();
    showSuggestedBudget();
    saveToLocalStorage();

    // Disable the input fields after setting the budget
    incomeInput.disabled = true;
    subscriptionInput.disabled = true;
    savingsInput.disabled = true;
    calculateBudgetBtn.disabled = true;

    // Save the disabled state to localStorage
    localStorage.setItem('inputsDisabled', 'true');
}

// Initialize the month counter
let month = parseInt(localStorage.getItem('monthCounter')) || 1;

// Duration of the countdown in milliseconds (1 minute)
const countdownDuration = 1 * 60 * 1000; 

// Function to format time as MM:SS
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Function to update the timer display
function updateTimer() {
    const now = Date.now();
    const timeRemaining = endTime - now;

    if (timeRemaining <= 0) {
        // Calculate the displayed month
        const currentMonth = month+1; // JavaScript months are 0-11
        const displayedMonth = ((currentMonth - 1) % 12) + 1;
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        clearInterval(timerInterval);
        alert(`It's ${monthNames[displayedMonth - 1]}!`);
        showAlert();
        resetTimer();
    } else {
        document.getElementById('timer').textContent = formatTime(timeRemaining);
    }
}

// Function to reset the timer
function resetTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    endTime = Date.now() + countdownDuration;
    localStorage.setItem('endTime', endTime);

    // Increment month counter and save to localStorage
    month++;
    localStorage.setItem('monthCounter', month);

    timerInterval = setInterval(updateTimer, 1000);
}

// Get the end time from localStorage or set it if not available
let endTime = localStorage.getItem('endTime');
if (!endTime) {
    endTime = Date.now() + countdownDuration;
    localStorage.setItem('endTime', endTime);
}

// Update the timer every second
let timerInterval = setInterval(updateTimer, 1000);

// Initial call to display the timer immediately
updateTimer();


// Show alert message
function showAlert() {
    const savedAmount = budget - Object.values(expenses).reduce((a, b) => a + b, 0);
    const goalAmount = parseFloat(savingsInput.value) || 0;

    let message;
    
    if (savedAmount === 0) {
        message = `Congrats on saving $${goalAmount.toFixed(2)}!`;
    } else if (savedAmount < 0) {
        message = `You did not manage to reach your goal of saving $${goalAmount.toFixed(2)}, try harder!`;
    } else {
        message = `Congrats on saving a total of $${(goalAmount + savedAmount).toFixed(2)}, reaching your goal of $${goalAmount.toFixed(2)} and saving $${savedAmount.toFixed(2)} on top of that, keep it up!`;
    }

    alert(message);
    resetEverything();
}



// Reset everything
function resetEverything() {
    // Reset inputs
    incomeInput.value = '';
    subscriptionInput.value = '';
    savingsInput.value = '';
    productTitleInput.value = '';
    userAmountInput.value = '';
    categorySelect.value = 'food'; // or any default value

    // Enable the input fields again
    incomeInput.disabled = false;
    subscriptionInput.disabled = false;
    savingsInput.disabled = false;
    calculateBudgetBtn.disabled = false;

    // Reset budget and expenses
    budget = 0;
    expenses = {
        food: 0,
        transport: 0,
        entertainment: 0,
        fashion: 0,
        others: 0
    };

    // Clear expense list
    listContainer.innerHTML = '';

    // Reset category spending
    updateCategorySpending();

    // Save reset data to localStorage
    saveToLocalStorage();
    localStorage.setItem('inputsDisabled', 'false'); // Make sure to reset the disabled state
}


// Show suggested budget allocations
function showSuggestedBudget() {
    document.getElementById('suggested-budget-container').classList.remove('hide');
    document.getElementById('custom-budget-container').classList.add('hide');
    const foodBudget = (budget * 0.20).toFixed(2);
    const transportBudget = (budget * 0.10).toFixed(2);
    const entertainmentBudget = (budget * 0.15).toFixed(2);
    const fashionBudget = (budget * 0.15).toFixed(2);
    const othersBudget = (budget * 0.40).toFixed(2);
    document.getElementById('food-budget-suggested').textContent = foodBudget;
    document.getElementById('transport-budget-suggested').textContent = transportBudget;
    document.getElementById('entertainment-budget-suggested').textContent = entertainmentBudget;
    document.getElementById('fashion-budget-suggested').textContent = fashionBudget;
    document.getElementById('others-budget-suggested').textContent = othersBudget;
}

// Show custom budget form
function showCustomBudgetForm() {
    document.getElementById('custom-budget-container').classList.remove('hide');
    document.getElementById('suggested-budget-container').classList.add('hide');
}

// Apply custom budget allocations
function applyCustomBudget() {
    const foodBudget = parseInputBudget(foodBudgetInput.value);
    const transportBudget = parseInputBudget(transportBudgetInput.value);
    const entertainmentBudget = parseInputBudget(entertainmentBudgetInput.value);
    const fashionBudget = parseInputBudget(fashionBudgetInput.value);
    const othersBudget = parseInputBudget(othersBudgetInput.value);

    document.getElementById('custom-budget-container').classList.add('hide');
    document.getElementById('suggested-budget-container').classList.remove('hide');
    document.getElementById('food-budget-suggested').textContent = foodBudget.toFixed(2);
    document.getElementById('transport-budget-suggested').textContent = transportBudget.toFixed(2);
    document.getElementById('entertainment-budget-suggested').textContent = entertainmentBudget.toFixed(2);
    document.getElementById('fashion-budget-suggested').textContent = fashionBudget.toFixed(2);
    document.getElementById('others-budget-suggested').textContent = othersBudget.toFixed(2);
    saveToLocalStorage();
}

// Parse budget input as percentage or amount
function parseInputBudget(value) {
    if (value.includes('%')) {
        const percentage = parseFloat(value) / 100;
        return budget * percentage;
    } else {
        return parseFloat(value) || 0;
    }
}

// Add expense and update DOM
function addExpense() {
    const title = productTitleInput.value.trim();
    const amount = parseFloat(userAmountInput.value);
    const category = categorySelect.value;

    if (!title || isNaN(amount)) {
        alert('Please provide a valid title and amount.');
        return;
    }

    const expenseEntry = {
        title: title,
        amount: amount,
        category: category,
        date: new Date().toLocaleString()
    };

    const expenseElement = document.createElement('div');
    expenseElement.className = 'expense-entry';
    expenseElement.innerHTML = `
        <span>${category.charAt(0).toUpperCase() + category.slice(1)} - ${title} - $${amount.toFixed(2)} - ${expenseEntry.date}</span>
        <button class="edit" onclick="editExpense(this)"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="delete" onclick="deleteExpense(this)"><i class="fa-solid fa-trash-can"></i></button>
    `
    ;
    listContainer.appendChild(expenseElement);

    // Update expenses and category spending
    expenses[category] += amount;
    updateCategorySpending();
    checkBudget(category);

    // Clear inputs
    productTitleInput.value = '';
    userAmountInput.value = '';
    
    // Save to localStorage
    saveExpenseToLocalStorage(expenseEntry);
    saveToLocalStorage();
    updateOverallExpenseList();
}

// Save expense to localStorage
function saveExpenseToLocalStorage(expense) {
    let savedList = JSON.parse(localStorage.getItem('expenseList')) || [];
    savedList.push(expense);
    localStorage.setItem('expenseList', JSON.stringify(savedList));
}

// Check if expenses exceed suggested budget
function checkBudget(category) {
    const suggestedBudget = parseFloat(document.getElementById(`${category}-budget-suggested`).textContent);
    if (expenses[category] > suggestedBudget) {
        alert(`You have exceeded the budget for ${category}.`);
    }
}

// Edit expense
function editExpense(button) {
    const entry = button.parentElement;
    const span = entry.querySelector('span');
    const textContent = span.textContent;
    
    const match = textContent.match(/^(\w+)\s*-\s*(.*?)\s*-\s*\$(\d+(\.\d+)?)\s*-\s*(.+)$/);
    if (!match) {
        console.error("Failed to parse expense entry. Check format:", textContent);
        return;
    }

    const [, originalCategory, originalTitle, originalAmountStr, , originalDate] = match;
    const originalAmount = parseFloat(originalAmountStr);

    if (isNaN(originalAmount)) {
        console.error('Original amount is NaN. Value:', originalAmountStr);
        return;
    }

    // Return the money back to the budget
    budget += originalAmount;
    expenses[originalCategory.toLowerCase()] -= originalAmount;
    updateCategorySpending();
    updateBalance();

    // Prompt user for new values
    const newTitle = prompt('Change the title:', originalTitle) || originalTitle;
    let newAmountStr = prompt('Change the amount:', originalAmount.toFixed(2)) || originalAmount.toFixed(2);
    let newAmount = parseFloat(newAmountStr);

    if (isNaN(newAmount)) {
        console.error('New amount is NaN. Value:', newAmountStr);
        newAmount = originalAmount; // Revert to original amount if invalid
    }

    let newCategory = prompt('Change the category (food, transport, entertainment, fashion, others):', originalCategory.toLowerCase()) || originalCategory.toLowerCase();

    // Validate category
    if (!expenses.hasOwnProperty(newCategory)) {
        alert('Invalid category. Keeping the original category.');
        newCategory = originalCategory.toLowerCase();
    }

    // Update the budget and expenses with new values
    budget -= newAmount;
    expenses[newCategory] += newAmount;
    updateCategorySpending();
    updateBalance();

    // Remove old entry
    entry.remove();

    // Create new entry
    const newEntry = {
        title: newTitle,
        amount: newAmount,
        category: newCategory,
        date: new Date().toLocaleString(),
        edit: true
    };

    const newExpenseElement = document.createElement('div');
    newExpenseElement.className = 'expense-entry';
    newExpenseElement.innerHTML = `
        <span>${newCategory.charAt(0).toUpperCase() + newCategory.slice(1)} - ${newTitle} - $${newAmount.toFixed(2)} - ${newEntry.date} (edit)</span>
        <button class="edit" onclick="editExpense(this)"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="delete" onclick="deleteExpense(this)"><i class="fa-solid fa-trash-can"></i></button>
    `;
    listContainer.appendChild(newExpenseElement);

    // Update localStorage and overall history
    updateLocalStorageWithEdit(textContent, newEntry);
    updateOverallExpenseList();
}


// Update localStorage with edited entry
function updateLocalStorageWithEdit(oldTextContent, newEntry) {
    let savedList = JSON.parse(localStorage.getItem('expenseList')) || [];
    
    // Remove old entry
    savedList = savedList.filter(entry => 
        `${entry.category.charAt(0).toUpperCase() + entry.category.slice(1)} - ${entry.title} - $${entry.amount.toFixed(2)} - ${entry.date}${entry.edit ? ' (edit)' : ''}` !== oldTextContent
    );

    // Add updated entry
    savedList.push(newEntry);
    localStorage.setItem('expenseList', JSON.stringify(savedList));
}

// Delete expense
function deleteExpense(button) {    
    const entry = button.parentElement;
    const span = entry.querySelector('span');
    const textContent = span.textContent;

    // Extract category and amount from the entry
    const match = textContent.match(/^(\w+)\s*-\s*(.*?)\s*-\s*\$(\d+(\.\d+)?)\s*-\s*(.+?)(\s*\(edit\))?$/);
    if (!match) {
        console.error("Failed to parse expense entry. Check format:", textContent);
        return;
    }

    const [, category, , amountStr] = match;
    const amount = parseFloat(amountStr);

    if (isNaN(amount)) {
        console.error('Amount is NaN. Value:', amountStr);
        return;
    }

    // Update expenses and category spending
    expenses[category.toLowerCase()] -= amount;
    updateCategorySpending();
    updateBalance();

    // Remove the entry from the list
    listContainer.removeChild(entry);

    // Remove from overall history
    deleteOverallExpenseFromHistory(textContent);
    updateOverallExpenseList(); // Update overall history immediately
}




const overallHistoryContainer = document.getElementById('overall-history-list');

function updateOverallExpenseList() {
    const savedList = JSON.parse(localStorage.getItem('expenseList')) || [];
    overallHistoryContainer.innerHTML = ''; // Clear existing entries

    savedList.forEach(entry => {
        const expenseEntry = document.createElement('div');
        expenseEntry.className = 'expense-entry';
        expenseEntry.innerHTML = `
            <span>${entry.category.charAt(0).toUpperCase() + entry.category.slice(1)} - ${entry.title} - $${entry.amount.toFixed(2)} - ${entry.date}${entry.edit ? ' (edit)' : ''}</span>
            <button class="delete" onclick="deleteOverallExpense(this)"><i class="fa-solid fa-trash-can"></i></button>
        `;
        overallHistoryContainer.appendChild(expenseEntry);
    });
}


function deleteOverallExpense(button) {
    const entry = button.parentElement;
    const span = entry.querySelector('span');
    const textContent = span.textContent;

    // Remove the entry from the list
    overallHistoryContainer.removeChild(entry);

    // Remove from localStorage
    let savedList = JSON.parse(localStorage.getItem('expenseList')) || [];
    savedList = savedList.filter(entry => 
        `${entry.category.charAt(0).toUpperCase() + entry.category.slice(1)} - ${entry.title} - $${entry.amount.toFixed(2)} - ${entry.date}` !== textContent
    );
    
    localStorage.setItem('expenseList', JSON.stringify(savedList));
}

function deleteOverallExpenseFromHistory(textContent) {
    let savedList = JSON.parse(localStorage.getItem('expenseList')) || [];
    savedList = savedList.filter(entry => 
        `${entry.category.charAt(0).toUpperCase() + entry.category.slice(1)} - ${entry.title} - $${entry.amount.toFixed(2)} - ${entry.date}${entry.edit ? ' (edit)' : ''}` !== textContent
    );
    localStorage.setItem('expenseList', JSON.stringify(savedList));
}

// Event listeners
calculateBudgetBtn.addEventListener('click', calculateBudget);
suggestedBudgetBtn.addEventListener('click', showSuggestedBudget);
customBudgetBtn.addEventListener('click', showCustomBudgetForm);
applyCustomBudgetBtn.addEventListener('click', applyCustomBudget);
backToSuggestedBudgetBtn.addEventListener('click', showSuggestedBudget);
addExpenseBtn.addEventListener('click', addExpense);

// Load initial data and start the timer when the page loads
window.onload = () => {
    loadFromLocalStorage();
};

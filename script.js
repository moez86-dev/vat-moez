// script.js

// Helper functions to handle localStorage
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Function to update the total sales and purchases
function updateTotals() {
    const sales = loadFromLocalStorage('sales');
    const purchases = loadFromLocalStorage('purchases');

    // Calculate total sales and purchases
    const totalSales = sales.reduce((total, sale) => total + parseFloat(sale.amount), 0);
    const totalPurchases = purchases.reduce((total, purchase) => total + parseFloat(purchase.amount), 0);

    // Display total sales and purchases
    document.getElementById('total-sales').textContent = totalSales.toFixed(2);
    document.getElementById('total-purchases').textContent = totalPurchases.toFixed(2);

    // Update the tax report
    document.getElementById('total-sales-report').textContent = totalSales.toFixed(2);
    document.getElementById('total-purchases-report').textContent = totalPurchases.toFixed(2);

    // Calculate and display sales and purchases tax
    const salesTax = (totalSales * 0.15).toFixed(2);
    const purchasesTax = (totalPurchases * 0.15).toFixed(2);

    document.getElementById('sales-tax').textContent = salesTax;
    document.getElementById('purchases-tax').textContent = purchasesTax;

    // Calculate and display net VAT with "ريال"
    const netVAT = (parseFloat(purchasesTax) - parseFloat(salesTax)).toFixed(2);
    document.getElementById('net-vat').textContent = `${netVAT} ريال`;
}

// Function to render table data
function renderTable(tableId, data) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.number}</td>
            <td>${item.date}</td>
            <td>${item.amount}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to add a sale
function addSale(event) {
    event.preventDefault();

    const number = document.getElementById('sales-number').value;
    const date = document.getElementById('sales-date').value;
    const amount = document.getElementById('sales-amount').value;

    if (number && date && amount) {
        const sales = loadFromLocalStorage('sales');
        sales.push({ number, date, amount });
        saveToLocalStorage('sales', sales);

        renderTable('sales-list', sales);
        updateTotals();

        document.getElementById('sales-form').reset();
    }
}

// Function to add a purchase
function addPurchase(event) {
    event.preventDefault();

    const number = document.getElementById('purchases-number').value;
    const date = document.getElementById('purchases-date').value;
    const amount = document.getElementById('purchases-amount').value;

    if (number && date && amount) {
        const purchases = loadFromLocalStorage('purchases');
        purchases.push({ number, date, amount });
        saveToLocalStorage('purchases', purchases);

        renderTable('purchases-list', purchases);
        updateTotals();

        document.getElementById('purchases-form').reset();
    }
}

// Function to handle the date range form submission
function handleDateRangeForm(event) {
    event.preventDefault();
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    // Save date range to localStorage
    saveToLocalStorage('date-range', { startDate, endDate });
}

// Event listeners
document.getElementById('sales-form').addEventListener('submit', addSale);
document.getElementById('purchases-form').addEventListener('submit', addPurchase);
document.getElementById('date-range-form').addEventListener('submit', handleDateRangeForm);

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    const sales = loadFromLocalStorage('sales');
    const purchases = loadFromLocalStorage('purchases');
    const dateRange = loadFromLocalStorage('date-range');

    renderTable('sales-list', sales);
    renderTable('purchases-list', purchases);
    updateTotals();

    if (dateRange) {
        document.getElementById('start-date').value = dateRange.startDate || '';
        document.getElementById('end-date').value = dateRange.endDate || '';
    }
});

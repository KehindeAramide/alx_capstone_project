document.addEventListener("DOMContentLoaded", function () {
    const incomeInput = document.getElementById("incomeAmount");
    const budgetInput = document.getElementById("budgetAmount");
    const itemInput = document.getElementById("Item");
    const itemValueInput = document.getElementById("ItemValue");
    const setBudgetButton = document.getElementById("setBudgetButton");
    const postIncomeButton = document.getElementById("enterIncome");
    const postExpenseButton = document.getElementById("postExpenseButton");
    const transactionList = document.getElementById("transaction-list");
    const exportButton = document.getElementById("export-data");

    let budget = 0;
    let totalExpenses = 0;
    let totalIncome = 0;

    postIncomeButton.addEventListener("click", function () {
        const incomeAmountEntered = parseFloat(incomeInput.value);
        if (!isNaN(incomeAmountEntered) && incomeAmountEntered >= 0) {
            totalIncome = incomeAmountEntered;
            document.getElementById("Income-Amount").textContent = totalIncome;
            updateSavings();
            updatePieCharts(); // Call the function to update the charts
        }
    });

    setBudgetButton.addEventListener("click", function () {
        const budgetAmountEntered = parseFloat(budgetInput.value);
        if (!isNaN(budgetAmountEntered) && budgetAmountEntered >= 0) {
            budget = budgetAmountEntered;
            document.getElementById("Budget-Amount").textContent = budget;
            updateSavings();
            updatePieCharts(); // Call the function to update the charts
        } else {
            alert("Please enter a valid budget amount.");
        }
    });

    postExpenseButton.addEventListener("click", function () {
        const item = itemInput.value;
        const itemValue = parseFloat(itemValueInput.value);

        if (item && !isNaN(itemValue) && itemValue >= 0) {
            const transaction = {
                description: item,
                amount: itemValue,
                type: "Expense"
            };

            totalExpenses += itemValue;
            document.getElementById("expenditure-value").textContent = totalExpenses;
            updateSavings();
            updateTransactionList(transaction);
            updatePieCharts(); // Call the function to update the charts
        } else {
            alert("Please enter a valid item and cost.");
        }
    });

    function updateSavings() {
        const savings = totalIncome - totalExpenses;
        document.getElementById("balance-amount").textContent = savings >= 0 ? savings : 0;
    }

    function updateTransactionList(transaction) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${transaction.description}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.type}</td>
            <td>
                <button class="delete-button">Delete</button>
                <button class="edit-button">Edit</button>
            </td>
        `;

        const deleteButton = row.querySelector(".delete-button");
        deleteButton.addEventListener("click", function () {
            totalExpenses -= transaction.amount;
            transactionList.removeChild(row);
            updateSavings();
        });

        const editButton = row.querySelector(".edit-button");
        editButton.addEventListener("click", function () {
            // Opening a modal or form to edit the transaction details
            // Update the transaction and UI after editing
            alert("Edit functionality is a placeholder. Implement your edit logic here.");
        });

        transactionList.appendChild(row);
    }

    function updatePieCharts() {
        // Update Expenses and Savings Pie Chart
        const expensesSavingsCtx = document.getElementById("expenses-savings-chart").getContext("2d");
        if (window.expensesSavingsPie) {
            window.expensesSavingsPie.destroy();
        }

        window.expensesSavingsPie = new Chart(expensesSavingsCtx, {
            type: "pie",
            data: {
                labels: ["Expenses", "Savings"],
                datasets: [{
                    data: [totalExpenses, totalIncome - totalExpenses],
                    backgroundColor: ["#FF6384", "#36A2EB"],
                    hoverBackgroundColor: ["#FF6384", "#36A2EB"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Update Income and Budget Pie Chart
        const incomeBudgetCtx = document.getElementById("income-budget-chart").getContext("2d");
        if (window.incomeBudgetPie) {
            window.incomeBudgetPie.destroy();
        }

        window.incomeBudgetPie = new Chart(incomeBudgetCtx, {
            type: "pie",
            data: {
                labels: ["Income", "Budget"],
                datasets: [{
                    data: [totalIncome, budget],
                    backgroundColor: ["#4CAF50", "#FFC107"],
                    hoverBackgroundColor: ["#4CAF50", "#FFC107"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    exportButton.addEventListener("click", function () {
        const exportData = {
            budget: budget,
            totalExpenses: totalExpenses,
            transactions: []
        };

        const transactionRows = document.querySelectorAll("#transaction-list tr");
        transactionRows.forEach(row => {
            const cells = row.children;
            const transaction = {
                description: cells[0].textContent,
                amount: parseFloat(cells[1].textContent),
                type: cells[2].textContent
            };
            exportData.transactions.push(transaction);
        });

        // Convert data to JSON string
        const jsonData = JSON.stringify(exportData, null, 2);

        // Create a Blob with the JSON data and create a download link
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "budget_data.json";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        // Remove the download link from the DOM
        document.body.removeChild(a);
    });
});

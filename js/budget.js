/* ===================================
   BudgetWise Ultra X Pro Max
   Smart Budget Planner System
=================================== */

class BudgetManager {

    constructor() {

        this.budgets =
            JSON.parse(
                localStorage.getItem("bw_budgets")
            ) || [];

        this.expenses =
            JSON.parse(
                localStorage.getItem("bw_expenses")
            ) || [];

        this.form =
            document.getElementById("budgetForm");

        this.table =
            document.getElementById("budgetTable");

        this.init();

    }

    /* ==========================
       Initialize
    ========================== */

    init() {

        this.bindEvents();
        this.renderBudgets();
        this.updateStats();

        console.log(
            "🎯 Budget Manager Loaded"
        );

    }

    /* ==========================
       Event Listeners
    ========================== */

    bindEvents() {

        if (this.form) {

            this.form.addEventListener(
                "submit",
                (e) => {

                    e.preventDefault();

                    this.addBudget();

                }
            );

        }

    }

    /* ==========================
       Add Budget
    ========================== */

    addBudget() {

        const category =
            document.getElementById(
                "budgetCategory"
            )?.value;

        const amount =
            document.getElementById(
                "budgetAmount"
            )?.value;

        const month =
            document.getElementById(
                "budgetMonth"
            )?.value;

        if (
            !category ||
            !amount ||
            !month
        ) {

            alert(
                "Please fill all fields."
            );

            return;

        }

        const budget = {

            id: Date.now(),

            category,

            amount:
                Number(amount),

            month,

            createdAt:
                new Date().toISOString()

        };

        this.budgets.push(budget);

        this.saveBudgets();

        this.renderBudgets();

        this.updateStats();

        if (window.app) {

            app.showNotification(
                "Budget Created Successfully",
                "success"
            );

        }

        this.form.reset();

    }

    /* ==========================
       Save Budgets
    ========================== */

    saveBudgets() {

        localStorage.setItem(
            "bw_budgets",
            JSON.stringify(
                this.budgets
            )
        );

    }

    /* ==========================
       Delete Budget
    ========================== */

    deleteBudget(id) {

        this.budgets =
            this.budgets.filter(
                budget =>
                    budget.id !== id
            );

        this.saveBudgets();

        this.renderBudgets();

        this.updateStats();

        if (window.app) {

            app.showNotification(
                "Budget Deleted",
                "warning"
            );

        }

    }

    /* ==========================
       Calculate Spent Amount
    ========================== */

    getSpentAmount(category) {

        return this.expenses
            .filter(
                expense =>
                    expense.category === category
            )
            .reduce(
                (
                    total,
                    expense
                ) =>
                    total +
                    Number(expense.amount),
                0
            );

    }

    /* ==========================
       Budget Progress
    ========================== */

    getBudgetProgress(
        budgetAmount,
        spentAmount
    ) {

        return Math.min(
            (
                spentAmount /
                budgetAmount
            ) * 100,
            100
        );

    }

    /* ==========================
       Render Budgets
    ========================== */

    renderBudgets() {

        if (!this.table) return;

        this.table.innerHTML = "";

        this.budgets.forEach(
            budget => {

                const spent =
                    this.getSpentAmount(
                        budget.category
                    );

                const progress =
                    this.getBudgetProgress(
                        budget.amount,
                        spent
                    );

                const status =
                    spent >
                    budget.amount
                        ? "Exceeded"
                        : "Safe";

                const row =
                    document.createElement(
                        "tr"
                    );

                row.innerHTML = `
                    <td>${budget.category}</td>

                    <td>₹${budget.amount.toLocaleString()}</td>

                    <td>₹${spent.toLocaleString()}</td>

                    <td>
                        <div class="progress-container">
                            <div
                            class="progress-bar"
                            style="width:${progress}%">
                            </div>
                        </div>
                        ${progress.toFixed(1)}%
                    </td>

                    <td>
                        <span class="
                        ${
                            status === "Safe"
                            ? "badge badge-success"
                            : "badge badge-danger"
                        }">
                        ${status}
                        </span>
                    </td>

                    <td>
                        <button
                        class="btn-danger"
                        onclick="budgetManager.deleteBudget(${budget.id})">
                        Delete
                        </button>
                    </td>
                `;

                this.table.appendChild(
                    row
                );

            }
        );

    }

    /* ==========================
       Total Budget
    ========================== */

    getTotalBudget() {

        return this.budgets.reduce(
            (
                total,
                budget
            ) =>
                total +
                budget.amount,
            0
        );

    }

    /* ==========================
       Total Spending
    ========================== */

    getTotalSpent() {

        return this.expenses.reduce(
            (
                total,
                expense
            ) =>
                total +
                Number(expense.amount),
            0
        );

    }

    /* ==========================
       Remaining Budget
    ========================== */

    getRemainingBudget() {

        return (
            this.getTotalBudget() -
            this.getTotalSpent()
        );

    }

    /* ==========================
       Overspending Alerts
    ========================== */

    checkOverspending() {

        this.budgets.forEach(
            budget => {

                const spent =
                    this.getSpentAmount(
                        budget.category
                    );

                if (
                    spent >
                    budget.amount
                ) {

                    if (window.app) {

                        app.showNotification(
                            `⚠ Budget Exceeded: ${budget.category}`,
                            "error"
                        );

                    }

                }

            }
        );

    }

    /* ==========================
       Statistics
    ========================== */

    updateStats() {

        const totalBudget =
            document.getElementById(
                "totalBudget"
            );

        const totalSpent =
            document.getElementById(
                "totalSpent"
            );

        const remainingBudget =
            document.getElementById(
                "remainingBudget"
            );

        if (totalBudget) {

            totalBudget.textContent =
                "₹" +
                this.getTotalBudget()
                    .toLocaleString();

        }

        if (totalSpent) {

            totalSpent.textContent =
                "₹" +
                this.getTotalSpent()
                    .toLocaleString();

        }

        if (remainingBudget) {

            remainingBudget.textContent =
                "₹" +
                this.getRemainingBudget()
                    .toLocaleString();

        }

        this.checkOverspending();

    }

    /* ==========================
       Export Budget Report
    ========================== */

    exportCSV() {

        let csv =
            "Category,Budget,Spent,Remaining\n";

        this.budgets.forEach(
            budget => {

                const spent =
                    this.getSpentAmount(
                        budget.category
                    );

                csv +=
                    `${budget.category},` +
                    `${budget.amount},` +
                    `${spent},` +
                    `${budget.amount - spent}\n`;

            }
        );

        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv"
                }
            );

        const link =
            document.createElement(
                "a"
            );

        link.href =
            URL.createObjectURL(
                blob
            );

        link.download =
            "budget-report.csv";

        link.click();

    }

}

/* ==========================
   Initialize Budget Manager
========================== */

const budgetManager =
    new BudgetManager();

/* ==========================
   Global Access
========================== */

window.budgetManager =
    budgetManager;

window.exportBudgets =
    () =>
        budgetManager.exportCSV();

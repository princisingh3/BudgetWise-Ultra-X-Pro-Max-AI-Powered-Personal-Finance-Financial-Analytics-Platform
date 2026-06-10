/* ===================================
   BudgetWise Ultra X Pro Max
   Expense Management System
=================================== */

class ExpenseManager {

    constructor() {

        this.expenses =
            JSON.parse(
                localStorage.getItem("bw_expenses")
            ) || [];

        this.form =
            document.getElementById("expenseForm");

        this.table =
            document.getElementById("expenseTable");

        this.init();

    }

    /* ==========================
       Initialize
    ========================== */

    init() {

        this.bindEvents();
        this.renderExpenses();
        this.updateStats();

        console.log(
            "💸 Expense Manager Loaded"
        );

    }

    /* ==========================
       Event Listeners
    ========================== */

    bindEvents() {

        if (this.form) {

            this.form.addEventListener(
                "submit",
                e => {

                    e.preventDefault();

                    this.addExpense();

                }
            );

        }

    }

    /* ==========================
       Add Expense
    ========================== */

    addExpense() {

        const title =
            document.getElementById(
                "expenseTitle"
            )?.value;

        const amount =
            document.getElementById(
                "expenseAmount"
            )?.value;

        const category =
            document.getElementById(
                "expenseCategory"
            )?.value;

        const date =
            document.getElementById(
                "expenseDate"
            )?.value;

        if (
            !title ||
            !amount ||
            !category ||
            !date
        ) {

            alert(
                "Please fill all fields"
            );

            return;

        }

        const expense = {

            id: Date.now(),

            title,

            amount:
                Number(amount),

            category,

            date,

            status:
                "Completed",

            createdAt:
                new Date().toISOString()

        };

        this.expenses.push(expense);

        this.saveExpenses();

        this.renderExpenses();

        this.updateStats();

        this.form.reset();

        if (window.app) {

            app.showNotification(
                "Expense Added Successfully",
                "success"
            );

        }

    }

    /* ==========================
       Save Expenses
    ========================== */

    saveExpenses() {

        localStorage.setItem(
            "bw_expenses",
            JSON.stringify(
                this.expenses
            )
        );

    }

    /* ==========================
       Delete Expense
    ========================== */

    deleteExpense(id) {

        this.expenses =
            this.expenses.filter(
                expense =>
                    expense.id !== id
            );

        this.saveExpenses();

        this.renderExpenses();

        this.updateStats();

        if (window.app) {

            app.showNotification(
                "Expense Deleted",
                "warning"
            );

        }

    }

    /* ==========================
       Render Expenses
    ========================== */

    renderExpenses() {

        if (!this.table) return;

        this.table.innerHTML = "";

        const latestExpenses =
            [...this.expenses]
            .reverse()
            .slice(0, 20);

        latestExpenses.forEach(
            expense => {

                const row =
                    document.createElement(
                        "tr"
                    );

                row.innerHTML = `
                    <td>${expense.date}</td>
                    <td>${expense.title}</td>
                    <td>${expense.category}</td>
                    <td>₹${expense.amount.toLocaleString()}</td>
                    <td>
                        <span class="badge badge-success">
                            ${expense.status}
                        </span>
                    </td>
                    <td>
                        <button
                        class="btn-danger"
                        onclick="expenseManager.deleteExpense(${expense.id})">
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
       Search Expenses
    ========================== */

    searchExpenses(keyword) {

        return this.expenses.filter(
            expense =>
                expense.title
                    .toLowerCase()
                    .includes(
                        keyword.toLowerCase()
                    ) ||

                expense.category
                    .toLowerCase()
                    .includes(
                        keyword.toLowerCase()
                    )
        );

    }

    /* ==========================
       Filter By Category
    ========================== */

    filterByCategory(
        category
    ) {

        return this.expenses.filter(
            expense =>
                expense.category ===
                category
        );

    }

    /* ==========================
       Monthly Expense
    ========================== */

    getMonthlyExpense() {

        const currentMonth =
            new Date().getMonth();

        const currentYear =
            new Date().getFullYear();

        return this.expenses
            .filter(expense => {

                const expenseDate =
                    new Date(
                        expense.date
                    );

                return (
                    expenseDate.getMonth() ===
                        currentMonth &&
                    expenseDate.getFullYear() ===
                        currentYear
                );

            })
            .reduce(
                (
                    total,
                    expense
                ) =>
                    total +
                    expense.amount,
                0
            );

    }

    /* ==========================
       Total Expense
    ========================== */

    getTotalExpense() {

        return this.expenses.reduce(
            (
                total,
                expense
            ) =>
                total +
                expense.amount,
            0
        );

    }

    /* ==========================
       Category Analytics
    ========================== */

    getCategoryAnalytics() {

        const analytics = {};

        this.expenses.forEach(
            expense => {

                if (
                    !analytics[
                        expense.category
                    ]
                ) {

                    analytics[
                        expense.category
                    ] = 0;

                }

                analytics[
                    expense.category
                ] += expense.amount;

            }
        );

        return analytics;

    }

    /* ==========================
       Update Statistics
    ========================== */

    updateStats() {

        const totalExpenses =
            document.getElementById(
                "totalExpenses"
            );

        const monthlyExpenses =
            document.getElementById(
                "monthlyExpenses"
            );

        if (totalExpenses) {

            totalExpenses.textContent =
                "₹" +
                this.getTotalExpense()
                    .toLocaleString();

        }

        if (monthlyExpenses) {

            monthlyExpenses.textContent =
                "₹" +
                this.getMonthlyExpense()
                    .toLocaleString();

        }

    }

    /* ==========================
       Export CSV
    ========================== */

    exportCSV() {

        let csv =
            "Date,Title,Category,Amount\n";

        this.expenses.forEach(
            expense => {

                csv +=
                    `${expense.date},` +
                    `${expense.title},` +
                    `${expense.category},` +
                    `${expense.amount}\n`;

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
            "expenses-report.csv";

        link.click();

    }

}

/* ==========================
   Initialize Expense Manager
========================== */

const expenseManager =
    new ExpenseManager();

/* ==========================
   Global Access
========================== */

window.expenseManager =
    expenseManager;

window.exportExpenses =
    () =>
        expenseManager.exportCSV();

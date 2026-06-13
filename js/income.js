/* ===================================
   BudgetWise Ultra X Pro Max
   Income Management System
=================================== */

class IncomeManager {

    constructor() {

        this.incomes =
            JSON.parse(
                localStorage.getItem("bw_income")
            ) || [];

        this.form =
            document.getElementById("incomeForm");

        this.table =
            document.getElementById("incomeTable");

        this.init();

    }

    /* ==========================
       Initialize
    ========================== */

    init() {

        this.bindEvents();
        this.renderIncome();
        this.updateStats();

        console.log(
            "💰 Income Manager Loaded"
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

                    this.addIncome();

                }
            );

        }

    }

    /* ==========================
       Add Income
    ========================== */

    addIncome() {

        const source =
            document.getElementById(
                "incomeSource"
            )?.value;

        const amount =
            document.getElementById(
                "incomeAmount"
            )?.value;

        const date =
            document.getElementById(
                "incomeDate"
            )?.value;

        const note =
            document.getElementById(
                "incomeNote"
            )?.value || "";

        if (
            !source ||
            !amount ||
            !date
        ) {

            alert(
                "Please fill all required fields."
            );

            return;

        }

        const income = {

            id: Date.now(),

            source,

            amount:
                Number(amount),

            date,

            note,

            status:
                "Received",

            createdAt:
                new Date().toISOString()

        };

        this.incomes.push(income);

        this.saveIncome();

        this.renderIncome();

        this.updateStats();

        this.form.reset();

        if (window.app) {

            app.showNotification(
                "Income Added Successfully",
                "success"
            );

        }

    }

    /* ==========================
       Save Data
    ========================== */

    saveIncome() {

        localStorage.setItem(
            "bw_income",
            JSON.stringify(
                this.incomes
            )
        );

    }

    /* ==========================
       Delete Income
    ========================== */

    deleteIncome(id) {

        this.incomes =
            this.incomes.filter(
                income =>
                    income.id !== id
            );

        this.saveIncome();

        this.renderIncome();

        this.updateStats();

        if (window.app) {

            app.showNotification(
                "Income Deleted",
                "warning"
            );

        }

    }

    /* ==========================
       Render Income Table
    ========================== */

    renderIncome() {

        if (!this.table) return;

        this.table.innerHTML = "";

        const latestIncome =
            [...this.incomes]
            .reverse()
            .slice(0, 25);

        latestIncome.forEach(
            income => {

                const row =
                    document.createElement(
                        "tr"
                    );

                row.innerHTML = `
                    <td>${income.date}</td>
                    <td>${income.source}</td>
                    <td>₹${income.amount.toLocaleString()}</td>
                    <td>${income.note}</td>
                    <td>
                        <span class="badge badge-success">
                            ${income.status}
                        </span>
                    </td>
                    <td>
                        <button
                            class="btn-danger"
                            onclick="incomeManager.deleteIncome(${income.id})">
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
       Total Income
    ========================== */

    getTotalIncome() {

        return this.incomes.reduce(
            (
                total,
                income
            ) =>
                total +
                income.amount,
            0
        );

    }

    /* ==========================
       Monthly Income
    ========================== */

    getMonthlyIncome() {

        const month =
            new Date().getMonth();

        const year =
            new Date().getFullYear();

        return this.incomes
            .filter(income => {

                const incomeDate =
                    new Date(
                        income.date
                    );

                return (
                    incomeDate.getMonth() === month &&
                    incomeDate.getFullYear() === year
                );

            })
            .reduce(
                (
                    total,
                    income
                ) =>
                    total +
                    income.amount,
                0
            );

    }

    /* ==========================
       Income Sources Analytics
    ========================== */

    getIncomeSources() {

        const analytics = {};

        this.incomes.forEach(
            income => {

                if (
                    !analytics[
                        income.source
                    ]
                ) {

                    analytics[
                        income.source
                    ] = 0;

                }

                analytics[
                    income.source
                ] += income.amount;

            }
        );

        return analytics;

    }

    /* ==========================
       Search Income
    ========================== */

    searchIncome(keyword) {

        return this.incomes.filter(
            income =>
                income.source
                    .toLowerCase()
                    .includes(
                        keyword.toLowerCase()
                    ) ||

                income.note
                    .toLowerCase()
                    .includes(
                        keyword.toLowerCase()
                    )
        );

    }

    /* ==========================
       Update Dashboard Stats
    ========================== */

    updateStats() {

        const totalIncome =
            document.getElementById(
                "totalIncome"
            );

        const monthlyIncome =
            document.getElementById(
                "monthlyIncome"
            );

        const incomeCount =
            document.getElementById(
                "incomeCount"
            );

        if (totalIncome) {

            totalIncome.textContent =
                "₹" +
                this.getTotalIncome()
                    .toLocaleString();

        }

        if (monthlyIncome) {

            monthlyIncome.textContent =
                "₹" +
                this.getMonthlyIncome()
                    .toLocaleString();

        }

        if (incomeCount) {

            incomeCount.textContent =
                this.incomes.length;

        }

    }

    /* ==========================
       Export Income Report
    ========================== */

    exportCSV() {

        let csv =
            "Date,Source,Amount,Note\n";

        this.incomes.forEach(
            income => {

                csv +=
                    `${income.date},` +
                    `${income.source},` +
                    `${income.amount},` +
                    `${income.note}\n`;

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
            "income-report.csv";

        link.click();

    }

}

/* ==========================
   Initialize Income Manager
========================== */

const incomeManager =
    new IncomeManager();

/* ==========================
   Global Access
========================== */

window.incomeManager =
    incomeManager;

window.exportIncome =
    () =>
        incomeManager.exportCSV();

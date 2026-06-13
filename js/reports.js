/* ===================================
   BudgetWise Ultra X Pro Max
   Reports & Export Center
=================================== */

class ReportsManager {

    constructor() {

        this.expenses =
            JSON.parse(
                localStorage.getItem("bw_expenses")
            ) || [];

        this.income =
            JSON.parse(
                localStorage.getItem("bw_income")
            ) || [];

        this.savings =
            JSON.parse(
                localStorage.getItem("bw_savings")
            ) || [];

        this.investments =
            JSON.parse(
                localStorage.getItem("bw_investments")
            ) || [];

        this.init();

    }

    /* ==========================
       Initialize
    ========================== */

    init() {

        this.updateReportStats();

        console.log(
            "📄 Reports Manager Loaded"
        );

    }

    /* ==========================
       Totals
    ========================== */

    getTotalIncome() {

        return this.income.reduce(
            (total, item) =>
                total + Number(item.amount),
            0
        );

    }

    getTotalExpenses() {

        return this.expenses.reduce(
            (total, item) =>
                total + Number(item.amount),
            0
        );

    }

    getTotalSavings() {

        return this.savings.reduce(
            (total, goal) =>
                total +
                Number(goal.savedAmount || 0),
            0
        );

    }

    getTotalInvestments() {

        return this.investments.reduce(
            (total, item) =>
                total +
                Number(item.currentValue || 0),
            0
        );

    }

    getNetWorth() {

        return (
            this.getTotalIncome() -
            this.getTotalExpenses() +
            this.getTotalSavings() +
            this.getTotalInvestments()
        );

    }

    /* ==========================
       Dashboard Report Stats
    ========================== */

    updateReportStats() {

        const income =
            document.getElementById(
                "reportIncome"
            );

        const expenses =
            document.getElementById(
                "reportExpenses"
            );

        const savings =
            document.getElementById(
                "reportSavings"
            );

        const netWorth =
            document.getElementById(
                "reportNetWorth"
            );

        if (income) {

            income.textContent =
                "₹" +
                this.getTotalIncome()
                    .toLocaleString();

        }

        if (expenses) {

            expenses.textContent =
                "₹" +
                this.getTotalExpenses()
                    .toLocaleString();

        }

        if (savings) {

            savings.textContent =
                "₹" +
                this.getTotalSavings()
                    .toLocaleString();

        }

        if (netWorth) {

            netWorth.textContent =
                "₹" +
                this.getNetWorth()
                    .toLocaleString();

        }

    }

    /* ==========================
       Generate Summary Report
    ========================== */

    generateSummary() {

        return {

            generatedAt:
                new Date()
                .toLocaleString(),

            totalIncome:
                this.getTotalIncome(),

            totalExpenses:
                this.getTotalExpenses(),

            totalSavings:
                this.getTotalSavings(),

            totalInvestments:
                this.getTotalInvestments(),

            netWorth:
                this.getNetWorth()

        };

    }

    /* ==========================
       Export JSON Report
    ========================== */

    exportJSON() {

        const report = {

            summary:
                this.generateSummary(),

            income:
                this.income,

            expenses:
                this.expenses,

            savings:
                this.savings,

            investments:
                this.investments

        };

        const blob =
            new Blob(
                [
                    JSON.stringify(
                        report,
                        null,
                        2
                    )
                ],
                {
                    type:
                        "application/json"
                }
            );

        const link =
            document.createElement("a");

        link.href =
            URL.createObjectURL(blob);

        link.download =
            "BudgetWise-Report.json";

        link.click();

        if (window.app) {

            app.showNotification(
                "JSON Report Exported",
                "success"
            );

        }

    }

    /* ==========================
       Export CSV Report
    ========================== */

    exportCSV() {

        let csv =
            "Type,Amount\n";

        csv +=
            `Income,${this.getTotalIncome()}\n`;

        csv +=
            `Expenses,${this.getTotalExpenses()}\n`;

        csv +=
            `Savings,${this.getTotalSavings()}\n`;

        csv +=
            `Investments,${this.getTotalInvestments()}\n`;

        csv +=
            `NetWorth,${this.getNetWorth()}\n`;

        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv"
                }
            );

        const link =
            document.createElement("a");

        link.href =
            URL.createObjectURL(blob);

        link.download =
            "Financial-Summary.csv";

        link.click();

        if (window.app) {

            app.showNotification(
                "CSV Report Exported",
                "success"
            );

        }

    }

    /* ==========================
       Print Report
    ========================== */

    printReport() {

        const summary =
            this.generateSummary();

        const reportWindow =
            window.open(
                "",
                "_blank"
            );

        reportWindow.document.write(`
            <html>
            <head>
                <title>BudgetWise Report</title>
                <style>
                    body{
                        font-family:Arial;
                        padding:30px;
                    }
                    h1{
                        text-align:center;
                    }
                    table{
                        width:100%;
                        border-collapse:collapse;
                    }
                    td,th{
                        border:1px solid #ccc;
                        padding:10px;
                    }
                </style>
            </head>

            <body>

            <h1>
            BudgetWise Ultra X Pro Max
            </h1>

            <table>

            <tr>
                <th>Metric</th>
                <th>Value</th>
            </tr>

            <tr>
                <td>Total Income</td>
                <td>₹${summary.totalIncome}</td>
            </tr>

            <tr>
                <td>Total Expenses</td>
                <td>₹${summary.totalExpenses}</td>
            </tr>

            <tr>
                <td>Total Savings</td>
                <td>₹${summary.totalSavings}</td>
            </tr>

            <tr>
                <td>Total Investments</td>
                <td>₹${summary.totalInvestments}</td>
            </tr>

            <tr>
                <td>Net Worth</td>
                <td>₹${summary.netWorth}</td>
            </tr>

            </table>

            </body>
            </html>
        `);

        reportWindow.print();

    }

    /* ==========================
       Monthly Report
    ========================== */

    getMonthlyReport() {

        const month =
            new Date()
            .toLocaleString(
                "default",
                { month: "long" }
            );

        return {

            month,

            income:
                this.getTotalIncome(),

            expenses:
                this.getTotalExpenses(),

            savings:
                this.getTotalSavings(),

            investments:
                this.getTotalInvestments(),

            netWorth:
                this.getNetWorth()

        };

    }

}

/* ==========================
   Initialize Reports
========================== */

const reportsManager =
    new ReportsManager();

/* ==========================
   Global Functions
========================== */

window.reportsManager =
    reportsManager;

window.exportJSONReport =
    () =>
        reportsManager.exportJSON();

window.exportCSVReport =
    () =>
        reportsManager.exportCSV();

window.printFinancialReport =
    () =>
        reportsManager.printReport();

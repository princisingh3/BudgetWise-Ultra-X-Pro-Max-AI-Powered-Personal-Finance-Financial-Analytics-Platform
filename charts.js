/* ===================================
   BudgetWise Ultra X Pro Max
   Advanced Charts Dashboard
   Requires: Chart.js CDN
=================================== */

class ChartsManager {

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
       Initialize Charts
    ========================== */

    init() {

        this.createIncomeExpenseChart();
        this.createExpenseCategoryChart();
        this.createSavingsChart();
        this.createInvestmentChart();

        console.log(
            "📊 Charts System Loaded"
        );

    }

    /* ==========================
       Monthly Income
    ========================== */

    getMonthlyIncomeData() {

        const months = [
            "Jan","Feb","Mar","Apr",
            "May","Jun","Jul","Aug",
            "Sep","Oct","Nov","Dec"
        ];

        const data =
            new Array(12).fill(0);

        this.income.forEach(item => {

            const date =
                new Date(item.date);

            data[
                date.getMonth()
            ] += Number(item.amount);

        });

        return {
            labels: months,
            values: data
        };

    }

    /* ==========================
       Monthly Expenses
    ========================== */

    getMonthlyExpenseData() {

        const data =
            new Array(12).fill(0);

        this.expenses.forEach(item => {

            const date =
                new Date(item.date);

            data[
                date.getMonth()
            ] += Number(item.amount);

        });

        return data;

    }

    /* ==========================
       Income vs Expense Chart
    ========================== */

    createIncomeExpenseChart() {

        const canvas =
            document.getElementById(
                "incomeExpenseChart"
            );

        if (!canvas) return;

        const incomeData =
            this.getMonthlyIncomeData();

        const expenseData =
            this.getMonthlyExpenseData();

        new Chart(canvas, {

            type: "bar",

            data: {

                labels:
                    incomeData.labels,

                datasets: [

                    {
                        label: "Income",
                        data:
                            incomeData.values,
                        backgroundColor:
                            "#10b981"
                    },

                    {
                        label: "Expenses",
                        data:
                            expenseData,
                        backgroundColor:
                            "#ef4444"
                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        position: "top"

                    }

                }

            }

        });

    }

    /* ==========================
       Expense Categories
    ========================== */

    getExpenseCategories() {

        const categories = {};

        this.expenses.forEach(
            expense => {

                if (
                    !categories[
                        expense.category
                    ]
                ) {

                    categories[
                        expense.category
                    ] = 0;

                }

                categories[
                    expense.category
                ] += Number(
                    expense.amount
                );

            }
        );

        return categories;

    }

    /* ==========================
       Pie Chart
    ========================== */

    createExpenseCategoryChart() {

        const canvas =
            document.getElementById(
                "expenseCategoryChart"
            );

        if (!canvas) return;

        const categories =
            this.getExpenseCategories();

        new Chart(canvas, {

            type: "pie",

            data: {

                labels:
                    Object.keys(
                        categories
                    ),

                datasets: [

                    {
                        data:
                            Object.values(
                                categories
                            ),

                        backgroundColor: [
                            "#3b82f6",
                            "#10b981",
                            "#f59e0b",
                            "#ef4444",
                            "#8b5cf6",
                            "#06b6d4"
                        ]

                    }

                ]

            },

            options: {

                responsive: true

            }

        });

    }

    /* ==========================
       Savings Progress Chart
    ========================== */

    createSavingsChart() {

        const canvas =
            document.getElementById(
                "savingsChart"
            );

        if (!canvas) return;

        const labels =
            this.savings.map(
                item =>
                    item.goalName
            );

        const saved =
            this.savings.map(
                item =>
                    item.savedAmount
            );

        const target =
            this.savings.map(
                item =>
                    item.targetAmount
            );

        new Chart(canvas, {

            type: "bar",

            data: {

                labels,

                datasets: [

                    {
                        label:
                            "Saved",

                        data:
                            saved,

                        backgroundColor:
                            "#10b981"
                    },

                    {
                        label:
                            "Target",

                        data:
                            target,

                        backgroundColor:
                            "#3b82f6"
                    }

                ]

            },

            options: {

                responsive: true

            }

        });

    }

    /* ==========================
       Investment Allocation
    ========================== */

    getInvestmentAllocation() {

        const allocation = {};

        this.investments.forEach(
            item => {

                if (
                    !allocation[
                        item.assetType
                    ]
                ) {

                    allocation[
                        item.assetType
                    ] = 0;

                }

                allocation[
                    item.assetType
                    ] +=
                    Number(
                        item.currentValue
                    );

            }
        );

        return allocation;

    }

    /* ==========================
       Doughnut Chart
    ========================== */

    createInvestmentChart() {

        const canvas =
            document.getElementById(
                "investmentChart"
            );

        if (!canvas) return;

        const data =
            this.getInvestmentAllocation();

        new Chart(canvas, {

            type: "doughnut",

            data: {

                labels:
                    Object.keys(data),

                datasets: [

                    {
                        data:
                            Object.values(
                                data
                            ),

                        backgroundColor: [
                            "#6366f1",
                            "#06b6d4",
                            "#10b981",
                            "#f59e0b",
                            "#ef4444",
                            "#8b5cf6"
                        ]

                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        position:
                            "bottom"

                    }

                }

            }

        });

    }

    /* ==========================
       Refresh Charts
    ========================== */

    refreshCharts() {

        location.reload();

    }

}

/* ==========================
   Initialize Charts
========================== */

const chartsManager =
    new ChartsManager();

/* ==========================
   Global Access
========================== */

window.chartsManager =
    chartsManager;

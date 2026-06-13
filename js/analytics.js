/* ===================================
   BudgetWise Ultra X Pro Max
   Financial Analytics Engine
=================================== */

class AnalyticsManager {

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

        this.updateAnalytics();
        this.generateInsights();

        console.log(
            "📊 Analytics Engine Loaded"
        );

    }

    /* ==========================
       Income Analytics
    ========================== */

    getTotalIncome() {

        return this.income.reduce(
            (total, item) =>
                total + Number(item.amount),
            0
        );

    }

    /* ==========================
       Expense Analytics
    ========================== */

    getTotalExpenses() {

        return this.expenses.reduce(
            (total, item) =>
                total + Number(item.amount),
            0
        );

    }

    /* ==========================
       Savings Analytics
    ========================== */

    getTotalSavings() {

        return this.savings.reduce(
            (total, goal) =>
                total +
                Number(goal.savedAmount || 0),
            0
        );

    }

    /* ==========================
       Investment Analytics
    ========================== */

    getInvestmentValue() {

        return this.investments.reduce(
            (total, item) =>
                total +
                Number(item.currentValue || 0),
            0
        );

    }

    /* ==========================
       Net Worth
    ========================== */

    getNetWorth() {

        return (
            this.getTotalSavings() +
            this.getInvestmentValue() +
            this.getTotalIncome() -
            this.getTotalExpenses()
        );

    }

    /* ==========================
       Financial Health Score
    ========================== */

    calculateHealthScore() {

        const income =
            this.getTotalIncome();

        const expenses =
            this.getTotalExpenses();

        if (income === 0)
            return 0;

        const ratio =
            ((income - expenses) /
                income) *
            100;

        return Math.max(
            0,
            Math.min(
                Math.round(ratio),
                100
            )
        );

    }

    /* ==========================
       Monthly Trends
    ========================== */

    getMonthlyIncome() {

        const month =
            new Date().getMonth();

        const year =
            new Date().getFullYear();

        return this.income
            .filter(item => {

                const d =
                    new Date(item.date);

                return (
                    d.getMonth() === month &&
                    d.getFullYear() === year
                );

            })
            .reduce(
                (total, item) =>
                    total +
                    Number(item.amount),
                0
            );

    }

    getMonthlyExpenses() {

        const month =
            new Date().getMonth();

        const year =
            new Date().getFullYear();

        return this.expenses
            .filter(item => {

                const d =
                    new Date(item.date);

                return (
                    d.getMonth() === month &&
                    d.getFullYear() === year
                );

            })
            .reduce(
                (total, item) =>
                    total +
                    Number(item.amount),
                0
            );

    }

    /* ==========================
       Expense Category Insights
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
       Highest Spending Category
    ========================== */

    getHighestExpenseCategory() {

        const categories =
            this.getExpenseCategories();

        let highest = "";
        let max = 0;

        for (const category in categories) {

            if (
                categories[
                    category
                ] > max
            ) {

                max =
                    categories[
                        category
                    ];

                highest =
                    category;

            }

        }

        return highest || "N/A";

    }

    /* ==========================
       Smart Recommendations
    ========================== */

    generateInsights() {

        const container =
            document.getElementById(
                "financialInsights"
            );

        if (!container) return;

        let insights = [];

        if (
            this.getTotalExpenses() >
            this.getTotalIncome()
        ) {

            insights.push(
                "⚠ Expenses are higher than income."
            );

        }

        if (
            this.calculateHealthScore() >
            70
        ) {

            insights.push(
                "✅ Excellent financial health."
            );

        }

        if (
            this.getTotalSavings() <
            this.getTotalIncome() *
                0.2
        ) {

            insights.push(
                "💡 Increase savings to at least 20% of income."
            );

        }

        if (
            this.investments.length ===
            0
        ) {

            insights.push(
                "📈 Consider investing for long-term growth."
            );

        }

        container.innerHTML =
            insights
                .map(
                    item =>
                        `<li>${item}</li>`
                )
                .join("");

    }

    /* ==========================
       Update Dashboard
    ========================== */

    updateAnalytics() {

        const netWorth =
            document.getElementById(
                "netWorth"
            );

        const healthScore =
            document.getElementById(
                "healthScore"
            );

        const monthlyIncome =
            document.getElementById(
                "monthlyIncome"
            );

        const monthlyExpenses =
            document.getElementById(
                "monthlyExpenses"
            );

        const topCategory =
            document.getElementById(
                "topExpenseCategory"
            );

        if (netWorth) {

            netWorth.textContent =
                "₹" +
                this.getNetWorth()
                    .toLocaleString();

        }

        if (healthScore) {

            healthScore.textContent =
                this.calculateHealthScore() +
                "%";

        }

        if (monthlyIncome) {

            monthlyIncome.textContent =
                "₹" +
                this.getMonthlyIncome()
                    .toLocaleString();

        }

        if (monthlyExpenses) {

            monthlyExpenses.textContent =
                "₹" +
                this.getMonthlyExpenses()
                    .toLocaleString();

        }

        if (topCategory) {

            topCategory.textContent =
                this.getHighestExpenseCategory();

        }

    }

}

/* ==========================
   Initialize Analytics
========================== */

const analyticsManager =
    new AnalyticsManager();

/* ==========================
   Global Access
========================== */

window.analyticsManager =
    analyticsManager;

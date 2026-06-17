/* ===================================
   BudgetWise Ultra X Pro Max
   Core Application Logic
=================================== */

class BudgetWise {

    constructor() {

        this.init();

    }

    init() {

        this.loadData();
        this.updateDashboard();
        this.initializeNotifications();
        this.initializeStorage();
        this.setCurrentDate();

        console.log(
            "🚀 BudgetWise Ultra X Pro Max Loaded"
        );

    }

    /* ==========================
       Local Storage
    ========================== */

    initializeStorage() {

        if (!localStorage.getItem("bw_expenses")) {
            localStorage.setItem(
                "bw_expenses",
                JSON.stringify([])
            );
        }

        if (!localStorage.getItem("bw_income")) {
            localStorage.setItem(
                "bw_income",
                JSON.stringify([])
            );
        }

        if (!localStorage.getItem("bw_budgets")) {
            localStorage.setItem(
                "bw_budgets",
                JSON.stringify([])
            );
        }

        if (!localStorage.getItem("bw_savings")) {
            localStorage.setItem(
                "bw_savings",
                JSON.stringify([])
            );
        }

        if (!localStorage.getItem("bw_investments")) {
            localStorage.setItem(
                "bw_investments",
                JSON.stringify([])
            );
        }

    }

    /* ==========================
       Load Data
    ========================== */

    loadData() {

        this.expenses =
            JSON.parse(
                localStorage.getItem("bw_expenses")
            ) || [];

        this.income =
            JSON.parse(
                localStorage.getItem("bw_income")
            ) || [];

        this.budgets =
            JSON.parse(
                localStorage.getItem("bw_budgets")
            ) || [];

        this.savings =
            JSON.parse(
                localStorage.getItem("bw_savings")
            ) || [];

        this.investments =
            JSON.parse(
                localStorage.getItem("bw_investments")
            ) || [];

    }

    /* ==========================
       Save Data
    ========================== */

    saveData(key, data) {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

    }

    /* ==========================
       Expense Functions
    ========================== */

   addExpense(expense) {

    if (!expense || isNaN(expense.amount) || Number(expense.amount) < 0) {
        this.showNotification("Invalid expense amount", "error");
        return;
    }

    this.expenses.push(expense);

    this.saveData("bw_expenses", this.expenses);

    this.updateDashboard();

    this.showNotification("Expense Added Successfully", "success");
   }

    /* ==========================
       Income Functions
    ========================== */

    addIncome(income) {

    if (!income || isNaN(income.amount) || Number(income.amount) < 0) {
        this.showNotification("Invalid income amount", "error");
        return;
    }

    this.income.push(income);

    this.saveData("bw_income", this.income);

    this.updateDashboard();

    this.showNotification("Income Added Successfully", "success");
    }
    /* ==========================
       Budget Functions
    ========================== */

    addBudget(budget) {

        this.budgets.push(budget);

        this.saveData(
            "bw_budgets",
            this.budgets
        );

        this.showNotification(
            "Budget Created Successfully",
            "success"
        );

    }

    /* ==========================
       Savings Functions
    ========================== */

    addSavingsGoal(goal) {

        this.savings.push(goal);

        this.saveData(
            "bw_savings",
            this.savings
        );

        this.showNotification(
            "Savings Goal Added",
            "success"
        );

    }

    /* ==========================
       Investment Functions
    ========================== */

    addInvestment(investment) {

        this.investments.push(
            investment
        );

        this.saveData(
            "bw_investments",
            this.investments
        );

        this.showNotification(
            "Investment Added",
            "success"
        );

    }

    /* ==========================
       Analytics
    ========================== */

    getTotalExpenses() {

        return this.expenses.reduce(
            (total, item) =>
                total + Number(item.amount),
            0
        );

    }

    getTotalIncome() {

        return this.income.reduce(
            (total, item) =>
                total + Number(item.amount),
            0
        );

    }

    getNetWorth() {

        return (
            this.getTotalIncome() -
            this.getTotalExpenses()
        );

    }

    /* ==========================
       Dashboard Update
    ========================== */

    updateDashboard() {

        const totalIncome =
            document.getElementById(
                "totalIncome"
            );

        const totalExpense =
            document.getElementById(
                "totalExpense"
            );

        const netWorth =
            document.getElementById(
                "netWorth"
            );

        if (totalIncome) {

            totalIncome.textContent =
                "₹" +
                this.getTotalIncome()
                    .toLocaleString();

        }

        if (totalExpense) {

            totalExpense.textContent =
                "₹" +
                this.getTotalExpenses()
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
       Notifications
    ========================== */

    initializeNotifications() {

    if (document.getElementById("notificationContainer")) {
        return;
    }

    const container = document.createElement("div");

    container.id = "notificationContainer";
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";

    document.body.appendChild(container);
    }

   showNotification(message, type = "success") {

    const container = document.getElementById("notificationContainer");

    if (!container) return;

    const notification = document.createElement("div");

    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
   }

    /* ==========================
       Current Date
    ========================== */

    setCurrentDate() {

        const dateElement =
            document.getElementById(
                "currentDate"
            );

        if (dateElement) {

            const today =
                new Date();

            dateElement.textContent =
                today.toDateString();

        }

    }

    /* ==========================
       Export Data
    ========================== */

    exportData() {

        const data = {

            expenses:
                this.expenses,

            income:
                this.income,

            budgets:
                this.budgets,

            savings:
                this.savings,

            investments:
                this.investments

        };

        const blob =
            new Blob(
                [
                    JSON.stringify(
                        data,
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
            "BudgetWise-Backup.json";

        link.click();

    }

    /* ==========================
       Import Data
    ========================== */

     importData(file) {

    const reader = new FileReader();

    reader.onload = (e) => {

        try {

            const data = JSON.parse(e.target.result);

            localStorage.setItem("bw_expenses", JSON.stringify(data.expenses || []));
            localStorage.setItem("bw_income", JSON.stringify(data.income || []));
            localStorage.setItem("bw_budgets", JSON.stringify(data.budgets || []));
            localStorage.setItem("bw_savings", JSON.stringify(data.savings || []));
            localStorage.setItem("bw_investments", JSON.stringify(data.investments || []));

            this.showNotification("Data Imported Successfully", "success");

            setTimeout(() => {
                location.reload();
            }, 1000);

        } catch (error) {

            this.showNotification("Invalid backup file", "error");

        }

    };

    reader.readAsText(file);
     }
   
   /*===========================
   Initialize App
========================== */

const app = new BudgetWise();

/* ==========================
   Global Functions
========================== */

window.exportBudgetData =
    () => app.exportData();

window.app = app;

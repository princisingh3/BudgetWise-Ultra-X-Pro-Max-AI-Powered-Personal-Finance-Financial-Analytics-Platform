/* ===================================
   BudgetWise Ultra X Pro Max
   Smart Notification System
=================================== */

class NotificationManager {

    constructor() {

        this.container = null;

        this.init();

    }

    /* ==========================
       Initialize
    ========================== */

    init() {

        this.createContainer();

        this.requestPermission();

        this.startReminderEngine();

        console.log(
            "🔔 Notification Manager Loaded"
        );

    }

    /* ==========================
       Create Toast Container
    ========================== */

    createContainer() {

        let container =
            document.getElementById(
                "toastContainer"
            );

        if (!container) {

            container =
                document.createElement(
                    "div"
                );

            container.id =
                "toastContainer";

            container.style.position =
                "fixed";

            container.style.top =
                "20px";

            container.style.right =
                "20px";

            container.style.zIndex =
                "99999";

            document.body.appendChild(
                container
            );

        }

        this.container =
            container;

    }

    /* ==========================
       Browser Permission
    ========================== */

    requestPermission() {

        if (
            "Notification" in window &&
            Notification.permission !==
                "granted"
        ) {

            Notification.requestPermission();

        }

    }

    /* ==========================
       Toast Notification
    ========================== */

    showToast(
        message,
        type = "success"
    ) {

        const toast =
            document.createElement(
                "div"
            );

        toast.className =
            `toast toast-${type}`;

        toast.style.marginBottom =
            "10px";

        toast.style.padding =
            "14px 18px";

        toast.style.borderRadius =
            "12px";

        toast.style.color =
            "#fff";

        toast.style.fontWeight =
            "600";

        toast.style.boxShadow =
            "0 10px 25px rgba(0,0,0,.25)";

        toast.style.animation =
            "fadeIn .4s ease";

        switch(type){

            case "success":
                toast.style.background =
                    "#10b981";
                break;

            case "error":
                toast.style.background =
                    "#ef4444";
                break;

            case "warning":
                toast.style.background =
                    "#f59e0b";
                break;

            default:
                toast.style.background =
                    "#3b82f6";

        }

        toast.innerHTML =
            message;

        this.container.appendChild(
            toast
        );

        setTimeout(() => {

            toast.remove();

        }, 4000);

    }

    /* ==========================
       Desktop Notification
    ========================== */

    showDesktopNotification(
        title,
        body
    ) {

        if (
            "Notification" in window &&
            Notification.permission ===
                "granted"
        ) {

            new Notification(
                title,
                {
                    body,
                    icon:
                        "assets/icon-192.png"
                }
            );

        }

    }

    /* ==========================
       Budget Alert
    ========================== */

    checkBudgetAlerts() {

        const budgets =
            JSON.parse(
                localStorage.getItem(
                    "bw_budgets"
                )
            ) || [];

        const expenses =
            JSON.parse(
                localStorage.getItem(
                    "bw_expenses"
                )
            ) || [];

        budgets.forEach(
            budget => {

                const spent =
                    expenses
                    .filter(
                        item =>
                            item.category ===
                            budget.category
                    )
                    .reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            Number(
                                item.amount
                            ),
                        0
                    );

                const usage =
                    (
                        spent /
                        budget.amount
                    ) * 100;

                if (
                    usage >= 90 &&
                    usage < 100
                ) {

                    this.showToast(
                        `⚠ ${budget.category} budget almost reached`,
                        "warning"
                    );

                }

                if (
                    usage >= 100
                ) {

                    this.showToast(
                        `🚨 Budget exceeded in ${budget.category}`,
                        "error"
                    );

                }

            }
        );

    }

    /* ==========================
       Savings Reminder
    ========================== */

    checkSavingsGoals() {

        const goals =
            JSON.parse(
                localStorage.getItem(
                    "bw_savings"
                )
            ) || [];

        goals.forEach(
            goal => {

                const progress =
                    (
                        goal.savedAmount /
                        goal.targetAmount
                    ) * 100;

                if (
                    progress >= 80 &&
                    progress < 100
                ) {

                    this.showToast(
                        `🎯 ${goal.goalName} is ${progress.toFixed(0)}% complete`,
                        "success"
                    );

                }

            }
        );

    }

    /* ==========================
       Monthly Summary
    ========================== */

    showMonthlySummary() {

        const income =
            JSON.parse(
                localStorage.getItem(
                    "bw_income"
                )
            ) || [];

        const expenses =
            JSON.parse(
                localStorage.getItem(
                    "bw_expenses"
                )
            ) || [];

        const totalIncome =
            income.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    Number(
                        item.amount
                    ),
                0
            );

        const totalExpenses =
            expenses.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    Number(
                        item.amount
                    ),
                0
            );

        const balance =
            totalIncome -
            totalExpenses;

        this.showDesktopNotification(
            "📊 Monthly Summary",
            `Balance: ₹${balance.toLocaleString()}`
        );

    }

    /* ==========================
       Recurring Reminder Engine
    ========================== */

    startReminderEngine() {

        setTimeout(() => {

            this.checkBudgetAlerts();

            this.checkSavingsGoals();

        }, 3000);

    }

    /* ==========================
       Bill Reminder
    ========================== */

    remindBill(
        billName,
        amount
    ) {

        this.showToast(
            `💳 Bill Due: ${billName} - ₹${amount}`,
            "warning"
        );

    }

    /* ==========================
       Goal Completion
    ========================== */

    goalCompleted(
        goalName
    ) {

        this.showToast(
            `🎉 Goal Completed: ${goalName}`,
            "success"
        );

        this.showDesktopNotification(
            "Goal Completed",
            goalName
        );

    }

    /* ==========================
       Investment Alert
    ========================== */

    investmentUpdate(
        asset,
        roi
    ) {

        this.showToast(
            `📈 ${asset} ROI: ${roi}%`,
            "success"
        );

    }

}

/* ==========================
   Initialize Notifications
========================== */

const notificationManager =
    new NotificationManager();

/* ==========================
   Global Access
========================== */

window.notificationManager =
    notificationManager;

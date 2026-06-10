/* ===================================
   BudgetWise Ultra X Pro Max
   Savings Goals Management System
=================================== */

class SavingsManager {

    constructor() {

        this.savingsGoals =
            JSON.parse(
                localStorage.getItem("bw_savings")
            ) || [];

        this.form =
            document.getElementById("savingsForm");

        this.table =
            document.getElementById("savingsTable");

        this.init();

    }

    /* ==========================
       Initialize
    ========================== */

    init() {

        this.bindEvents();
        this.renderGoals();
        this.updateStats();

        console.log(
            "🏦 Savings Manager Loaded"
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

                    this.addGoal();

                }
            );

        }

    }

    /* ==========================
       Add Savings Goal
    ========================== */

    addGoal() {

        const goalName =
            document.getElementById(
                "goalName"
            )?.value;

        const targetAmount =
            document.getElementById(
                "targetAmount"
            )?.value;

        const savedAmount =
            document.getElementById(
                "savedAmount"
            )?.value || 0;

        const targetDate =
            document.getElementById(
                "targetDate"
            )?.value;

        if (
            !goalName ||
            !targetAmount ||
            !targetDate
        ) {

            alert(
                "Please fill all required fields."
            );

            return;

        }

        const goal = {

            id: Date.now(),

            goalName,

            targetAmount:
                Number(targetAmount),

            savedAmount:
                Number(savedAmount),

            targetDate,

            status:
                "Active",

            createdAt:
                new Date().toISOString()

        };

        this.savingsGoals.push(goal);

        this.saveGoals();

        this.renderGoals();

        this.updateStats();

        this.form.reset();

        if (window.app) {

            app.showNotification(
                "Savings Goal Added",
                "success"
            );

        }

    }

    /* ==========================
       Save Goals
    ========================== */

    saveGoals() {

        localStorage.setItem(
            "bw_savings",
            JSON.stringify(
                this.savingsGoals
            )
        );

    }

    /* ==========================
       Add Money To Goal
    ========================== */

    addSavings(id, amount) {

        const goal =
            this.savingsGoals.find(
                item => item.id === id
            );

        if (!goal) return;

        goal.savedAmount +=
            Number(amount);

        if (
            goal.savedAmount >=
            goal.targetAmount
        ) {

            goal.status =
                "Completed";

            if (window.app) {

                app.showNotification(
                    `🎉 Goal Completed: ${goal.goalName}`,
                    "success"
                );

            }

        }

        this.saveGoals();

        this.renderGoals();

        this.updateStats();

    }

    /* ==========================
       Delete Goal
    ========================== */

    deleteGoal(id) {

        this.savingsGoals =
            this.savingsGoals.filter(
                goal =>
                    goal.id !== id
            );

        this.saveGoals();

        this.renderGoals();

        this.updateStats();

        if (window.app) {

            app.showNotification(
                "Goal Deleted",
                "warning"
            );

        }

    }

    /* ==========================
       Calculate Progress
    ========================== */

    getProgress(goal) {

        return Math.min(
            (
                goal.savedAmount /
                goal.targetAmount
            ) * 100,
            100
        );

    }

    /* ==========================
       Remaining Amount
    ========================== */

    getRemaining(goal) {

        return Math.max(
            goal.targetAmount -
            goal.savedAmount,
            0
        );

    }

    /* ==========================
       Render Goals
    ========================== */

    renderGoals() {

        if (!this.table) return;

        this.table.innerHTML = "";

        this.savingsGoals.forEach(
            goal => {

                const progress =
                    this.getProgress(
                        goal
                    );

                const row =
                    document.createElement(
                        "tr"
                    );

                row.innerHTML = `
                    <td>${goal.goalName}</td>

                    <td>
                    ₹${goal.targetAmount.toLocaleString()}
                    </td>

                    <td>
                    ₹${goal.savedAmount.toLocaleString()}
                    </td>

                    <td>
                    ₹${this.getRemaining(goal).toLocaleString()}
                    </td>

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
                            goal.status === "Completed"
                            ? "badge badge-success"
                            : "badge badge-info"
                        }">
                        ${goal.status}
                        </span>
                    </td>

                    <td>

                        <button
                        class="btn-success"
                        onclick="savingsManager.quickAdd(${goal.id})">
                        + Save
                        </button>

                        <button
                        class="btn-danger"
                        onclick="savingsManager.deleteGoal(${goal.id})">
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
       Quick Add Savings
    ========================== */

    quickAdd(id) {

        const amount =
            prompt(
                "Enter amount to add:"
            );

        if (
            !amount ||
            isNaN(amount)
        ) return;

        this.addSavings(
            id,
            Number(amount)
        );

    }

    /* ==========================
       Analytics
    ========================== */

    getTotalTarget() {

        return this.savingsGoals.reduce(
            (
                total,
                goal
            ) =>
                total +
                goal.targetAmount,
            0
        );

    }

    getTotalSaved() {

        return this.savingsGoals.reduce(
            (
                total,
                goal
            ) =>
                total +
                goal.savedAmount,
            0
        );

    }

    getCompletedGoals() {

        return this.savingsGoals.filter(
            goal =>
                goal.status ===
                "Completed"
        ).length;

    }

    /* ==========================
       Update Stats
    ========================== */

    updateStats() {

        const totalTarget =
            document.getElementById(
                "totalTarget"
            );

        const totalSaved =
            document.getElementById(
                "totalSaved"
            );

        const completedGoals =
            document.getElementById(
                "completedGoals"
            );

        if (totalTarget) {

            totalTarget.textContent =
                "₹" +
                this.getTotalTarget()
                    .toLocaleString();

        }

        if (totalSaved) {

            totalSaved.textContent =
                "₹" +
                this.getTotalSaved()
                    .toLocaleString();

        }

        if (completedGoals) {

            completedGoals.textContent =
                this.getCompletedGoals();

        }

    }

    /* ==========================
       Export Savings Report
    ========================== */

    exportCSV() {

        let csv =
            "Goal,Target,Saved,Remaining,Status\n";

        this.savingsGoals.forEach(
            goal => {

                csv +=
                    `${goal.goalName},` +
                    `${goal.targetAmount},` +
                    `${goal.savedAmount},` +
                    `${this.getRemaining(goal)},` +
                    `${goal.status}\n`;

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
            "savings-report.csv";

        link.click();

    }

}

/* ==========================
   Initialize Savings Manager
========================== */

const savingsManager =
    new SavingsManager();

/* ==========================
   Global Access
========================== */

window.savingsManager =
    savingsManager;

window.exportSavings =
    () =>
        savingsManager.exportCSV();

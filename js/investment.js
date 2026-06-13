/* ===================================
   BudgetWise Ultra X Pro Max
   Investment Portfolio Manager
=================================== */

class InvestmentManager {

    constructor() {

        this.investments =
            JSON.parse(
                localStorage.getItem("bw_investments")
            ) || [];

        this.form =
            document.getElementById(
                "investmentForm"
            );

        this.table =
            document.getElementById(
                "investmentTable"
            );

        this.init();

    }

    /* ==========================
       Initialize
    ========================== */

    init() {

        this.bindEvents();
        this.renderInvestments();
        this.updateStats();

        console.log(
            "📈 Investment Manager Loaded"
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

                    this.addInvestment();

                }
            );

        }

    }

    /* ==========================
       Add Investment
    ========================== */

    addInvestment() {

        const assetName =
            document.getElementById(
                "assetName"
            )?.value;

        const assetType =
            document.getElementById(
                "assetType"
            )?.value;

        const investedAmount =
            document.getElementById(
                "investedAmount"
            )?.value;

        const currentValue =
            document.getElementById(
                "currentValue"
            )?.value;

        const purchaseDate =
            document.getElementById(
                "purchaseDate"
            )?.value;

        if (
            !assetName ||
            !assetType ||
            !investedAmount ||
            !currentValue
        ) {

            alert(
                "Please fill all required fields."
            );

            return;

        }

        const investment = {

            id: Date.now(),

            assetName,

            assetType,

            investedAmount:
                Number(investedAmount),

            currentValue:
                Number(currentValue),

            purchaseDate,

            createdAt:
                new Date().toISOString()

        };

        this.investments.push(
            investment
        );

        this.saveInvestments();

        this.renderInvestments();

        this.updateStats();

        this.form.reset();

        if (window.app) {

            app.showNotification(
                "Investment Added Successfully",
                "success"
            );

        }

    }

    /* ==========================
       Save Investments
    ========================== */

    saveInvestments() {

        localStorage.setItem(
            "bw_investments",
            JSON.stringify(
                this.investments
            )
        );

    }

    /* ==========================
       Delete Investment
    ========================== */

    deleteInvestment(id) {

        this.investments =
            this.investments.filter(
                item =>
                    item.id !== id
            );

        this.saveInvestments();

        this.renderInvestments();

        this.updateStats();

        if (window.app) {

            app.showNotification(
                "Investment Removed",
                "warning"
            );

        }

    }

    /* ==========================
       ROI Calculation
    ========================== */

    calculateROI(
        invested,
        current
    ) {

        return (
            (
                current - invested
            ) / invested
        ) * 100;

    }

    /* ==========================
       Profit / Loss
    ========================== */

    getProfitLoss(
        invested,
        current
    ) {

        return current - invested;

    }

    /* ==========================
       Render Investments
    ========================== */

    renderInvestments() {

        if (!this.table) return;

        this.table.innerHTML = "";

        this.investments.forEach(
            investment => {

                const roi =
                    this.calculateROI(
                        investment.investedAmount,
                        investment.currentValue
                    );

                const profitLoss =
                    this.getProfitLoss(
                        investment.investedAmount,
                        investment.currentValue
                    );

                const row =
                    document.createElement(
                        "tr"
                    );

                row.innerHTML = `
                    <td>${investment.assetName}</td>

                    <td>${investment.assetType}</td>

                    <td>
                    ₹${investment.investedAmount.toLocaleString()}
                    </td>

                    <td>
                    ₹${investment.currentValue.toLocaleString()}
                    </td>

                    <td>
                    ₹${profitLoss.toLocaleString()}
                    </td>

                    <td>
                        <span class="${
                            roi >= 0
                            ? "badge badge-success"
                            : "badge badge-danger"
                        }">
                        ${roi.toFixed(2)}%
                        </span>
                    </td>

                    <td>
                        <button
                        class="btn-danger"
                        onclick="investmentManager.deleteInvestment(${investment.id})">
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
       Analytics
    ========================== */

    getTotalInvested() {

        return this.investments.reduce(
            (total, item) =>
                total +
                item.investedAmount,
            0
        );

    }

    getPortfolioValue() {

        return this.investments.reduce(
            (total, item) =>
                total +
                item.currentValue,
            0
        );

    }

    getTotalProfitLoss() {

        return (
            this.getPortfolioValue() -
            this.getTotalInvested()
        );

    }

    getAverageROI() {

        if (
            this.investments.length === 0
        )
            return 0;

        const totalROI =
            this.investments.reduce(
                (sum, item) =>
                    sum +
                    this.calculateROI(
                        item.investedAmount,
                        item.currentValue
                    ),
                0
            );

        return (
            totalROI /
            this.investments.length
        );

    }

    /* ==========================
       Asset Allocation
    ========================== */

    getAssetAllocation() {

        const allocation = {};

        this.investments.forEach(
            investment => {

                if (
                    !allocation[
                        investment.assetType
                    ]
                ) {

                    allocation[
                        investment.assetType
                    ] = 0;

                }

                allocation[
                    investment.assetType
                ] +=
                    investment.currentValue;

            }
        );

        return allocation;

    }

    /* ==========================
       Update Dashboard Stats
    ========================== */

    updateStats() {

        const totalInvested =
            document.getElementById(
                "totalInvested"
            );

        const portfolioValue =
            document.getElementById(
                "portfolioValue"
            );

        const profitLoss =
            document.getElementById(
                "profitLoss"
            );

        const averageROI =
            document.getElementById(
                "averageROI"
            );

        if (totalInvested) {

            totalInvested.textContent =
                "₹" +
                this.getTotalInvested()
                    .toLocaleString();

        }

        if (portfolioValue) {

            portfolioValue.textContent =
                "₹" +
                this.getPortfolioValue()
                    .toLocaleString();

        }

        if (profitLoss) {

            profitLoss.textContent =
                "₹" +
                this.getTotalProfitLoss()
                    .toLocaleString();

        }

        if (averageROI) {

            averageROI.textContent =
                this.getAverageROI()
                    .toFixed(2) + "%";

        }

    }

    /* ==========================
       Export Investment Report
    ========================== */

    exportCSV() {

        let csv =
            "Asset,Type,Invested,Current Value,ROI\n";

        this.investments.forEach(
            investment => {

                csv +=
                    `${investment.assetName},` +
                    `${investment.assetType},` +
                    `${investment.investedAmount},` +
                    `${investment.currentValue},` +
                    `${this.calculateROI(
                        investment.investedAmount,
                        investment.currentValue
                    ).toFixed(2)}%\n`;

            }
        );

        const blob =
            new Blob(
                [csv],
                {
                    type: "text/csv"
                }
            );

        const link =
            document.createElement("a");

        link.href =
            URL.createObjectURL(blob);

        link.download =
            "investment-report.csv";

        link.click();

    }

}

/* ==========================
   Initialize Investment Manager
========================== */

const investmentManager =
    new InvestmentManager();

/* ==========================
   Global Access
========================== */

window.investmentManager =
    investmentManager;

window.exportInvestments =
    () =>
        investmentManager.exportCSV();

/* ===================================
   BudgetWise Ultra X Pro Max
   Settings Management System
=================================== */

class SettingsManager {

    constructor() {

        this.defaultSettings = {

            currency: "INR",

            currencySymbol: "₹",

            language: "en",

            theme: "dark",

            notifications: true,

            autoBackup: true,

            biometricLock: false,

            soundEffects: true,

            compactMode: false,

            dateFormat: "DD/MM/YYYY"

        };

        this.settings =
            JSON.parse(
                localStorage.getItem(
                    "bw_settings"
                )
            ) || this.defaultSettings;

        this.init();

    }

    /* ==========================
       Initialize
    ========================== */

    init() {

        this.loadSettings();
        this.bindEvents();

        console.log(
            "⚙️ Settings Manager Loaded"
        );

    }

    /* ==========================
       Save Settings
    ========================== */

    saveSettings() {

        localStorage.setItem(
            "bw_settings",
            JSON.stringify(
                this.settings
            )
        );

        this.showMessage(
            "Settings Saved Successfully"
        );

    }

    /* ==========================
       Load Settings
    ========================== */

    loadSettings() {

        const currency =
            document.getElementById(
                "currency"
            );

        const language =
            document.getElementById(
                "language"
            );

        const notifications =
            document.getElementById(
                "notifications"
            );

        const autoBackup =
            document.getElementById(
                "autoBackup"
            );

        const compactMode =
            document.getElementById(
                "compactMode"
            );

        const biometricLock =
            document.getElementById(
                "biometricLock"
            );

        if (currency)
            currency.value =
                this.settings.currency;

        if (language)
            language.value =
                this.settings.language;

        if (notifications)
            notifications.checked =
                this.settings.notifications;

        if (autoBackup)
            autoBackup.checked =
                this.settings.autoBackup;

        if (compactMode)
            compactMode.checked =
                this.settings.compactMode;

        if (biometricLock)
            biometricLock.checked =
                this.settings.biometricLock;

    }

    /* ==========================
       Update Setting
    ========================== */

    updateSetting(
        key,
        value
    ) {

        this.settings[key] =
            value;

        this.saveSettings();

    }

    /* ==========================
       Currency Symbol
    ========================== */

    updateCurrency(
        currency
    ) {

        const symbols = {

            INR: "₹",

            USD: "$",

            EUR: "€",

            GBP: "£",

            JPY: "¥"

        };

        this.settings.currency =
            currency;

        this.settings.currencySymbol =
            symbols[currency];

        this.saveSettings();

    }

    /* ==========================
       Export Backup
    ========================== */

    exportBackup() {

        const backup = {

            settings:
                this.settings,

            expenses:
                JSON.parse(
                    localStorage.getItem(
                        "bw_expenses"
                    )
                ) || [],

            income:
                JSON.parse(
                    localStorage.getItem(
                        "bw_income"
                    )
                ) || [],

            budgets:
                JSON.parse(
                    localStorage.getItem(
                        "bw_budgets"
                    )
                ) || [],

            savings:
                JSON.parse(
                    localStorage.getItem(
                        "bw_savings"
                    )
                ) || [],

            investments:
                JSON.parse(
                    localStorage.getItem(
                        "bw_investments"
                    )
                ) || []

        };

        const blob =
            new Blob(
                [
                    JSON.stringify(
                        backup,
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
            document.createElement(
                "a"
            );

        link.href =
            URL.createObjectURL(
                blob
            );

        link.download =
            "BudgetWise-Backup.json";

        link.click();

        this.showMessage(
            "Backup Downloaded"
        );

    }

    /* ==========================
       Import Backup
    ========================== */

    importBackup(
        file
    ) {

        const reader =
            new FileReader();

        reader.onload =
            event => {

                try {

                    const data =
                        JSON.parse(
                            event.target.result
                        );

                    if (
                        data.settings
                    ) {

                        localStorage.setItem(
                            "bw_settings",
                            JSON.stringify(
                                data.settings
                            )
                        );

                    }

                    if (
                        data.expenses
                    ) {

                        localStorage.setItem(
                            "bw_expenses",
                            JSON.stringify(
                                data.expenses
                            )
                        );

                    }

                    if (
                        data.income
                    ) {

                        localStorage.setItem(
                            "bw_income",
                            JSON.stringify(
                                data.income
                            )
                        );

                    }

                    if (
                        data.budgets
                    ) {

                        localStorage.setItem(
                            "bw_budgets",
                            JSON.stringify(
                                data.budgets
                            )
                        );

                    }

                    if (
                        data.savings
                    ) {

                        localStorage.setItem(
                            "bw_savings",
                            JSON.stringify(
                                data.savings
                            )
                        );

                    }

                    if (
                        data.investments
                    ) {

                        localStorage.setItem(
                            "bw_investments",
                            JSON.stringify(
                                data.investments
                            )
                        );

                    }

                    this.showMessage(
                        "Backup Restored Successfully"
                    );

                    setTimeout(() => {

                        location.reload();

                    }, 1500);

                }
                catch {

                    alert(
                        "Invalid Backup File"
                    );

                }

            };

        reader.readAsText(
            file
        );

    }

    /* ==========================
       Reset Application
    ========================== */

    resetApplication() {

        const confirmReset =
            confirm(
                "Delete all data permanently?"
            );

        if (
            !confirmReset
        ) return;

        localStorage.clear();

        alert(
            "Application Reset Complete"
        );

        location.reload();

    }

    /* ==========================
       Bind Events
    ========================== */

    bindEvents() {

        const settingsForm =
            document.getElementById(
                "settingsForm"
            );

        if (
            settingsForm
        ) {

            settingsForm.addEventListener(
                "submit",
                e => {

                    e.preventDefault();

                    this.collectFormData();

                }
            );

        }

    }

    /* ==========================
       Collect Form Values
    ========================== */

    collectFormData() {

        this.settings.currency =
            document.getElementById(
                "currency"
            )?.value ||
            "INR";

        this.settings.language =
            document.getElementById(
                "language"
            )?.value ||
            "en";

        this.settings.notifications =
            document.getElementById(
                "notifications"
            )?.checked ||
            false;

        this.settings.autoBackup =
            document.getElementById(
                "autoBackup"
            )?.checked ||
            false;

        this.settings.compactMode =
            document.getElementById(
                "compactMode"
            )?.checked ||
            false;

        this.settings.biometricLock =
            document.getElementById(
                "biometricLock"
            )?.checked ||
            false;

        this.saveSettings();

    }

    /* ==========================
       UI Message
    ========================== */

    showMessage(
        message
    ) {

        if (
            window.app
        ) {

            app.showNotification(
                message,
                "success"
            );

        }
        else {

            console.log(
                message
            );

        }

    }

}

/* ==========================
   Initialize Settings
========================== */

const settingsManager =
    new SettingsManager();

/* ==========================
   Global Access
========================== */

window.settingsManager =
    settingsManager;

window.exportBackup =
    () =>
        settingsManager.exportBackup();

window.resetApplication =
    () =>
        settingsManager.resetApplication();

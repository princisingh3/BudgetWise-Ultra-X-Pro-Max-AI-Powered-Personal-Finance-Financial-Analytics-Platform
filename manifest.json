/* ===================================
   BudgetWise Ultra X Pro Max
   Progressive Web App Manager
=================================== */

class PWAManager {

    constructor() {

        this.deferredPrompt = null;

        this.init();

    }

    /* ==========================
       Initialize
    ========================== */

    init() {

        this.registerServiceWorker();

        this.handleInstallPrompt();

        this.detectConnection();

        this.createInstallButton();

        this.checkAppMode();

        console.log(
            "🚀 PWA Manager Loaded"
        );

    }

    /* ==========================
       Service Worker Register
    ========================== */

    async registerServiceWorker() {

        if (
            "serviceWorker" in navigator
        ) {

            try {

                const registration =
                    await navigator
                    .serviceWorker
                    .register(
                        "./service-worker.js"
                    );

                console.log(
                    "✅ Service Worker Registered",
                    registration
                );

            }
            catch (error) {

                console.error(
                    "❌ Service Worker Failed",
                    error
                );

            }

        }

    }

    /* ==========================
       Install Prompt
    ========================== */

    handleInstallPrompt() {

        window.addEventListener(
            "beforeinstallprompt",
            (event) => {

                event.preventDefault();

                this.deferredPrompt =
                    event;

                this.showInstallButton();

            }
        );

    }

    /* ==========================
       Install App
    ========================== */

    async installApp() {

        if (
            !this.deferredPrompt
        ) return;

        this.deferredPrompt.prompt();

        const choice =
            await this.deferredPrompt
            .userChoice;

        if (
            choice.outcome ===
            "accepted"
        ) {

            console.log(
                "🎉 App Installed"
            );

        }

        this.deferredPrompt =
            null;

    }

    /* ==========================
       Install Button
    ========================== */

    createInstallButton() {

        if (
            document.getElementById(
                "installAppBtn"
            )
        ) {
            return;
        }

        const btn =
            document.createElement(
                "button"
            );

        btn.id =
            "installAppBtn";

        btn.innerHTML =
            "📲 Install App";

        btn.style.position =
            "fixed";

        btn.style.left =
            "20px";

        btn.style.bottom =
            "20px";

        btn.style.padding =
            "12px 20px";

        btn.style.border =
            "none";

        btn.style.borderRadius =
            "12px";

        btn.style.cursor =
            "pointer";

        btn.style.display =
            "none";

        btn.style.zIndex =
            "9999";

        document.body.appendChild(
            btn
        );

        btn.addEventListener(
            "click",
            () => {

                this.installApp();

            }
        );

    }

    /* ==========================
       Show Install Button
    ========================== */

    showInstallButton() {

        const btn =
            document.getElementById(
                "installAppBtn"
            );

        if (btn) {

            btn.style.display =
                "block";

        }

    }

    /* ==========================
       Online / Offline Status
    ========================== */

    detectConnection() {

        window.addEventListener(
            "online",
            () => {

                this.showStatus(
                    "🌐 Back Online",
                    "success"
                );

            }
        );

        window.addEventListener(
            "offline",
            () => {

                this.showStatus(
                    "📴 Offline Mode",
                    "warning"
                );

            }
        );

    }

    /* ==========================
       Status Message
    ========================== */

    showStatus(
        message,
        type
    ) {

        if (
            window.notificationManager
        ) {

            notificationManager
                .showToast(
                    message,
                    type
                );

        }
        else {

            console.log(
                message
            );

        }

    }

    /* ==========================
       Detect Installed App
    ========================== */

    checkAppMode() {

        const isInstalled =
            window.matchMedia(
                "(display-mode: standalone)"
            ).matches;

        if (
            isInstalled
        ) {

            console.log(
                "📱 Running as Installed App"
            );

        }

    }

    /* ==========================
       Background Sync
    ========================== */

    async registerBackgroundSync() {

        if (
            "serviceWorker" in navigator &&
            "SyncManager" in window
        ) {

            const registration =
                await navigator
                .serviceWorker
                .ready;

            try {

                await registration.sync
                    .register(
                        "budgetwise-sync"
                    );

                console.log(
                    "🔄 Background Sync Registered"
                );

            }
            catch (error) {

                console.error(
                    error
                );

            }

        }

    }

    /* ==========================
       Cache Storage Info
    ========================== */

    async getCacheInfo() {

        const cacheNames =
            await caches.keys();

        console.log(
            "📦 Cache Storage:",
            cacheNames
        );

    }

    /* ==========================
       Clear App Cache
    ========================== */

    async clearCache() {

        const names =
            await caches.keys();

        await Promise.all(

            names.map(
                cache =>
                    caches.delete(
                        cache
                    )
            )

        );

        this.showStatus(
            "🗑 Cache Cleared",
            "success"
        );

    }

}

/* ==========================
   Initialize PWA
========================== */

const pwaManager =
    new PWAManager();

/* ==========================
   Global Access
========================== */

window.pwaManager =
    pwaManager;

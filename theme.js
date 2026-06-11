/* ===================================
   BudgetWise Ultra X Pro Max
   Theme Management System
=================================== */

class ThemeManager {

    constructor() {

        this.defaultTheme = "dark";

        this.currentTheme =
            localStorage.getItem(
                "bw_theme"
            ) || this.defaultTheme;

        this.init();

    }

    /* ==========================
       Initialize
    ========================== */

    init() {

        this.applyTheme(
            this.currentTheme
        );

        this.createThemeButton();

        this.bindEvents();

        console.log(
            "🎨 Theme Manager Loaded"
        );

    }

    /* ==========================
       Apply Theme
    ========================== */

    applyTheme(theme) {

        document.body.setAttribute(
            "data-theme",
            theme
        );

        this.currentTheme =
            theme;

        localStorage.setItem(
            "bw_theme",
            theme
        );

        this.updateThemeIcon();

    }

    /* ==========================
       Toggle Theme
    ========================== */

    toggleTheme() {

        const newTheme =
            this.currentTheme === "dark"
                ? "light"
                : "dark";

        this.applyTheme(
            newTheme
        );

        if (window.app) {

            app.showNotification(
                `${newTheme.toUpperCase()} Mode Activated`,
                "success"
            );

        }

    }

    /* ==========================
       Theme Button
    ========================== */

    createThemeButton() {

        if (
            document.getElementById(
                "themeToggle"
            )
        ) {
            return;
        }

        const btn =
            document.createElement(
                "button"
            );

        btn.id =
            "themeToggle";

        btn.className =
            "theme-toggle-btn";

        btn.innerHTML =
            this.currentTheme === "dark"
                ? "☀️"
                : "🌙";

        btn.style.position =
            "fixed";

        btn.style.bottom =
            "25px";

        btn.style.right =
            "25px";

        btn.style.width =
            "60px";

        btn.style.height =
            "60px";

        btn.style.border =
            "none";

        btn.style.borderRadius =
            "50%";

        btn.style.cursor =
            "pointer";

        btn.style.fontSize =
            "24px";

        btn.style.zIndex =
            "9999";

        btn.style.boxShadow =
            "0 10px 25px rgba(0,0,0,.25)";

        document.body.appendChild(
            btn
        );

    }

    /* ==========================
       Update Icon
    ========================== */

    updateThemeIcon() {

        const btn =
            document.getElementById(
                "themeToggle"
            );

        if (!btn) return;

        btn.innerHTML =
            this.currentTheme === "dark"
                ? "☀️"
                : "🌙";

    }

    /* ==========================
       Color Presets
    ========================== */

    setAccentColor(
        color
    ) {

        document.documentElement
            .style
            .setProperty(
                "--primary-color",
                color
            );

        localStorage.setItem(
            "bw_accent_color",
            color
        );

    }

    loadAccentColor() {

        const savedColor =
            localStorage.getItem(
                "bw_accent_color"
            );

        if (savedColor) {

            document.documentElement
                .style
                .setProperty(
                    "--primary-color",
                    savedColor
                );

        }

    }

    /* ==========================
       Glassmorphism Mode
    ========================== */

    enableGlassMode() {

        document.body.classList.add(
            "glass-mode"
        );

        localStorage.setItem(
            "bw_glass_mode",
            "true"
        );

    }

    disableGlassMode() {

        document.body.classList.remove(
            "glass-mode"
        );

        localStorage.setItem(
            "bw_glass_mode",
            "false"
        );

    }

    loadGlassMode() {

        const enabled =
            localStorage.getItem(
                "bw_glass_mode"
            );

        if (
            enabled === "true"
        ) {

            document.body.classList.add(
                "glass-mode"
            );

        }

    }

    /* ==========================
       Compact Mode
    ========================== */

    enableCompactMode() {

        document.body.classList.add(
            "compact-mode"
        );

    }

    disableCompactMode() {

        document.body.classList.remove(
            "compact-mode"
        );

    }

    /* ==========================
       Event Binding
    ========================== */

    bindEvents() {

        document.addEventListener(
            "click",
            (e) => {

                if (
                    e.target.id ===
                    "themeToggle"
                ) {

                    this.toggleTheme();

                }

            }
        );

    }

    /* ==========================
       System Theme Detection
    ========================== */

    detectSystemTheme() {

        const prefersDark =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

        this.applyTheme(
            prefersDark
                ? "dark"
                : "light"
        );

    }

    /* ==========================
       Reset Theme Settings
    ========================== */

    resetTheme() {

        localStorage.removeItem(
            "bw_theme"
        );

        localStorage.removeItem(
            "bw_accent_color"
        );

        localStorage.removeItem(
            "bw_glass_mode"
        );

        this.applyTheme(
            this.defaultTheme
        );

    }

}

/* ==========================
   Initialize Theme Manager
========================== */

const themeManager =
    new ThemeManager();

themeManager.loadAccentColor();

themeManager.loadGlassMode();

/* ==========================
   Global Access
========================== */

window.themeManager =
    themeManager;

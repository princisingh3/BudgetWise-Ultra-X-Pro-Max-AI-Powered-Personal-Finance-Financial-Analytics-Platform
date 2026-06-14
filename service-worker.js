/* ===================================
   BudgetWise Ultra X Pro Max
   Service Worker
=================================== */

const CACHE_NAME =
    "budgetwise-ultra-x-v1.0.0";

const STATIC_ASSETS = [

    "./",
    "./html/index.html",
    "./html/dashboard.html",
    "./html/expenses.html",
    "./html/income.html",
    "./html/budgets.html",
    "./html/savings.html",
    "./html/investments.html",
    "./html/reports.html",
    "./html/profile.html",
    "./html/settings.html",

    "./css/style.css",
    "./css/dashboard.css",
    "./css/components.css",
    "./css/animations.css",
    "./css/responsive.css",

    "./js/app.js",
    "./js/auth.js",
    "./js/expense.js",
    "./js/income.js",
    "./js/budget.js",
    "./js/savings.js",
    "./js/investment.js",
    "./js/analytics.js",
    "./js/charts.js",
    "./js/reports.js",
    "./js/settings.js",
    "./js/notifications.js",
    "./js/theme.js",
    "./js/pwa.js",

    "./manifest.json",

    "./asset/icon-192.png",
    "./asset/icon-512.png",
    "./asset/logo.png"
];

/* ==========================
   Install Event
========================== */

self.addEventListener(
    "install",
    event => {

        console.log(
            "🚀 Service Worker Installing"
        );

        event.waitUntil(

            caches.open(
                CACHE_NAME
            )
            .then(cache => {

                return cache.addAll(
                    STATIC_ASSETS
                );

            })

        );

        self.skipWaiting();

    }
);

/* ==========================
   Activate Event
========================== */

self.addEventListener(
    "activate",
    event => {

        console.log(
            "✅ Service Worker Activated"
        );

        event.waitUntil(

            caches.keys()
            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if (
                            key !== CACHE_NAME
                        ) {

                            return caches.delete(
                                key
                            );

                        }

                    })

                );

            })

        );

        self.clients.claim();

    }
);

/* ==========================
   Fetch Event
========================== */

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(
                event.request
            )
            .then(response => {

                if (response) {

                    return response;

                }

                return fetch(
                    event.request
                )
                .then(networkResponse => {

                    return caches.open(
                        CACHE_NAME
                    )
                    .then(cache => {

                        cache.put(
                            event.request,
                            networkResponse.clone()
                        );

                        return networkResponse;

                    });

                })
                .catch(() => {

                    if (
                        event.request.mode ===
                        "navigate"
                    ) {

                        return caches.match(
                            "./index.html"
                        );

                    }

                });

            })

        );

    }
);

/* ==========================
   Background Sync
========================== */

self.addEventListener(
    "sync",
    event => {

        if (
            event.tag ===
            "budgetwise-sync"
        ) {

            event.waitUntil(

                syncData()

            );

        }

    }
);

async function syncData() {

    console.log(
        "🔄 Background Sync Running"
    );

    return Promise.resolve();

}

/* ==========================
   Push Notification
========================== */

self.addEventListener(
    "push",
    event => {

        const options = {

            body:
                event.data
                ? event.data.text()
                : "New update available",

            icon:
                "./asset/icon-192.png",

            badge:
                "./asset/icon-192.png",

            vibrate: [
                200,
                100,
                200
            ],

            data: {

                dateOfArrival:
                    Date.now()

            }

        };

        event.waitUntil(

            self.registration
            .showNotification(
                "💰 BudgetWise Alert",
                options
            )

        );

    }
);

/* ==========================
   Notification Click
========================== */

self.addEventListener(
    "notificationclick",
    event => {

        event.notification.close();

        event.waitUntil(

            clients.openWindow(
                "./dashboard.html"
            )

        );

    }
);

/* ==========================
   Message Listener
========================== */

self.addEventListener(
    "message",
    event => {

        if (
            event.data &&
            event.data.type ===
            "SKIP_WAITING"
        ) {

            self.skipWaiting();

        }

    }
);

console.log(
    "💎 BudgetWise Ultra X Pro Max Service Worker Ready"
);

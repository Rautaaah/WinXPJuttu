/*
 * ============================================================
 * WINDOWS XP LOADER / LOGIN
 * ============================================================
 *
 * The normal window "load" event only prepares the listener.
 *
 * The actual XP loader sequence does NOT start until
 * "biosIntroFinished" is dispatched by index.html.
 *
 * This prevents the XP loader from being 10 seconds ahead.
 * ============================================================
 */

window.addEventListener("load", function () {

    window.addEventListener(
        "biosIntroFinished",
        function () {

            /*
             * Original XP loader delay.
             *
             * BIOS:
             *     0s -> 10s
             *
             * XP loader:
             *     10s -> 14s
             */
            setTimeout(function () {

                const loader =
                    document.getElementById("loader");

                const loginScreen =
                    document.getElementById("login-screen");


                if (loader && loginScreen) {

                    /*
                     * Hide the XP loader.
                     */
                    loader.style.display = "none";


                    /*
                     * Black transition screen.
                     */
                    const blackScreen =
                        document.createElement("div");

                    blackScreen.style.position = "fixed";
                    blackScreen.style.inset = "0";
                    blackScreen.style.background = "black";
                    blackScreen.style.zIndex = "10000";
                    blackScreen.style.opacity = "1";


                    document.body.appendChild(
                        blackScreen
                    );


                    /*
                     * Give the black screen time
                     * before the startup transition.
                     */
                    setTimeout(function () {

                        const transitionDiv =
                            document.createElement("div");

                        transitionDiv.id =
                            "transition-screen";

                        transitionDiv.style.position =
                            "fixed";

                        transitionDiv.style.inset = "0";

                        transitionDiv.style.zIndex =
                            "10001";

                        transitionDiv.style.display =
                            "flex";

                        transitionDiv.style.alignItems =
                            "center";

                        transitionDiv.style.justifyContent =
                            "center";

                        transitionDiv.style.background =
                            "black";


                        document.body.appendChild(
                            transitionDiv
                        );


                        /*
                         * Remove the black screen.
                         */
                        blackScreen.remove();


                        /*
                         * Load the original startup
                         * transition.
                         */
                        fetch(
                            "/Loader_Login/Startup_Transition.html"
                        )
                            .then(function (response) {

                                if (!response.ok) {
                                    throw new Error(
                                        "HTTP " +
                                        response.status
                                    );
                                }

                                return response.text();
                            })

                            .then(function (html) {

                                transitionDiv.innerHTML =
                                    html;


                                /*
                                 * Original transition timing.
                                 */
                                setTimeout(function () {

                                    transitionDiv.remove();

                                    loginScreen.classList.remove(
                                        "hidden"
                                    );

                                }, 800);
                            })

                            .catch(function (error) {

                                console.error(
                                    "Failed to load startup transition:",
                                    error
                                );


                                transitionDiv.remove();

                                loginScreen.classList.remove(
                                    "hidden"
                                );
                            });

                    }, 1000);

                } else {

                    console.error(
                        "Missing #loader or #login-screen"
                    );
                }

            }, 4000);

        },
        {
            once: true
        }
    );

});


/*
 * ============================================================
 * FADE-IN SETUP
 * ============================================================
 */

window.addEventListener(
    "DOMContentLoaded",
    function () {

        document.body.classList.add(
            "fade-in-steps"
        );

    }
);


/*
 * ============================================================
 * USER LOGIN
 * ============================================================
 */

function switchUserLogOn() {

    localStorage.setItem(
        "hasLoggedInAsGuest",
        "true"
    );

    window.location.href =
        "/Bureau/Bureau.html";
}


/*
 * ============================================================
 * GUEST LOGIN CHECK
 * ============================================================
 */

function hasLoggedInAsGuest() {

    return localStorage.getItem(
        "hasLoggedInAsGuest"
    ) === "true";
}


/*
 * ============================================================
 * GUEST LOGIN
 * ============================================================
 */

function loginAsGuest() {

    const leftPanel =
        document.getElementById("left-panel");

    const rightPanel =
        document.getElementById("right-panel");

    const guestUser =
        document.getElementById("guest-user");


    /*
     * Change the guest panel.
     */
    if (leftPanel) {

        leftPanel.classList.add(
            "paddingTopLog"
        );
    }


    /*
     * Loading message.
     */
    const loadingText =
        document.createElement("div");

    loadingText.id =
        "guest-loading";

    loadingText.textContent =
        "Loading your personal settings...";


    if (guestUser) {

        guestUser.appendChild(
            loadingText
        );
    }


    /*
     * Hide the other login UI.
     */
    const leftBottom =
        document.getElementById("left-bottom");

    const rightBottom =
        document.getElementById("right-bottom");


    if (leftBottom) {
        leftBottom.style.display = "none";
    }

    if (rightBottom) {
        rightBottom.style.display = "none";
    }


    /*
     * Remember guest login.
     */
    localStorage.setItem(
        "hasLoggedInAsGuest",
        "true"
    );


    /*
     * Give the loading screen time to display.
     */
    setTimeout(function () {

        window.location.href =
            "/Bureau/Bureau.html";

    }, 1000);
}


/*
 * ============================================================
 * LOGIN SCREEN INTERACTION
 * ============================================================
 */

window.addEventListener(
    "DOMContentLoaded",
    function () {

        const guestUser =
            document.getElementById("guest-user");

        const guestImage =
            document.getElementById("guest-image");


        /*
         * Guest image border.
         */
        if (guestImage) {

            guestImage.addEventListener(
                "mouseenter",
                function () {

                    guestImage.classList.add(
                        "selected"
                    );

                }
            );


            guestImage.addEventListener(
                "mouseleave",
                function () {

                    guestImage.classList.remove(
                        "selected"
                    );

                }
            );
        }


        /*
         * Guest user hover.
         */
        if (guestUser) {

            guestUser.addEventListener(
                "mouseenter",
                function () {

                    guestUser.classList.add(
                        "selected"
                    );

                }
            );


            guestUser.addEventListener(
                "mouseleave",
                function () {

                    guestUser.classList.remove(
                        "selected"
                    );

                }
            );


            /*
             * Mouse press.
             */
            guestUser.addEventListener(
                "mousedown",
                function () {

                    guestUser.classList.add(
                        "pressed"
                    );

                }
            );


            /*
             * Mouse release.
             */
            guestUser.addEventListener(
                "mouseup",
                function () {

                    guestUser.classList.remove(
                        "pressed"
                    );

                }
            );
        }


        /*
         * Keyboard navigation.
         */
        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    if (
                        document.activeElement ===
                        guestUser
                    ) {

                        loginAsGuest();
                    }
                }

            }
        );


        /*
         * Make guest selectable.
         */
        if (guestUser) {

            guestUser.setAttribute(
                "tabindex",
                "0"
            );
        }

    }
);

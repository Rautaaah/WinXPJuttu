/*
 * =========================================================
 * WINDOWS XP PORTFOLIO STARTUP / LOGIN
 * =========================================================
 *
 * STARTUP ORDER:
 *
 *   1. BIOS
 *          ↓
 *   2. WINDOWS XP SPINNING SCREEN
 *          ↓
 *   3. EXISTING LOADER
 *          ↓
 *   4. EXISTING LoadingScreenTransition
 *          ↓
 *   5. BLACK FADE
 *          ↓
 *   6. Windows95Happyyay.gif
 *          ↓
 *   7. EXISTING LOGIN SCREEN
 *          ↓
 *   8. USER LOGS IN
 *          ↓
 *   9. DESKTOP
 *
 * =========================================================
 */


/*
 * =========================================================
 * STARTUP
 * =========================================================
 */

window.addEventListener("load", function () {

  const loader = document.getElementById("loader");
  const loginScreen = document.getElementById("login-screen");

  if (!loader || !loginScreen) {
    console.error("Missing #loader or #login-screen");
    return;
  }

  /*
   * Hide the EXISTING loader while BIOS is running.
   */
  loader.style.display = "none";

  /*
   * Hide login until the entire startup sequence is finished.
   */
  loginScreen.classList.add("hidden");

  /*
   * 1. BIOS
   */
  showComputerInfoScreen(loader);

});


/*
 * =========================================================
 * 1. BIOS / COMPUTER INFORMATION
 * =========================================================
 */

function showComputerInfoScreen(loader) {

  const bootScreen = document.createElement("div");

  bootScreen.id = "custom-boot-screen";

  Object.assign(bootScreen.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    background: "#000",
    color: "#c0c0c0",
    zIndex: "99999",
    fontFamily: "Consolas, 'Courier New', monospace",
    fontSize: "15px",
    lineHeight: "1.5",
    padding: "28px",
    boxSizing: "border-box",
    overflow: "hidden",
    whiteSpace: "pre-wrap",
    cursor: "default"
  });

  document.body.appendChild(bootScreen);

  const bootLines = [
    "RAUTATIENTORI SYSTEM BIOS",
    "==========================================",
    "",
    "Copyright (C) Rautatientori Industries",
    "",
    "SYSTEM INFORMATION",
    "------------------------------------------",
    "",
    "CPU ................. DETECTED",
    "CPU SPEED ........... 3.40 GHz",
    "MEMORY .............. 16384 MB OK",
    "STORAGE ............. 512 GB OK",
    "DISPLAY ............. OK",
    "AUDIO ............... OK",
    "NETWORK ............. OK",
    "",
    "Initializing hardware...",
    "",
    "[ OK ] CPU initialization",
    "[ OK ] Memory check",
    "[ OK ] Storage check",
    "[ OK ] Display adapter",
    "[ OK ] Audio device",
    "[ OK ] Network device",
    "[ OK ] System devices",
    "",
    "Checking system files...",
    "",
    "[ OK ] WINXP_CORE.SYS",
    "[ OK ] USER32.DLL",
    "[ OK ] KERNEL32.DLL",
    "[ OK ] SHELL32.DLL",
    "[ OK ] RAUTATIENTORI.EXE",
    "",
    "Loading Windows components...",
    "",
    "[ OK ] Login subsystem",
    "[ OK ] User profile system",
    "[ OK ] Desktop environment",
    "",
    "System initialization complete.",
    "",
    "Starting Windows..."
  ];

  let lineIndex = 0;

  function addBootLine() {

    if (lineIndex >= bootLines.length) {

      setTimeout(() => {

        bootScreen.remove();

        /*
         * BIOS IS FINISHED.
         *
         * NOW:
         * WINDOWS XP SPINNING SCREEN
         */

        showWindowsXPSPINNING(loader);

      }, 700);

      return;
    }

    bootScreen.textContent +=
      bootLines[lineIndex] + "\n";

    lineIndex++;

    const delay =
      lineIndex < 5
        ? 80
        : 45 + Math.random() * 90;

    setTimeout(addBootLine, delay);
  }

  addBootLine();
}


/*
 * =========================================================
 * 2. WINDOWS XP SPINNING SCREEN
 * =========================================================
 *
 * IMPORTANT:
 *
 * This is SEPARATE from #loader.
 *
 * #loader does NOT appear until this screen is finished.
 * =========================================================
 */

function showWindowsXPSPINNING(loader) {

  const spinningScreen =
    document.createElement("div");

  spinningScreen.id =
    "windows-xp-spinning-screen";

  Object.assign(spinningScreen.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    background: "#000",
    zIndex: "99998",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  });


  /*
   * XP logo.
   */

  const xpLogo =
    document.createElement("img");

  xpLogo.src =
    "/Assets/Images/Windows_XP_SP2_Boot_screen cropped.png";

  xpLogo.alt =
    "Windows XP";

  Object.assign(xpLogo.style, {
    position: "absolute",
    top: "25%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "auto",
    maxWidth: "70%",
    maxHeight: "45%",
    objectFit: "contain"
  });


  /*
   * Spinning/loading container.
   */

  const spinner =
    document.createElement("div");

  Object.assign(spinner.style, {
    position: "absolute",
    bottom: "25%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "180px",
    height: "18px",
    overflow: "hidden",
    background: "transparent"
  });


  /*
   * Moving XP-style blocks.
   */

  const spinnerTrack =
    document.createElement("div");

  Object.assign(spinnerTrack.style, {
    display: "flex",
    gap: "3px",
    position: "absolute",
    left: "-70px",
    top: "0",
    width: "260px",
    height: "18px",
    animation: "xpSpinnerMove 1.15s linear infinite"
  });


  for (let i = 0; i < 12; i++) {

    const block =
      document.createElement("div");

    Object.assign(block.style, {
      width: "14px",
      height: "18px",
      background: "#3b7ddd",
      flexShrink: "0",
      borderRadius: "1px"
    });

    spinnerTrack.appendChild(block);
  }


  spinner.appendChild(spinnerTrack);


  /*
   * Microsoft logo.
   */

  const microsoftLogo =
    document.createElement("img");

  microsoftLogo.src =
    "/Assets/Images/Microsoft logo démarrage.png";

  microsoftLogo.alt =
    "Microsoft";

  Object.assign(microsoftLogo.style, {
    position: "absolute",
    right: "35px",
    bottom: "35px",
    width: "auto",
    maxWidth: "180px",
    maxHeight: "60px",
    objectFit: "contain"
  });


  /*
   * Add spinner animation.
   */

  const spinnerStyle =
    document.createElement("style");

  spinnerStyle.textContent = `
    @keyframes xpSpinnerMove {
      0% {
        transform: translateX(0);
      }

      100% {
        transform: translateX(204px);
      }
    }
  `;


  document.head.appendChild(
    spinnerStyle
  );

  spinningScreen.appendChild(
    xpLogo
  );

  spinningScreen.appendChild(
    spinner
  );

  spinningScreen.appendChild(
    microsoftLogo
  );

  document.body.appendChild(
    spinningScreen
  );


  /*
   * Let the SPINNING SCREEN play.
   *
   * ONLY AFTER THIS finishes do we
   * reveal the EXISTING #loader.
   */

  setTimeout(() => {

    spinningScreen.style.transition =
      "opacity 350ms ease";

    spinningScreen.style.opacity =
      "0";

    setTimeout(() => {

      spinningScreen.remove();

      /*
       * Remove the temporary animation CSS.
       */

      spinnerStyle.remove();

      /*
       * 3. EXISTING LOADER
       */

      showExistingLoader(loader);

    }, 350);

  }, 3500);
}


/*
 * =========================================================
 * 3. EXISTING LOADER
 * =========================================================
 *
 * THIS IS YOUR ORIGINAL #loader FROM index.html.
 *
 * It is NOT replaced by the spinning screen.
 * =========================================================
 */

function showExistingLoader(loader) {

  /*
   * Reveal the original loader exactly as it
   * exists in index.html.
   */

  loader.style.display = "";

  /*
   * Let the original loader play.
   */

  setTimeout(() => {

    loader.style.display = "none";

    /*
     * 4. EXISTING XP LoadingScreenTransition
     */

    showLoadingScreenTransition();

  }, 4000);
}


/*
 * =========================================================
 * 4. WINDOWS XP LoadingScreenTransition
 * =========================================================
 */

function showLoadingScreenTransition() {

  const transitionScreen =
    document.createElement("div");

  transitionScreen.id =
    "transition-screen";

  Object.assign(transitionScreen.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    background: "#000",
    zIndex: "10001",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: "1"
  });

  document.body.appendChild(
    transitionScreen
  );

  fetch("/Loader_Login/Startup_Transition.html")
    .then((response) => {

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      return response.text();

    })
    .then((html) => {

      transitionScreen.innerHTML =
        html;

      setTimeout(() => {

        transitionScreen.style.transition =
          "opacity 700ms ease";

        transitionScreen.style.opacity =
          "0";

        setTimeout(() => {

          transitionScreen.remove();

          /*
           * 5. BLACK FADE
           */

          showBlackFadeIn();

        }, 700);

      }, 800);

    })
    .catch((error) => {

      console.error(
        "Failed to load startup transition:",
        error
      );

      transitionScreen.style.transition =
        "opacity 700ms ease";

      transitionScreen.style.opacity =
        "0";

      setTimeout(() => {

        transitionScreen.remove();

        showBlackFadeIn();

      }, 700);

    });
}


/*
 * =========================================================
 * 5. BLACK FADE-IN
 * =========================================================
 */

function showBlackFadeIn() {

  const blackScreen =
    document.createElement("div");

  blackScreen.id =
    "black-fade-screen";

  Object.assign(blackScreen.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    background: "#000",
    zIndex: "10002",
    opacity: "1",
    transition: "opacity 1000ms ease",
    pointerEvents: "none"
  });

  document.body.appendChild(
    blackScreen
  );

  setTimeout(() => {

    /*
     * GIF appears underneath.
     */

    showGifScreen();

    requestAnimationFrame(() => {

      requestAnimationFrame(() => {

        blackScreen.style.opacity =
          "0";

      });

    });

    setTimeout(() => {

      blackScreen.remove();

    }, 1000);

  }, 250);
}


/*
 * =========================================================
 * 6. WINDOWS95HAPPYYAY.GIF
 * =========================================================
 */

function showGifScreen() {

  const gifScreen =
    document.createElement("div");

  gifScreen.id =
    "gif-startup-screen";

  Object.assign(gifScreen.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    background: "#000",
    zIndex: "10001",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: "1"
  });

  const gif =
    document.createElement("img");

  gif.src =
    "/Assets/Windows95Happyyay.gif";

  gif.alt =
    "Windows startup animation";

  Object.assign(gif.style, {
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
    width: "auto",
    height: "auto",
    objectFit: "contain"
  });

  gifScreen.appendChild(
    gif
  );

  document.body.appendChild(
    gifScreen
  );


  /*
   * Keep the GIF visible.
   */

  setTimeout(() => {

    gifScreen.style.transition =
      "opacity 500ms ease";

    gifScreen.style.opacity =
      "0";

    setTimeout(() => {

      gifScreen.remove();

      /*
       * 7. EXISTING LOGIN SCREEN
       */

      const loginScreen =
        document.getElementById(
          "login-screen"
        );

      if (!loginScreen) {

        console.error(
          "Missing #login-screen"
        );

        return;
      }

      loginScreen.classList.remove(
        "hidden"
      );

    }, 500);

  }, 3000);
}


/*
 * =========================================================
 * PAGE FADE
 * =========================================================
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
 * =========================================================
 * SWITCH USER
 * =========================================================
 */

function switchUserLogOn() {

  localStorage.setItem(
    "fromSwitchUser",
    "1"
  );

  window.location.href =
    "/Bureau/Bureau.html";
}


/*
 * =========================================================
 * LOGIN STATE
 * =========================================================
 */

let hasLoggedInAsGuest = false;


/*
 * =========================================================
 * LOGIN AS GUEST
 * =========================================================
 */

function loginAsGuest() {

  if (hasLoggedInAsGuest) return;

  hasLoggedInAsGuest = true;

  const leftSection =
    document.getElementById(
      "left-section"
    );

  const rightText =
    document.getElementById(
      "right-text"
    );

  const leftPanel =
    document.getElementById(
      "left-panel"
    );

  const userList =
    document.getElementById(
      "user-list"
    );

  const guestUser =
    document.getElementById(
      "guest-user"
    );

  if (
    !leftSection ||
    !rightText ||
    !leftPanel ||
    !userList ||
    !guestUser
  ) {

    console.error(
      "Required login elements are missing."
    );

    hasLoggedInAsGuest = false;

    return;
  }

  const guestSpan =
    guestUser.querySelector(
      "span"
    );

  leftPanel.innerHTML =
    `<p>welcome</p>`;

  leftPanel.style.paddingTop =
    "18%";

  const leftPanelP =
    leftPanel.querySelector(
      "p"
    );

  if (leftPanelP) {

    Object.assign(
      leftPanelP.style,
      {
        fontSize: "5rem",
        fontFamily:
          "Arial, sans-serif",
        fontStyle: "italic",
        fontWeight: "bold",
        textShadow:
          "2px 3px #3454b4"
      }
    );
  }

  if (guestSpan) {

    guestSpan.insertAdjacentHTML(
      "afterend",
      `<p>Loading your personal settings...</p>`
    );

  }

  userList.classList.add(
    "is-padding-anim"
  );

  userList.style.animation =
    "paddingTopLog 1s forwards";

  setTimeout(() => {

    userList.classList.remove(
      "is-padding-anim"
    );

  }, 1000);

  leftSection.style.display =
    "none";

  rightText.style.display =
    "none";

  guestUser.classList.remove(
    "selected"
  );

  setTimeout(() => {

    window.location.href =
      "/Bureau/Bureau.html";

  }, 1000);
}


/*
 * =========================================================
 * LOGIN SCREEN CONTROLS
 * =========================================================
 */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const userList =
      document.getElementById(
        "user-list"
      );

    const users =
      document.querySelectorAll(
        ".user"
      );

    let selectedIndex = null;
    let hasArrowBeenUsed = false;


    /*
     * =====================================================
     * UPDATE USER SELECTION
     * =====================================================
     */

    function updateUserSelection(index) {

      users.forEach(
        (user, i) => {

          user.classList.toggle(
            "selected",
            i === index
          );

        }
      );
    }


    updateUserSelection(
      selectedIndex
    );


    /*
     * =====================================================
     * ENTER KEY
     * =====================================================
     */

    document.addEventListener(
      "keydown",
      function (e) {

        const guestUser =
          document.getElementById(
            "guest-user"
          );

        if (!guestUser) return;

        if (
          e.key === "Enter" &&
          guestUser.classList.contains(
            "selected"
          )
        ) {

          if (
            window.location.pathname.endsWith(
              "/Start_Menu/Log_Off/Transition/Switch_User.html"
            )
          ) {

            switchUserLogOn();

          } else {

            loginAsGuest();

          }

        }

      }
    );


    /*
     * =====================================================
     * ARROW KEY NAVIGATION
     * =====================================================
     */

    document.addEventListener(
      "keydown",
      function (e) {

        if (
          e.key === "ArrowDown" ||
          e.key === "ArrowUp"
        ) {

          if (!hasArrowBeenUsed) {

            selectedIndex = 0;

            updateUserSelection(
              selectedIndex
            );

            hasArrowBeenUsed = true;

            users.forEach(
              (user, i) => {

                if (
                  i === selectedIndex
                ) {

                  user.style.opacity =
                    "1";

                  user.style.animation =
                    "";

                } else {

                  user.style.opacity =
                    "0.5";

                  user.style.animation =
                    "glitchOpacityReverse 0.4s steps(5, end)";

                }

              }
            );

            e.preventDefault();

            return;
          }

        }

        if (hasArrowBeenUsed) {

          if (e.key === "ArrowDown") {

            if (
              selectedIndex <
              users.length - 1
            ) {

              selectedIndex++;

              updateUserSelection(
                selectedIndex
              );

              users.forEach(
                (user, i) => {

                  if (
                    i === selectedIndex
                  ) {

                    user.style.opacity =
                      "1";

                    user.style.animation =
                      "";

                  } else {

                    user.style.opacity =
                      "0.5";

                    user.style.animation =
                      "glitchOpacityReverse 0.4s steps(5, end)";

                  }

                }
              );

            }

            e.preventDefault();

          } else if (
            e.key === "ArrowUp"
          ) {

            if (
              selectedIndex > 0
            ) {

              selectedIndex--;

              updateUserSelection(
                selectedIndex
              );

              users.forEach(
                (user, i) => {

                  if (
                    i === selectedIndex
                  ) {

                    user.style.opacity =
                      "1";

                    user.style.animation =
                      "";

                  } else {

                    user.style.opacity =
                      "0.5";

                    user.style.animation =
                      "glitchOpacityReverse 0.4s steps(5, end)";

                  }

                }
              );

            }

            e.preventDefault();

          }

        }

      }
    );


    /*
     * =====================================================
     * USER LIST CHECK
     * =====================================================
     */

    if (
      !userList ||
      users.length === 0
    ) {

      console.error(
        "Element '#user-list' or '.user' missing!"
      );

      return;
    }


    /*
     * =====================================================
     * USER LIST MOUSE ENTER
     * =====================================================
     */

    userList.addEventListener(
      "mouseenter",
      function () {

        const hasSelected =
          Array.from(users).some(
            (user) =>
              user.classList.contains(
                "selected"
              )
          );

        if (hasSelected) return;

        users.forEach(
          (user) => {

            user.style.opacity =
              "0.5";

            user.style.animation =
              "glitchOpacityReverse 0.4s steps(5, end)";

          }
        );

      }
    );


    /*
     * =====================================================
     * USER LIST MOUSE LEAVE
     * =====================================================
     */

    userList.addEventListener(
      "mouseleave",
      function () {

        const hasSelected =
          Array.from(users).some(
            (user) =>
              user.classList.contains(
                "selected"
              )
          );

        if (hasSelected) return;

        users.forEach(
          (user) => {

            user.style.opacity =
              "1";

            user.style.animation =
              "glitchOpacity 0.4s steps(5, end)";

          }
        );

      }
    );


    /*
     * =====================================================
     * INDIVIDUAL USER HOVER
     * =====================================================
     */

    users.forEach(
      (user) => {

        user.addEventListener(
          "mouseenter",
          function () {

            user.style.opacity =
              "1";

            user.style.animation =
              "";

          }
        );

        user.addEventListener(
          "mouseleave",
          function () {

            if (
              user.classList.contains(
                "selected"
              )
            ) {

              user.style.opacity =
                "1";

              user.style.animation =
                "";

            } else {

              if (
                userList.matches(":hover") &&
                !userList.classList.contains(
                  "is-padding-anim"
                )
              ) {

                user.style.opacity =
                  "0.5";

                user.style.animation =
                  "glitchOpacityReverse 0.4s steps(5, end)";

              }

            }

          }
        );

      }
    );


    /*
     * =====================================================
     * USER IMAGE BORDER
     * =====================================================
     */

    users.forEach(
      (user) => {

        const userimg =
          user.querySelector(
            "img"
          );

        if (userimg) {

          user.addEventListener(
            "mouseenter",
            function () {

              userimg.style.border =
                "2px solid #bfa304";

            }
          );

          user.addEventListener(
            "mouseleave",
            function () {

              userimg.style.border =
                "2px solid white";

            }
          );

        }

      }
    );


    /*
     * =====================================================
     * MOUSE DOWN TEXT COLOR
     * =====================================================
     */

    const guestUser =
      document.getElementById(
        "guest-user"
      );

    if (guestUser) {

      guestUser.addEventListener(
        "mousedown",
        function () {

          const guestP =
            guestUser.querySelector(
              "p"
            );

          if (guestP) {

            guestP.style.color =
              "white";

          }

        }
      );

    }


    /*
     * =====================================================
     * MOUSE SELECTION
     * =====================================================
     */

    users.forEach(
      (user) => {

        user.addEventListener(
          "mousedown",
          function () {

            users.forEach(
              (u) =>
                u.classList.remove(
                  "selected"
                )
            );

            this.classList.add(
              "selected"
            );

          }
        );

        user.addEventListener(
          "mouseup",
          function () {

            users.forEach(
              (u) =>
                u.classList.remove(
                  "selected"
                )
            );

            this.style.opacity =
              "1";

          }
        );

        document.addEventListener(
          "click",
          () => {

            user.classList.remove(
              "selected"
            );

            hasArrowBeenUsed = false;

            user.style.opacity =
              "1";

          }
        );

      }
    );

  }
);

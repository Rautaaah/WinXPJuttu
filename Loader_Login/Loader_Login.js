
/*
 * =========================================================
 * WINDOWS XP PORTFOLIO STARTUP / LOGIN
 * =========================================================
 *
 * STARTUP FLOW:
 *
 *   1. CMD / COMPUTER INFORMATION
 *              ↓
 *   2. Windows95Happyyay.gif
 *              ↓
 *   3. WINDOWS XP LOGIN SCREEN
 *              ↓
 *   4. User logs in
 *              ↓
 *   5. Bureau.html / Desktop
 *
 * IMPORTANT:
 * The desktop is NOT loaded during startup.
 * =========================================================
 */


/* =========================================================
 * STARTUP SEQUENCE
 * ========================================================= */

window.addEventListener("load", function () {

  const loader = document.getElementById("loader");
  const loginScreen = document.getElementById("login-screen");

  if (!loader || !loginScreen) {
    console.error("Missing #loader or #login-screen");
    return;
  }


  /*
   * Hide the original XP boot screen.
   */

  loader.style.display = "none";


  /*
   * =======================================================
   * 1. CMD / COMPUTER STARTUP SCREEN
   * =======================================================
   */

  const bootScreen = document.createElement("div");

  bootScreen.id = "custom-boot-screen";

  Object.assign(bootScreen.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    background: "#000",
    color: "#c0c0c0",
    zIndex: "10000",
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


  /*
   * Boot information.
   */

  const bootLines = [

    "RAUTATIENTORI SYSTEM BIOS",
    "==========================================",
    "",

    "Copyright (C) Rautatietori Industries",
    "",

    "CPU ................. DETECTED",
    "MEMORY .............. 16384 MB OK",
    "STORAGE ............. OK",
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


  /*
   * Type each line onto the screen.
   */

  function addBootLine() {

    if (lineIndex >= bootLines.length) {

      /*
       * Boot finished.
       */

      setTimeout(showGifScreen, 700);

      return;
    }


    bootScreen.textContent +=
      bootLines[lineIndex] + "\n";

    lineIndex++;


    /*
     * Slightly randomized terminal timing.
     */

    const delay =
      lineIndex < 4
        ? 80
        : 45 + Math.random() * 90;


    setTimeout(addBootLine, delay);
  }



  /*
   * =======================================================
   * 2. WINDOWS 95 HAPPY GIF
   * =======================================================
   */

  function showGifScreen() {

    /*
     * Remove CMD screen.
     */

    bootScreen.remove();


    /*
     * Create black GIF screen.
     */

    const gifScreen = document.createElement("div");

    gifScreen.id = "gif-startup-screen";

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


    /*
     * Create GIF.
     */

    const gif = document.createElement("img");

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


    gifScreen.appendChild(gif);

    document.body.appendChild(gifScreen);


    /*
     * =====================================================
     * GIF DISPLAY TIME
     * =====================================================
     *
     * 3000 = 3 seconds
     */

    setTimeout(function () {

      /*
       * Fade GIF away.
       */

      gifScreen.style.transition =
        "opacity 500ms ease";

      gifScreen.style.opacity = "0";


      /*
       * After fade:
       * SHOW LOGIN SCREEN.
       *
       * DO NOT redirect to Bureau.html here.
       */

      setTimeout(function () {

        gifScreen.remove();

        loginScreen.classList.remove("hidden");

      }, 500);

    }, 3000);

  }


  /*
   * Begin CMD startup.
   */

  addBootLine();

});



/* =========================================================
 * PAGE FADE
 * ========================================================= */

window.addEventListener(
  "DOMContentLoaded",
  function () {

    document.body.classList.add(
      "fade-in-steps"
    );

  }
);



/* =========================================================
 * SWITCH USER
 * ========================================================= */

function switchUserLogOn() {

  localStorage.setItem(
    "fromSwitchUser",
    "1"
  );

  window.location.href =
    "/Bureau/Bureau.html";
}



/* =========================================================
 * LOGIN STATE
 * ========================================================= */

let hasLoggedInAsGuest = false;



/* =========================================================
 * LOGIN AS GUEST
 * ========================================================= */

function loginAsGuest() {

  /*
   * Prevent multiple login attempts.
   */

  if (hasLoggedInAsGuest) return;

  hasLoggedInAsGuest = true;


  /*
   * Get login elements.
   */

  const leftSection =
    document.getElementById("left-section");

  const rightText =
    document.getElementById("right-text");

  const leftPanel =
    document.getElementById("left-panel");

  const userList =
    document.getElementById("user-list");

  const guestUser =
    document.getElementById("guest-user");


  /*
   * Verify elements.
   */

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


  /*
   * Get username.
   */

  const guestSpan =
    guestUser.querySelector("span");


  /*
   * Change left panel to welcome.
   */

  leftPanel.innerHTML =
    `<p>welcome</p>`;

  leftPanel.style.paddingTop =
    "18%";


  const leftPanelP =
    leftPanel.querySelector("p");


  if (leftPanelP) {

    Object.assign(leftPanelP.style, {

      fontSize: "5rem",

      fontFamily:
        "Arial, sans-serif",

      fontStyle: "italic",

      fontWeight: "bold",

      textShadow:
        "2px 3px #3454b4"

    });

  }


  /*
   * Loading message.
   */

  if (guestSpan) {

    guestSpan.insertAdjacentHTML(
      "afterend",
      `<p>Loading your personal settings...</p>`
    );

  }


  /*
   * Animate user list.
   */

  userList.classList.add(
    "is-padding-anim"
  );

  userList.style.animation =
    "paddingTopLog 1s forwards";


  setTimeout(function () {

    userList.classList.remove(
      "is-padding-anim"
    );

  }, 1000);


  /*
   * Hide bottom controls.
   */

  leftSection.style.display =
    "none";

  rightText.style.display =
    "none";


  /*
   * Remove selection.
   */

  guestUser.classList.remove(
    "selected"
  );


  /*
   * =======================================================
   * ACTUAL LOGIN
   * =======================================================
   *
   * This is the ONLY place in the startup flow
   * where the desktop is entered.
   */

  setTimeout(function () {

    window.location.href =
      "/Bureau/Bureau.html";

  }, 1000);

}



/* =========================================================
 * LOGIN SCREEN CONTROLS
 * ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const userList =
      document.getElementById("user-list");

    const users =
      document.querySelectorAll(".user");


    let selectedIndex = null;

    let hasArrowBeenUsed = false;



    /* =====================================================
     * UPDATE USER SELECTION
     * ===================================================== */

    function updateUserSelection(index) {

      users.forEach(function (user, i) {

        user.classList.toggle(
          "selected",
          i === index
        );

      });

    }


    updateUserSelection(
      selectedIndex
    );



    /* =====================================================
     * ENTER = LOGIN
     * ===================================================== */

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

          /*
           * Switch User page.
           */

          if (
            window.location.pathname.endsWith(
              "/Start_Menu/Log_Off/Transition/Switch_User.html"
            )
          ) {

            switchUserLogOn();

          }

          /*
           * Normal login.
           */

          else {

            loginAsGuest();

          }

        }

      }
    );



    /* =====================================================
     * ARROW KEY NAVIGATION
     * ===================================================== */

    document.addEventListener(
      "keydown",
      function (e) {

        /*
         * First arrow press selects first user.
         */

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
              function (user, i) {

                if (
                  i === selectedIndex
                ) {

                  user.style.opacity =
                    "1";

                  user.style.animation =
                    "";

                }

                else {

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


        /*
         * Arrow navigation after
         * first selection.
         */

        if (hasArrowBeenUsed) {

          /*
           * Arrow Down.
           */

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
                function (user, i) {

                  if (
                    i === selectedIndex
                  ) {

                    user.style.opacity =
                      "1";

                    user.style.animation =
                      "";

                  }

                  else {

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


          /*
           * Arrow Up.
           */

          else if (
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
                function (user, i) {

                  if (
                    i === selectedIndex
                  ) {

                    user.style.opacity =
                      "1";

                    user.style.animation =
                      "";

                  }

                  else {

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



    /* =====================================================
     * USER LIST CHECK
     * ===================================================== */

    if (
      !userList ||
      users.length === 0
    ) {

      console.error(
        "Element '#user-list' or '.user' missing!"
      );

      return;

    }



    /* =====================================================
     * USER LIST MOUSE ENTER
     * ===================================================== */

    userList.addEventListener(
      "mouseenter",
      function () {

        const hasSelected =
          Array.from(users).some(
            function (user) {

              return user.classList.contains(
                "selected"
              );

            }
          );


        if (hasSelected) return;


        users.forEach(
          function (user) {

            user.style.opacity =
              "0.5";

            user.style.animation =
              "glitchOpacityReverse 0.4s steps(5, end)";

          }
        );

      }
    );



    /* =====================================================
     * USER LIST MOUSE LEAVE
     * ===================================================== */

    userList.addEventListener(
      "mouseleave",
      function () {

        const hasSelected =
          Array.from(users).some(
            function (user) {

              return user.classList.contains(
                "selected"
              );

            }
          );


        if (hasSelected) return;


        users.forEach(
          function (user) {

            user.style.opacity =
              "1";

            user.style.animation =
              "glitchOpacity 0.4s steps(5, end)";

          }
        );

      }
    );



    /* =====================================================
     * INDIVIDUAL USER HOVER
     * ===================================================== */

    users.forEach(
      function (user) {

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

            }

            else {

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



    /* =====================================================
     * USER IMAGE HIGHLIGHT
     * ===================================================== */

    users.forEach(
      function (user) {

        const userimg =
          user.querySelector("img");


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



    /* =====================================================
     * MOUSE DOWN TEXT COLOR
     * ===================================================== */

    const guestUser =
      document.getElementById(
        "guest-user"
      );


    if (guestUser) {

      guestUser.addEventListener(
        "mousedown",
        function () {

          const guestP =
            guestUser.querySelector("p");


          if (guestP) {

            guestP.style.color =
              "white";

          }

        }
      );

    }



    /* =====================================================
     * MOUSE SELECTION
     * ===================================================== */

    users.forEach(
      function (user) {

        /*
         * Mouse down selects user.
         */

        user.addEventListener(
          "mousedown",
          function () {

            users.forEach(
              function (u) {

                u.classList.remove(
                  "selected"
                );

              }
            );


            this.classList.add(
              "selected"
            );

          }
        );


        /*
         * Mouse up clears selection styling.
         */

        user.addEventListener(
          "mouseup",
          function () {

            users.forEach(
              function (u) {

                u.classList.remove(
                  "selected"
                );

              }
            );


            this.style.opacity =
              "1";

          }
        );


        /*
         * Clicking elsewhere resets
         * the selection state.
         */

        document.addEventListener(
          "click",
          function () {

            user.classList.remove(
              "selected"
            );

            hasArrowBeenUsed =
              false;

            user.style.opacity =
              "1";

          }
        );

      }
    );

  }
);


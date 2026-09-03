/*
 * =========================================================
 * WINDOWS XP PORTFOLIO STARTUP / LOGIN
 * =========================================================
 *
 * Startup flow:
 *
 *   WINDOWS XP LOADING SCREEN
 *          ↓
 *   LoadingScreenTransition / Startup_Transition.html
 *          ↓
 *   CMD / COMPUTER INFO SCREEN
 *          ↓
 *   Windows95Happyyay.gif
 *          ↓
 *   WINDOWS XP LOGIN SCREEN
 *          ↓
 *   User logs in
 *          ↓
 *   Bureau.html / Desktop
 *
 * IMPORTANT:
 * The desktop is NOT loaded during startup.
 * =========================================================
 */


/*
 * =========================================================
 * STARTUP SEQUENCE
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
   * =======================================================
   * 1. LET THE ORIGINAL WINDOWS XP LOADING SCREEN RUN
   * =======================================================
   *
   * The HTML #loader is the actual XP loading screen.
   *
   * Do NOT hide it immediately.
   *
   * This delay gives the original XP loading animation
   * time to play before we move to the next stage.
   */

  setTimeout(() => {

    /*
     * Hide the original XP loading screen.
     */

    loader.style.display = "none";


    /*
     * =====================================================
     * 2. EXISTING WINDOWS XP LOADING TRANSITION
     * =====================================================
     *
     * This loads:
     *
     * /Loader_Login/Startup_Transition.html
     *
     * This is your existing LoadingScreenTransition.
     */

    const transitionScreen = document.createElement("div");

    transitionScreen.id = "transition-screen";

    Object.assign(transitionScreen.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      background: "#000",
      zIndex: "10000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });

    document.body.appendChild(transitionScreen);


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

        transitionScreen.innerHTML = html;


        /*
         * Give the existing XP transition time to play.
         */

        setTimeout(() => {

          transitionScreen.remove();

          showComputerInfoScreen();

        }, 800);

      })
      .catch((error) => {

        console.error(
          "Failed to load startup transition:",
          error
        );


        /*
         * If the transition file fails,
         * continue with the startup sequence.
         */

        transitionScreen.remove();

        showComputerInfoScreen();

      });

  }, 4000);

});


/*
 * =========================================================
 * 3. CMD / COMPUTER INFORMATION SCREEN
 * =========================================================
 */

function showComputerInfoScreen() {

  const bootScreen =
    document.createElement("div");

  bootScreen.id =
    "custom-boot-screen";


  Object.assign(bootScreen.style, {

    position: "fixed",
    inset: "0",

    width: "100%",
    height: "100%",

    background: "#000",

    color: "#c0c0c0",

    zIndex: "10001",

    fontFamily:
      "Consolas, 'Courier New', monospace",

    fontSize: "15px",

    lineHeight: "1.5",

    padding: "28px",

    boxSizing: "border-box",

    overflow: "hidden",

    whiteSpace: "pre-wrap",

    cursor: "default",

  });


  document.body.appendChild(bootScreen);


  /*
   * Computer information.
   */

  const bootLines = [

    "RAUTATIENTORI SYSTEM BIOS",

    "==========================================",

    "",

    "Copyright (C) Rautatientori Industries",

    "",

    "SYSTEM INFORMATION",

    "------------------------------------------",

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


  /*
   * Type each line.
   */

  function addBootLine() {

    if (lineIndex >= bootLines.length) {

      /*
       * CMD screen finished.
       */

      setTimeout(() => {

        showGifScreen();

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


    setTimeout(
      addBootLine,
      delay
    );

  }


  addBootLine();

}



/*
 * =========================================================
 * 4. WINDOWS95HAPPYYAY.GIF
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

    zIndex: "10002",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    opacity: "1",

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

    objectFit: "contain",

  });


  gifScreen.appendChild(gif);

  document.body.appendChild(gifScreen);


  /*
   * Keep the GIF visible for 3 seconds.
   */

  setTimeout(() => {

    gifScreen.style.transition =
      "opacity 500ms ease";

    gifScreen.style.opacity = "0";


    /*
     * Reveal the LOGIN SCREEN only after
     * the GIF has faded away.
     */

    setTimeout(() => {

      gifScreen.remove();


      /*
       * IMPORTANT:
       *
       * This is the XP LOGIN SCREEN.
       *
       * We do NOT go to Bureau.html here.
       */

      const loginScreen =
        document.getElementById(
          "login-screen"
        );


      if (loginScreen) {

        loginScreen.classList.remove(
          "hidden"
        );

      }

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


  /*
   * Change the left panel.
   */

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
          "2px 3px #3454b4",

      }
    );

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


  setTimeout(() => {

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


  guestUser.classList.remove(
    "selected"
  );


  /*
   * =======================================================
   * ACTUAL LOGIN
   * =======================================================
   *
   * ONLY HERE does the desktop load.
   */

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

    function updateUserSelection(
      index
    ) {

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

          /*
           * DOWN
           */

          if (
            e.key === "ArrowDown"
          ) {

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

          }


          /*
           * UP
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
                userList.matches(
                  ":hover"
                ) &&
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

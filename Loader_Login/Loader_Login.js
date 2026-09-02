/* =========================================================
   WINDOWS XP STARTUP SEQUENCE

   CMD
      ↓
   Windows95Happyyay.gif
      ↓
   Existing Windows XP Boot Screen
      ↓
   Existing Windows XP Login Screen
   ========================================================= */


/* =========================================================
   STARTUP
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  const prebootConsole =
    document.getElementById("preboot-console");

  const consoleOutput =
    document.getElementById("console-output");

  const prebootGif =
    document.getElementById("preboot-gif");

  const loader =
    document.getElementById("loader");

  const loginScreen =
    document.getElementById("login-screen");


  /* =======================================================
     SAFETY CHECK
     ======================================================= */

  if (
    !prebootConsole ||
    !consoleOutput ||
    !prebootGif ||
    !loader ||
    !loginScreen
  ) {

    console.error(
      "STARTUP ERROR: One or more startup elements are missing."
    );

    return;
  }


  /* =======================================================
     STOP THE OLD FADE SYSTEM
     
     This is important.
     We do NOT want the existing login animation
     touching the CMD screen.
     ======================================================= */

  document.body.classList.remove(
    "fade-in-steps"
  );


  /* =======================================================
     FORCE BLACK BACKGROUND
     ======================================================= */

  document.documentElement.style.background =
    "#000";

  document.body.style.background =
    "#000";


  /* =======================================================
     FORCE STARTING STATE
     ======================================================= */

  /* Hide XP boot */
  loader.style.display =
    "none";


  /* Hide login */
  loginScreen.classList.add(
    "hidden"
  );


  /* Hide GIF */
  prebootGif.classList.add(
    "hidden"
  );


  /* Show CMD */
  prebootConsole.style.display =
    "block";


  /*
   * Make absolutely sure the CMD
   * is on top of EVERYTHING.
   */

  prebootConsole.style.position =
    "fixed";

  prebootConsole.style.inset =
    "0";

  prebootConsole.style.zIndex =
    "999999";


  /* Clear old output */
  consoleOutput.innerHTML =
    "";


  /* =======================================================
     COMMAND PROMPT
     ======================================================= */

  const systemLines = [

    "RAUTATIENTORI BIOS v95.09",

    "",

    "Initializing system...",

    "",

    "CPU.................... OK",
    "RAM.................... OK",
    "GPU.................... OK",
    "AUDIO.................. OK",
    "STORAGE................ OK",
    "NETWORK................ OK",

    "",

    "Detecting hardware...",
    "Hardware detection..... OK",

    "",

    "Checking Windows services...",
    "Windows services....... OK",

    "",

    "Loading system files...",
    "System files........... OK",

    "",

    "Loading portfolio core...",
    "Portfolio core......... OK",

    "Loading Webamp engine...",
    "Webamp engine.......... OK",

    "Loading user profile...",
    "User profile........... OK",

    "",

    "Starting system services...",
    "System services........ OK",

    "",

    "SYSTEM READY.",

    "",

    "Starting Windows XP..."

  ];


  /* =======================================================
     TYPE CMD LINES
     ======================================================= */

  let currentLine = 0;


  function typeNextLine() {

    /*
     * Are we finished?
     */

    if (
      currentLine >=
      systemLines.length
    ) {

      /*
       * Finished CMD.
       *
       * Wait 1 second before
       * moving to GIF.
       */

      setTimeout(
        startWindows95Gif,
        1000
      );

      return;
    }


    /*
     * Create new line.
     */

    const line =
      document.createElement("div");


    line.className =
      "console-line";


    line.textContent =
      systemLines[currentLine];


    consoleOutput.appendChild(
      line
    );


    currentLine++;


    /*
     * Scroll to bottom.
     */

    consoleOutput.scrollTop =
      consoleOutput.scrollHeight;


    /*
     * Type next line.
     */

    setTimeout(
      typeNextLine,
      100
    );

  }


  /* =======================================================
     WINDOWS 95 GIF
     ======================================================= */

  function startWindows95Gif() {

    console.log(
      "STARTUP: CMD finished."
    );


    /*
     * Hide CMD.
     */

    prebootConsole.style.display =
      "none";


    /*
     * Show GIF.
     */

    prebootGif.classList.remove(
      "hidden"
    );


    prebootGif.style.display =
      "flex";


    prebootGif.style.position =
      "fixed";


    prebootGif.style.inset =
      "0";


    prebootGif.style.zIndex =
      "999998";


    prebootGif.style.background =
      "#000";


    console.log(
      "STARTUP: Windows 95 GIF started."
    );


    /*
     * Keep GIF on screen
     * for 3 seconds.
     */

    setTimeout(
      startXPBoot,
      3000
    );

  }


  /* =======================================================
     WINDOWS XP BOOT SCREEN
     ======================================================= */

  function startXPBoot() {

    console.log(
      "STARTUP: Windows 95 GIF finished."
    );


    /*
     * Hide GIF.
     */

    prebootGif.style.display =
      "none";


    prebootGif.classList.add(
      "hidden"
    );


    /*
     * Show EXISTING XP BOOT SCREEN.
     */

    loader.style.display =
      "flex";


    loader.style.position =
      "fixed";


    loader.style.inset =
      "0";


    loader.style.zIndex =
      "999997";


    console.log(
      "STARTUP: Windows XP boot started."
    );


    /*
     * XP boot stays for 4 seconds.
     */

    setTimeout(
      finishXPBoot,
      4000
    );

  }


  /* =======================================================
     FINISH WINDOWS XP BOOT
     ======================================================= */

  function finishXPBoot() {

    console.log(
      "STARTUP: Windows XP boot finished."
    );


    /*
     * Hide XP boot.
     */

    loader.style.display =
      "none";


    /*
     * Create black transition.
     */

    const blackScreen =
      document.createElement("div");


    blackScreen.id =
      "startup-black-screen";


    blackScreen.style.position =
      "fixed";

    blackScreen.style.inset =
      "0";

    blackScreen.style.background =
      "#000";

    blackScreen.style.zIndex =
      "9999999";


    document.body.appendChild(
      blackScreen
    );


    /*
     * Give the black screen
     * a short moment.
     */

    setTimeout(
      showStartupTransition,
      1000
    );

  }


  /* =======================================================
     EXISTING STARTUP TRANSITION
     ======================================================= */

  function showStartupTransition() {

    const blackScreen =
      document.getElementById(
        "startup-black-screen"
      );


    const transitionDiv =
      document.createElement("div");


    transitionDiv.id =
      "transition-screen";


    transitionDiv.style.position =
      "fixed";

    transitionDiv.style.inset =
      "0";

    transitionDiv.style.zIndex =
      "10000000";

    transitionDiv.style.display =
      "flex";

    transitionDiv.style.alignItems =
      "center";

    transitionDiv.style.justifyContent =
      "center";

    transitionDiv.style.background =
      "#000";


    document.body.appendChild(
      transitionDiv
    );


    if (blackScreen) {
      blackScreen.remove();
    }


    /*
     * Load your EXISTING
     * Startup_Transition.html
     */

    fetch(
      "/Loader_Login/Startup_Transition.html"
    )

      .then(function (response) {

        if (!response.ok) {

          throw new Error(
            "Startup transition returned HTTP " +
            response.status
          );

        }

        return response.text();

      })


      .then(function (html) {

        transitionDiv.innerHTML =
          html;


        /*
         * Let the existing transition
         * play for 800ms.
         */

        setTimeout(
          showLoginScreen,
          800
        );

      })


      .catch(function (error) {

        console.error(
          "Startup transition failed:",
          error
        );


        /*
         * If transition fails,
         * still continue to login.
         */

        setTimeout(
          showLoginScreen,
          300
        );

      });

  }


  /* =======================================================
     SHOW XP LOGIN
     ======================================================= */

  function showLoginScreen() {

    const transitionDiv =
      document.getElementById(
        "transition-screen"
      );


    if (transitionDiv) {
      transitionDiv.remove();
    }


    /*
     * Show original login screen.
     */

    loginScreen.classList.remove(
      "hidden"
    );


    /*
     * NOW it is safe to use
     * the original fade animation.
     */

    document.body.classList.add(
      "fade-in-steps"
    );


    console.log(
      "STARTUP: XP login screen shown."
    );

  }


  /* =======================================================
     BEGIN CMD
     ======================================================= */

  console.log(
    "STARTUP: Command prompt started."
  );


  typeNextLine();

});



/* =========================================================
   SWITCH USER
   ========================================================= */

function switchUserLogOn() {

  localStorage.setItem(
    "fromSwitchUser",
    "1"
  );

  window.location.href =
    "/Bureau/Bureau.html";
}



/* =========================================================
   GUEST LOGIN
   ========================================================= */

let hasLoggedInAsGuest = false;


function loginAsGuest() {

  if (hasLoggedInAsGuest) {
    return;
  }


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

    hasLoggedInAsGuest =
      false;

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

        fontStyle:
          "italic",

        fontWeight:
          "bold",

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


  setTimeout(function () {

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


  setTimeout(function () {

    window.location.href =
      "/Bureau/Bureau.html";

  }, 1000);

}



/* =========================================================
   LOGIN KEYBOARD / MOUSE CONTROLS
   ========================================================= */

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


    let selectedIndex =
      null;


    let hasArrowBeenUsed =
      false;



    /* =====================================================
       USER SELECTION
       ===================================================== */

    function updateUserSelection(index) {

      users.forEach(
        function (user, i) {

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



    /* =====================================================
       ENTER KEY
       ===================================================== */

    document.addEventListener(
      "keydown",
      function (e) {

        const guestUser =
          document.getElementById(
            "guest-user"
          );


        if (!guestUser) {
          return;
        }


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



    /* =====================================================
       ARROW KEYS
       ===================================================== */

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

            hasArrowBeenUsed =
              true;


            users.forEach(
              function (user, i) {

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
                function (user, i) {

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



    /* =====================================================
       CHECK USER LIST
       ===================================================== */

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
       USER LIST MOUSE ENTER
       ===================================================== */

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


        if (hasSelected) {
          return;
        }


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
       USER LIST MOUSE LEAVE
       ===================================================== */

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


        if (hasSelected) {
          return;
        }


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
       INDIVIDUAL USER HOVER
       ===================================================== */

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



    /* =====================================================
       USER IMAGE BORDER
       ===================================================== */

    users.forEach(
      function (user) {

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



    /* =====================================================
       GUEST MOUSE DOWN
       ===================================================== */

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



    /* =====================================================
       USER MOUSE SELECTION
       ===================================================== */

    users.forEach(
      function (user) {

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

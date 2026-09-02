/* =========================================================
   STARTUP SEQUENCE

   1. Command prompt
   2. Windows95Happyyay.gif
   3. Existing Windows XP boot screen
   4. Existing XP login screen
   ========================================================= */

window.addEventListener("load", function () {

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
     CHECK REQUIRED ELEMENTS
     ======================================================= */

  if (
    !prebootConsole ||
    !consoleOutput ||
    !prebootGif ||
    !loader
  ) {
    console.error(
      "Pre-boot elements are missing!"
    );

    return;
  }


  /* =======================================================
     INITIAL STATE

     Hide XP boot.
     Show command prompt.
     Hide GIF.
     ======================================================= */

  loader.style.display = "none";

  prebootConsole.style.display = "block";

  prebootGif.classList.add("hidden");


  /* =======================================================
     COMMAND PROMPT TEXT
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

    "Checking Windows services...",
    "Windows services....... OK",

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
     TYPE COMMAND PROMPT
     ======================================================= */

  let currentLine = 0;

  function showNextLine() {

    if (
      currentLine >=
      systemLines.length
    ) {

      /*
       * Finished typing.
       * Wait a little before showing GIF.
       */

      setTimeout(() => {

        startGif();

      }, 800);

      return;
    }


    const line =
      document.createElement("div");

    line.className =
      "console-line";

    line.textContent =
      systemLines[currentLine];

    consoleOutput.appendChild(line);

    currentLine++;


    /*
     * Speed of command prompt.
     * Smaller = faster.
     */

    setTimeout(
      showNextLine,
      120
    );
  }


  /* =======================================================
     START GIF
     ======================================================= */

  function startGif() {

    /*
     * Hide command prompt.
     */

    prebootConsole.style.display =
      "none";


    /*
     * Show GIF.
     */

    prebootGif.classList.remove(
      "hidden"
    );


    /*
     * GIF duration.
     *
     * 3000 = 3 seconds.
     */

    setTimeout(() => {

      startXPBoot();

    }, 3000);
  }


  /* =======================================================
     START EXISTING WINDOWS XP BOOT
     ======================================================= */

  function startXPBoot() {

    /*
     * Hide GIF.
     */

    prebootGif.classList.add(
      "hidden"
    );


    /*
     * Show the ORIGINAL XP boot screen.
     */

    loader.style.display =
      "flex";


    /*
     * Original XP boot duration.
     *
     * 4000 = 4 seconds.
     */

    setTimeout(() => {

      finishXPBoot();

    }, 4000);
  }


  /* =======================================================
     FINISH XP BOOT
     ======================================================= */

  function finishXPBoot() {

    if (!loader || !loginScreen) {

      console.error(
        "Missing #loader or #login-screen"
      );

      return;
    }


    /*
     * Hide XP boot.
     */

    loader.style.display =
      "none";


    /*
     * Original black transition.
     */

    const blackScreen =
      document.createElement("div");

    blackScreen.style.position =
      "fixed";

    blackScreen.style.inset =
      "0";

    blackScreen.style.background =
      "black";

    blackScreen.style.zIndex =
      "10000";

    blackScreen.style.opacity =
      "1";


    document.body.appendChild(
      blackScreen
    );


    /*
     * Wait before Startup_Transition.
     */

    setTimeout(() => {

      const transitionDiv =
        document.createElement("div");


      transitionDiv.id =
        "transition-screen";


      transitionDiv.style.position =
        "fixed";

      transitionDiv.style.inset =
        "0";

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


      blackScreen.remove();


      /*
       * Load the existing startup
       * transition.
       */

      fetch(
        "/Loader_Login/Startup_Transition.html"
      )

        .then((response) => {

          if (!response.ok) {

            throw new Error(
              "Startup transition returned " +
              response.status
            );

          }

          return response.text();

        })


        .then((html) => {

          transitionDiv.innerHTML =
            html;


          /*
           * Original transition
           * duration.
           */

          setTimeout(() => {

            transitionDiv.remove();


            /*
             * Show the ORIGINAL
             * XP login screen.
             */

            loginScreen.classList.remove(
              "hidden"
            );

          }, 800);

        })


        .catch((error) => {

          console.error(
            "Failed to load startup transition:",
            error
          );


          transitionDiv.remove();


          /*
           * Still show login if
           * transition fails.
           */

          loginScreen.classList.remove(
            "hidden"
          );

        });

    }, 1000);
  }


  /* =======================================================
     START EVERYTHING
     ======================================================= */

  showNextLine();

});



/* =========================================================
   FADE-IN EFFECT
   ========================================================= */

window.addEventListener(
  "DOMContentLoaded",
  function () {

    document.body.classList.add(
      "fade-in-steps"
    );

  }
);



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
            (user) =>
              user.classList.contains(
                "selected"
              )
          );


        if (hasSelected) {
          return;
        }


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



    /* =====================================================
       USER LIST MOUSE LEAVE
       ===================================================== */

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


        if (hasSelected) {
          return;
        }


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



    /* =====================================================
       INDIVIDUAL USER HOVER
       ===================================================== */

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



    /* =====================================================
       USER IMAGE BORDER
       ===================================================== */

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

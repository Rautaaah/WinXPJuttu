/*

* =========================================================
* STARTUP SEQUENCE
*
* BIOS GIF       : 10 seconds
* XP LOADER      : 4 seconds
* BLACK SCREEN   : 1 second
* TRANSITION     : 0.8 seconds
* LOGIN SCREEN   : appears after transition
*
* =========================================================
  */

window.addEventListener("DOMContentLoaded", function () {

document.body.classList.add("fade-in-steps");

});

window.addEventListener("load", function () {

const loader =
document.getElementById("loader");

const loginScreen =
document.getElementById("login-screen");

const biosScreen =
document.getElementById("bios-screen");

if (!loader || !loginScreen) {


console.error(
  "Missing #loader or #login-screen"
);

return;


}

/*

* ---
* STEP 1
*
* BIOS GIF is already covering the XP loader.
*
* Wait 10 seconds.
* ---

*/

setTimeout(function () {


/*
 * Remove BIOS.
 *
 * The Windows XP loader underneath becomes visible.
 */

if (biosScreen) {
  biosScreen.remove();
}


/*
 * -----------------------------------------------------
 * STEP 2
 *
 * Let the REAL Windows XP loader run.
 *
 * This is the original 4-second timer.
 * -----------------------------------------------------
 */

setTimeout(function () {

  /*
   * Hide XP loader.
   */

  loader.style.display = "none";


  /*
   * ---------------------------------------------------
   * STEP 3
   *
   * Black screen.
   * ---------------------------------------------------
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
   * Wait one second.
   */

  setTimeout(function () {

    /*
     * -------------------------------------------------
     * STEP 4
     *
     * Startup transition.
     * -------------------------------------------------
     */

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
     * Load your existing startup transition.
     */

    fetch(
      "/Loader_Login/Startup_Transition.html"
    )

      .then(function (response) {

        if (!response.ok) {
          throw new Error(
            "HTTP " + response.status
          );
        }

        return response.text();

      })

      .then(function (html) {

        transitionDiv.innerHTML =
          html;


        /*
         * ------------------------------------------------
         * STEP 5
         *
         * Show login screen after transition.
         * ------------------------------------------------
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

}, 4000);


}, 10000);

});

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
* GUEST LOGIN
* =========================================================
  */

let hasLoggedInAsGuest = false;

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

/*

* This redirect ONLY happens when
* the user actually logs in.
  */

setTimeout(function () {


window.location.href =
  "/Bureau/Bureau.html";


}, 1000);

}

/*

* =========================================================
* KEYBOARD / USER SELECTION
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



/*
 * ENTER
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
 * ARROW KEYS
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



/*
 * Make sure user list exists.
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
 * USER LIST HOVER
 */

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



/*
 * INDIVIDUAL USER HOVER
 */

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
 * USER IMAGE BORDER
 */

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



/*
 * GUEST MOUSE DOWN
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
 * USER SELECTION
 */

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

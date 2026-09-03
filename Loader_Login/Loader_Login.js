
window.addEventListener("DOMContentLoaded", function () {
  const loader = document.getElementById("loader");
  const loginScreen = document.getElementById("login-screen");

  if (!loader || !loginScreen) {
    console.error("Missing #loader or #login-screen");
    return;
  }

  // Keep the login screen hidden until everything is finished.
  loginScreen.classList.add("hidden");

  // Remember the loader's normal display value.
  const originalLoaderDisplay = getComputedStyle(loader).display;

  // Hide the XP loader while BIOS is playing.
  loader.style.display = "none";

  // Create BIOS screen if it doesn't already exist.
  let biosScreen = document.getElementById("bios-screen");

  if (!biosScreen) {
    biosScreen = document.createElement("div");
    biosScreen.id = "bios-screen";

    Object.assign(biosScreen.style, {
      position: "fixed",
      inset: "0",
      zIndex: "99999",
      backgroundImage: 'url("assets/biosgif.gif")',
      backgroundSize: "55% auto",
      backgroundPosition: "top left",
      backgroundRepeat: "no-repeat",
      backgroundColor: "black"
    });

    document.body.appendChild(biosScreen);
  }

  /*
   * ============================================================
   * BIOS
   * ============================================================
   * BIOS stays on screen for exactly 10 seconds.
   */
  setTimeout(() => {
    if (biosScreen) {
      biosScreen.remove();
    }

    /*
     * ============================================================
     * START XP LOADER
     * ============================================================
     *
     * Showing it now causes its CSS animations to start NOW,
     * instead of running underneath the BIOS screen.
     */
    loader.style.display = originalLoaderDisplay;

    // Force all XP animations to restart from frame 0.
    const animatedElements = loader.querySelectorAll("*");

    animatedElements.forEach((element) => {
      element.style.animation = "none";
      void element.offsetWidth;
      element.style.animation = "";
    });

    // Also restart the loader itself if it has an animation.
    loader.style.animation = "none";
    void loader.offsetWidth;
    loader.style.animation = "";

    /*
     * ============================================================
     * XP LOADER DURATION
     * ============================================================
     *
     * Original XP loader duration = 4 seconds.
     */
    setTimeout(() => {
      loader.style.display = "none";

      /*
       * ============================================================
       * BLACK SCREEN
       * ============================================================
       */
      const blackScreen = document.createElement("div");

      Object.assign(blackScreen.style, {
        position: "fixed",
        inset: "0",
        background: "black",
        zIndex: "10000",
        opacity: "1"
      });

      document.body.appendChild(blackScreen);

      /*
       * ============================================================
       * STARTUP TRANSITION
       * ============================================================
       */
      setTimeout(() => {
        const transitionDiv = document.createElement("div");

        transitionDiv.id = "transition-screen";

        Object.assign(transitionDiv.style, {
          position: "fixed",
          inset: "0",
          zIndex: "10001",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "black"
        });

        document.body.appendChild(transitionDiv);

        blackScreen.remove();

        fetch("/Loader_Login/Startup_Transition.html")
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `HTTP ${response.status}: ${response.statusText}`
              );
            }

            return response.text();
          })
          .then((html) => {
            transitionDiv.innerHTML = html;

            setTimeout(() => {
              transitionDiv.remove();
              loginScreen.classList.remove("hidden");
            }, 800);
          })
          .catch((error) => {
            console.error(
              "Failed to load startup transition:",
              error
            );

            transitionDiv.remove();
            loginScreen.classList.remove("hidden");
          });
      }, 1000);
    }, 4000);
  }, 10000);
});


/*
 * ============================================================
 * FADE-IN
 * ============================================================
 */
window.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("fade-in-steps");
});


/*
 * ============================================================
 * SWITCH USER
 * ============================================================
 */
function switchUserLogOn() {
  localStorage.setItem("fromSwitchUser", "1");
  window.location.href = "/Bureau/Bureau.html";
}


/*
 * ============================================================
 * GUEST LOGIN
 * ============================================================
 */
let hasLoggedInAsGuest = false;

function loginAsGuest() {
  if (hasLoggedInAsGuest) return;

  hasLoggedInAsGuest = true;

  const leftSection = document.getElementById("left-section");
  const rightText = document.getElementById("right-text");
  const leftPanel = document.getElementById("left-panel");
  const userList = document.getElementById("user-list");
  const guestUser = document.getElementById("guest-user");

  if (
    !leftSection ||
    !rightText ||
    !leftPanel ||
    !userList ||
    !guestUser
  ) {
    console.error("Required login elements are missing.");
    hasLoggedInAsGuest = false;
    return;
  }

  const guestSpan = guestUser.querySelector("span");

  leftPanel.innerHTML = `<p>welcome</p>`;
  leftPanel.style.paddingTop = "18%";

  const leftPanelP = leftPanel.querySelector("p");

  if (leftPanelP) {
    Object.assign(leftPanelP.style, {
      fontSize: "5rem",
      fontFamily: "Arial, sans-serif",
      fontStyle: "italic",
      fontWeight: "bold",
      textShadow: "2px 3px #3454b4"
    });
  }

  if (guestSpan) {
    guestSpan.insertAdjacentHTML(
      "afterend",
      `<p>Loading your personal settings...</p>`
    );
  }

  userList.classList.add("is-padding-anim");
  userList.style.animation = "paddingTopLog 1s forwards";

  setTimeout(() => {
    userList.classList.remove("is-padding-anim");
  }, 1000);

  leftSection.style.display = "none";
  rightText.style.display = "none";

  guestUser.classList.remove("selected");

  setTimeout(() => {
    window.location.href = "/Bureau/Bureau.html";
  }, 1000);
}


/*
 * ============================================================
 * USER SELECTION
 * ============================================================
 */
document.addEventListener("DOMContentLoaded", function () {
  const userList = document.getElementById("user-list");
  const users = document.querySelectorAll(".user");

  let selectedIndex = null;
  let hasArrowBeenUsed = false;

  function updateUserSelection(index) {
    users.forEach((user, i) => {
      user.classList.toggle("selected", i === index);
    });
  }

  updateUserSelection(selectedIndex);

  /*
   * ENTER
   */
  document.addEventListener("keydown", function (e) {
    const guestUser = document.getElementById("guest-user");

    if (!guestUser) return;

    if (
      e.key === "Enter" &&
      guestUser.classList.contains("selected")
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
  });

  /*
   * ARROW NAVIGATION
   */
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!hasArrowBeenUsed) {
        selectedIndex = 0;
        updateUserSelection(selectedIndex);
        hasArrowBeenUsed = true;

        users.forEach((user, i) => {
          if (i === selectedIndex) {
            user.style.opacity = "1";
            user.style.animation = "";
          } else {
            user.style.opacity = "0.5";
            user.style.animation =
              "glitchOpacityReverse 0.4s steps(5, end)";
          }
        });

        e.preventDefault();
        return;
      }
    }

    if (hasArrowBeenUsed) {
      if (e.key === "ArrowDown") {
        if (selectedIndex < users.length - 1) {
          selectedIndex++;
          updateUserSelection(selectedIndex);

          users.forEach((user, i) => {
            if (i === selectedIndex) {
              user.style.opacity = "1";
              user.style.animation = "";
            } else {
              user.style.opacity = "0.5";
              user.style.animation =
                "glitchOpacityReverse 0.4s steps(5, end)";
            }
          });
        }

        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        if (selectedIndex > 0) {
          selectedIndex--;
          updateUserSelection(selectedIndex);

          users.forEach((user, i) => {
            if (i === selectedIndex) {
              user.style.opacity = "1";
              user.style.animation = "";
            } else {
              user.style.opacity = "0.5";
              user.style.animation =
                "glitchOpacityReverse 0.4s steps(5, end)";
            }
          });
        }

        e.preventDefault();
      }
    }
  });

  if (!userList || users.length === 0) {
    console.error("Element '#user-list' or '.user' missing!");
    return;
  }

  /*
   * MOUSE ENTER
   */
  userList.addEventListener("mouseenter", function () {
    const hasSelected = Array.from(users).some((user) =>
      user.classList.contains("selected")
    );

    if (hasSelected) return;

    users.forEach((user) => {
      user.style.opacity = "0.5";
      user.style.animation =
        "glitchOpacityReverse 0.4s steps(5, end)";
    });
  });

  /*
   * MOUSE LEAVE
   */
  userList.addEventListener("mouseleave", function () {
    const hasSelected = Array.from(users).some((user) =>
      user.classList.contains("selected")
    );

    if (hasSelected) return;

    users.forEach((user) => {
      user.style.opacity = "1";
      user.style.animation =
        "glitchOpacity 0.4s steps(5, end)";
    });
  });

  /*
   * USER HOVER
   */
  users.forEach((user) => {
    user.addEventListener("mouseenter", function () {
      user.style.opacity = "1";
      user.style.animation = "";
    });

    user.addEventListener("mouseleave", function () {
      if (user.classList.contains("selected")) {
        user.style.opacity = "1";
        user.style.animation = "";
      } else {
        if (
          userList.matches(":hover") &&
          !userList.classList.contains("is-padding-anim")
        ) {
          user.style.opacity = "0.5";
          user.style.animation =
            "glitchOpacityReverse 0.4s steps(5, end)";
        }
      }
    });
  });

  /*
   * USER IMAGE BORDER
   */
  users.forEach((user) => {
    const userimg = user.querySelector("img");

    if (userimg) {
      user.addEventListener("mouseenter", function () {
        userimg.style.border = "2px solid #bfa304";
      });

      user.addEventListener("mouseleave", function () {
        userimg.style.border = "2px solid white";
      });
    }
  });

  /*
   * GUEST MOUSEDOWN
   */
  const guestUser = document.getElementById("guest-user");

  if (guestUser) {
    guestUser.addEventListener("mousedown", function () {
      const guestP = guestUser.querySelector("p");

      if (guestP) {
        guestP.style.color = "white";
      }
    });
  }

  /*
   * USER CLICK
   */
  users.forEach((user) => {
    user.addEventListener("mousedown", function () {
      users.forEach((u) => u.classList.remove("selected"));
      this.classList.add("selected");
    });

    user.addEventListener("mouseup", function () {
      users.forEach((u) => u.classList.remove("selected"));
      this.style.opacity = "1";
    });

    document.addEventListener("click", () => {
      user.classList.remove("selected");
      hasArrowBeenUsed = false;
      user.style.opacity = "1";
    });
  });
});


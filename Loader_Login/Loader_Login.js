// ================================
// Loader_Login.js
// ================================

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const loginScreen = document.getElementById("login-screen");

  if (!loader || !loginScreen) {
    console.error("Loader or login screen not found.");
    return;
  }

  // Hide the original loader and login screen
  // while BIOS is running.
  loader.style.display = "none";
  loginScreen.classList.add("hidden");

  // BIOS → FULL-SCREEN GIF → ORIGINAL #loader
  showComputerInfoScreen(loader);
});


// ==================================================
// BIOS SCREEN
// ==================================================

function showComputerInfoScreen(loader) {
  const biosScreen = document.createElement("div");

  biosScreen.id = "bios-screen";

  Object.assign(biosScreen.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    margin: "0",
    padding: "30px",
    boxSizing: "border-box",
    background: "#000",
    color: "#fff",
    fontFamily: "monospace",
    fontSize: "16px",
    lineHeight: "1.5",
    zIndex: "999999",
    overflow: "hidden"
  });

  biosScreen.innerHTML = `
    <div>
      <div>American Megatrends</div>
      <div>Copyright (C) 1985-2005, American Megatrends, Inc.</div>
      <br>

      <div>BIOS Date: 04/21/05</div>
      <div>CPU: Intel(R) Pentium(R) 4 CPU</div>
      <div>Memory Test: 640K OK</div>
      <br>

      <div>Detecting Primary Master ...</div>
      <div>Detecting Primary Slave ...</div>
      <div>Detecting Secondary Master ...</div>
      <div>Detecting Secondary Slave ...</div>
      <br>

      <div>USB Device(s): 1 Keyboard, 1 Mouse</div>
      <br>

      <div>Press DEL to enter SETUP</div>
      <br>

      <div>Starting Windows...</div>
    </div>
  `;

  document.body.appendChild(biosScreen);

  // BIOS duration
  setTimeout(() => {
    biosScreen.style.transition = "opacity 300ms ease";
    biosScreen.style.opacity = "0";

    setTimeout(() => {
      biosScreen.remove();

      // BIOS → FULL-SCREEN GIF
      showGifScreenBeforeLoader(loader);
    }, 300);

  }, 3500);
}


// ==================================================
// FULL-SCREEN GIF
// This takes the job of the NEW spinning screen.
// ==================================================

function showGifScreenBeforeLoader(loader) {
  const gifScreen = document.createElement("div");

  gifScreen.id = "startup-gif-screen";

  Object.assign(gifScreen.style, {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    width: "100vw",
    height: "100vh",
    margin: "0",
    padding: "0",
    border: "0",
    background: "#000",
    overflow: "hidden",
    zIndex: "999999",
    display: "block",
    opacity: "1"
  });

  const gif = document.createElement("img");

  gif.src = "/Assets/Windows95Happyyay.gif";
  gif.alt = "";

  Object.assign(gif.style, {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    width: "100vw",
    height: "100vh",
    margin: "0",
    padding: "0",
    border: "0",
    display: "block",
    objectFit: "cover"
  });

  gifScreen.appendChild(gif);
  document.body.appendChild(gifScreen);

  /*
   * Let the FULL-SCREEN GIF play first.
   * Then reveal the ORIGINAL #loader.
   */
  setTimeout(() => {
    gifScreen.style.transition = "opacity 500ms ease";
    gifScreen.style.opacity = "0";

    setTimeout(() => {
      gifScreen.remove();

      // GIF → ORIGINAL #loader
      showExistingLoader(loader);

    }, 500);

  }, 3000);
}


// ==================================================
// ORIGINAL LOADER
// KEEP #loader FROM index.html
// ==================================================

function showExistingLoader(loader) {
  // This is the ORIGINAL #loader.
  loader.style.display = "flex";
  loader.style.opacity = "1";

  /*
   * Give the original XP loader time to run.
   */
  setTimeout(() => {
    loader.style.transition = "opacity 700ms ease";
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
      loader.style.opacity = "1";
      loader.style.transition = "";

      // ORIGINAL LOADING SCREEN TRANSITION
      showLoadingScreenTransition();

    }, 700);

  }, 4000);
}


// ==================================================
// LOADING SCREEN TRANSITION
// ==================================================

function showLoadingScreenTransition() {
  fetch("/Loader_Login/Startup_Transition.html")
    .then(response => {
      if (!response.ok) {
        throw new Error(
          `Failed to load Startup_Transition.html: ${response.status}`
        );
      }

      return response.text();
    })
    .then(html => {
      const transition = document.createElement("div");

      transition.id = "loading-screen-transition";

      Object.assign(transition.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        margin: "0",
        padding: "0",
        zIndex: "999998",
        opacity: "1"
      });

      transition.innerHTML = html;

      document.body.appendChild(transition);

      /*
       * Let the existing transition play.
       */
      setTimeout(() => {
        transition.style.transition = "opacity 700ms ease";
        transition.style.opacity = "0";

        setTimeout(() => {
          transition.remove();

          // Transition → BLACK FADE
          showBlackFadeIn();

        }, 700);

      }, 800);
    })
    .catch(error => {
      console.error("Loading screen transition error:", error);

      // If the transition cannot load,
      // continue with the startup sequence.
      showBlackFadeIn();
    });
}


// ==================================================
// BLACK FADE
// ==================================================

function showBlackFadeIn() {
  const blackOverlay = document.createElement("div");

  blackOverlay.id = "startup-black-fade";

  Object.assign(blackOverlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    margin: "0",
    padding: "0",
    background: "#000",
    zIndex: "999999",
    opacity: "1",
    display: "block"
  });

  document.body.appendChild(blackOverlay);

  /*
   * Keep the screen black briefly,
   * then reveal the GIF underneath.
   */
  setTimeout(() => {
    showGifScreen(blackOverlay);
  }, 250);
}


// ==================================================
// EXISTING GIF STAGE
// ==================================================

function showGifScreen(blackOverlay) {
  const gifScreen = document.createElement("div");

  gifScreen.id = "gif-screen";

  Object.assign(gifScreen.style, {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    width: "100vw",
    height: "100vh",
    margin: "0",
    padding: "0",
    border: "0",
    background: "#000",
    overflow: "hidden",
    zIndex: "999998",
    display: "block",
    opacity: "1"
  });

  const gif = document.createElement("img");

  gif.src = "/Assets/Windows95Happyyay.gif";
  gif.alt = "";

  Object.assign(gif.style, {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    width: "100vw",
    height: "100vh",
    margin: "0",
    padding: "0",
    border: "0",
    display: "block",
    objectFit: "cover"
  });

  gifScreen.appendChild(gif);
  document.body.appendChild(gifScreen);

  /*
   * Fade the black overlay away so the GIF appears
   * through the black fade.
   */
  requestAnimationFrame(() => {
    blackOverlay.style.transition = "opacity 1000ms ease";
    blackOverlay.style.opacity = "0";

    setTimeout(() => {
      blackOverlay.remove();
    }, 1000);
  });

  /*
   * Let the GIF play.
   * Then fade it out and show the ORIGINAL login screen.
   */
  setTimeout(() => {
    gifScreen.style.transition = "opacity 500ms ease";
    gifScreen.style.opacity = "0";

    setTimeout(() => {
      gifScreen.remove();

      showLoginScreen();

    }, 500);

  }, 3000);
}


// ==================================================
// LOGIN SCREEN
// ==================================================

function showLoginScreen() {
  const loginScreen = document.getElementById("login-screen");

  if (!loginScreen) {
    console.error("Login screen not found.");
    return;
  }

  loginScreen.classList.remove("hidden");

  loginScreen.style.opacity = "0";
  loginScreen.style.display = "block";

  requestAnimationFrame(() => {
    loginScreen.style.transition = "opacity 500ms ease";
    loginScreen.style.opacity = "1";
  });
}


// ==================================================
// LOGIN / USER SELECTION
// ==================================================

function switchUserLogOn() {
  const guestUser = document.getElementById("guest-user");

  if (guestUser) {
    guestUser.click();
  }
}


function loginAsGuest() {
  const loginScreen = document.getElementById("login-screen");

  if (!loginScreen) {
    return;
  }

  loginScreen.style.transition = "opacity 500ms ease";
  loginScreen.style.opacity = "0";

  setTimeout(() => {
    loginScreen.classList.add("hidden");
    loginScreen.style.display = "none";

    /*
     * Desktop is handled by the existing Bureau system.
     */
    if (typeof showDesktop === "function") {
      showDesktop();
    }

  }, 500);
}


// ==================================================
// KEYBOARD / MOUSE USER SELECTION
// ==================================================

document.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    const loginScreen = document.getElementById("login-screen");

    if (
      loginScreen &&
      !loginScreen.classList.contains("hidden")
    ) {
      switchUserLogOn();
    }
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const guestUser = document.getElementById("guest-user");

  if (!guestUser) {
    return;
  }

  guestUser.addEventListener("mouseenter", () => {
    guestUser.classList.add("selected");
  });

  guestUser.addEventListener("mouseleave", () => {
    guestUser.classList.remove("selected");
  });
});

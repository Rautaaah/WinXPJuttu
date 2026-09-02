
/* =========================================
   WINDOWS XP PORTFOLIO
   LOADER + LOGIN SCRIPT

   STARTUP ORDER:

   COMMAND PROMPT
        ↓
   WINDOWS 95 GIF
        ↓
   WINDOWS XP BOOT SCREEN
        ↓
   WINDOWS XP LOGIN SCREEN
   ========================================= */


/* =========================================
   STARTUP SEQUENCE
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const consoleScreen = document.getElementById("preboot-console");
  const consoleOutput = document.getElementById("console-output");

  const gifScreen = document.getElementById("preboot-gif");

  const loader = document.getElementById("loader");

  const loginScreen = document.getElementById("login-screen");


  /* -----------------------------------------
     CHECK REQUIRED ELEMENTS
     ----------------------------------------- */

  if (
    !consoleScreen ||
    !consoleOutput ||
    !gifScreen ||
    !loader ||
    !loginScreen
  ) {
    console.error(
      "STARTUP ERROR: One or more startup elements are missing."
    );

    return;
  }


  /* -----------------------------------------
     FORCE INITIAL STATE
     ----------------------------------------- */

  // Command prompt: visible
  consoleScreen.classList.remove("hidden");
  consoleScreen.style.display = "block";
  consoleScreen.style.opacity = "1";
  consoleScreen.style.visibility = "visible";

  // GIF: hidden
  gifScreen.classList.add("hidden");
  gifScreen.style.display = "none";

  // XP boot screen: hidden
  loader.classList.add("hidden");
  loader.style.display = "none";

  // Login screen: hidden
  loginScreen.classList.add("hidden");
  loginScreen.style.display = "none";


  /* -----------------------------------------
     COMMAND PROMPT CONTENT
     ----------------------------------------- */

  const lines = [

    "RAUTATIENTORI BIOS v95.09",

    "",

    "Copyright (C) RAUTATIENTORI Corporation",

    "",

    "Checking system hardware...",

    "",

    "CPU ......................... OK",
    "RAM ......................... OK",
    "GPU ......................... OK",
    "AUDIO ....................... OK",
    "STORAGE ..................... OK",
    "NETWORK ..................... OK",

    "",

    "Loading system services...",

    "Windows services ........... OK",
    "Webamp engine ............... OK",
    "Portfolio core .............. OK",
    "User profile ................ OK",

    "",

    "SYSTEM READY.",

    "",

    "Starting Windows XP..."

  ];


  /* -----------------------------------------
     COMMAND PROMPT TYPING
     ----------------------------------------- */

  let lineIndex = 0;


  function typeLine() {

    if (lineIndex >= lines.length) {

      /*
       * Finished typing.
       *
       * Wait a moment before moving
       * to the Windows 95 GIF.
       */

      setTimeout(() => {

        showWindows95();

      }, 800);

      return;
    }


    const line = document.createElement("div");

    line.className = "console-line";

    line.textContent = lines[lineIndex];

    consoleOutput.appendChild(line);


    lineIndex++;


    /*
     * Speed of each line.
     *
     * Lower = faster
     * Higher = slower
     */

    setTimeout(typeLine, 90);
  }


  /* -----------------------------------------
     COMMAND PROMPT → WINDOWS 95 GIF
     ----------------------------------------- */

  function showWindows95() {

    consoleScreen.style.display = "none";
    consoleScreen.classList.add("hidden");


    gifScreen.classList.remove("hidden");

    gifScreen.style.display = "flex";
    gifScreen.style.opacity = "1";
    gifScreen.style.visibility = "visible";


    /*
     * How long the Windows 95 GIF stays
     * on screen.
     *
     * 3000 = 3 seconds
     */

    setTimeout(() => {

      showXPBoot();

    }, 3000);
  }


  /* -----------------------------------------
     WINDOWS 95 GIF → WINDOWS XP BOOT
     ----------------------------------------- */

  function showXPBoot() {

    gifScreen.style.display = "none";
    gifScreen.classList.add("hidden");


    loader.classList.remove("hidden");

    loader.style.display = "flex";
    loader.style.opacity = "1";
    loader.style.visibility = "visible";


    /*
     * How long the XP boot screen stays.
     *
     * 4000 = 4 seconds
     */

    setTimeout(() => {

      showLogin();

    }, 4000);
  }


  /* -----------------------------------------
     WINDOWS XP BOOT → LOGIN SCREEN
     ----------------------------------------- */

  function showLogin() {

    loader.style.display = "none";
    loader.classList.add("hidden");


    loginScreen.classList.remove("hidden");

    loginScreen.style.display = "block";
    loginScreen.style.opacity = "1";
    loginScreen.style.visibility = "visible";

  }


  /* -----------------------------------------
     START COMMAND PROMPT
     ----------------------------------------- */

  typeLine();

});


/* =========================================
   LOGIN SCREEN
   ========================================= */


/*
 * Switch user / log-on animation
 */

function switchUserLogOn(userId) {

  const user = document.getElementById(userId);

  if (!user) {
    return;
  }


  user.classList.add("selected");


  setTimeout(() => {

    loginAsGuest();

  }, 500);
}


/* =========================================
   GUEST LOGIN
   ========================================= */

function loginAsGuest() {

  const loginScreen = document.getElementById("login-screen");

  if (!loginScreen) {
    return;
  }


  /*
   * Optional login animation.
   */

  loginScreen.classList.add("logging-in");


  /*
   * Give the login screen a moment before
   * continuing to the portfolio.
   */

  setTimeout(() => {

    /*
     * If your existing project already has
     * login functionality elsewhere, this
     * function can be expanded there.
     */

    window.location.href = "/Bureau/Bureau.html";

  }, 1000);

}


/* =========================================
   TURN OFF COMPUTER
   ========================================= */

function turnOffComputer() {

  /*
   * Hide everything.
   */

  const loginScreen =
    document.getElementById("login-screen");

  const loader =
    document.getElementById("loader");

  const gifScreen =
    document.getElementById("preboot-gif");

  const consoleScreen =
    document.getElementById("preboot-console");


  if (loginScreen) {
    loginScreen.style.display = "none";
  }

  if (loader) {
    loader.style.display = "none";
  }

  if (gifScreen) {
    gifScreen.style.display = "none";
  }

  if (consoleScreen) {
    consoleScreen.style.display = "none";
  }


  /*
   * Black shutdown screen.
   */

  document.body.style.background = "#000";

  document.body.innerHTML = "";


  const shutdownScreen =
    document.createElement("div");


  shutdownScreen.style.position = "fixed";
  shutdownScreen.style.inset = "0";

  shutdownScreen.style.background = "#000";

  shutdownScreen.style.color = "#aaa";

  shutdownScreen.style.display = "flex";

  shutdownScreen.style.alignItems = "center";

  shutdownScreen.style.justifyContent = "center";

  shutdownScreen.style.fontFamily =
    "Tahoma, Verdana, sans-serif";

  shutdownScreen.style.fontSize = "18px";


  shutdownScreen.textContent =
    "It is now safe to turn off your computer.";


  document.body.appendChild(shutdownScreen);

}


/* =========================================
   KEYBOARD SUPPORT
   ========================================= */

document.addEventListener("keydown", (event) => {

  /*
   * ENTER on the login screen
   * logs in as the guest user.
   */

  if (event.key === "Enter") {

    const loginScreen =
      document.getElementById("login-screen");


    if (
      loginScreen &&
      !loginScreen.classList.contains("hidden")
    ) {

      loginAsGuest();

    }

  }

});


/* =========================================
   MOUSE SUPPORT
   ========================================= */

document.addEventListener("click", (event) => {

  const user =
    event.target.closest(".user");


  if (!user) {
    return;
  }


  if (user.id === "guest-user") {

    loginAsGuest();

  }

});

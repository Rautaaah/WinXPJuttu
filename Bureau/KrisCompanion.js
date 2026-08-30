document.addEventListener("DOMContentLoaded", () => {
  const kris = document.getElementById("kris-companion");
  const desktop = document.getElementById("desktop");
  const dialogue = document.getElementById("kris-dialogue");
  const dialogueText = document.getElementById("kris-dialogue-text");

  if (!kris || !desktop) {
    console.warn("Kris Companion: missing #kris-companion or #desktop.");
    return;
  }

  let dragging = false;
  let pointerId = null;

  let offsetX = 0;
  let offsetY = 0;

  let dialogueTimer = null;

  const quotes = [
    "what are you doing.",
    "you opened that?",
    "wow.",
    "interesting.",
    "are you lost?",
    "i'm watching you.",
    "you really like clicking things.",
    "what are you looking for?",
    "this is productive.",
    "sure.",
    "...",
    "why are you still here?",
    "you've been here for a while.",
    "i saw that.",
    "stop clicking everything.",
    "okay.",
    "fascinating.",
    "you moved me.",
    "why did you move me?",
    "put me back.",
    "seriously?",
    "nice.",
    "windows xp.",
    "this website is weird.",
    "i'm just gonna stand here.",
    "you know i'm dancing, right?",
    "is this really what you're doing?",
    "you have too much free time.",
    "i'm judging you.",
    "..."
  ];

  const dragQuotes = [
    "hey.",
    "why are you moving me?",
    "put me down.",
    "seriously?",
    "where are we going?",
    "stop dragging me.",
    "i was comfortable there.",
    "bro.",
    "what are you doing?"
  ];

  const idleQuotes = [
    "are you still there?",
    "hello?",
    "you stopped moving.",
    "did you fall asleep?",
    "...",
    "i'm getting bored.",
    "you still there?",
    "what happened?"
  ];

  const windowQuotes = [
    "another window?",
    "oh, we're opening things now.",
    "what's in there?",
    "you really like windows.",
    "click click click.",
    "another one?"
  ];

  const startQuotes = [
    "the start menu again?",
    "what are you looking for?",
    "you already have a start menu.",
    "windows XP moment.",
    "what's in there?"
  ];

  function randomQuote(list = quotes) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function talk(message, duration = 3500) {
    if (!dialogue || !dialogueText) return;

    clearTimeout(dialogueTimer);

    dialogueText.textContent = message;
    dialogue.classList.remove("hidden");

    dialogueTimer = setTimeout(() => {
      dialogue.classList.add("hidden");
    }, duration);
  }

  /*
   * Public functions
   *
   * You can use:
   *
   * krisTalk("hello");
   * krisReact("window");
   * krisReact("start");
   */

  window.krisTalk = (message, duration) => {
    talk(message, duration);
  };

  window.krisReact = (type) => {
    switch (type) {
      case "drag":
        talk(randomQuote(dragQuotes), 1800);
        break;

      case "idle":
        talk(randomQuote(idleQuotes), 4000);
        break;

      case "window":
        talk(randomQuote(windowQuotes), 3500);
        break;

      case "start":
        talk(randomQuote(startQuotes), 3500);
        break;

      default:
        talk(randomQuote(), 3500);
        break;
    }
  };

  /*
   * Get Kris' position relative to the desktop.
   */

  function getPosition() {
    const krisRect = kris.getBoundingClientRect();
    const desktopRect = desktop.getBoundingClientRect();

    return {
      x: krisRect.left - desktopRect.left,
      y: krisRect.top - desktopRect.top
    };
  }

  /*
   * Keep Kris inside the desktop.
   */

  function clampPosition(x, y) {
    const maxX = Math.max(
      0,
      desktop.clientWidth - kris.offsetWidth
    );

    const maxY = Math.max(
      0,
      desktop.clientHeight - kris.offsetHeight
    );

    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    };
  }

  /*
   * Move Kris.
   */

  function moveKris(clientX, clientY) {
    const desktopRect = desktop.getBoundingClientRect();

    let x =
      clientX -
      desktopRect.left -
      offsetX;

    let y =
      clientY -
      desktopRect.top -
      offsetY;

    const position = clampPosition(x, y);

    kris.style.left = `${position.x}px`;
    kris.style.top = `${position.y}px`;
  }

  /*
   * Start dragging.
   */

  function startDragging(event) {
    if (dragging) return;

    /*
     * Only left mouse button.
     */
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    dragging = true;
    pointerId = event.pointerId;

    const krisRect = kris.getBoundingClientRect();

    offsetX = event.clientX - krisRect.left;
    offsetY = event.clientY - krisRect.top;

    kris.classList.add("dragging");

    /*
     * Capture the pointer so dragging doesn't break
     * when the cursor leaves Kris.
     */
    try {
      kris.setPointerCapture(pointerId);
    } catch (error) {
      // Pointer capture isn't supported everywhere.
    }

    talk(randomQuote(dragQuotes), 1800);

    event.preventDefault();
  }

  /*
   * Dragging.
   */

  function drag(event) {
    if (!dragging) return;

    if (
      pointerId !== null &&
      event.pointerId !== pointerId
    ) {
      return;
    }

    moveKris(event.clientX, event.clientY);

    event.preventDefault();
  }

  /*
   * Stop dragging.
   */

  function stopDragging(event) {
    if (!dragging) return;

    if (
      pointerId !== null &&
      event.pointerId !== undefined &&
      event.pointerId !== pointerId
    ) {
      return;
    }

    dragging = false;

    try {
      if (pointerId !== null) {
        kris.releasePointerCapture(pointerId);
      }
    } catch (error) {
      // Nothing to do.
    }

    pointerId = null;

    kris.classList.remove("dragging");

    savePosition();
  }

  /*
   * Pointer events work for:
   *
   * - Mouse
   * - Touch
   * - Pen
   */

  kris.addEventListener(
    "pointerdown",
    startDragging
  );

  document.addEventListener(
    "pointermove",
    drag,
    { passive: false }
  );

  document.addEventListener(
    "pointerup",
    stopDragging
  );

  document.addEventListener(
    "pointercancel",
    stopDragging
  );

  /*
   * Prevent the GIF from being dragged as an image.
   */

  const gif = document.getElementById("kris-gif");

  if (gif) {
    gif.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
  }

  /*
   * Save Kris' position.
   */

  function savePosition() {
    const position = getPosition();

    localStorage.setItem(
      "kris-companion-position",
      JSON.stringify({
        x: Math.round(position.x),
        y: Math.round(position.y)
      })
    );
  }

  /*
   * Restore Kris' position.
   */

  function restorePosition() {
    const saved =
      localStorage.getItem(
        "kris-companion-position"
      );

    if (!saved) return;

    try {
      const position = JSON.parse(saved);

      if (
        typeof position.x !== "number" ||
        typeof position.y !== "number"
      ) {
        return;
      }

      const safePosition =
        clampPosition(
          position.x,
          position.y
        );

      kris.style.left =
        `${safePosition.x}px`;

      kris.style.top =
        `${safePosition.y}px`;

    } catch (error) {
      console.warn(
        "Kris Companion: invalid saved position.",
        error
      );
    }
  }

  restorePosition();

  /*
   * If the browser window changes size,
   * make sure Kris doesn't end up outside
   * the desktop.
   */

  window.addEventListener(
    "resize",
    () => {

      const position = getPosition();

      const safePosition =
        clampPosition(
          position.x,
          position.y
        );

      kris.style.left =
        `${safePosition.x}px`;

      kris.style.top =
        `${safePosition.y}px`;

      savePosition();
    }
  );

  /*
   * First message.
   */

  setTimeout(() => {
    talk(
      "oh. you found me.",
      4000
    );
  }, 1200);

  /*
   * Random commentary.
   */

  function scheduleRandomComment() {
    const delay =
      12000 +
      Math.random() * 18000;

    setTimeout(() => {

      if (!dragging) {
        talk(
          randomQuote(),
          3500
        );
      }

      scheduleRandomComment();

    }, delay);
  }

  scheduleRandomComment();

  /*
   * Idle detection.
   */

  let lastActivity = Date.now();
  let alreadyIdle = false;

  function registerActivity() {
    lastActivity = Date.now();
    alreadyIdle = false;
  }

  document.addEventListener(
    "pointermove",
    registerActivity,
    { passive: true }
  );

  document.addEventListener(
    "pointerdown",
    registerActivity,
    { passive: true }
  );

  document.addEventListener(
    "keydown",
    registerActivity,
    { passive: true }
  );

  setInterval(() => {

    const idleTime =
      Date.now() - lastActivity;

    if (
      idleTime > 30000 &&
      !alreadyIdle &&
      !dragging
    ) {

      alreadyIdle = true;

      talk(
        randomQuote(idleQuotes),
        4000
      );
    }

  }, 5000);

});

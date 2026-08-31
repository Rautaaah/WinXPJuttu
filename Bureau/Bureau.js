let startMenuHTML = "";
let openWindowHTML = "";
let openLogOffHTML = "";
let turnOffComputerHTML = "";

let zIndexCounter = 1;
const savedZ = localStorage.getItem("zIndexCounter");
if (savedZ !== null) {
  zIndexCounter = parseInt(savedZ, 10);
}

let isResizingGlobal = false;

let currentTooltipContainer = null;
let currentLabel = null;

let recentlyClosedStartMenu = false;

let hoverTooltipMouseEnterHandler = null;
let hoverTooltipMouseLeaveHandler = null;

async function loadHTML(filePath) {
  const res = await fetch(filePath);
  if (!res.ok) throw new Error(`Loading error : ${filePath}`);
  return await res.text();
}

loadHTML("/Start_Menu/Base/Start_Menu.html")
  .then((html) => (startMenuHTML = html))
  .catch((error) => console.error("Failed to load Start Menu:", error));

loadHTML("/Open_Windows/Base/Open_Window.html")
  .then((html) => (openWindowHTML = html))
  .catch((error) => console.error("Failed to load base window template:", error));

loadHTML("/Start_Menu/Log_Off/Base/Log_Off.html")
  .then((html) => (openLogOffHTML = html))
  .catch((error) => console.error("Failed to load Log Off modal:", error));

loadHTML("/Start_Menu/Turn_Off_Computer/Turn_Off_Computer.html")
  .then((html) => (turnOffComputerHTML = html))
  .catch((error) => console.error("Failed to load Turn Off modal:", error));

function playSoundOnPage(path, defaultSoundPath, onLoadCallback) {
  if (window.location.pathname.endsWith(path)) {
    window.addEventListener("load", function () {
      let soundPath = defaultSoundPath;

      if (
        path === "/Bureau/Bureau.html" &&
        localStorage.getItem("fromSwitchUser") === "1"
      ) {
        soundPath = "/Assets/Sounds/Resume_Users.mp3";
        localStorage.removeItem("fromSwitchUser");
      }

      const guestUser = document.getElementById("guest-user");

      if (guestUser && guestUser.querySelector("#loaded")) {
        soundPath = "/Assets/Sounds/Resume_Users.mp3";
      }

      const audio = new Audio(soundPath);

      audio.play().catch((error) =>
        console.error("Audio error:", error)
      );

      if (typeof onLoadCallback === "function") {
        onLoadCallback();
      }
    });
  }
}

/*
 * Windows XP startup sound
 *
 * LinkedIn startup opening has been completely removed.
 */
playSoundOnPage(
  "/Bureau/Bureau.html",
  "/Assets/Sounds/windows-xp-startup.mp3"
);

playSoundOnPage(
  "/Start_Menu/Log_Off/Transition/Switch_User.html",
  "/Assets/Sounds/Switch_Users.mp3"
);

document.addEventListener("DOMContentLoaded", () => {
  updateTaskbarVisibility();

  function updateClock() {
    const now = new Date().toLocaleTimeString([], {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });

    const footerTime = document.getElementById("footer-time");

    if (footerTime) {
      footerTime.textContent = now;
    }
  }

  updateClock();
  setInterval(updateClock, 52000);

  const startBtn = document.getElementById("start-button");

  if (startBtn) {
    startBtn.addEventListener("mouseenter", () => {
      startBtn.src =
        "/Assets/Images/windows_xp_start_button_hover.png";
    });

    startBtn.addEventListener("mouseleave", () => {
      startBtn.src =
        "/Assets/Images/windows_xp_start_button_normal.png";
    });

    startBtn.addEventListener("mousedown", () => {
      startBtn.src =
        "/Assets/Images/windows_xp_start_button_onclick.png";
    });

    startBtn.addEventListener("mouseup", () => {
      const isHovering = startBtn.matches(":hover");

      startBtn.src = isHovering
        ? "/Assets/Images/windows_xp_start_button_hover.png"
        : "/Assets/Images/windows_xp_start_button_normal.png";
    });
  }
});

document.addEventListener("click", function (event) {
  const menu = document.getElementById("StartMenu");
  const startMenuBtn = document.querySelector(".footer__start_menu");

  if (
    menu &&
    startMenuBtn &&
    !menu.contains(event.target) &&
    !startMenuBtn.contains(event.target)
  ) {
    menu.remove();
  }
});

function openWindow(appName) {
  // The base window template loads asynchronously. If a user clicks an app
  // before it is ready, wait for it instead of creating an empty/broken window.
  if (!openWindowHTML) {
    loadHTML("/Open_Windows/Base/Open_Window.html")
      .then((html) => {
        openWindowHTML = html;
        openWindow(appName);
      })
      .catch((error) => {
        console.error("Unable to load the base window template:", error);
      });
    return;
  }

  let windowTooltipContainer = null;
  let windowCurrentLabel = null;

  createTaskbar();

  injectStyle(
    "bureau-styles",
    "/Open_Windows/Base/Open_Window.css"
  );

  injectStyle(
    "taskbar-styles",
    "/Bureau/Taskbar.css"
  );

  injectStyle(
    `window-${appName}`,
    `/Open_Windows/${appName}/${appName}.css`
  );

  const taskbar = document.getElementById("taskbar");

  if (document.getElementById(`window-${appName}`)) return;

  const windowElement = document.createElement("div");

  windowElement.id = `window-${appName}`;
  windowElement.classList.add("window");

  const personalizedHTML = openWindowHTML.replace(
    /\$\{appName\}/g,
    appName
  );

  windowElement.innerHTML = personalizedHTML;

  if (appName === "Minesweeper") {
    const maximazeButton = windowElement.querySelector(
      ".header-button--maximaze"
    );

    if (maximazeButton) {
      maximazeButton.removeAttribute("onclick");
      maximazeButton.disabled = true;
      maximazeButton.style.opacity = "0.5";
      maximazeButton.style.pointerEvents = "none";

      windowElement.style.width = "auto";
      windowElement.style.height = "auto";
    }
  } else {
    makeResizable(windowElement);

    const header = windowElement.querySelector(".window-header");

    if (header) {
      header.setAttribute(
        "ondblclick",
        `maximazeWindow('${appName}')`
      );
    }
  }

  if (appName === "Space Cadet Pinball") {
    windowElement.style.visibility = "hidden";
    windowElement.style.opacity = "0";
  }

  fetch(`/Open_Windows/${appName}/${appName}.html`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Fichier introuvable");
      }

      return response.text();
    })
    .then((htmlContent) => {
      const contentContainer =
        windowElement.querySelector(".window-content");

      if (contentContainer) {
        contentContainer.innerHTML = htmlContent;
      } else {
        windowElement.innerHTML = htmlContent;
      }

      const labelDivs = windowElement.querySelectorAll(
        ".drop_down_label, .Minesweeper_drop_down_label"
      );

      labelDivs.forEach((labelDiv) => {
        labelDiv.addEventListener("click", function () {
          if (
            windowTooltipContainer &&
            windowTooltipContainer.parentNode
          ) {
            windowTooltipContainer.removeAttribute(
              "data-tooltip-initialized"
            );

            windowTooltipContainer.parentNode.removeChild(
              windowTooltipContainer
            );

            windowTooltipContainer = null;
          }

          windowCurrentLabel = labelDiv;

          const fileName = labelDiv.textContent.trim();

          fetch(
            `/Open_Windows/${appName}/Tooltip/${fileName}.html`
          )
            .then((response) => response.text())
            .then((htmlContent) => {
              const container = document.createElement("div");

              container.className = "window-tooltip";
              container.innerHTML = htmlContent;

              observeMinesweeperTooltipLoad();
              observeSecondaryTooltipRows(appName);

              labelDiv.parentNode.insertBefore(
                container,
                labelDiv.nextSibling
              );

              windowTooltipContainer = container;

              const closeDivs =
                container.querySelectorAll(".drop-down__text");

              closeDivs.forEach((div) => {
                const txt = div.textContent
                  .trim()
                  .toLowerCase();

                if (txt === "close" || txt === "exit") {
                  div.setAttribute(
                    "onclick",
                    `closeWindow('${appName}')`
                  );
                }
              });
            })
            .catch((err) => {
              console.error(
                "Erreur de chargement du fichier HTML:",
                err
              );
            });
        });

        labelDiv.addEventListener("mouseenter", function () {
          if (!windowTooltipContainer) return;
          if (windowCurrentLabel === labelDiv) return;

          if (
            windowTooltipContainer &&
            windowTooltipContainer.parentNode
          ) {
            windowTooltipContainer.removeAttribute(
              "data-tooltip-initialized"
            );

            windowTooltipContainer.parentNode.removeChild(
              windowTooltipContainer
            );

            windowTooltipContainer = null;
          }

          windowCurrentLabel = labelDiv;

          const fileName = labelDiv.textContent.trim();

          fetch(
            `/Open_Windows/${appName}/Tooltip/${fileName}.html`
          )
            .then((response) => response.text())
            .then((htmlContent) => {
              const container = document.createElement("div");

              container.className = "window-tooltip";
              container.innerHTML = htmlContent;

              observeMinesweeperTooltipLoad();
              observeSecondaryTooltipRows(appName);

              labelDiv.parentNode.insertBefore(
                container,
                labelDiv.nextSibling
              );

              windowTooltipContainer = container;

              const closeDivs =
                container.querySelectorAll(".drop-down__text");

              closeDivs.forEach((div) => {
                const txt = div.textContent
                  .trim()
                  .toLowerCase();

                if (txt === "close" || txt === "exit") {
                  div.setAttribute(
                    "onclick",
                    `closeWindow('${appName}')`
                  );
                }
              });
            })
            .catch((err) => {
              console.error(
                "Erreur de chargement du fichier HTML:",
                err
              );
            });
        });
      });

      windowElement.addEventListener("mousedown", function (event) {
        const isOnLabel = Array.from(labelDivs).some((label) =>
          label.contains(event.target)
        );

        const isOnTooltip =
          windowTooltipContainer &&
          windowTooltipContainer.contains(event.target);

        if (
          !isOnLabel &&
          !isOnTooltip &&
          windowTooltipContainer
        ) {
          if (
            windowTooltipContainer &&
            windowTooltipContainer.parentNode
          ) {
            windowTooltipContainer.removeAttribute(
              "data-tooltip-initialized"
            );

            windowTooltipContainer.parentNode.removeChild(
              windowTooltipContainer
            );

            windowTooltipContainer = null;
            windowCurrentLabel = null;
          }
        }
      });
    })
    .catch((error) => {
      console.error("Erreur de chargement :", error);
    });

  document.body.appendChild(windowElement);

  windowElement.style.top = "115px";
  windowElement.style.left = "115px";

  makeDraggable(windowElement);

  if (!document.getElementById(`taskbar-${appName}`)) {
    const taskbarItem = document.createElement("div");

    taskbarItem.id = `taskbar-${appName}`;
    taskbarItem.classList.add("taskbar-item");

    taskbarItem.innerHTML = `
      <img
        src="/Assets/Windows XP High Resolution Icon Pack avec MAOSX/Windows XP High Resolution Icon Pack/Windows XP Icons/${appName}.png"
        width="16"
      >
      <span>${appName}</span>
    `;

    taskbarItem.onmousedown = () =>
      toggleWindow(appName);

    taskbar.appendChild(taskbarItem);
  }

  window.addEventListener("mousedown", function (event) {
    const windowEl = windowElement;

    if (!windowEl) return;

    const isInWindow = windowEl.contains(event.target);

    const isInTooltip =
      windowTooltipContainer &&
      windowTooltipContainer.contains(event.target);

    if (
      !isInWindow &&
      !isInTooltip &&
      windowTooltipContainer
    ) {
      windowTooltipContainer.removeAttribute(
        "data-tooltip-initialized"
      );

      windowTooltipContainer.remove();

      windowTooltipContainer = null;
      windowCurrentLabel = null;
    }
  });
}

function observeSecondaryTooltipRows(appName) {
  const windowElement = document.getElementById(
    `window-${appName}`
  );

  if (!windowElement) return;

  const observer = new MutationObserver(() => {
    const tooltipWindows = Array.from(
      windowElement.querySelectorAll(
        ".window-tooltip:not([data-tooltip-initialized])"
      )
    ).filter((el) => el.offsetParent !== null);

    tooltipWindows.forEach((tooltipWindow) => {
      tooltipWindow.setAttribute(
        "data-tooltip-initialized",
        "true"
      );

      const dropDownRows =
        tooltipWindow.querySelectorAll(".drop-down__row");

      let windowSecondTooltip = null;
      let windowSecondCurrentRow = null;

      dropDownRows.forEach((row) => {
        row.addEventListener("mouseenter", function () {
          const textDiv =
            row.querySelector(".drop-down__text");

          if (!textDiv) return;

          const fileName = textDiv.textContent.trim();

          if (windowSecondCurrentRow === row) return;

          if (windowSecondTooltip?.parentNode) {
            windowSecondTooltip.parentNode.removeChild(
              windowSecondTooltip
            );

            windowSecondTooltip = null;
          }

          windowSecondCurrentRow = row;

          const allowedTooltips = [
            "Encoding",
            "Explorer Bar",
            "Go to",
            "Mail and News",
            "New",
            "Send",
            "Text Size",
            "Toolbars",
            "Arrange Icons by",
            "Links",
            "Pop-up Blocker",
          ];

          if (!allowedTooltips.includes(fileName)) return;

          fetch(
            `/Open_Windows/${appName}/Sub_Tooltip/${fileName}.html`
          )
            .then((response) => {
              if (!response.ok) {
                if (response.status === 404) return null;

                throw new Error(
                  `Erreur HTTP: ${response.status}`
                );
              }

              return response.text();
            })
            .then((htmlContent) => {
              if (!htmlContent) return;

              const container =
                document.createElement("div");

              container.className =
                "window-Sub_tooltip";

              container.innerHTML = htmlContent;

              const tooltipWindow =
                row.closest(".window-tooltip");

              if (!tooltipWindow) return;

              const reference =
                row.querySelector(".drop-down__text");

              const referenceRect =
                reference.getBoundingClientRect();

              const parentRect =
                tooltipWindow.getBoundingClientRect();

              const offsetX =
                referenceRect.left - parentRect.left;

              const offsetY =
                referenceRect.bottom -
                parentRect.top +
                5;

              container.style.position = "absolute";

              container.style.left =
                `${offsetX + 110}px`;

              container.style.top =
                `${offsetY - 5}px`;

              tooltipWindow.appendChild(container);

              windowSecondTooltip = container;
            })
            .catch(() => {});
        });
      });
    });
  });

  observer.observe(windowElement, {
    childList: true,
    subtree: true,
  });
}

function updateCheckmarkInTooltip() {
  const selectedLevel =
    localStorage.getItem("SelectedLevel");

  if (!selectedLevel) return;

  const minesweeperMenu =
    document.querySelector(".Minesweeper_drop_down");

  if (!minesweeperMenu) return;

  const rows =
    minesweeperMenu.querySelectorAll(".drop-down__row");

  rows.forEach((row) => {
    const checkContainer =
      row.querySelector(".drop-down__check");

    const textContainer =
      row.querySelector(".drop-down__text");

    if (!checkContainer || !textContainer) return;

    checkContainer.innerHTML = "";

    const levelText =
      textContainer.textContent.trim().toLowerCase();

    const selectedText =
      selectedLevel.trim().toLowerCase();

    if (levelText === selectedText) {
      const img = document.createElement("img");

      img.src =
        "/Assets/Images/Tooltip_CheckMark.png";

      img.alt = "Check Mark";

      checkContainer.appendChild(img);
    }
  });
}

function observeMinesweeperTooltipLoad() {
  const observer = new MutationObserver(() => {
    const tooltip = document.querySelector(
      ".Minesweeper_drop_down"
    );

    if (tooltip) {
      updateCheckmarkInTooltip();
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function openRawWinamp() {
  if (
    document.getElementById("app") ||
    document.getElementById("webamp")
  ) {
    return;
  }

  const winampDiv =
    document.createElement("div");

  winampDiv.id = "app";

  winampDiv.style.position = "absolute";
  winampDiv.style.left = "0";
  winampDiv.style.top = "0";

  document.body.appendChild(winampDiv);

  const script =
    document.createElement("script");

  script.src =
    "https://unpkg.com/webamp@latest/built/webamp.bundle.min.js";

  script.onload = () => {
    if (typeof Webamp === "undefined") {
      console.error("Webamp is not loaded!");
      if (winampDiv.parentNode) winampDiv.remove();
      return;
    }

// Clear Webamp's saved playlist/state so it starts fresh
localStorage.removeItem("webamp");
sessionStorage.removeItem("webamp");

const webamp = new Webamp({
  initialTracks: [
    {
      metaData: {
        artist: "Aikakone",
        title: "Anna mun bailaa",
      },
      url: "/Assets/Sounds/Anna mun bailaa.mp3",
    },
    {
      metaData: {
        artist: "Aikakone",
        title: "Odota",
      },
      url: "/Assets/Sounds/Odota.mp3",
    },
    {
      metaData: {
        artist: "Movetron",
        title: "Romeo Ja Julia (Original Mix)",
      },
      url: "/Assets/Sounds/Romeo Ja Julia (Original Mix).mp3",
    },
        {
      metaData: {
        artist: "Evangelion Finally",
        title: "KOMM, SUSSER TOD M-10 Director's Edit Version",
      },
      url: "/Assets/Sounds/KOMM, SUSSER TOD M-10 Directors Edit Version _ Evangelion Finally.mp3",
    },
  ],
});

webamp.renderWhenReady(winampDiv).then(() => {
  const initializeWebampWindow = () => {
    const webampWindow = document.getElementById("webamp");
    if (!webampWindow) return false;

    zIndexCounter++;
    webampWindow.style.zIndex = String(zIndexCounter);
    webampWindow.classList.add("window", "no-bg");

    // Webamp can add/remove its own inactive classes. Keep the visible window
    // from inheriting the desktop's inactive-window appearance.
    const normalizeClasses = () => {
      webampWindow.classList.remove("window-inactive");
      webampWindow.querySelectorAll(".window-inactive").forEach((el) => {
        el.classList.remove("window-inactive");
        el.style.setProperty("background-color", "transparent", "important");
      });
    };

    normalizeClasses();

    const classObserver = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.type === "attributes" && mutation.attributeName === "class")) {
        normalizeClasses();
      }
    });

    classObserver.observe(webampWindow, {
      attributes: true,
      subtree: true,
      attributeFilter: ["class"],
    });

    webampWindow.addEventListener("mousedown", () => {
      zIndexCounter++;
      webampWindow.style.zIndex = String(zIndexCounter);
      updateTaskbarHighlight();
    });

    updateTaskbarHighlight();
    return true;
  };

  // renderWhenReady() may resolve after Webamp has already inserted #webamp,
  // so check immediately first. Only observe the body if it is not there yet.
  if (!initializeWebampWindow()) {
    const observer = new MutationObserver(() => {
      if (initializeWebampWindow()) observer.disconnect();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => observer.disconnect(), 10000);
  }
}).catch((error) => {
  console.error("Webamp failed to render:", error);
  if (winampDiv.parentNode) winampDiv.remove();
  updateTaskbarHighlight();
});


    webamp.onClose(() => {
      if (taskbarItem) taskbarItem.remove();

      if (winampDiv.parentNode) {
        winampDiv.parentNode.removeChild(winampDiv);
      }

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }

      const webampContainer =
        document.getElementById("webamp");

      if (
        webampContainer &&
        webampContainer.parentNode
      ) {
        webampContainer.parentNode.removeChild(
          webampContainer
        );
      }
    });

    setTimeout(() => {
      const closeBtn =
        document.getElementById("close");

      if (closeBtn) {
        closeBtn.addEventListener(
          "click",
          () => {
            if (winampDiv.parentNode) {
              winampDiv.parentNode.removeChild(
                winampDiv
              );
            }

            if (script.parentNode) {
              script.parentNode.removeChild(
                script
              );
            }

            const webampContainer =
              document.getElementById("webamp");

            if (
              webampContainer &&
              webampContainer.parentNode
            ) {
              webampContainer.parentNode.removeChild(
                webampContainer
              );

              updateTaskbarHighlight();
            }
          }
        );
      }
    }, 1150);

    setTimeout(() => {
      const minimizeBtn =
        document.querySelector(
          "#webamp #minimize"
        );

      if (minimizeBtn) {
        minimizeBtn.addEventListener(
          "click",
          () => {
            const win =
              document.getElementById("webamp");

            if (win) {
              win.style.display = "none";
            }

            updateTaskbarHighlight();
          }
        );
      }
    }, 1000);
  };

  script.onerror = () => {
    console.error("Failed to load Webamp from the CDN.");
    if (winampDiv.parentNode) winampDiv.remove();
    updateTaskbarHighlight();
  };

  winampDiv.appendChild(script);

  let taskbarItem =
    document.getElementById("taskbar-Winamp");

  if (!document.getElementById("taskbar-Winamp")) {
    taskbarItem =
      document.createElement("div");

    taskbarItem.id = "taskbar-Winamp";

    taskbarItem.classList.add(
      "taskbar-item"
    );

    taskbarItem.innerHTML = `
      <img
        src="/Assets/Images/Winamp-logo.png"
        width="16"
      >
      <span>Winamp</span>
    `;

    taskbarItem.onmousedown = () => {
      const winampWindow =
        document.getElementById("webamp");

      if (!winampWindow) return;

      const winampZ =
        parseInt(
          winampWindow.style.zIndex || "0",
          10
        );

      if (
        winampWindow.style.display === "none" ||
        getComputedStyle(winampWindow).display ===
          "none"
      ) {
        winampWindow.style.display = "block";

        zIndexCounter++;

        winampWindow.style.zIndex =
          zIndexCounter;

        updateTaskbarHighlight();
      } else if (winampZ < zIndexCounter) {
        zIndexCounter++;

        winampWindow.style.zIndex =
          zIndexCounter;

        updateTaskbarHighlight();
      } else if (winampZ >= zIndexCounter) {
        winampWindow.style.display = "none";

        updateTaskbarHighlight();
      }
    };

    taskbar.appendChild(taskbarItem);
  }
}


/* ============================================================
   AUTO-START WEBAMP
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /*
   * Wait a moment for the desktop to finish loading.
   * This uses your EXISTING openRawWinamp() function,
   * so there is still only one Webamp implementation.
   */

  setTimeout(function () {

    if (typeof window.openRawWinamp === "function") {
      window.openRawWinamp();
    }

  }, 500);

});



function waitForGameToLoad() {
  console.log("waitForGameToLoad started");

  const iframe =
    document.getElementById("pinball-frame");

  if (!iframe) {
    console.warn("Pinball iframe not found yet; retrying shortly.");
    setTimeout(waitForGameToLoad, 250);
    return;
  }

  const iframeDoc =
    iframe.contentDocument ||
    iframe.contentWindow?.document;

  if (!iframeDoc || !iframeDoc.body) {
    console.warn("Pinball iframe document is not ready yet; retrying shortly.");
    setTimeout(waitForGameToLoad, 250);
    return;
  }

  const observer =
    new MutationObserver(() => {
      checkGameReady();
    });

  const styleObserver =
    new MutationObserver(() => {
      checkGameReady();
    });

  function checkGameReady() {
    try {
      const canvas =
        iframeDoc.querySelector(
          "canvas.emscripten#canvas"
        );

      const statusElement =
        iframeDoc.querySelector("#status");

      console.log(
        `Canvas found: ${!!canvas}, Status element found: ${!!statusElement}`
      );

      if (canvas) {
        console.log(
          `Canvas display: ${canvas.style.display}, Width: ${canvas.width}, Height: ${canvas.height}`
        );
      }

      const isGameLoaded =
        statusElement &&
        (
          statusElement.innerHTML === "" ||
          statusElement.style.display === "none"
        ) &&
        canvas &&
        canvas.style.display !== "none" &&
        (
          canvas.width > 0 ||
          canvas.clientWidth > 0
        );

      console.log(
        `Game loaded: ${isGameLoaded}`
      );

      if (isGameLoaded) {
        observer.disconnect();
        styleObserver.disconnect();

        const finalWidth =
          canvas.width ||
          canvas.clientWidth ||
          600;

        const finalHeight =
          canvas.height ||
          canvas.clientHeight ||
          440;

        applyCanvasDimensionsToWindow(
          finalWidth,
          finalHeight
        );

        resizeWindow(
          finalWidth,
          finalHeight
        );

        setTimeout(() => {
          showWindow();
          hideLoading();
        }, 100);

        return;
      }

      if (
        canvas &&
        !canvas.dataset.observed
      ) {
        canvas.dataset.observed = "true";

        styleObserver.observe(canvas, {
          attributes: true,
          attributeFilter: [
            "style",
            "width",
            "height",
          ],
        });
      }
    } catch (e) {
      console.error(
        "Error accessing iframe:",
        e
      );

      observer.disconnect();
      styleObserver.disconnect();

      applyCanvasDimensionsToWindow(
        600,
        440
      );

      resizeWindow(
        600,
        440
      );

      setTimeout(() => {
        showWindow();
        hideLoading();
      }, 100);
    }
  }

  observer.observe(iframeDoc.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style"],
  });

  checkGameReady();

  const fallbackTimeout = setTimeout(() => {
    observer.disconnect();
    styleObserver.disconnect();

    console.log(
      "Fallback: using default dimensions"
    );

    applyCanvasDimensionsToWindow(
      600,
      440
    );

    resizeWindow(
      600,
      440
    );

    showWindow();
    hideLoading();
  }, 30000);

  const originalDisconnect =
    observer.disconnect;

  observer.disconnect = function () {
    clearTimeout(fallbackTimeout);

    originalDisconnect.call(this);
  };
}

function showWindow() {
  const windowElement =
    window.parent.document.getElementById(
      "window-Space Cadet Pinball"
    );

  const iframe =
    document.getElementById(
      "pinball-frame"
    );

  if (windowElement) {
    windowElement.style.visibility =
      "visible";

    windowElement.style.opacity = "1";

    console.log(
      "Window is now visible"
    );
  }

  if (iframe) {
    iframe.style.visibility =
      "visible";
  }
}

function hideLoading() {
  const loading =
    document.getElementById("loading");

  if (loading) {
    loading.style.opacity = "0";

    setTimeout(() => {
      loading.style.display = "none";
    }, 300);
  }
}

function applyCanvasDimensionsToWindow(
  canvasWidth,
  canvasHeight
) {
  const headerHeight = 30;
  const borderWidth = 3;

  const totalWidth =
    canvasWidth + borderWidth;

  const totalHeight =
    canvasHeight + headerHeight;

  const existingStyles =
    window.parent.document.querySelectorAll(
      "style[data-pinball-resize]"
    );

  existingStyles.forEach((style) =>
    style.remove()
  );

  const style =
    document.createElement("style");

  style.setAttribute(
    "data-pinball-resize",
    "true"
  );

  style.textContent = `
    #window-Space\\ Cadet\\ Pinball.window {
      width: ${totalWidth}px !important;
      height: ${totalHeight}px !important;
      min-width: ${totalWidth}px !important;
      min-height: ${totalHeight}px !important;
      max-width: ${totalWidth}px !important;
      max-height: ${totalHeight}px !important;
    }

    #window-Space\\ Cadet\\ Pinball {
      height: ${canvasHeight}px !important;
      overflow: hidden !important;
    }
  `;

  window.parent.document.head.appendChild(
    style
  );

  console.log(
    `Canvas dimensions applied to CSS: ${canvasWidth}x${canvasHeight} -> Window: ${totalWidth}x${totalHeight}`
  );

  applyInlineStyles(
    canvasWidth,
    canvasHeight,
    totalWidth,
    totalHeight
  );
}

function applyInlineStyles(
  canvasWidth,
  canvasHeight,
  totalWidth,
  totalHeight
) {
  const windowElement =
    window.parent.document.getElementById(
      "window-Space Cadet Pinball"
    );

  if (windowElement) {
    windowElement.style.setProperty(
      "width",
      `${totalWidth}px`,
      "important"
    );

    windowElement.style.setProperty(
      "height",
      `${totalHeight}px`,
      "important"
    );

    console.log(
      `Inline styles applied to window: ${totalWidth}x${totalHeight}`
    );
  }
}

function resizeWindow(
  canvasWidth,
  canvasHeight
) {
  let windowElement =
    window.parent.document.getElementById(
      "window-Space Cadet Pinball"
    );

  if (!windowElement) {
    windowElement =
      window.parent.document.querySelector(
        '[data-app-name="Space Cadet Pinball"]'
      );
  }

  if (windowElement) {
    const headerHeight = 30;
    const borderWidth = 3;

    const totalWidth =
      canvasWidth + borderWidth;

    const totalHeight =
      canvasHeight + headerHeight;

    windowElement.style.width =
      totalWidth + "px";

    windowElement.style.height =
      totalHeight + "px";

    console.log(
      `Window resized to: ${totalWidth}x${totalHeight} (canvas: ${canvasWidth}x${canvasHeight})`
    );
  } else {
    console.warn(
      "Could not find window elements"
    );
  }
}

function openSimpleModal(
  id,
  htmlContent,
  cssHref =
    "/Start_Menu/Log_Off/Base/Log_Off.css"
) {
  injectStyle(
    "Log_Off-styles",
    cssHref
  );

  const modalDiv =
    document.createElement("div");

  modalDiv.id = id;
  modalDiv.innerHTML = htmlContent;

  modalDiv.style.position = "fixed";
  modalDiv.style.zIndex = "99999";
  modalDiv.style.left = "0";
  modalDiv.style.top = "0";
  modalDiv.style.width = "100vw";
  modalDiv.style.height = "100vh";

  document.body.appendChild(
    modalDiv
  );

  Array.from(
    document.body.children
  ).forEach((child) => {
    if (child.id !== id) {
      child.classList.add(
        "modal-open"
      );
    }
  });

  const closeBtn =
    modalDiv.querySelector(
      ".footer__button"
    );

  if (closeBtn) {
    closeBtn.addEventListener(
      "click",
      () => {
        Array.from(
          document.body.children
        ).forEach((child) => {
          child.classList.remove(
            "modal-open"
          );
        });

        document.body.classList.remove(
          "modal-open"
        );

        modalDiv.remove();
      }
    );
  }
}

function openLogOff() {
  openSimpleModal(
    "Log_Off",
    openLogOffHTML
  );
}

function turnOffComputer() {
  openSimpleModal(
    "Turn_Off_Computer",
    turnOffComputerHTML
  );
}

window.turnOffComputer =
  turnOffComputer;

function switchUser() {
  injectStyle(
    "Switch_User-styles",
    "/Loader_Login/Login_Screen.css"
  );

  const windows =
    Array.from(
      document.querySelectorAll(
        '[id^="window-"]'
      )
    );

  const windowStates =
    windows.map((win) => ({
      appName:
        win.id.replace(
          "window-",
          ""
        ),

      left: win.style.left,
      top: win.style.top,
      width: win.style.width,
      height: win.style.height,
      display: win.style.display,
      zIndex: win.style.zIndex,
    }));

  localStorage.setItem(
    "openWindows",
    JSON.stringify(
      windowStates
    )
  );

  localStorage.setItem(
    "zIndexCounter",
    zIndexCounter
  );

  window.location.href =
    "/Start_Menu/Log_Off/Transition/Switch_User.html";
}

function logOff() {
  const icones =
    document.getElementById(
      "desktop"
    );

  const taskbarHidden =
    document.getElementById(
      "Desktop_Footer"
    );

  const logOff =
    document.getElementById(
      "Log_Off"
    );

  let step = 0;

  const interval =
    setInterval(() => {
      switch (step) {
        case 0:
          Array.from(
            document.body.children
          ).forEach((child) => {
            child.classList.remove(
              "modal-open"
            );
          });

          document.body.classList.remove(
            "modal-open"
          );
          break;

        case 1:
          if (logOff) {
            logOff.style.display =
              "none";
          }

          if (icones) {
            icones.style.display =
              "none";
          }
          break;

        case 2:
          if (taskbarHidden) {
            taskbarHidden.style.display =
              "none";
          }
          break;

        case 3:
          clearInterval(interval);

          window.location.href =
            "/Start_Menu/Log_Off/Transition/Login.html";

          return;
      }

      step++;
    }, 250);
}

function PowerState(event) {
  const icones =
    document.getElementById(
      "desktop"
    );

  const taskbarHidden =
    document.getElementById(
      "Desktop_Footer"
    );

  const turnOffComputer =
    document.getElementById(
      "Turn_Off_Computer"
    );

  const targetId =
    event?.target?.id;

  localStorage.setItem(
    "powerAction",
    targetId
  );

  let step = 0;

  const interval =
    setInterval(() => {
      switch (step) {
        case 0:
          Array.from(
            document.body.children
          ).forEach((child) =>
            child.classList.remove(
              "modal-open"
            )
          );

          document.body.classList.remove(
            "modal-open"
          );
          break;

        case 1:
          if (turnOffComputer) {
            turnOffComputer.style.display =
              "none";
          }

          if (icones) {
            icones.style.display =
              "none";
          }
          break;

        case 2:
          if (taskbarHidden) {
            taskbarHidden.style.display =
              "none";
          }
          break;

        case 3:
          clearInterval(interval);

          window.location.href =
            "/Start_Menu/Turn_Off_Computer/Shut_Down/Shut_Down.html";

          break;
      }

      step++;
    }, 250);
}

function closeWindow(appName) {
  const windowElement =
    document.getElementById(
      `window-${appName}`
    );

  const taskbarItem =
    document.getElementById(
      `taskbar-${appName}`
    );

  if (windowElement) {
    windowElement.remove();
  }

  if (taskbarItem) {
    taskbarItem.remove();
  }

  const styleLink =
    document.getElementById(
      `css-window-${appName}`
    );

  if (
    styleLink &&
    styleLink.tagName === "LINK"
  ) {
    styleLink.remove();
  }

  updateTaskbarVisibility();
}

function toggleWindow(appName) {
  const windowElement =
    document.getElementById(
      `window-${appName}`
    );

  const taskbarItem =
    document.getElementById(
      `taskbar-${appName}`
    );

  if (!windowElement || !taskbarItem) {
    return;
  }

  const isHidden =
    windowElement.style.display ===
    "none";

  const isInactive =
    windowElement.classList.contains(
      "window-inactive"
    );

  if (isInactive && !isHidden) {
    return;
  }

  const isOnTop =
    parseInt(
      windowElement.style.zIndex
    ) === zIndexCounter;

  if (isHidden) {
    windowElement.style.removeProperty(
      "display"
    );

    windowElement.classList.remove(
      "window-inactive"
    );

    zIndexCounter++;

    windowElement.style.zIndex =
      zIndexCounter;

    updateTaskbarHighlight(
      appName,
      true
    );
  } else {
    if (isOnTop) {
      windowElement.style.display =
        "none";

      windowElement.classList.add(
        "window-inactive"
      );

      updateTaskbarHighlight(
        appName,
        false
      );
    } else {
      zIndexCounter++;

      windowElement.style.zIndex =
        zIndexCounter;

      updateTaskbarHighlight(
        appName,
        true
      );
    }
  }
}

function maximazeWindow(appName) {
  const windowElement =
    document.getElementById(
      `window-${appName}`
    );

  const taskbarItem =
    document.getElementById(
      `taskbar-${appName}`
    );

  if (!windowElement || !taskbarItem) {
    return;
  }

  const footerHeight = 35;

  const maxWidth =
    document.documentElement.clientWidth;

  const maxHeight =
    document.documentElement.clientHeight -
    footerHeight;

  const isMaximized =
    windowElement.dataset.maximized ===
    "true";

  const maximizeButton =
    windowElement.querySelector(
      ".header-button--maximaze, .header_button--maximized"
    );

  if (!isMaximized) {
    windowElement.dataset.originalWidth =
      windowElement.offsetWidth;

    windowElement.dataset.originalHeight =
      windowElement.offsetHeight;

    windowElement.dataset.originalLeft =
      windowElement.style.left;

    windowElement.dataset.originalTop =
      windowElement.style.top;

    windowElement.style.left =
      "0px";

    windowElement.style.top =
      "0px";

    windowElement.style.width =
      `${maxWidth}px`;

    windowElement.style.height =
      `${maxHeight}px`;

    windowElement.dataset.maximized =
      "true";

    windowElement.style.zIndex =
      zIndexCounter;

    if (maximizeButton) {
      maximizeButton.classList.remove(
        "header-button--maximaze"
      );

      maximizeButton.classList.remove(
        "header_button--maximaze"
      );

      maximizeButton.classList.add(
        "header-button--maximized"
      );

      maximizeButton.classList.add(
        "header_button--maximized"
      );
    }

    updateTaskbarHighlight(
      appName,
      true
    );
  } else {
    windowElement.style.width =
      `${windowElement.dataset.originalWidth}px`;

    windowElement.style.height =
      `${windowElement.dataset.originalHeight}px`;

    windowElement.style.left =
      windowElement.dataset.originalLeft;

    windowElement.style.top =
      windowElement.dataset.originalTop;

    windowElement.dataset.maximized =
      "false";

    windowElement.style.zIndex =
      zIndexCounter;

    if (maximizeButton) {
      maximizeButton.classList.remove(
        "header-button--maximized"
      );

      maximizeButton.classList.remove(
        "header_button--maximized"
      );

      maximizeButton.classList.add(
        "header-button--maximaze"
      );

      maximizeButton.classList.add(
        "header_button--maximaze"
      );
    }

    updateTaskbarHighlight(
      appName,
      false
    );
  }
}

function makeDraggable(element) {
  const header =
    element.querySelector(
      ".window-header"
    );

  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  if (!header) {
    console.warn("Cannot make window draggable: .window-header is missing.", element);
    return;
  }

  header.addEventListener(
    "mousedown",
    (e) => {
      if (isResizingGlobal) return;

      isDragging = true;

      offsetX =
        e.clientX -
        element.offsetLeft;

      offsetY =
        e.clientY -
        element.offsetTop;

      element.style.zIndex =
        zIndexCounter;

      updateTaskbarHighlight();

      document.addEventListener(
        "mousemove",
        moveWindow
      );

      document.addEventListener(
        "mouseup",
        () => {
          isDragging = false;

          document.removeEventListener(
            "mousemove",
            moveWindow
          );
        }
      );
    }
  );

  function moveWindow(e) {
    if (!isDragging) return;

    let newX =
      e.clientX - offsetX;

    let newY =
      e.clientY - offsetY;

    const screenWidth =
      window.innerWidth;

    const screenHeight =
      window.innerHeight;

    const windowWidth =
      element.offsetWidth;

    const windowHeight =
      element.offsetHeight;

    newX = Math.max(
      0,
      Math.min(
        screenWidth -
          windowWidth,
        newX
      )
    );

    newY = Math.max(
      0,
      Math.min(
        screenHeight -
          windowHeight,
        newY
      )
    );

    element.style.left =
      `${newX}px`;

    element.style.top =
      `${newY}px`;
  }

  element.addEventListener(
    "mousedown",
    () => {
      zIndexCounter++;

      element.style.zIndex =
        zIndexCounter;

      updateTaskbarHighlight();
    }
  );
}

function makeResizable(windowElement) {
  const minWidth = 150;
  const minHeight = 115;

  let isResizing = false;

  let startX;
  let startY;
  let startWidth;
  let startHeight;
  let startTop;
  let startLeft;
  let resizeDir = "";

  let iframe;

  windowElement.addEventListener(
    "mousedown",
    (e) => {
      const rect =
        windowElement.getBoundingClientRect();

      const borderSize = 2;

      const mouseX =
        e.clientX;

      const mouseY =
        e.clientY;

      const onLeft =
        mouseX >= rect.left &&
        mouseX <=
          rect.left +
            borderSize;

      const onRight =
        mouseX >=
          rect.right -
            borderSize &&
        mouseX <=
          rect.right;

      const onTop =
        mouseY >= rect.top &&
        mouseY <=
          rect.top +
            borderSize;

      const onBottom =
        mouseY >=
          rect.bottom -
            borderSize &&
        mouseY <=
          rect.bottom;

      resizeDir = "";

      if (onRight) resizeDir += "e";
      if (onLeft) resizeDir += "w";
      if (onTop) resizeDir += "n";
      if (onBottom) resizeDir += "s";

      if (resizeDir !== "") {
        isResizing = true;
        isResizingGlobal = true;

        startX = e.clientX;
        startY = e.clientY;

        startWidth = rect.width;
        startHeight = rect.height;

        startTop = rect.top;
        startLeft = rect.left;

        iframe =
          windowElement.querySelector(
            "iframe"
          );

        if (iframe) {
          iframe.style.pointerEvents =
            "none";
        }

        document.addEventListener(
          "mousemove",
          onMouseMove
        );

        document.addEventListener(
          "mouseup",
          onMouseUp
        );

        e.preventDefault();
      }
    }
  );

  windowElement.addEventListener(
    "mousemove",
    (e) => {
      if (isResizing) {
        if (
          resizeDir.includes("n") &&
          resizeDir.includes("e")
        ) {
          windowElement.style.cursor =
            "nesw-resize";
        } else if (
          resizeDir.includes("s") &&
          resizeDir.includes("w")
        ) {
          windowElement.style.cursor =
            "nesw-resize";
        } else if (
          resizeDir.includes("n") &&
          resizeDir.includes("w")
        ) {
          windowElement.style.cursor =
            "nwse-resize";
        } else if (
          resizeDir.includes("s") &&
          resizeDir.includes("e")
        ) {
          windowElement.style.cursor =
            "nwse-resize";
        } else if (
          resizeDir.includes("e") ||
          resizeDir.includes("w")
        ) {
          windowElement.style.cursor =
            "ew-resize";
        } else if (
          resizeDir.includes("n") ||
          resizeDir.includes("s")
        ) {
          windowElement.style.cursor =
            "ns-resize";
        }

        return;
      }

      const rect =
        windowElement.getBoundingClientRect();

      const borderSize = 2;

      const mouseX =
        e.clientX;

      const mouseY =
        e.clientY;

      const onLeft =
        mouseX >= rect.left &&
        mouseX <=
          rect.left +
            borderSize;

      const onRight =
        mouseX >=
          rect.right -
            borderSize &&
        mouseX <=
          rect.right;

      const onTop =
        mouseY >= rect.top &&
        mouseY <=
          rect.top +
            borderSize;

      const onBottom =
        mouseY >=
          rect.bottom -
            borderSize &&
        mouseY <=
          rect.bottom;

      if (
        (onLeft && onTop) ||
        (onRight && onBottom)
      ) {
        windowElement.style.cursor =
          "nwse-resize";
      } else if (
        (onRight && onTop) ||
        (onLeft && onBottom)
      ) {
        windowElement.style.cursor =
          "nesw-resize";
      } else if (
        onLeft ||
        onRight
      ) {
        windowElement.style.cursor =
          "ew-resize";
      } else if (
        onTop ||
        onBottom
      ) {
        windowElement.style.cursor =
          "ns-resize";
      } else {
        windowElement.style.cursor =
          "default";
      }
    }
  );

  function onMouseMove(e) {
    if (!isResizing) return;

    const dx =
      e.clientX - startX;

    const dy =
      e.clientY - startY;

    if (resizeDir.includes("e")) {
      let newWidth =
        startWidth + dx;

      if (newWidth < minWidth) {
        newWidth = minWidth;
      }

      windowElement.style.width =
        newWidth + "px";
    }

    if (resizeDir.includes("s")) {
      let newHeight =
        startHeight + dy;

      if (newHeight < minHeight) {
        newHeight = minHeight;
      }

      windowElement.style.height =
        newHeight + "px";
    }

    if (resizeDir.includes("w")) {
      let newWidth =
        startWidth - dx;

      let newLeft =
        startLeft + dx;

      if (newWidth < minWidth) {
        newLeft -=
          minWidth -
          newWidth;

        newWidth =
          minWidth;
      }

      windowElement.style.width =
        newWidth + "px";

      windowElement.style.left =
        newLeft + "px";
    }

    if (resizeDir.includes("n")) {
      let newHeight =
        startHeight - dy;

      let newTop =
        startTop + dy;

      if (newHeight < minHeight) {
        newTop -=
          minHeight -
          newHeight;

        newHeight =
          minHeight;
      }

      windowElement.style.height =
        newHeight + "px";

      windowElement.style.top =
        newTop + "px";
    }
  }

  function onMouseUp() {
    isResizing = false;
    isResizingGlobal = false;

    if (iframe) {
      iframe.style.pointerEvents =
        "auto";
    }

    document.removeEventListener(
      "mousemove",
      onMouseMove
    );

    document.removeEventListener(
      "mouseup",
      onMouseUp
    );
  }
}

function updateTaskbarHighlight() {
  const windows =
    Array.from(
      document.querySelectorAll(
        ".window"
      )
    ).filter(
      (win) =>
        win.style.display !== "none"
    );

  const webampDiv =
    document.getElementById(
      "webamp"
    );

  if (
    webampDiv &&
    webampDiv.style.display !==
      "none" &&
    !windows.includes(webampDiv)
  ) {
    windows.push(webampDiv);
  }

  let topWindow = null;
  let maxZ = -1;

  windows.forEach((win) => {
    const z =
      parseInt(
        win.style.zIndex || 0,
        10
      );

    if (z > maxZ) {
      maxZ = z;
      topWindow = win;
    }
  });

  document
    .querySelectorAll(
      ".taskbar-item"
    )
    .forEach((item) => {
      item.style.background = "";
      item.style.backgroundColor = "";
      item.style.boxShadow = "";
    });

  windows.forEach((win) => {
    const isTop =
      win === topWindow;

    const headerBg =
      win.querySelector &&
      win.querySelector(
        ".window-header-background"
      );

    const headerButtons =
      win.querySelector &&
      win.querySelector(
        ".window-header-buttons"
      );

    if (isTop) {
      win.classList.remove(
        "window-inactive"
      );

      win.style.backgroundColor =
        "";

      if (headerBg) {
        headerBg.style.background =
          "";
      }

      if (headerButtons) {
        headerButtons.style.opacity =
          "1";
      }
    } else {
      win.classList.add(
        "window-inactive"
      );

      if (headerBg) {
        headerBg.style.background =
          `
          linear-gradient(
            rgb(205, 115, 145) 0%,
            rgb(215, 125, 155) 3%,
            rgb(225, 145, 170) 6%,
            rgb(228, 150, 175) 8%,
            rgb(220, 135, 165) 14%,
            rgb(215, 125, 155) 17%,
            rgb(208, 110, 145) 25%,
            rgb(210, 115, 150) 56%,
            rgb(220, 135, 165) 81%,
            rgb(215, 125, 155) 89%,
            rgb(205, 105, 140) 94%,
            rgb(200, 100, 135) 97%,
            rgb(235, 175, 195) 115%
          )
        `;
      }

      if (headerButtons) {
        headerButtons.style.opacity =
          "0.4";
      }
    }
  });

  if (topWindow) {
    let topAppId;

    if (topWindow.id === "webamp") {
      topAppId = "Winamp";
    } else {
      topAppId =
        topWindow.id.replace(
          "window-",
          ""
        );
    }

    const taskbarItem =
      document.getElementById(
        `taskbar-${topAppId}`
      );

    if (taskbarItem) {
      taskbarItem.style.background =
        `
        linear-gradient(
          180deg,
          rgba(255, 195, 218, 0.95) 0%,
          rgba(235, 100, 145, 0.95) 45%,
          rgba(185, 45, 95, 0.98) 100%
        )
      `;

      taskbarItem.style.boxShadow =
        `
        inset 0 1px 0 rgba(255,255,255,.55),
        inset 0 -1px 0 rgba(100,15,45,.3),
        0 0 8px rgba(255,120,165,.35)
      `;
    }
  }

  if (
    !updateTaskbarHighlight._blurListenerAdded
  ) {
    document.addEventListener(
      "mousedown",
      (event) => {
        const windows =
          Array.from(
            document.querySelectorAll(
              ".window"
            )
          ).filter(
            (win) =>
              win.style.display !==
              "none"
          );

        const webampDiv =
          document.getElementById(
            "webamp"
          );

        if (
          webampDiv &&
          webampDiv.style.display !==
            "none" &&
          !windows.includes(
            webampDiv
          )
        ) {
          windows.push(webampDiv);
        }

        let clickedOnWindow =
          null;

        let clickedOnTaskbar =
          null;

        windows.forEach((win) => {
          let appId;

          if (win.id === "webamp") {
            appId = "Winamp";
          } else {
            appId =
              win.id.replace(
                "window-",
                ""
              );
          }

          const taskbarItem =
            document.getElementById(
              `taskbar-${appId}`
            );

          if (
            win.contains(
              event.target
            )
          ) {
            clickedOnWindow = win;
          }

          if (
            taskbarItem &&
            taskbarItem.contains(
              event.target
            )
          ) {
            clickedOnTaskbar = win;
          }
        });

        if (
          !clickedOnWindow &&
          !clickedOnTaskbar
        ) {
          windows.forEach((win) => {
            win.classList.add(
              "window-inactive"
            );

            const headerBg =
              win.querySelector &&
              win.querySelector(
                ".window-header-background"
              );

            const headerButtons =
              win.querySelector &&
              win.querySelector(
                ".window-header-buttons"
              );

            if (headerBg) {
              headerBg.style.background =
                `
                linear-gradient(
                  rgb(205, 115, 145) 0%,
                  rgb(215, 125, 155) 3%,
                  rgb(225, 145, 170) 6%,
                  rgb(228, 150, 175) 8%,
                  rgb(220, 135, 165) 14%,
                  rgb(215, 125, 155) 17%,
                  rgb(208, 110, 145) 25%,
                  rgb(210, 115, 150) 56%,
                  rgb(220, 135, 165) 81%,
                  rgb(215, 125, 155) 89%,
                  rgb(205, 105, 140) 94%,
                  rgb(200, 100, 135) 97%,
                  rgb(235, 175, 195) 115%
                )
              `;
            }

            if (headerButtons) {
              headerButtons.style.opacity =
                "0.4";
            }
          });

          document
            .querySelectorAll(
              ".taskbar-item"
            )
            .forEach((item) => {
              item.style.background =
                "";

              item.style.backgroundColor =
                "";

              item.style.boxShadow =
                "";
            });
        } else {
          const win =
            clickedOnWindow ||
            clickedOnTaskbar;

          if (
            win &&
            win.classList.contains(
              "window-inactive"
            )
          ) {
            win.classList.remove(
              "window-inactive"
            );

            zIndexCounter++;

            win.style.zIndex =
              zIndexCounter;

            updateTaskbarHighlight();
          }
        }
      }
    );

    updateTaskbarHighlight._blurListenerAdded =
      true;
  }
}

function createTaskbar() {
  if (
    !document.getElementById(
      "taskbar"
    )
  ) {
    const taskbar =
      document.createElement(
        "div"
      );

    taskbar.id = "taskbar";

    const start_menu =
      document.querySelector(
        ".footer__start_menu"
      );

    if (start_menu) {
      start_menu.insertAdjacentElement(
        "afterend",
        taskbar
      );
    }
  }
}

function updateTaskbarVisibility() {
  const taskbar =
    document.getElementById(
      "taskbar"
    );

  if (
    taskbar &&
    taskbar.children.length ===
      0
  ) {
    taskbar.remove();
  }
}

function openStartMenu() {
  if (recentlyClosedStartMenu) {
    return;
  }

  injectStyle(
    "StartMenu-styles",
    "/Start_Menu/Base/Start_Menu.css"
  );

  if (!startMenuHTML) return;

  const container =
    document.querySelector(
      ".footer__start_menu"
    );

  if (!container) return;

  const existingMenu =
    container.querySelector(
      "#StartMenu"
    );

  if (existingMenu) {
    existingMenu.remove();

    recentlyClosedStartMenu =
      true;

    setTimeout(() => {
      recentlyClosedStartMenu =
        false;
    }, 115);

    return;
  }

  const StartMenu =
    document.createElement(
      "div"
    );

  StartMenu.id = "StartMenu";
  StartMenu.innerHTML =
    startMenuHTML;

  setTimeout(() => {
    container.appendChild(
      StartMenu
    );

    attachHoverTooltip();

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );
  }, 10);

  function handleOutsideClick(e) {
    setTimeout(() => {
      const startMenu =
        document.getElementById(
          "StartMenu"
        );

      if (
        startMenu &&
        !startMenu.contains(
          e.target
        )
      ) {
        startMenu.remove();

        document.removeEventListener(
          "mousedown",
          handleOutsideClick
        );

        recentlyClosedStartMenu =
          true;

        setTimeout(() => {
          recentlyClosedStartMenu =
            false;
        }, 115);
      }
    }, 0);
  }
}

function attachHoverTooltip() {
  injectStyle(
    "hover-info-styles",
    "/Start_Menu/All_Programs/Tooltip/tooltip.css"
  );

  let tooltipHierarchy = [];

  const menu =
    document.querySelector(
      ".AllProgMenu"
    ) ||
    document.querySelector(
      ".ItemMenu"
    );

  if (!menu) return;

  const createTooltip = (
    content,
    parent
  ) => {
    let level = 0;

    const tooltip =
      document.createElement(
        "div"
      );

    tooltip.className =
      "hover-info";

    tooltip.innerHTML =
      content;

    const infoitm =
      parent.closest(
        ".hover-infoitm"
      );

    const tooltipParent =
      parent.closest(
        ".hover-info"
      );

    if (
      infoitm &&
      tooltipParent
    ) {
      const rectInfoitm =
        infoitm.getBoundingClientRect();

      const rectTooltip =
        tooltipParent.getBoundingClientRect();

      const ecart =
        rectTooltip.bottom -
        rectInfoitm.bottom;
    }

    const rect =
      parent.getBoundingClientRect();

    console.log(
      "Parent Rect:",
      rect
    );

    tooltip.style.visibility =
      "hidden";

    tooltip.style.position =
      "absolute";

    document.body.appendChild(
      tooltip
    );

    const parentTooltip =
      parent.closest(
        ".hover-info"
      );

    const specificTooltip =
      parent.closest(
        ".hover-infotxt"
      );

    if (
      parentTooltip &&
      parentTooltip.dataset.level
    ) {
      level =
        parseInt(
          parentTooltip.dataset.level,
          10
        ) + 1;
    }

    tooltip.dataset.level =
      level.toString();

    let tooltipName = "";

    const infotxt =
      parent.querySelector(
        ".hover-infotxt"
      );

    if (infotxt) {
      tooltipName =
        infotxt.textContent.trim();
    }

    if (level === 0) {
      tooltip.style.visibility =
        "";

      tooltip.style.left =
        `${rect.right}px`;

      tooltip.style.top =
        `${405 - rect.height}px`;
    } else if (
      tooltipName ===
      "Accessories"
    ) {
      tooltip.style.visibility =
        "";

      tooltip.style.left =
        `${rect.right - 112}px`;

      tooltip.style.top =
        `${rect.height - 30}px`;
    } else if (
      tooltipName ===
      "Games"
    ) {
      tooltip.style.visibility =
        "";

      tooltip.style.left =
        `${rect.right - 112}px`;

      tooltip.style.top =
        `${rect.height - 22}px`;
    } else if (
      tooltipName ===
      "Startup"
    ) {
      tooltip.style.visibility =
        "";

      tooltip.style.left =
        `${rect.right - 112}px`;

      tooltip.style.top =
        `${rect.height - 3}px`;
    } else if (
      tooltipName ===
      "Accessibility"
    ) {
      tooltip.style.visibility =
        "";

      tooltip.style.left =
        `${rect.right - 329}px`;

      tooltip.style.top =
        `${rect.height + 90}px`;
    } else if (
      tooltipName ===
      "Communication"
    ) {
      tooltip.style.visibility =
        "";

      tooltip.style.left =
        `${rect.right - 329}px`;

      tooltip.style.top =
        `${rect.height + 90}px`;
    } else if (
      tooltipName ===
      "Entertainement"
    ) {
      tooltip.style.visibility =
        "";

      tooltip.style.left =
        `${rect.right - 329}px`;

      tooltip.style.top =
        `${rect.height + 44}px`;
    } else if (
      tooltipName ===
      "System Tools"
    ) {
      tooltip.style.visibility =
        "";

      tooltip.style.left =
        `${rect.right - 329}px`;

      tooltip.style.top =
        `${rect.height + 182}px`;
    }

    const itemMenu =
      parent.closest(
        ".ItemMenu"
      );

    if (
      itemMenu &&
      itemMenu.id ===
        "Connect To"
    ) {
      tooltip.style.left =
        `${rect.right + 48}px`;

      tooltip.style.top =
        `${rect.height + 256}px`;
    } else if (
      itemMenu &&
      itemMenu.id ===
        "My Recent Documents"
    ) {
      tooltip.style.left =
        `${rect.right + 48}px`;

      tooltip.style.top =
        `${rect.height + 34}px`;
    }

    tooltip.style.zIndex =
      9999;

    if (
      parent.classList.contains(
        "AllProgTxt"
      )
    ) {
      parent.appendChild(
        tooltip
      );
    } else if (
      parent.classList.contains(
        "hover-infotxt"
      )
    ) {
      parent.appendChild(
        tooltip
      );
    } else if (
      specificTooltip
    ) {
      specificTooltip.appendChild(
        tooltip
      );
    } else {
      parent.appendChild(
        tooltip
      );
    }

    return tooltip;
  };

  const closeAllTooltips =
    () => {
      tooltipHierarchy.forEach(
        (t) => t.remove()
      );

      tooltipHierarchy = [];
    };

  const isMouseOverAnyTooltip =
    () => {
      return (
        tooltipHierarchy.some(
          (t) =>
            t.matches(
              ":hover"
            )
        ) ||
        menu.matches(":hover") ||
        document.querySelector(
          ".ItemMenu:hover"
        ) ||
        document.querySelector(
          ".hover-infoitm:hover"
        ) ||
        document.querySelector(
          ".hover-infotxt:hover"
        )
      );
    };

  const scheduleTooltipClose =
    () => {
      if (
        !isMouseOverAnyTooltip()
      ) {
        closeAllTooltips();
      }
    };

  const handleMouseEnter =
    async (e) => {
      const target =
        e.target.closest(
          ".AllProgMenu, .ItemMenu, .hover-infoitm"
        );

      if (!target) return;

      let contentFile = null;

      const textElement =
        target.querySelector(
          ".hover-infotxt"
        );

      const allowedTexts = [
        "Accessories",
        "Games",
        "Startup",
        "Accessibility",
        "Communication",
        "Entertainement",
        "System Tools",
      ];

      if (textElement) {
        const text =
          textElement.textContent.trim();

        if (
          allowedTexts.includes(
            text
          )
        ) {
          contentFile =
            `/Start_Menu/All_Programs/Sub_Tooltip/${text}.html`;
        }
      }

      if (!contentFile) {
        const textTest =
          target.querySelector(
            ".AllProgTxt"
          );

        if (textTest) {
          const text =
            textTest.textContent.trim();

          if (
            text ===
            "All Programs"
          ) {
            contentFile =
              "/Start_Menu/All_Programs/Tooltip/Tooltip.html";
          }
        }
      }

      if (!contentFile) {
        let itemMenu = null;

        if (
          target.classList &&
          target.classList.contains(
            "ItemMenu"
          ) &&
          (
            target.id ===
              "Connect To" ||
            target.id ===
              "My Recent Documents"
          )
        ) {
          itemMenu = target;

          contentFile =
            `/Start_Menu/Tooltip/${itemMenu.id}.html`;
        }

        if (!itemMenu) return;
      }

      if (!contentFile) return;

      if (!target.dataset.tooltipId) {
        target.dataset.tooltipId =
          `tt-${Date.now()}-${Math.random()
            .toString(36)}`;
      }

      const existing =
        tooltipHierarchy.find(
          (t) =>
            t.dataset.parent ===
              target.dataset.tooltipId &&
            t.dataset.file ===
              contentFile
        );

      if (existing) return;

      const content =
        await loadHTML(
          contentFile
        );

      const tooltip =
        createTooltip(
          content,
          target
        );

      attachTooltipListeners(
        tooltip
      );

      const text =
        textElement
          ? textElement.textContent.trim()
          : "";

      if (
        allowedTexts.includes(
          text
        )
      ) {
        target.addEventListener(
          "mouseleave",
          function onLeave() {
            tooltip.remove();

            tooltipHierarchy =
              tooltipHierarchy.filter(
                (t) =>
                  t !== tooltip
              );

            target.removeEventListener(
              "mouseleave",
              onLeave
            );
          }
        );
      }

      const currentLevel =
        parseInt(
          tooltip.dataset.level,
          10
        );

      tooltipHierarchy =
        tooltipHierarchy.filter(
          (t) => {
            const tooltipLevel =
              parseInt(
                t.dataset.level,
                10
              );

            if (
              tooltipLevel ===
                currentLevel &&
              t !== tooltip
            ) {
              t.remove();
              return false;
            }

            return true;
          }
        );

      tooltip.dataset.parent =
        target.dataset.tooltipId;

      tooltip.dataset.file =
        contentFile;

      tooltipHierarchy.push(
        tooltip
      );
    };

  let lastActiveLevel =
    null;

  const attachTooltipListeners =
    (tooltip) => {
      tooltip.addEventListener(
        "mouseenter",
        (e) => {
          const currentLevel =
            parseInt(
              e.currentTarget.dataset.level,
              10
            );

          if (
            lastActiveLevel !==
              null &&
            currentLevel <
              lastActiveLevel
          ) {
            setTimeout(() => {
              tooltipHierarchy =
                tooltipHierarchy.filter(
                  (t) => {
                    const tooltipLevel =
                      parseInt(
                        t.dataset.level,
                        10
                      );

                    if (
                      tooltipLevel >
                      currentLevel
                    ) {
                      t.remove();
                      return false;
                    }

                    return true;
                  }
                );
            }, 250);
          }
        }
      );

      tooltip.addEventListener(
        "mouseleave",
        (e) => {
          const leavingLevel =
            parseInt(
              e.currentTarget.dataset.level,
              10
            );

          lastActiveLevel =
            leavingLevel;
        }
      );
    };

  if (
    hoverTooltipMouseEnterHandler
  ) {
    document.body.removeEventListener(
      "mouseenter",
      hoverTooltipMouseEnterHandler,
      true
    );
  }

  if (
    hoverTooltipMouseLeaveHandler
  ) {
    document.body.removeEventListener(
      "mouseleave",
      hoverTooltipMouseLeaveHandler,
      true
    );
  }

  hoverTooltipMouseEnterHandler =
    function (e) {
      if (
        e.target.closest(
          ".AllProgMenu, .ItemMenu, .hover-infoitm"
        )
      ) {
        handleMouseEnter(e);
      }
    };

  hoverTooltipMouseLeaveHandler =
    function () {
      scheduleTooltipClose();
    };

  document.body.addEventListener(
    "mouseenter",
    hoverTooltipMouseEnterHandler,
    true
  );

  document.body.addEventListener(
    "mouseleave",
    hoverTooltipMouseLeaveHandler,
    true
  );
}

function injectStyle(
  id,
  href
) {
  const cssId =
    `css-${id}`;

  if (
    !document.getElementById(
      cssId
    )
  ) {
    const link =
      document.createElement(
        "link"
      );

    link.id = cssId;
    link.rel =
      "stylesheet";

    link.href =
      href;

    document.head.appendChild(
      link
    );
  }
}

document.addEventListener(
  "mousedown",
  function (event) {
    document
      .querySelectorAll(
        ".window"
      )
      .forEach((windowEl) => {
        const labelDivs =
          windowEl.querySelectorAll(
            ".drop_down_label"
          );

        const tooltip =
          windowEl.querySelector(
            ".tooltip, .window-tooltip, .hover-info"
          );

        if (!tooltip) return;

        const isOnLabel =
          Array.from(
            labelDivs
          ).some((label) =>
            label.contains(
              event.target
            )
          );

        const isOnTooltip =
          tooltip.contains(
            event.target
          );

        if (
          !isOnLabel &&
          !isOnTooltip
        ) {
          tooltip.parentNode.removeChild(
            tooltip
          );
        }
      });
  }
);

document.addEventListener(
  "click",
  function (event) {
    const tooltip =
      event.target.closest(
        ".window-tooltip"
      );

    if (tooltip) {
      tooltip.remove();
    }
  }
);

setTimeout(() => {
  const windowStates =
    JSON.parse(
      localStorage.getItem(
        "openWindows"
      ) || "[]"
    );

  windowStates.forEach(
    ({
      appName,
      left,
      top,
      width,
      height,
      display,
      zIndex,
    }) => {
      openWindow(
        appName
      );

      const win =
        document.getElementById(
          `window-${appName}`
        );

      if (win) {
        win.classList.add(
          "window-inactive"
        );

        if (left) {
          win.style.left =
            left;
        }

        if (top) {
          win.style.top =
            top;
        }

        if (width) {
          win.style.width =
            width;
        }

        if (height) {
          win.style.height =
            height;
        }

        if (display) {
          win.style.display =
            display;
        }

        if (zIndex) {
          win.style.zIndex =
            zIndex;
        }
      }
    }
  );

  localStorage.removeItem(
    "openWindows"
  );

  localStorage.removeItem(
    "zIndexCounter"
  );
}, 200);

function writeDateTime() {
  const textarea =
    document.querySelector(
      ".write"
    );

  if (!textarea) return;

  const now =
    new Date();

  const dateOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  const dateStr =
    now.toLocaleDateString(
      "en-US",
      dateOptions
    );

  const timeStr =
    now.toLocaleTimeString(
      "en-US",
      timeOptions
    );

  textarea.value +=
    `${timeStr} ${dateStr} \n`;
}





/* =========================================================
   ROSE GLASS THEME + DESKTOP SELECTION + ICON GRID
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     ROSE COLORS
     --------------------------------------------------------- */

  const ROSE = {
    dark: "#7b234f",
    darker: "#581936",
    main: "#c94f82",
    light: "#e98daf",
    pale: "#f7c1d2",
    highlight: "#ffdce8",
    taskbar: "#b83f70",
    taskbarDark: "#762247",
    active: "#d85b8d",
    inactive: "#a83b69",
    border: "#702044",
    glass: "rgba(214, 88, 133, 0.72)",
    glassLight: "rgba(255, 205, 222, 0.30)"
  };

  /* ---------------------------------------------------------
     ROSE GLASS CSS
     --------------------------------------------------------- */

  function installRoseGlassTheme() {
    if (document.getElementById("rose-glass-theme")) return;

    const style = document.createElement("style");
    style.id = "rose-glass-theme";

    style.textContent = `
      /* =====================================================
         DESKTOP
         ===================================================== */

      #desktop {
        position: relative;
      }

      /* =====================================================
         MAIN XP TASKBAR
         ===================================================== */

      #Desktop_Footer {
        background:
          linear-gradient(
            to bottom,
            rgba(255, 211, 226, 0.78) 0%,
            rgba(234, 139, 169, 0.90) 4%,
            rgba(215, 91, 135, 0.94) 12%,
            rgba(193, 65, 112, 0.96) 50%,
            rgba(169, 48, 94, 0.98) 88%,
            rgba(119, 31, 70, 1) 100%
          ) !important;

        border-top: 1px solid rgba(255, 230, 240, 0.8) !important;

        box-shadow:
          0 -1px 0 rgba(255,255,255,.55) inset,
          0 -2px 8px rgba(80, 15, 42, .35),
          0 -8px 25px rgba(190, 55, 105, .18);

        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }

      /* =====================================================
         START BUTTON CONTAINER
         ===================================================== */

      #Desktop_Footer .footer__start_menu {
        background:
          linear-gradient(
            to bottom,
            rgba(255, 226, 235, .42),
            rgba(196, 62, 111, .35)
          );

        box-shadow:
          inset 0 1px rgba(255,255,255,.45),
          inset 0 -1px rgba(91,20,52,.35);
      }

      /* =====================================================
         DYNAMIC APP TASKBAR
         ===================================================== */

      #taskbar {
        background:
          linear-gradient(
            to bottom,
            rgba(246, 170, 194, .88) 0%,
            rgba(218, 105, 145, .90) 6%,
            rgba(194, 64, 112, .95) 50%,
            rgba(156, 43, 84, .98) 100%
          ) !important;

        border-left: 1px solid rgba(255,255,255,.25);
        border-right: 1px solid rgba(255,255,255,.15);

        box-shadow:
          inset 0 1px rgba(255,255,255,.35),
          inset 0 -1px rgba(86,18,49,.4),
          0 0 14px rgba(93, 17, 48, .28);

        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
      }

      /* =====================================================
         TASKBAR ITEMS
         ===================================================== */

      #taskbar .taskbar-item {
        position: relative;

        background:
          linear-gradient(
            to bottom,
            rgba(255, 209, 225, .30),
            rgba(185, 55, 103, .42)
          ) !important;

        border-left: 1px solid rgba(255,255,255,.16);
        border-right: 1px solid rgba(87,18,48,.22);

        color: white !important;

        text-shadow:
          0 1px 1px rgba(70, 10, 35, .8);

        box-shadow:
          inset 0 1px rgba(255,255,255,.20),
          inset 0 -1px rgba(74,12,39,.30);

        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);

        transition:
          background .12s ease,
          box-shadow .12s ease,
          filter .12s ease;
      }

      #taskbar .taskbar-item:hover {
        background:
          linear-gradient(
            to bottom,
            rgba(255, 225, 236, .55),
            rgba(211, 75, 124, .70)
          ) !important;

        box-shadow:
          inset 0 1px rgba(255,255,255,.42),
          inset 0 -1px rgba(86,15,46,.35),
          0 0 8px rgba(255, 160, 193, .18);
      }

      #taskbar .taskbar-item img {
        filter:
          drop-shadow(0 1px 1px rgba(50, 5, 25, .65));
      }

      /* =====================================================
         ACTIVE TASKBAR ITEM
         ===================================================== */

      #taskbar .taskbar-item.rose-active {
        background:
          linear-gradient(
            to bottom,
            rgba(255, 215, 230, .70),
            rgba(220, 80, 130, .95) 40%,
            rgba(171, 45, 91, .98)
          ) !important;

        box-shadow:
          inset 0 1px rgba(255,255,255,.55),
          inset 0 -1px rgba(76,12,39,.65),
          0 0 7px rgba(255, 164, 194, .28);
      }

      /* =====================================================
         WINDOWS
         ===================================================== */

      .window {
        border-color: ${ROSE.border} !important;

        box-shadow:
          0 8px 28px rgba(57, 7, 30, .34),
          0 2px 7px rgba(44, 5, 23, .25),
          inset 0 0 0 1px rgba(255,255,255,.22);

        background:
          rgba(255, 225, 236, .13) !important;

        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      /* =====================================================
         WINDOW HEADER
         ===================================================== */

      .window-header,
      .window-header-background {
        background:
          linear-gradient(
            rgb(143, 47, 86) 0%,
            rgb(220, 106, 143) 3%,
            rgb(241, 146, 174) 7%,
            rgb(229, 117, 151) 14%,
            rgb(205, 76, 119) 25%,
            rgb(201, 72, 116) 55%,
            rgb(211, 86, 128) 81%,
            rgb(192, 60, 105) 94%,
            rgb(155, 43, 81) 100%
          ) !important;

        box-shadow:
          inset 0 1px rgba(255,255,255,.55),
          inset 0 -1px rgba(91,17,48,.40);

        color: white !important;

        text-shadow:
          0 1px 1px rgba(65, 8, 32, .8);
      }

      .window-header-background::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 1px;
        height: 2px;

        background:
          linear-gradient(
            to right,
            transparent,
            rgba(255,255,255,.65),
            transparent
          );

        pointer-events: none;
      }

      /* =====================================================
         WINDOW CONTENT GLASS
         ===================================================== */

      .window-content {
        background:
          linear-gradient(
            135deg,
            rgba(255,255,255,.22),
            rgba(255,185,211,.08)
          ) !important;

        backdrop-filter: blur(7px);
        -webkit-backdrop-filter: blur(7px);
      }

      /* =====================================================
         WINDOW BUTTONS
         ===================================================== */

      .window-header-buttons button,
      .header-button--close,
      .header-button--maximaze,
      .header-button--minimize,
      .header-button--maximized,
      [class*="header-button"] {
        filter:
          hue-rotate(300deg)
          saturate(1.15);

        box-shadow:
          inset 0 1px rgba(255,255,255,.28);
      }

      /* =====================================================
         INACTIVE WINDOWS
         ===================================================== */

      .window.window-inactive
      .window-header-background {
        background:
          linear-gradient(
            rgb(112, 48, 76) 0%,
            rgb(159, 83, 110) 3%,
            rgb(190, 117, 143) 7%,
            rgb(181, 104, 133) 14%,
            rgb(162, 82, 115) 25%,
            rgb(166, 88, 119) 56%,
            rgb(175, 99, 128) 81%,
            rgb(160, 79, 111) 94%,
            rgb(130, 61, 89) 100%
          ) !important;

        filter: saturate(.82);
      }

      /* =====================================================
         START MENU / XP MENUS
         ===================================================== */

      #StartMenu,
      .StartMenu,
      .AllProgMenu,
      .ItemMenu,
      .hover-info {
        border-color: rgba(105, 25, 59, .75) !important;

        box-shadow:
          0 8px 25px rgba(54, 7, 28, .35),
          inset 0 1px rgba(255,255,255,.35);

        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }

      /* broad rose tint for existing blue XP menu gradients */
      #StartMenu [style*="blue"],
      .AllProgMenu [style*="blue"],
      .ItemMenu [style*="blue"] {
        filter: hue-rotate(300deg) saturate(1.05);
      }

      /* =====================================================
         DESKTOP ICONS
         ===================================================== */

      #desktop .icon {
        user-select: none;
        -webkit-user-select: none;
        touch-action: none;
        cursor: default;
      }

      #desktop .icon.dragging {
        opacity: .82;
        z-index: 9999;

        filter:
          drop-shadow(0 4px 9px rgba(35, 3, 18, .45));
      }

      #desktop .icon.rose-selected {
        background: rgba(224, 91, 140, .30) !important;

        border: 1px solid rgba(255, 199, 218, .85);

        box-shadow:
          inset 0 0 0 1px rgba(121, 31, 67, .30),
          0 0 8px rgba(244, 130, 168, .18);

        border-radius: 2px;
      }

      /* =====================================================
         SELECTION RECTANGLE
         ===================================================== */

      #desktop-selection-box {
        position: absolute;

        display: none;

        pointer-events: none;

        z-index: 9998;

        box-sizing: border-box;

        border: 1px solid rgba(255, 190, 215, .95);

        background:
          rgba(210, 76, 127, .22);

        box-shadow:
          inset 0 0 0 1px rgba(104, 28, 60, .28),
          0 0 5px rgba(240, 117, 160, .18);
      }

      /* =====================================================
         GRID
         ===================================================== */

      #desktop-grid-overlay {
        position: absolute;

        inset: 0;

        pointer-events: none;

        display: none;

        z-index: 9990;

        opacity: .42;

        background-image:
          linear-gradient(
            rgba(255, 174, 203, .18) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(255, 174, 203, .18) 1px,
            transparent 1px
          );

        background-size:
          70px 70px;

        background-position:
          20px 20px;

        mask-image:
          linear-gradient(
            to bottom,
            rgba(0,0,0,.85),
            rgba(0,0,0,.25)
          );
      }

      /* =====================================================
         SMALL GLASS HIGHLIGHT
         ===================================================== */

      #Desktop_Footer::before,
      #taskbar::before {
        content: "";

        position: absolute;

        left: 0;
        right: 0;
        top: 0;

        height: 1px;

        background:
          linear-gradient(
            to right,
            transparent,
            rgba(255,255,255,.65),
            transparent
          );

        pointer-events: none;
      }
    `;

    document.head.appendChild(style);
  }

  /* ---------------------------------------------------------
     CREATE DESKTOP SELECTION BOX
     --------------------------------------------------------- */

  function installDesktopSelection() {
    const desktop = document.getElementById("desktop");

    if (!desktop) return;

    if (!document.getElementById("desktop-selection-box")) {
      const selection = document.createElement("div");
      selection.id = "desktop-selection-box";
      desktop.appendChild(selection);
    }

    if (!document.getElementById("desktop-grid-overlay")) {
      const grid = document.createElement("div");
      grid.id = "desktop-grid-overlay";
      desktop.appendChild(grid);
    }

    const selectionBox =
      document.getElementById("desktop-selection-box");

    const gridOverlay =
      document.getElementById("desktop-grid-overlay");

    let selecting = false;

    let startX = 0;
    let startY = 0;

    function clearSelections() {
      desktop
        .querySelectorAll(".icon.rose-selected")
        .forEach((icon) => {
          icon.classList.remove("rose-selected");
        });
    }

    function pointInsideRectangle(rect, x, y) {
      return (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      );
    }

    function updateSelection(event) {
      if (!selecting) return;

      const desktopRect =
        desktop.getBoundingClientRect();

      const currentX =
        event.clientX - desktopRect.left;

      const currentY =
        event.clientY - desktopRect.top;

      const left = Math.min(startX, currentX);
      const top = Math.min(startY, currentY);

      const width =
        Math.abs(currentX - startX);

      const height =
        Math.abs(currentY - startY);

      selectionBox.style.display = "block";

      selectionBox.style.left =
        `${left}px`;

      selectionBox.style.top =
        `${top}px`;

      selectionBox.style.width =
        `${width}px`;

      selectionBox.style.height =
        `${height}px`;

      const selectionRect = {
        left,
        top,
        right: left + width,
        bottom: top + height
      };

      desktop
        .querySelectorAll(".icon")
        .forEach((icon) => {
          const iconLeft =
            parseInt(icon.style.left || "0", 10);

          const iconTop =
            parseInt(icon.style.top || "0", 10);

          const iconRight =
            iconLeft + icon.offsetWidth;

          const iconBottom =
            iconTop + icon.offsetHeight;

          const overlaps =
            iconLeft < selectionRect.right &&
            iconRight > selectionRect.left &&
            iconTop < selectionRect.bottom &&
            iconBottom > selectionRect.top;

          if (overlaps) {
            icon.classList.add("rose-selected");
          } else {
            icon.classList.remove("rose-selected");
          }
        });
    }

    desktop.addEventListener("mousedown", function (event) {
      if (event.button !== 0) return;

      /*
       * Do not start selection when clicking an icon,
       * a window, or another interactive element.
       */
      if (event.target.closest(".icon")) return;

      if (event.target !== desktop) return;

      const rect =
        desktop.getBoundingClientRect();

      startX =
        event.clientX - rect.left;

      startY =
        event.clientY - rect.top;

      selecting = true;

      clearSelections();

      selectionBox.style.display = "block";

      selectionBox.style.left =
        `${startX}px`;

      selectionBox.style.top =
        `${startY}px`;

      selectionBox.style.width = "0px";
      selectionBox.style.height = "0px";

      event.preventDefault();
    });

    document.addEventListener("mousemove", function (event) {
      if (!selecting) return;

      updateSelection(event);
    });

    document.addEventListener("mouseup", function () {
      if (!selecting) return;

      selecting = false;

      selectionBox.style.display = "none";
    });

    /*
     * Click desktop with no drag = deselect.
     */
    desktop.addEventListener("click", function (event) {
      if (
        event.target === desktop &&
        !selecting
      ) {
        clearSelections();
      }
    });
  }

  /* ---------------------------------------------------------
     GRID SNAP
     --------------------------------------------------------- */

  const GRID_X = 70;
  const GRID_Y = 70;

  const GRID_ORIGIN_X = 20;
  const GRID_ORIGIN_Y = 20;

  const SNAP_DISTANCE = 28;

  function nearestGrid(value, grid, origin) {
    return (
      origin +
      Math.round(
        (value - origin) / grid
      ) *
        grid
    );
  }

  function getOtherIconPositions(currentIcon) {
    const desktop =
      document.getElementById("desktop");

    if (!desktop) return [];

    return Array.from(
      desktop.querySelectorAll(".icon")
    )
      .filter((icon) => icon !== currentIcon)
      .map((icon) => ({
        x: parseInt(
          icon.style.left || "0",
          10
        ),
        y: parseInt(
          icon.style.top || "0",
          10
        )
      }));
  }

  function snapIconPosition(icon, rawX, rawY) {
    let x = nearestGrid(
      rawX,
      GRID_X,
      GRID_ORIGIN_X
    );

    let y = nearestGrid(
      rawY,
      GRID_Y,
      GRID_ORIGIN_Y
    );

    /*
     * First snap to the normal grid.
     */

    const otherIcons =
      getOtherIconPositions(icon);

    /*
     * Then see if another icon is nearby.
     * This makes icons "magnetically" line up.
     */

    let bestX = x;
    let bestY = y;

    let bestDistance =
      Number.POSITIVE_INFINITY;

    otherIcons.forEach((position) => {
      const dx =
        Math.abs(rawX - position.x);

      const dy =
        Math.abs(rawY - position.y);

      /*
       * Same-column snapping
       */
      if (dx <= SNAP_DISTANCE && dy <= 45) {
        const distance = dx;

        if (distance < bestDistance) {
          bestDistance = distance;
          bestX = position.x;
        }
      }

      /*
       * Same-row snapping
       */
      if (dy <= SNAP_DISTANCE && dx <= 45) {
        const distance = dy;

        if (distance < bestDistance) {
          bestDistance = distance;
          bestY = position.y;
        }
      }
    });

    return {
      x: bestX,
      y: bestY
    };
  }

  /* ---------------------------------------------------------
     PATCH EXISTING ICON DRAGGING
     --------------------------------------------------------- */

  function installIconSnapSystem() {
    const desktop =
      document.getElementById("desktop");

    if (!desktop) return;

    let draggedIcon = null;

    /*
     * Detect the icon currently being dragged.
     *
     * The existing Bureau.html drag system still does
     * the actual movement. We simply snap its resulting
     * position to our grid.
     */

    desktop
      .querySelectorAll(".icon")
      .forEach((icon) => {
        icon.addEventListener(
          "mousedown",
          function (event) {
            if (event.button !== 0) return;

            draggedIcon = icon;

            const grid =
              document.getElementById(
                "desktop-grid-overlay"
              );

            if (grid) {
              grid.style.display = "block";
            }
          },
          true
        );
      });

    document.addEventListener(
      "mousemove",
      function () {
        if (!draggedIcon) return;

        /*
         * The original drag handler has already updated
         * left/top by this point.
         */

        const rawX =
          parseInt(
            draggedIcon.style.left || "0",
            10
          );

        const rawY =
          parseInt(
            draggedIcon.style.top || "0",
            10
          );

        const snapped =
          snapIconPosition(
            draggedIcon,
            rawX,
            rawY
          );

        draggedIcon.style.left =
          `${snapped.x}px`;

        draggedIcon.style.top =
          `${snapped.y}px`;
      },
      true
    );

    document.addEventListener(
      "mouseup",
      function () {
        if (!draggedIcon) return;

        const snapped =
          snapIconPosition(
            draggedIcon,
            parseInt(
              draggedIcon.style.left || "0",
              10
            ),
            parseInt(
              draggedIcon.style.top || "0",
              10
            )
          );

        draggedIcon.style.left =
          `${snapped.x}px`;

        draggedIcon.style.top =
          `${snapped.y}px`;

        /*
         * Save position using the same localStorage
         * format as the existing desktop system.
         */

        if (draggedIcon.dataset.icon) {
          localStorage.setItem(
            "desktop-icon-" +
              draggedIcon.dataset.icon,
            JSON.stringify({
              x: snapped.x,
              y: snapped.y
            })
          );
        }

        draggedIcon.classList.remove(
          "dragging"
        );

        const grid =
          document.getElementById(
            "desktop-grid-overlay"
          );

        if (grid) {
          grid.style.display = "none";
        }

        draggedIcon = null;
      },
      true
    );
  }

  /* ---------------------------------------------------------
     MAKE DYNAMIC TASKBAR ITEMS ROSE
     --------------------------------------------------------- */

  function refreshRoseTaskbar() {
    const taskbar =
      document.getElementById("taskbar");

    if (!taskbar) return;

    taskbar
      .querySelectorAll(".taskbar-item")
      .forEach((item) => {
        item.style.setProperty(
          "color",
          "#fff",
          "important"
        );

        item.style.setProperty(
          "text-shadow",
          "0 1px 1px rgba(70,10,35,.8)",
          "important"
        );
      });
  }

  /* ---------------------------------------------------------
     FORCE ACTIVE TASKBAR COLOR
     --------------------------------------------------------- */

  function patchTaskbarHighlight() {
    if (
      typeof updateTaskbarHighlight !==
      "function"
    ) {
      return;
    }

    const original =
      updateTaskbarHighlight;

    /*
     * Don't patch repeatedly.
     */

    if (
      updateTaskbarHighlight
        ._rosePatched
    ) {
      return;
    }

    function roseHighlight() {
      original.apply(this, arguments);

      const taskbar =
        document.getElementById("taskbar");

      if (!taskbar) return;

      taskbar
        .querySelectorAll(".taskbar-item")
        .forEach((item) => {
          /*
           * The original function gives the active
           * item an inline blue background.
           * Remove that blue and replace it.
           */

          const background =
            item.style.backgroundColor;

          if (
            background &&
            (
              background.includes("26, 80, 183") ||
              background.includes(
                "rgb(26, 80, 183)"
              )
            )
          ) {
            item.style.backgroundColor =
              "rgba(211, 75, 124, .95)";

            item.style.boxShadow =
              `
              inset 0 1px rgba(255,255,255,.55),
              inset 0 -1px rgba(76,12,39,.65),
              0 0 7px rgba(255,164,194,.28)
              `;

            item.classList.add(
              "rose-active"
            );
          }
        });

      refreshRoseTaskbar();
    }

    roseHighlight._rosePatched = true;

    /*
     * Replace global function.
     */
    window.updateTaskbarHighlight =
      roseHighlight;
  }

  /* ---------------------------------------------------------
     REMOVE ANY OLD LINKEDIN WINDOW
     --------------------------------------------------------- */

  function removeLinkedInEverywhere() {
    /*
     * Remove an already-open LinkedIn window.
     */

    document
      .querySelectorAll(
        '[id*="LinkedIn"], [data-app-name*="LinkedIn"]'
      )
      .forEach((element) => {
        element.remove();
      });

    /*
     * Remove LinkedIn taskbar entry.
     */

    document
      .querySelectorAll(
        '[id="taskbar-LinkedIn"]'
      )
      .forEach((element) => {
        element.remove();
      });

    /*
     * Clean saved window state.
     */

    try {
      const saved =
        JSON.parse(
          localStorage.getItem(
            "openWindows"
          ) || "[]"
        );

      const filtered =
        saved.filter(
          (windowState) =>
            windowState.appName !==
            "LinkedIn"
        );

      localStorage.setItem(
        "openWindows",
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.warn(
        "Could not clean LinkedIn from saved windows:",
        error
      );
    }
  }

  /* ---------------------------------------------------------
     OBSERVE NEW WINDOWS / TASKBAR
     --------------------------------------------------------- */

  function installDynamicObserver() {
    const observer =
      new MutationObserver(() => {
        refreshRoseTaskbar();
        removeLinkedInEverywhere();

        const grid =
          document.getElementById(
            "desktop-grid-overlay"
          );

        if (grid) {
          grid.style.pointerEvents =
            "none";
        }
      });

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );
  }

  /* ---------------------------------------------------------
     START EVERYTHING
     --------------------------------------------------------- */

  function initializeRoseSystem() {
    installRoseGlassTheme();

    removeLinkedInEverywhere();

    installDesktopSelection();

    installIconSnapSystem();

    installDynamicObserver();

    /*
     * updateTaskbarHighlight may not exist yet
     * depending on script execution order.
     */

    setTimeout(() => {
      patchTaskbarHighlight();
      refreshRoseTaskbar();
    }, 50);

    setTimeout(() => {
      patchTaskbarHighlight();
      refreshRoseTaskbar();
    }, 500);

    setTimeout(() => {
      patchTaskbarHighlight();
      refreshRoseTaskbar();
    }, 1500);
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initializeRoseSystem
    );
  } else {
    initializeRoseSystem();
  }
})();



/* ============================================================
   ROSE GLASS THEME
   ============================================================ */

(function initRoseTheme() {
  function applyRoseTheme() {
    if (document.getElementById("rose-glass-theme")) return;

    const style = document.createElement("style");
    style.id = "rose-glass-theme";

    style.textContent = `
      /* ======================================================
         COLORS
         ====================================================== */

      :root {
        --rose-dark: #9b2457;
        --rose-deep: #b72f67;
        --rose: #d84c82;
        --rose-light: #ed78a5;
        --rose-lighter: #f5a0bd;
        --rose-highlight: #ffd4e3;

        --glass-white: rgba(255,255,255,0.24);
        --glass-white-strong: rgba(255,255,255,0.38);
      }


      /* ======================================================
         DESKTOP FOOTER
         
         LIGHTER ROSE VERSION
         ====================================================== */

      #Desktop_Footer {
        background:
          linear-gradient(
            to bottom,

            /* glossy top */
            rgba(255, 215, 230, 0.78) 0%,

            rgba(255, 190, 215, 0.58) 4%,

            /* light rose */
            rgba(244, 139, 174, 0.98) 10%,

            rgba(235, 112, 153, 0.98) 28%,

            rgba(225, 91, 139, 0.98) 52%,

            rgba(211, 70, 121, 0.99) 76%,

            rgba(193, 53, 103, 1) 100%
          ) !important;

        border-top:
          1px solid rgba(255,255,255,0.65) !important;

        box-shadow:
          0 -1px 0 rgba(255,255,255,0.5) inset,
          0 -2px 8px rgba(255,105,155,0.20),
          0 -5px 18px rgba(120,20,60,0.18);

        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }


      /* ======================================================
         START BUTTON AREA
         ====================================================== */

      #Desktop_Footer .footer__start_menu {
        filter:
          drop-shadow(0 1px 2px rgba(70,0,30,0.25));
      }


      /* ======================================================
         DYNAMIC TASKBAR
         ====================================================== */

      #taskbar {
        background: transparent !important;
      }


      .taskbar-item {
        position: relative;

        background:
          linear-gradient(
            to bottom,

            rgba(255,218,232,0.58) 0%,
            rgba(255,184,211,0.42) 5%,
            rgba(230,91,139,0.95) 16%,
            rgba(211,61,113,0.98) 45%,
            rgba(185,40,91,1) 100%
          ) !important;

        border:
          1px solid rgba(255,205,225,0.40) !important;

        box-shadow:
          0 1px 0 rgba(255,255,255,0.45) inset,
          0 -1px 0 rgba(110,10,45,0.25) inset,
          1px 0 1px rgba(100,10,45,0.35) inset,
          0 1px 3px rgba(90,0,35,0.18);

        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }


      .taskbar-item:hover {
        background:
          linear-gradient(
            to bottom,
            rgba(255,230,240,0.72),
            rgba(244,129,169,0.98) 25%,
            rgba(215,67,119,1) 100%
          ) !important;

        box-shadow:
          0 1px 0 rgba(255,255,255,0.55) inset,
          0 0 7px rgba(255,130,175,0.28);

        filter: brightness(1.05);
      }


      /* ======================================================
         ACTIVE TASKBAR ITEM
         ====================================================== */

      .taskbar-item.active {
        background:
          linear-gradient(
            to bottom,
            rgba(247,157,188,0.72),
            rgba(194,42,92,0.98) 35%,
            rgba(153,22,65,1) 100%
          ) !important;

        box-shadow:
          0 1px 0 rgba(255,255,255,0.20) inset,
          0 1px 2px rgba(70,0,25,0.45) inset;
      }


      /* ======================================================
         ROSE GLASS WINDOWS
         ====================================================== */

      .window {
        border:
          1px solid rgba(255,215,230,0.62) !important;

        border-radius: 8px;

        background:
          linear-gradient(
            135deg,
            rgba(255,190,215,0.48),
            rgba(207,55,108,0.92)
          ) !important;

        box-shadow:
          0 8px 25px rgba(70,0,30,0.32),
          0 1px 0 rgba(255,255,255,0.50) inset,
          0 0 0 1px rgba(120,10,50,0.25);

        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
      }


      /* ======================================================
         WINDOW TOPBAR
         ====================================================== */

      .window-header-background {
        background:
          linear-gradient(
            to bottom,

            rgba(255,220,233,0.82) 0%,
            rgba(255,188,214,0.66) 4%,
            rgba(246,125,165,0.98) 11%,
            rgba(232,86,135,0.99) 30%,
            rgba(213,56,111,1) 60%,
            rgba(189,35,88,1) 85%,
            rgba(158,23,69,1) 100%
          ) !important;

        border-top-left-radius: 7px;
        border-top-right-radius: 7px;

        box-shadow:
          0 1px 0 rgba(255,255,255,0.52) inset,
          0 2px 5px rgba(120,10,50,0.18);

        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }


      /* ======================================================
         WINDOW TOPBAR SHINE
         ====================================================== */

      .window-header-background::before {
        opacity: 1 !important;

        background:
          linear-gradient(
            to right,
            rgba(255,255,255,0.42),
            rgba(255,255,255,0.10),
            transparent
          ) !important;
      }


      .window-header-background::after {
        opacity: 1 !important;

        background:
          linear-gradient(
            to left,
            rgba(255,255,255,0.25),
            transparent
          ) !important;
      }


      /* ======================================================
         INACTIVE WINDOW
         ====================================================== */

      .window.window-inactive {
        filter: saturate(0.72);
      }


      .window.window-inactive .window-header-background {
        background:
          linear-gradient(
            to bottom,
            rgba(218,169,188,0.72),
            rgba(187,111,140,0.82) 30%,
            rgba(157,76,108,0.90) 65%,
            rgba(126,52,81,0.96) 100%
          ) !important;
      }


      /* ======================================================
         WINDOW BUTTONS
         ====================================================== */

      .header-button--minimize,
      .header-button--maximaze,
      .header-button--maximized {

        background-image:
          radial-gradient(
            circle at 85% 85%,
            #a71954 0%,
            #cf3975 42%,
            #ee78a6 67%,
            #ffc9dd 88%,
            #fff 100%
          ) !important;

        box-shadow:
          #8e1649 0 -1px 2px 1px inset,
          rgba(255,255,255,0.35) 0 1px 1px inset !important;
      }


      .header-button--close {
        background-image:
          radial-gradient(
            circle at 85% 85%,
            #941442 0%,
            #c52d65 45%,
            #ed719d 68%,
            #ffc8dc 88%,
            #fff 100%
          ) !important;

        box-shadow:
          #7d1038 0 -1px 2px 1px inset,
          rgba(255,255,255,0.30) 0 1px 1px inset !important;
      }


      /* ======================================================
         DESKTOP SELECTION FRAME
         ====================================================== */

      #desktop-selection-frame {
        position: fixed;

        display: none;

        pointer-events: none;

        z-index: 999999;

        box-sizing: border-box;

        border:
          1px solid rgba(70,150,235,0.95);

        background:
          rgba(80,155,235,0.20);

        box-shadow:
          0 0 0 1px rgba(255,255,255,0.16) inset;
      }


      /* ======================================================
         SELECTED DESKTOP ICON
         ====================================================== */

      #desktop .desktop-selected {
        background:
          rgba(70,150,235,0.32) !important;

        outline:
          1px solid rgba(120,190,255,0.78);
      }


      /* ======================================================
         ICONS
         ====================================================== */

      #desktop .icon {
        box-sizing: border-box;
      }


      #desktop .icon img {
        filter:
          drop-shadow(
            0 2px 2px rgba(0,0,0,0.35)
          );
      }


      #desktop .icon:hover img {
        filter:
          drop-shadow(
            0 2px 3px rgba(0,0,0,0.45)
          )
          brightness(1.06);
      }
    `;

    document.head.appendChild(style);
  }


  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyRoseTheme);
  } else {
    applyRoseTheme();
  }
})();


/* ============================================================
   DESKTOP SELECTION RECTANGLE
   ============================================================ */

/* ============================================================
   DESKTOP SELECTION + MULTI-ICON DRAGGING + 19x8 GRID
   ============================================================ */

(function initDesktopSelectionAndGrid() {

  const GRID_COLUMNS = 19;
  const GRID_ROWS = 8;

  let desktop = null;
  let selectionFrame = null;

  let selecting = false;
  let dragging = false;

  let startX = 0;
  let startY = 0;

  let dragStartX = 0;
  let dragStartY = 0;

  let draggedIcons = [];


  /* ==========================================================
     SETUP
     ========================================================== */

  function setup() {

    desktop = document.getElementById("desktop");

    if (!desktop) {
      console.warn("Desktop element #desktop was not found.");
      return;
    }


    /* --------------------------------------------------------
       Create selection rectangle
       -------------------------------------------------------- */

    selectionFrame =
      document.getElementById(
        "desktop-selection-frame"
      );


    if (!selectionFrame) {

      selectionFrame =
        document.createElement("div");

      selectionFrame.id =
        "desktop-selection-frame";

      document.body.appendChild(
        selectionFrame
      );

    }


    /* --------------------------------------------------------
       DESKTOP MOUSE DOWN
       -------------------------------------------------------- */

    desktop.addEventListener(
      "mousedown",
      onDesktopMouseDown,
      true
    );


    /* --------------------------------------------------------
       GLOBAL MOUSE MOVE
       -------------------------------------------------------- */

    document.addEventListener(
      "mousemove",
      onMouseMove,
      true
    );


    /* --------------------------------------------------------
       GLOBAL MOUSE UP
       -------------------------------------------------------- */

    document.addEventListener(
      "mouseup",
      onMouseUp,
      true
    );

  }


  /* ==========================================================
     GET SELECTED ICONS
     ========================================================== */

  function getSelectedIcons() {

    return Array.from(
      desktop.querySelectorAll(
        ".icon.desktop-selected"
      )
    );

  }


  /* ==========================================================
     CLEAR SELECTION
     ========================================================== */

  function clearSelection() {

    desktop
      .querySelectorAll(
        ".desktop-selected"
      )
      .forEach(function(icon) {

        icon.classList.remove(
          "desktop-selected"
        );

      });

  }


  /* ==========================================================
     DESKTOP MOUSE DOWN
     ========================================================== */

  function onDesktopMouseDown(event) {

    if (event.button !== 0) return;


    const icon =
      event.target.closest(".icon");


    /*
     * --------------------------------------------------------
     * CLICKED AN ICON
     * --------------------------------------------------------
     */

    if (icon) {

      /*
       * If this icon is already selected,
       * move ALL selected icons.
       */

      if (
        icon.classList.contains(
          "desktop-selected"
        )
      ) {

        draggedIcons =
          getSelectedIcons();

      }

      /*
       * Otherwise select only this icon.
       */

      else {

        clearSelection();

        icon.classList.add(
          "desktop-selected"
        );

        draggedIcons = [icon];

      }


      if (
        draggedIcons.length === 0
      ) {
        return;
      }


      /*
       * Start dragging.
       */

      dragging = true;

      dragStartX =
        event.clientX;

      dragStartY =
        event.clientY;


      /*
       * Remember every icon's starting position.
       */

      draggedIcons.forEach(
        function(selectedIcon) {

          const left =
            parseFloat(
              selectedIcon.style.left
            ) ||
            selectedIcon.offsetLeft;


          const top =
            parseFloat(
              selectedIcon.style.top
            ) ||
            selectedIcon.offsetTop;


          selectedIcon.dataset.dragStartLeft =
            left;

          selectedIcon.dataset.dragStartTop =
            top;

        }
      );


      event.preventDefault();

      return;
    }


    /*
     * --------------------------------------------------------
     * CLICKED A WINDOW
     * --------------------------------------------------------
     */

    if (
      event.target.closest(".window")
    ) {
      return;
    }


    /*
     * --------------------------------------------------------
     * START DESKTOP SELECTION
     * --------------------------------------------------------
     */

    selecting = true;

    startX = event.clientX;
    startY = event.clientY;


    selectionFrame.style.display =
      "block";

    selectionFrame.style.left =
      `${startX}px`;

    selectionFrame.style.top =
      `${startY}px`;

    selectionFrame.style.width =
      "0px";

    selectionFrame.style.height =
      "0px";


    /*
     * Clear previous selection.
     */

    clearSelection();


    event.preventDefault();

  }


  /* ==========================================================
     MOUSE MOVE
     ========================================================== */

  function onMouseMove(event) {


    /* --------------------------------------------------------
       MOVE SELECTED ICONS
       -------------------------------------------------------- */

    if (dragging) {

      const deltaX =
        event.clientX -
        dragStartX;


      const deltaY =
        event.clientY -
        dragStartY;


      draggedIcons.forEach(
        function(icon) {

          const originalLeft =
            parseFloat(
              icon.dataset.dragStartLeft
            );


          const originalTop =
            parseFloat(
              icon.dataset.dragStartTop
            );


          icon.style.left =
            `${originalLeft + deltaX}px`;

          icon.style.top =
            `${originalTop + deltaY}px`;

        }
      );


      return;
    }


    /* --------------------------------------------------------
       DRAW SELECTION RECTANGLE
       -------------------------------------------------------- */

    if (!selecting) {
      return;
    }


    const currentX =
      event.clientX;

    const currentY =
      event.clientY;


    const left =
      Math.min(
        startX,
        currentX
      );


    const top =
      Math.min(
        startY,
        currentY
      );


    const width =
      Math.abs(
        currentX -
        startX
      );


    const height =
      Math.abs(
        currentY -
        startY
      );


    selectionFrame.style.left =
      `${left}px`;

    selectionFrame.style.top =
      `${top}px`;

    selectionFrame.style.width =
      `${width}px`;

    selectionFrame.style.height =
      `${height}px`;


    /*
     * Get rectangle coordinates.
     */

    const selectionRect =
      selectionFrame.getBoundingClientRect();


    /*
     * Select every icon that intersects
     * the rectangle.
     */

    desktop
      .querySelectorAll(".icon")
      .forEach(function(icon) {

        const iconRect =
          icon.getBoundingClientRect();


        const intersects =
          iconRect.left <
            selectionRect.right &&

          iconRect.right >
            selectionRect.left &&

          iconRect.top <
            selectionRect.bottom &&

          iconRect.bottom >
            selectionRect.top;


        icon.classList.toggle(
          "desktop-selected",
          intersects
        );

      });

  }


  /* ==========================================================
     MOUSE UP
     ========================================================== */

  function onMouseUp() {


    /* --------------------------------------------------------
       FINISH ICON DRAG
       -------------------------------------------------------- */

    if (dragging) {

      dragging = false;


      /*
       * Snap every moved icon.
       */

      draggedIcons.forEach(
        function(icon) {

          snapIconToGrid(icon);


          delete icon.dataset.dragStartLeft;

          delete icon.dataset.dragStartTop;

        }
      );


      draggedIcons = [];

      return;
    }


    /* --------------------------------------------------------
       FINISH SELECTION
       -------------------------------------------------------- */

    if (selecting) {

      selecting = false;

      selectionFrame.style.display =
        "none";

    }

  }


  /* ==========================================================
     19 x 8 GRID
     ========================================================== */

  function snapIconToGrid(icon) {

    if (!icon || !desktop) {
      return;
    }


    const desktopWidth =
      desktop.clientWidth;

    const desktopHeight =
      desktop.clientHeight;


    if (
      desktopWidth <= 0 ||
      desktopHeight <= 0
    ) {
      return;
    }


    /*
     * Calculate actual grid-cell size.
     *
     * 19 columns across.
     * 8 rows vertically.
     */

    const cellWidth =
      desktopWidth /
      GRID_COLUMNS;


    const cellHeight =
      desktopHeight /
      GRID_ROWS;


    let left =
      parseFloat(
        icon.style.left
      );


    let top =
      parseFloat(
        icon.style.top
      );


    if (Number.isNaN(left)) {
      left = icon.offsetLeft;
    }


    if (Number.isNaN(top)) {
      top = icon.offsetTop;
    }


    /*
     * Find closest grid position.
     */

    let column =
      Math.round(
        left /
        cellWidth
      );


    let row =
      Math.round(
        top /
        cellHeight
      );


    /*
     * Keep inside 19 x 8.
     */

    column =
      Math.max(
        0,
        Math.min(
          GRID_COLUMNS - 1,
          column
        )
      );


    row =
      Math.max(
        0,
        Math.min(
          GRID_ROWS - 1,
          row
        )
      );


    /*
     * Apply snapped position.
     */

    icon.style.left =
      `${column * cellWidth}px`;

    icon.style.top =
      `${row * cellHeight}px`;

  }


  /* ==========================================================
     INITIALIZE
     ========================================================== */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      setup
    );

  }

  else {

    setup();

  }

})();



/* ============================================================
   ONEKO
   ============================================================ */

(function initOneko() {

  /*
   * Prevent loading Oneko twice.
   */

  if (
    document.querySelector(
      'script[data-oneko="true"]'
    )
  ) {
    return;
  }


  /*
   * Load Oneko from:
   *
   * /Oneko/oneko.js
   */

  const oneko =
    document.createElement(
      "script"
    );


  oneko.src =
    "/Oneko/oneko.js";


  oneko.dataset.oneko =
    "true";


  oneko.async = true;


  document.body.appendChild(
    oneko
  );

})();

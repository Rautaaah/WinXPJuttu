/* ==========================================================================
   DESKTOP ICON SYSTEM
   --------------------------------------------------------------------------
   Modular replacement for ad-hoc icon drag/selection code.

   Modules (each is independent and can be swapped/extended on its own):
     - Grid       : grid geometry + nearest-free-cell search
     - Selection  : drag-to-select rectangle + modifier-key multi-select
     - DragMove   : group dragging, free overlap while dragging, snap on release
     - Hover      : hover highlight box (separate from selection box)

   Usage:
     const desktopIconSystem = DesktopIconSystem.init({
       desktopSelector: '#desktop',
       iconSelector: '.icon',
       columns: 19,
       rows: 8,
     });

   Icons just need to be `position: absolute` children of the desktop
   container with `left`/`top` in px. Everything else is handled here.
   ========================================================================== */

const DesktopIconSystem = (function () {
  "use strict";

  /* ------------------------------------------------------------------
     GRID MODULE
     ------------------------------------------------------------------ */

  function createGrid(desktop, columns, rows) {
    function cellSize() {
      return {
        w: desktop.clientWidth / columns,
        h: desktop.clientHeight / rows,
      };
    }

    function toCell(x, y) {
      const { w, h } = cellSize();
      return {
        col: clamp(Math.round(x / w), 0, columns - 1),
        row: clamp(Math.round(y / h), 0, rows - 1),
      };
    }

    function toPixels(col, row) {
      const { w, h } = cellSize();
      return { x: col * w, y: row * h };
    }

    function clamp(v, min, max) {
      return Math.max(min, Math.min(max, v));
    }

    /*
     * Breadth-first search outward from the ideal cell to find the
     * nearest cell not already in `occupied`. Returns {col,row} or
     * null if the grid is completely full.
     */
    function nearestFreeCell(idealCol, idealRow, occupied) {
      const key = (c, r) => `${c},${r}`;

      if (!occupied.has(key(idealCol, idealRow))) {
        return { col: idealCol, row: idealRow };
      }

      const maxRadius = columns + rows;

      for (let radius = 1; radius <= maxRadius; radius++) {
        const candidates = [];

        for (let dc = -radius; dc <= radius; dc++) {
          for (let dr = -radius; dr <= radius; dr++) {
            // Only test the ring at this radius (Chebyshev distance),
            // not cells already tested at smaller radii.
            if (Math.max(Math.abs(dc), Math.abs(dr)) !== radius) continue;

            const col = idealCol + dc;
            const row = idealRow + dr;

            if (col < 0 || col >= columns || row < 0 || row >= rows) continue;
            if (occupied.has(key(col, row))) continue;

            candidates.push({
              col,
              row,
              dist: dc * dc + dr * dr, // true distance to pick the closest within the ring
            });
          }
        }

        if (candidates.length > 0) {
          candidates.sort((a, b) => a.dist - b.dist);
          return { col: candidates[0].col, row: candidates[0].row };
        }
      }

      return null; // grid is full
    }

    return { cellSize, toCell, toPixels, nearestFreeCell, columns, rows };
  }

  /* ------------------------------------------------------------------
     SHARED STATE HELPERS
     ------------------------------------------------------------------ */

  function getIconPosition(icon) {
    return {
      x: parseFloat(icon.style.left) || 0,
      y: parseFloat(icon.style.top) || 0,
    };
  }

  function setIconPosition(icon, x, y) {
    icon.style.left = `${Math.round(x)}px`;
    icon.style.top = `${Math.round(y)}px`;
  }

  function isModifierClick(event) {
    return event.shiftKey || event.ctrlKey || event.metaKey;
  }

  /* ------------------------------------------------------------------
     SELECTION MODULE
     ------------------------------------------------------------------ */

  function createSelectionModule({ desktop, iconSelector, onSelectionChange }) {
    const SELECTED_CLASS = "icon-selected";

    let selectionBox = document.getElementById("icon-selection-box");
    if (!selectionBox) {
      selectionBox = document.createElement("div");
      selectionBox.id = "icon-selection-box";
      selectionBox.className = "icon-selection-box";
      desktop.appendChild(selectionBox);
    }

    let isSelecting = false;
    let startX = 0;
    let startY = 0;

    function getIcons() {
      return Array.from(desktop.querySelectorAll(iconSelector));
    }

    function getSelected() {
      return Array.from(desktop.querySelectorAll(`${iconSelector}.${SELECTED_CLASS}`));
    }

    function clearSelection() {
      getSelected().forEach((icon) => icon.classList.remove(SELECTED_CLASS));
      onSelectionChange && onSelectionChange(getSelected());
    }

    function selectOnly(icon) {
      clearSelection();
      icon.classList.add(SELECTED_CLASS);
      onSelectionChange && onSelectionChange(getSelected());
    }

    function toggle(icon) {
      icon.classList.toggle(SELECTED_CLASS);
      onSelectionChange && onSelectionChange(getSelected());
    }

    function isSelected(icon) {
      return icon.classList.contains(SELECTED_CLASS);
    }

    /* Click handling: modifier = toggle, no modifier = replace selection.
       This only handles the "click an icon" case; drag start is handled
       by DragMove, which calls into this module to decide what's selected
       before a drag begins. */
    function handleIconMouseDown(icon, event) {
      if (isModifierClick(event)) {
        toggle(icon);
      } else if (!isSelected(icon)) {
        // Only replace selection if this icon isn't already part of a
        // multi-selection — clicking an already-selected icon (to drag
        // the group) must NOT clear the rest of the selection.
        selectOnly(icon);
      }
    }

    /* Rectangle drag-to-select. Ignores clicks that start on an icon. */
    function handleDesktopMouseDown(event) {
      if (event.button !== 0) return;
      if (event.target.closest(iconSelector)) return; // let icon handler run instead

      isSelecting = true;

      const rect = desktop.getBoundingClientRect();
      startX = event.clientX - rect.left;
      startY = event.clientY - rect.top;

      if (!isModifierClick(event)) {
        clearSelection();
      }

      Object.assign(selectionBox.style, {
        display: "block",
        left: `${startX}px`,
        top: `${startY}px`,
        width: "0px",
        height: "0px",
      });

      event.preventDefault();
    }

    function handleMouseMove(event) {
      if (!isSelecting) return;

      const rect = desktop.getBoundingClientRect();
      const currentX = event.clientX - rect.left;
      const currentY = event.clientY - rect.top;

      const left = Math.min(startX, currentX);
      const top = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      Object.assign(selectionBox.style, {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
      });

      const boxRect = {
        left,
        top,
        right: left + width,
        bottom: top + height,
      };

      getIcons().forEach((icon) => {
        const pos = getIconPosition(icon);
        const iconRect = {
          left: pos.x,
          top: pos.y,
          right: pos.x + icon.offsetWidth,
          bottom: pos.y + icon.offsetHeight,
        };

        const intersects =
          iconRect.left < boxRect.right &&
          iconRect.right > boxRect.left &&
          iconRect.top < boxRect.bottom &&
          iconRect.bottom > boxRect.top;

        icon.classList.toggle(SELECTED_CLASS, intersects);
      });

      onSelectionChange && onSelectionChange(getSelected());
    }

    function handleMouseUp() {
      if (!isSelecting) return;
      isSelecting = false;
      selectionBox.style.display = "none";
    }

    desktop.addEventListener("mousedown", handleDesktopMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return {
      getIcons,
      getSelected,
      clearSelection,
      selectOnly,
      toggle,
      isSelected,
      handleIconMouseDown,
      SELECTED_CLASS,
    };
  }

  /* ------------------------------------------------------------------
     DRAG + COLLISION + SNAP MODULE
     ------------------------------------------------------------------ */

  function createDragModule({ desktop, grid, selection }) {
    let dragging = false;
    let draggedIcons = [];
    let dragStartMouseX = 0;
    let dragStartMouseY = 0;
    let originalPositions = []; // [{icon, x, y}]

    function occupiedCellsExcluding(excludedIcons) {
      const excluded = new Set(excludedIcons);
      const occupied = new Set();

      selection.getIcons().forEach((icon) => {
        if (excluded.has(icon)) return;
        const pos = getIconPosition(icon);
        const cell = grid.toCell(pos.x, pos.y);
        occupied.add(`${cell.col},${cell.row}`);
      });

      return occupied;
    }

    function beginDrag(icon, event) {
      // Decide selection state first (handles modifier / replace logic),
      // unless the icon is already selected — in that case we drag the
      // existing multi-selection without altering it.
      if (!selection.isSelected(icon) && !isModifierClick(event)) {
        selection.selectOnly(icon);
      } else if (!selection.isSelected(icon)) {
        selection.toggle(icon);
      }

      draggedIcons = selection.isSelected(icon)
        ? selection.getSelected()
        : [icon];

      if (draggedIcons.length === 0) draggedIcons = [icon];

      dragging = true;
      dragStartMouseX = event.clientX;
      dragStartMouseY = event.clientY;

      originalPositions = draggedIcons.map((el) => {
        const pos = getIconPosition(el);
        return { icon: el, x: pos.x, y: pos.y };
      });

      draggedIcons.forEach((el) => el.classList.add("icon-dragging"));

      event.preventDefault();
    }

    function onMouseMove(event) {
      if (!dragging) return;

      const deltaX = event.clientX - dragStartMouseX;
      const deltaY = event.clientY - dragStartMouseY;

      // Free movement while dragging: no collision blocking, only
      // clamped to stay within the desktop bounds. Icons may visually
      // overlap each other during the drag.
      originalPositions.forEach(({ icon, x, y }) => {
        const maxX = Math.max(0, desktop.clientWidth - icon.offsetWidth);
        const maxY = Math.max(0, desktop.clientHeight - icon.offsetHeight);

        const newX = Math.max(0, Math.min(x + deltaX, maxX));
        const newY = Math.max(0, Math.min(y + deltaY, maxY));

        setIconPosition(icon, newX, newY);
      });
    }

    function onMouseUp() {
      if (!dragging) return;
      dragging = false;

      draggedIcons.forEach((el) => el.classList.remove("icon-dragging"));

      // Snap every dragged icon to its nearest free cell. Icons already
      // being dragged don't count as "occupied" for each other, so a
      // group can settle into adjacent free cells without blocking one
      // another — but two dragged icons will still never land on the
      // same cell (each claim marks that cell occupied for the rest of
      // the batch).
      const occupied = occupiedCellsExcluding(draggedIcons);

      // Process icons in the order the user is most likely to expect:
      // closest-to-original-target first isn't well defined for groups,
      // so we just process in a stable order (their current DOM order).
      draggedIcons.forEach((icon) => {
        const pos = getIconPosition(icon);
        const idealCell = grid.toCell(pos.x, pos.y);

        const freeCell = grid.nearestFreeCell(
          idealCell.col,
          idealCell.row,
          occupied
        );

        if (freeCell) {
          const px = grid.toPixels(freeCell.col, freeCell.row);
          setIconPosition(icon, px.x, px.y);
          occupied.add(`${freeCell.col},${freeCell.row}`);
          persistPosition(icon, px.x, px.y);
        } else {
          // Grid is full: fall back to the original position.
          const original = originalPositions.find((o) => o.icon === icon);
          if (original) {
            setIconPosition(icon, original.x, original.y);
          }
        }
      });

      draggedIcons = [];
      originalPositions = [];
    }

    function persistPosition(icon, x, y) {
      if (!icon.dataset.icon) return;
      try {
        localStorage.setItem(
          `desktop-icon-${icon.dataset.icon}`,
          JSON.stringify({ x: Math.round(x), y: Math.round(y) })
        );
      } catch (e) {
        /* storage unavailable — ignore */
      }
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return { beginDrag, isDragging: () => dragging };
  }

  /* ------------------------------------------------------------------
     HOVER MODULE
     ------------------------------------------------------------------ */

  function createHoverModule({ desktop, iconSelector, dragModule }) {
    let hoverBox = document.getElementById("icon-hover-box");
    if (!hoverBox) {
      hoverBox = document.createElement("div");
      hoverBox.id = "icon-hover-box";
      hoverBox.className = "icon-hover-box";
      desktop.appendChild(hoverBox);
    }

    function show(icon) {
      const pos = getIconPosition(icon);
      Object.assign(hoverBox.style, {
        display: "block",
        left: `${pos.x - 3}px`,
        top: `${pos.y - 3}px`,
        width: `${icon.offsetWidth + 6}px`,
        height: `${icon.offsetHeight + 6}px`,
      });
    }

    function hide() {
      hoverBox.style.display = "none";
    }

    desktop.addEventListener("mouseover", (event) => {
      const icon = event.target.closest(iconSelector);
      if (!icon || dragModule.isDragging()) return;
      show(icon);
    });

    desktop.addEventListener("mouseout", (event) => {
      const icon = event.target.closest(iconSelector);
      if (!icon) return;
      // Only hide if we're not moving into a child of the same icon.
      if (icon.contains(event.relatedTarget)) return;
      hide();
    });

    // Keep the box glued to the icon if it moves (e.g. another mechanism
    // repositions it while hovered) and hide it once dragging starts.
    document.addEventListener("mousemove", () => {
      if (dragModule.isDragging()) hide();
    });

    return { show, hide };
  }

  /* ------------------------------------------------------------------
     STYLES (injected once)
     ------------------------------------------------------------------ */

  function injectStyles() {
    if (document.getElementById("desktop-icon-system-styles")) return;

    const style = document.createElement("style");
    style.id = "desktop-icon-system-styles";
    style.textContent = `
      .icon-selection-box {
        position: absolute;
        display: none;
        pointer-events: none;
        z-index: 9998;
        box-sizing: border-box;
        border: 1px solid rgba(70, 150, 235, 0.95);
        background: rgba(80, 155, 235, 0.20);
      }

      .icon-hover-box {
        position: absolute;
        display: none;
        pointer-events: none;
        z-index: 9997;
        box-sizing: border-box;
        border: 1px dashed rgba(255, 255, 255, 0.75);
        background: rgba(255, 255, 255, 0.08);
        border-radius: 3px;
      }

      .icon-selected {
        background: rgba(70, 150, 235, 0.32) !important;
        outline: 1px solid rgba(120, 190, 255, 0.78);
      }

      .icon-dragging {
        opacity: 0.85;
        z-index: 9999;
      }
    `;
    document.head.appendChild(style);
  }

  /* ------------------------------------------------------------------
     PUBLIC INIT
     ------------------------------------------------------------------ */

  function init({ desktopSelector, iconSelector, columns = 19, rows = 8 }) {
    const desktop = document.querySelector(desktopSelector);
    if (!desktop) {
      console.warn(`DesktopIconSystem: no element matches "${desktopSelector}"`);
      return null;
    }

    injectStyles();

    const grid = createGrid(desktop, columns, rows);
    const selection = createSelectionModule({ desktop, iconSelector });
    const dragModule = createDragModule({ desktop, grid, selection });
    const hoverModule = createHoverModule({ desktop, iconSelector, dragModule });

    function attachIcon(icon) {
      icon.addEventListener("mousedown", (event) => {
        if (event.button !== 0) return;
        event.stopPropagation(); // don't let this bubble to the desktop's selection-box handler
        dragModule.beginDrag(icon, event);
      });
    }

    // Attach to icons already present, and watch for icons added later.
    Array.from(desktop.querySelectorAll(iconSelector)).forEach(attachIcon);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches && node.matches(iconSelector)) attachIcon(node);
          node.querySelectorAll &&
            node.querySelectorAll(iconSelector).forEach(attachIcon);
        });
      });
    });
    observer.observe(desktop, { childList: true, subtree: true });

    return { grid, selection, dragModule, hoverModule, observer };
  }

  return { init };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = DesktopIconSystem;
}

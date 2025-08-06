// assets/utils/focus.js

/**
 * Returns all focusable elements within a container.
 */
export function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}

/**
 * Traps keyboard navigation focus inside a container.
 */
export function trapFocus(container, elementToFocus = container) {
  removeTrapFocus(); // Ensure no double traps

  const elements = getFocusableElements(container);
  const first = elements[0];
  const last = elements[elements.length - 1];

  function keydownHandler(event) {
    if (event.code !== 'Tab' && event.key !== 'Tab') return;
    if (!elements.length) return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === first || document.activeElement === container) {
        event.preventDefault();
        last.focus();
      }
    } else {
      // Tab
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  document.addEventListener('keydown', keydownHandler);

  // Store handler for later removal
  container.__trapFocusKeydownHandler = keydownHandler;

  // Focus the desired element
  elementToFocus.focus();
  if (
    elementToFocus.tagName === 'INPUT' &&
    ['search', 'text', 'email', 'url'].includes(elementToFocus.type) &&
    elementToFocus.value
  ) {
    elementToFocus.setSelectionRange(0, elementToFocus.value.length);
  }
}

/**
 * Removes any trap focus handler attached to a container.
 */
export function removeTrapFocus(container = document) {
  const handler = container.__trapFocusKeydownHandler;
  if (handler) {
    document.removeEventListener('keydown', handler);
    delete container.__trapFocusKeydownHandler;
  }
}

/**
 * Optional: Closes any open <details> on Escape key, returning focus to the summary.
 */
export function onKeyUpEscape(event) {
  if (event.code !== 'Escape' && event.key !== 'Escape') return;

  const openDetailsElement = event.target.closest('details[open]');
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector('summary');
  openDetailsElement.removeAttribute('open');
  summaryElement?.setAttribute('aria-expanded', false);
  summaryElement?.focus();
}

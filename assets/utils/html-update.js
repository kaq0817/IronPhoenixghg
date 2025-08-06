// assets/utils/html-update.js

/**
 * Utility for safely replacing HTML content and handling view transitions
 */
export class HTMLUpdateUtility {
  /**
   * Swap an HTML node with new content using a double-buffer approach
   * @param {HTMLElement} oldNode
   * @param {HTMLElement} newContent
   * @param {Function[]} preProcessCallbacks
   * @param {Function[]} postProcessCallbacks
   */
  static viewTransition(oldNode, newContent, preProcessCallbacks = [], postProcessCallbacks = []) {
    preProcessCallbacks.forEach((callback) => callback(newContent));

    const newNodeWrapper = document.createElement('div');
    HTMLUpdateUtility.setInnerHTML(newNodeWrapper, newContent.outerHTML);
    const newNode = newNodeWrapper.firstChild;

    // Deduplicate IDs
    const uniqueKey = Date.now();
    oldNode.querySelectorAll('[id], [form]').forEach((element) => {
      if (element.id) element.id = `${element.id}-${uniqueKey}`;
      if (element.form) element.setAttribute('form', `${element.form.getAttribute('id')}-${uniqueKey}`);
    });

    oldNode.parentNode.insertBefore(newNode, oldNode);
    oldNode.style.display = 'none';

    postProcessCallbacks.forEach((callback) => callback(newNode));

    setTimeout(() => oldNode.remove(), 500);
  }

  /**
   * Safely inject HTML into a container and reinject <script> tags to allow execution
   * @param {HTMLElement} element
   * @param {string} html
   */
  static setInnerHTML(element, html) {
    element.innerHTML = html;
    element.querySelectorAll('script').forEach((oldScriptTag) => {
      const newScriptTag = document.createElement('script');
      Array.from(oldScriptTag.attributes).forEach((attr) => {
        newScriptTag.setAttribute(attr.name, attr.value);
      });
      newScriptTag.appendChild(document.createTextNode(oldScriptTag.innerHTML));
      oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
    });
  }
}

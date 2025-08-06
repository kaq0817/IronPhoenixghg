// assets/utils/media-utils.js

/**
 * Pauses all media elements on the page, including YouTube, Vimeo,
 * native <video> elements, and Shopify's <product-model> viewer.
 */
export function pauseAllMedia() {
  document.querySelectorAll('.js-youtube').forEach((video) => {
    video.contentWindow?.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      '*'
    );
  });

  document.querySelectorAll('.js-vimeo').forEach((video) => {
    video.contentWindow?.postMessage(
      '{"method":"pause"}',
      '*'
    );
  });

  document.querySelectorAll('video').forEach((video) => {
    video.pause?.();
  });

  document.querySelectorAll('product-model').forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause?.();
  });
}

/**
 * Loads deferred media content from a <template> inside the element.
 * Used for lazy loading videos, 3D models, and iframes.
 *
 * @param {HTMLElement} host - The element containing a <template> with deferred media.
 * @returns {HTMLElement} - The loaded media element.
 */
export function loadDeferredMedia(host) {
  if (!host || host.getAttribute('loaded')) return;

  const content = document.createElement('div');
  content.appendChild(host.querySelector('template')?.content.firstElementChild.cloneNode(true));
  host.setAttribute('loaded', true);

  const mediaEl = content.querySelector('video, model-viewer, iframe');
  if (!mediaEl) return;

  const injected = host.appendChild(mediaEl);

  if (mediaEl.nodeName === 'VIDEO' && mediaEl.getAttribute('autoplay')) {
    injected.play?.(); // Safari workaround
  }

  // Workaround for Safari iframe bug
  const prevStyle = injected.getAttribute('style');
  injected.setAttribute('style', 'display: block;');
  setTimeout(() => injected.setAttribute('style', prevStyle || ''), 0);

  return injected;
}

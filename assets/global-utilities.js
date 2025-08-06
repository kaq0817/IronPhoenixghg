// assets/utils/global-utilities.js

// Debounce
export function debounce(fn, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Throttle
export function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return fn(...args);
  };
}

// Pause all media
export function pauseAllMedia() {
  document.querySelectorAll('.js-youtube').forEach((video) => {
    video.contentWindow?.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      '*'
    );
  });
  document.querySelectorAll('.js-vimeo').forEach((video) => {
    video.contentWindow?.postMessage('{"method":"pause"}', '*');
  });
  document.querySelectorAll('video').forEach((video) => video.pause?.());
  document.querySelectorAll('product-model').forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause?.();
  });
}

// PubSub
export const PUB_SUB_EVENTS = {
  quantityUpdate: 'quantityUpdate',
  optionValueSelectionChange: 'optionValueSelectionChange',
};
const subscriptions = {};
export function subscribe(eventName, callback) {
  if (!subscriptions[eventName]) subscriptions[eventName] = [];
  subscriptions[eventName].push(callback);
  return () => {
    subscriptions[eventName] = subscriptions[eventName].filter(cb => cb !== callback);
  };
}
export function publish(eventName, data) {
  if (!subscriptions[eventName]) return;
  subscriptions[eventName].forEach(callback => callback(data));
}

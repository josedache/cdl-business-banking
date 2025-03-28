/**
 * @template C
 * @param {C} callback
 * @param {number} wait
 * @returns {C & {flush: Function, cancel: Function}}
 */
export function debounce<C extends Function>(callback: C, wait = 0) {
  let debounceTimer: any;
  let triggerArgs: any;
  let triggerThis: any;

  function trigger(this: any, ...arg: any[]) {
    triggerArgs = arg;
    triggerThis = this;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      callback.apply(triggerThis, triggerArgs);
    }, wait);
  }

  trigger.cancel = () => clearTimeout(debounceTimer);
  trigger.flush = () => {
    clearTimeout(debounceTimer);
    callback.apply(triggerThis, triggerArgs);
  };

  return trigger as unknown as C & { flush: Function; cancel: Function };
}

export default debounce;

import { debounce } from "utils/function/debounce";
import { useEffect, useMemo, useState } from "react";

interface Options {
  wait?: number;
  enableReInitialize?: boolean;
}

function useDebouncedState<T>(initialState?: T, options: Options = {}) {
  const { wait = 100, enableReInitialize = false } = options;
  const [state, setState] = useState<T | undefined>(initialState);

  const debouncedSetState = useMemo(
    () => debounce(setState, wait),
    [wait]
  );

  useEffect(() => {
    if (enableReInitialize) {
      debouncedSetState(initialState);
    }
  }, [debouncedSetState, enableReInitialize, initialState]);

  return [state, debouncedSetState] as [T, typeof debouncedSetState];
}

export default useDebouncedState;

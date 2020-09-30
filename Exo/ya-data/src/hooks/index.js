//
// custom hooks
//
import { useState, useEffect, useCallback, useMemo } from "react";

export function useFetch(uri) {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uri) return;

    fetch(uri)
      .then(data => data.json())
      .then(setData)
      .then(() => setLoading(false))
      .catch(setError);
  }, [uri]);

  return { loading, data, error };
}

export const useIterator = (items = [], initVal = 0) => {
  const [ix, setIndex] = useState(initVal);

  const prev = useCallback(() => {
    if (ix === 0) return setIndex(items.length - 1);
    setIndex(ix - 1);
  }, [ix, items.length]);

  const next = useCallback(() => {
    if (ix === items.length - 1) return setIndex(0);
    setIndex(ix + 1);
  }, [ix, items.length]);

  const item = useMemo(() => items[ix], [ix, items]);

  return [item || items[0], prev, next];
};

export const useInput = initVal => {
  const [value, setValue] = useState(initVal);

  return [
    { value, onChange: evt => setValue(evt.target.value) },
    () => setValue(initVal)
  ];
};

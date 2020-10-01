//
// custom hooks
//
import { useState, useEffect, useCallback, useMemo } from "react";
import useMountedRef from "../useMountedRef";

// define the data fetch-er
export const useFetch = (uri) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const mounted = useMountedRef();

  useEffect(() => {
    if (!uri) return;
    if (!mounted.current) return;

    fetch(uri)
      .then((data) => {
        if (!mounted.current) throw new Error("component is not mounted");
        return data;
      })
      .then((data) => data.json())
      .then(setData)
      .then(() => setLoading(false))
      .catch((err) => {
        if (!mounted.current) return;
        setError(err);
      });
  }, [uri, mounted]); // if uri changes => fetch dat at that uri

  return { loading, data, error };
};

// define iterator
export const useIterator = (items = [], initVal = 0) => {
  const [ix, setIndex] = useState(initVal);

  const prev = useCallback(() => {
    if (ix === 0) return setIndex(items.length - 1);
    setIndex(ix - 1);
  }, [ix, items.length]); // if ix changes or items length => change prev

  const next = useCallback(() => {
    if (ix === items.length - 1) return setIndex(0);
    setIndex(ix + 1);
  }, [ix, items.length]); // same logic as above for next

  const item = useMemo(() => items[ix], [ix, items]); // ditto

  return [item || items[0], prev, next];
};

// define useInput (reset function)
export const useInput = (initVal) => {
  const [value, setValue] = useState(initVal);

  return [{ value, onChange: (evt) => setValue(evt.target.value) }, () => setValue(initVal)];
};

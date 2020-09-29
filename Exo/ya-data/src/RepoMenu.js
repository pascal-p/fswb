import React, { useEffect } from "react";

import { useIterator } from "./hooks";
import RepoReadme from "./RepoReadme"

export default function RepoMenu({ login, repositories, onSelect = f => f }) {
  const [{ name }, previous, next] = useIterator(repositories);

  useEffect(() => {
    if (!name) return;

    onSelect(name);
  }, [name, onSelect]);

  return (
    <>
      <div style={{ display: "flex" }}>
        <button onClick={previous}>&lt;</button>
        <p><strong>{name}</strong></p>
        <button onClick={next}>&gt;</button>
      </div>
      <RepoReadme login={login} repo={name} />
    </>
  );
}

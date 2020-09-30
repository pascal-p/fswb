import React from "react";

import { Fetch } from "./Fetch";
import RepoMenu from "./RepoMenu";

export function UserRepo({ login, repo, onSelect = f => f }) {
  return (
    <Fetch uri={`https://api.github.com/users/${login}/repos`}
      renderSuccess={({ data }) => (
        <RepoMenu login={login} repositories={data} selected={repo} onSelect={onSelect} />
      )}
    />
  );
}

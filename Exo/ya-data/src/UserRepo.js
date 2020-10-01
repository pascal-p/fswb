import React from "react";
import PropTypes from "prop-types";

import { Fetch } from "./Fetch";
import RepoMenu from "./RepoMenu";

export function UserRepo({ login, repo, onSelect = (f) => f }) {
  return (
    <Fetch
      uri={`https://api.github.com/users/${login}/repos`}
      renderSuccess={({ data }) => (
        <RepoMenu repositories={data} selected={repo} onSelect={onSelect} />
      )}
    />
  );
}

UserRepo.propTypes = {
  login: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};

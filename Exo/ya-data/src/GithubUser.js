import React from "react";
import PropTypes from "prop-types";

import { Fetch } from "./Fetch";

export default function GithubUser({ login }) {
  return <Fetch uri={`https://api.github.com/users/${login}`} renderSuccess={UserDetails} />;
}

// avoid eslint error: 5:38  error  'login' is missing in props validation
GithubUser.propTypes = {
  login: PropTypes.string.isRequired
};

function UserDetails({ data }) {
  return (
    <div className="githubUser">
      <img src={data.avatar_url} alt={data.login} style={{ width: 200 }} />

      <div>
        <h1>{data.login}</h1>
        {data.name && (
          <p>
            Name: <strong>{data.name}</strong>
          </p>
        )}
        {data.location && (
          <p>
            Location: <strong>{data.location}</strong>
          </p>
        )}
        {data.company && (
          <p>
            Comp.: <strong>{data.company}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

// avoid eslint error: 12:24  error  'data' is missing in props validation
UserDetails.propTypes = {
  data: PropTypes.object.isRequired
};

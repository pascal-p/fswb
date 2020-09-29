import React from 'react';

import { UserRepo } from "./UserRepo";
import { Fetch } from "./Fetch";

function UserDetails({ data }) {
  return (
    <div className="githubUser">
      <img src={data.avatar_url} alt={data.login} style={{ width: 200 }} />

      <div>
        <h1>{data.login}</h1>
        {data.name && <p>Name: <strong>{data.name}</strong></p>}
        {data.location && <p>Location: <strong>{data.location}</strong></p>}
        {data.company && <p>Comp.: <strong>{data.company}</strong></p>}
      </div>

      <UserRepo
        login={data.login}
        onSelect={repoName => console.log(`${repoName} selected`)} />
    </div>
  );
}

function GitHubUser({ login }) {
  return (
    <Fetch uri={`https://api.github.com/users/${login}`}
      renderSuccess={UserDetails} />
  );
}

export default function App() {
  return <GitHubUser login="pascal-p" />;
}

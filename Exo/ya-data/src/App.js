import React, { useState } from 'react';

import SearchForm from "./SearchForm";
import GithubUser from "./GithubUser";
import { UserRepo } from "./UserRepo";
import RepoReadme  from "./RepoReadme"

export default function App() {
  const [login] = useState(""); // const [login, setLogin] = useState(""); // pascal-p
  const [repo, setRepo] = useState(""); // Algo

  /*
  const handleSearch = log_in => {
    if (log_in) return setLogin(log_in);

    setLogin("");
    setRepo("");
  };

  if (!login)
    return (
        <SearchForm value={login} onSearch={handleSearch} />
    );
  */

  // <SearchForm value={login} onSearch={handleSearch} />
  // <SearchForm value={login} onSearch={setLogin} />

  return (
    <>
      <SearchForm />
      { console.log("in App.js after search form / login is: ", login) }
      {login && <GithubUser login={login} />}
      {login && (<UserRepo login={login} repo={repo} onSelect={setRepo} />)}
      {login && repo && (<RepoReadme login={login} repo={repo} />)}
      { console.log("in App.js - done ") }
    </>
  )
}

import React, { useState } from "react";

import SearchForm from "./SearchForm";
import GithubUser from "./GithubUser";
import { UserRepo } from "./UserRepo";
import RepoReadme from "./RepoReadme";

const nonBlank = (input) => {
  return input.replace(/\s+/, "");
};

export default function App() {
  const [login, setLogin] = useState("");
  const [repo, setRepo] = useState("");

  const handleSearch = (log_in) => {
    if (log_in) return setLogin(log_in);
    setLogin("");
    setRepo("");
  };

  if (!login) return <SearchForm value={login} onSearch={handleSearch} />;

  return (
    <>
      <SearchForm value={login} onSearch={handleSearch} />
      {nonBlank(login) && <GithubUser login={login} />}
      {nonBlank(login) && <UserRepo login={login} repo={repo} onSelect={setRepo} />}
      {nonBlank(login) && repo && <RepoReadme login={login} repo={repo} />}
    </>
  );
}

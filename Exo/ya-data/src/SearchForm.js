import React, { useState }  from "react";

import { useInput } from "./hooks";


export default function SearchForm({ _value, onSearch = f => f }) {
  const [login, resetLogin] = useInput("");
  const [, setLogin] = useState();

  const submit = evt => {
    evt.preventDefault();
    console.log("login is: ", login, " / login.state: ", login.value);

    resetLogin();
    return setLogin(login.value);
  };

  return (
    <form onSubmit={submit}>
      <input {...login} type="text" placeholder="name..." required />
      <button>search</button>
    </form>
  );
}

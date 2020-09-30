import React, { useState }  from "react";
// import PropTypes from 'prop-types';

import { useInput } from "./hooks";


// export default function SearchForm({ onSearch = f => f }) {
export default function SearchForm() {
  const [login, resetLogin] = useInput("");
  const [, setLogin] = useState();

  const submit = evt => {
    evt.preventDefault();
    console.log("login is: ", login, " / login.state: ", login.value);

    setLogin(login.value);
    resetLogin();
    // return setLogin(login.value);
  };

  return (
    <form onSubmit={submit}>
      <input {...login} type="text" placeholder="name..." required />
      <button>search</button>
    </form>
  );
}

/*
SearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired
}
*/

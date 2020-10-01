import React from "react";
import PropTypes from "prop-types";

import { useInput } from "./hooks";

export default function SearchForm({ onSearch = (f) => f }) {
  const [login, resetLogin] = useInput("");

  const submit = (evt) => {
    evt.preventDefault();
    onSearch(login.value);
    resetLogin();
  };

  return (
    <form onSubmit={(e) => submit(e)}>
      <input {...login} type="text" placeholder="name..." required />
      <button>search</button>
    </form>
  );
}

SearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired
};

import React, { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import ReactMarkdown from "react-markdown";

export default function RepoReadme({ login, repo }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [markdown, setMarkdown] = useState("");

  const loadReadme = useCallback(async (login, repo) => {
    setLoading(true);

    const uri = `https://api.github.com/repos/${login}/${repo}/readme`;
    const { download_url } = await fetch(uri).then(res => res.json());
    const markdown = await fetch(download_url).then(res => res.text());

    setMarkdown(markdown);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!repo || !login) return;

    loadReadme(login, repo).catch(setError);
  }, [repo, loadReadme, login]);

  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
  if (loading) return <p>Loading...</p>;

  return <ReactMarkdown source={markdown} />;
}

RepoReadme.propTypes = {
  login: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired
}

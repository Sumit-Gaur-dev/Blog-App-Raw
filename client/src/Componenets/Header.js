import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContexts } from "../Contexts/UserContexts";

// use Link instead of a because of React-Router
export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContexts);

  // then((info) => setUserInfo(info));
  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      response.json().then((info) => setUserInfo(info));
    });
  }, []);

  function logout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        My Blog
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create New Post</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

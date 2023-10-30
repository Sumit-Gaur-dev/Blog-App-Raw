import React, { useState } from "react";

function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const register = async (e) => {
    e.preventDefault();

    // Sending Data to DB
    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ userName, password }),
      headers: { "Content-Type": "application/json" },
    });

    // Catching Error if Occured
    if (response.status !== 200) {
      alert("Registration failed. Try Again");
    } else {
      alert("Registration Successful");
    }
  };

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Yout Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="Password"
        placeholder="Yout Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Register</button>
    </form>
  );
}

export default RegisterPage;

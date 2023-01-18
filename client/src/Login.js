import { useState, useContext } from "react";
import axios from "axios";
import UserContext from "./UserContext";
import { Redirect } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const { setUser } = useContext(UserContext);

  function loginUser(e) {
    e.preventDefault();

    const data = { email, password };
    axios
      .post("http://localhost:4000/login", data, { withCredentials: true })
      .then((response) => {
        setUser(response.data);
        setEmail("");
        setPassword("");
        setLoginError(false);
        setRedirect(true);
      })
      .catch(() => {
        setLoginError(true);
      });
  }

  if (redirect) {
    return <Redirect to={"/"} />;
  }

  return (
    <form action="" onSubmit={(e) => loginUser(e)}>
      <h1>Login</h1>
      {loginError && <div>LOGIN ERROR! WRONG EMAIL OR PASSWORD!</div>}
      <input
        type="email"
        required
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        required
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button type="submit">log in</button>
    </form>
  );
}

export default Login;

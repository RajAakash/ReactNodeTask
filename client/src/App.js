import "./App.css";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./Register";
import UserContext from "./UserContext";
import axios from "axios";
import Login from "./Login";
import Home from "./Home";

const App = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:4000/user", { withCredentials: true })
      .then((response) => {
        // setUser(response.data.data);
        console.log("response", response);
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoading(false);
      });
    console.log(user);
  }, []);

  const logout = () => {
    axios
      .post("http://localhost:4000/logout", {}, { withCredentials: true })
      .then(() => setUser({}));
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        {console.log("user", user)}
        {loading ? (
          <h1>Loading</h1>
        ) : (
          <nav>
            <Link to={"/"}>Home</Link>
            {user.email ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              >
                Logout
              </button>
            ) : (
              <>
                <Link to={"/login"}>Login</Link>
                <Link to={"/register"}>Register</Link>
              </>
            )}
          </nav>
        )}

        <main>
          <Switch>
            <Route exact path={"/"} component={Home} />
            <Route exact path={"/register"} component={Register} />
            <Route exact path={"/login"} component={Login} />
          </Switch>
        </main>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;

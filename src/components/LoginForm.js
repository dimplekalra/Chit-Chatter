import React, { useState } from "react";

import "materialize-css/dist/css/materialize.min.css";
const Login = (props) => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [passShow, setPasswordShow] = useState(false);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, password } = user;

    props.userLogin({ username, password });
  };

  return (
    <div className="row">
      <form
        action=""
        className="col s12 m6 push-m3 l6 login-form z-depth-1 "
        onSubmit={handleSubmit}
      >
        <h4>Login User</h4>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">person</i>
            <input
              type="text"
              className="validate"
              name="username"
              id="Username"
              //placeholder="Enter Username"
              value={user.username}
              onChange={handleChange}
            />
            <label htmlFor="Username">Username</label>
          </div>

          <div className="input-field col s12">
            <i className="material-icons prefix">vpn_key</i>
            <input
              type={`${passShow ? "text" : "password"}`}
              className="validate"
              name="password"
              id="Password"
              //placeholder="Enter password"
              value={user.password}
              onChange={handleChange}
            />
            <label htmlFor="Password">Password</label>
            <div
              className="passwordShow"
              onClick={(e) => setPasswordShow(!passShow)}
            >
              <i className={`material-icons ${passShow ? "red-text" : null}`}>
                remove_red_eye
              </i>
            </div>
          </div>
          {props.loginError.length ? (
            <div className="center red-text error">
              Must Enter Valid UserName And Password
            </div>
          ) : null}
          <button
            type="submit"
            className="btn waves-effect waves-light col s8 push-s2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

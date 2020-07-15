import React, { useState } from "react";
// import PropTypes from "prop-types";

// import "@material/react-material-icon/dist/material-icon.css";

import "materialize-css/dist/css/materialize.min.css";
const Register = (props) => {
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

    props.userRegistration(user);
  };

  return (
    <div className="row">
      <form
        action=""
        className="col s12 m6 push-m3 l6 register-form z-depth-1 "
        onSubmit={handleSubmit}
      >
        <h4>Register User</h4>
        <div className="row">
          <div className="input-field col s12">
            <i className="material-icons prefix">person</i>
            <input
              type="text"
              className="validate"
              name="username"
              id="Username"
              //placeholder=" Enter a Username"
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
              //placeholder="Enter a password"
              value={user.password}
              onChange={handleChange}
            />
            <label htmlFor="Password">Password</label>
            <div
              className={`passwordShow `}
              onClick={(e) => setPasswordShow(!passShow)}
            >
              <i className={`material-icons ${passShow ? "red-text" : null}`}>
                remove_red_eye
              </i>
            </div>
          </div>
          {props.registerationError.length ? (
            <div className="red-text center error">
              {
                props.registerationError[props.registerationError.length - 1]
                  .response.data.error
              }
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

export default Register;

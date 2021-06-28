import React, { useState } from "react";
// import PropTypes from "prop-types";
import Input from "../controls/Input";
// import "@material/react-material-icon/dist/material-icon.css";

import "materialize-css/dist/css/materialize.min.css";
import { validateName, validatePassword } from "../common/validateInputs";
const Register = (props) => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [passShow, setPasswordShow] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [isErrorThere, setIsErrorThere] = useState(false);
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMessage = errors;
    let isError = false;

    switch (name) {
      case "username": {
        const { error, message } = validateName(value);
        if (error) {
          errorMessage.username = message;
          isError = true;
        } else {
          errorMessage.username = "";
        }
        break;
      }

      case "password": {
        const { error, message } = validatePassword(value);

        if (error) {
          errorMessage.password = message;
          isError = true;
        } else {
          errorMessage.password = "";
        }
        break;
      }

      default:
        return;
    }

    setErrors(errorMessage);
    setIsErrorThere(isError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      validateName(user.username).error ||
      validatePassword(user.password).error
    ) {
      alert("Please fill out the fields properly");
      return;
    }

    await props.userRegistration(user);
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
            <Input
              type="text"
              onChange={handleChange}
              name="username"
              id="Username"
              value={user.username}
              important={true}
              onBlur={handleBlur}
              placeholder=" Enter a Username"
              error={errors.username}
              icon="person"
            />
          </div>

          <div className="input-field col s12">
            <Input
              type={`${passShow ? "text" : "password"}`}
              onChange={handleChange}
              name="password"
              id="Password"
              value={user.password}
              important={true}
              onBlur={handleBlur}
              error={errors.password}
              icon="security"
            />

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
            disabled={isErrorThere}
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

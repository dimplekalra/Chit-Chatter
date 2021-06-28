import React, { useState } from "react";
import Input from "../controls/Input";
import { validateName, validatePassword } from "../common/validateInputs";
import "materialize-css/dist/css/materialize.min.css";
const Login = (props) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      validateName(user.username).error ||
      validatePassword(user.password).error
    ) {
      alert("Please fill out the fields properly");
      return;
    }
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
            disabled={isErrorThere}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

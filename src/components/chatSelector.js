import React from "react";

const ChatSelector = (props) => {
  const {
    handleChange,

    loginError,
    handleGuestSignin,
    handleGuestRegister,
  } = props;

  return (
    <div className="section container center">
      <div className="chatapp-form-guest">
        <h3>Guest Login</h3>
        <p>Login , Register or Enter as Guest</p>
        <form>
          <div className="input-field">
            <label htmlFor="guestSignup">Guest</label>
            <input
              type="text"
              onChange={handleChange}
              className="validation"
              name="guestSignup"
              placeholder="Enter as guest"
              required={true}
            />
          </div>

          <button
            className="btn waves-light waves-dark center"
            onClick={handleGuestSignin}
          >
            Login
          </button>
          <button
            className="btn waves-light waves-dark center "
            onClick={handleGuestRegister}
          >
            SignUp
          </button>
        </form>
        {loginError.length ? (
          <p className="red-text">
            {loginError[loginError.length - 1].response.data.error}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default ChatSelector;

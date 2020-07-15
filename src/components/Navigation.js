import React from "react";

const Navigation = (props) => {
  const {
    displayForms,
    id,
    userLogout,
    username,
    guestUsername,
    closeForm,
  } = props;

  return (
    <nav>
      <div className="nav-wrapper">
        <a
          href="/"
          className="brand-logo"
          onClick={(e) => {
            if (!username) closeForm();
          }}
        >
          Home
        </a>
        <a href="#!" className="sidenav-trigger" data-target="mobile">
          <i className="material-icons">menu</i>
        </a>
        <ul className="right hide-on-med-and-down">
          {username && id ? (
            <>
              <li>
                {username ? username : guestUsername ? guestUsername : null}
              </li>
              <li>
                <a href="#!" onClick={userLogout}>
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="#!" onClick={() => displayForms("login")}>
                  Login
                </a>
              </li>
              <li>
                <a href="#!" onClick={() => displayForms("register")}>
                  Register
                </a>
              </li>
            </>
          )}
        </ul>

        <ul className="sidenav" id="mobile">
          {username && id ? (
            <>
              <li>{username}</li>
              <li>
                <a href="#!" onClick={userLogout}>
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="#!" onClick={() => displayForms("login")}>
                  Login
                </a>
              </li>
              <li>
                <a href="#!" onClick={() => displayForms("register")}>
                  Register
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;

import React, { useState } from "react";
//import M from "materialize-css";
// import { Button, Icon } from "react-materialize";
//import "materialize-css/dist/css/materialize.min.css";

const AddChannelButton = (props) => {
  const [showmenu, setShow] = useState(false);

  const handleClick = (e) => {
    setShow(!showmenu);
  };

  const closeMenu = () => {
    setShow(false);
  };

  const create = (e) => {
    createChannel(e);
    closeMenu();
  };

  const { handleChange, createChannel } = props;

  return (
    <div className="channel__add--popup">
      {showmenu ? (
        <div className="channelSearch">
          <div className="input-field">
            <form action="" onSubmit={create}>
              <label htmlFor="channelName">
                <i className="material-icons">search</i>
              </label>
              <input
                type="text"
                id="channelName"
                onChange={handleChange}
                name="createInput"
                placeholder="channel Name"
                required={true}
              />
            </form>
          </div>

          <button
            className="btn waves-effect waves-light btn-floating"
            onClick={closeMenu}
          >
            <i className="material-icons">close</i>
          </button>
        </div>
      ) : (
        <button
          className="btn waves-effect waves-light btn-floating"
          onClick={handleClick}
        >
          <i className="material-icons">add</i>
        </button>
      )}
    </div>
  );
};

export default AddChannelButton;

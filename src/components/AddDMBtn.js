import React, { useState } from "react";

const AddDMBtn = (props) => {
  const [showmenu, setShow] = useState(false);

  const handleClick = () => {
    setShow(!showmenu);
  };

  const closeMenu = () => {
    setShow(false);
  };

  const { handleChange, startConversation, directMessageErrorLog } = props;

  return (
    <div className="channel-add add-chanl">
      {showmenu ? (
        <div>
          {directMessageErrorLog.length ? <div>Error is there</div> : null}

          <div className="channel-search">
            <form action="" onSubmit={startConversation}>
              <input
                type="text"
                onChange={handleChange}
                name="startDMInput"
                placeholder="Recipient Name"
              />
            </form>
            <button className="close-btn btn btn-floating" onClick={closeMenu}>
              <i className="material-icons">close</i>
            </button>
          </div>
        </div>
      ) : (
        <button onClick={handleClick} className="btn waves-effect waves-light">
          <i className="material-icons">add</i>
        </button>
      )}
    </div>
  );
};

export default AddDMBtn;

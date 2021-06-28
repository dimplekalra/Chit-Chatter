import React, { useEffect, useRef, useState } from "react";
import M from "materialize-css";
import { filterList } from "../common/utility";
import Search from "../controls/Search";
import Modal from "../controls/Modal";

const AddDMBtn = (props) => {
  const [showmenu, setShow] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([...props.users]);
  const [search, setSearch] = useState("");
  const [modalInstance, setModalInstance] = useState(null);

  useEffect(() => {
    const instance = M.Modal.init(modalRef.current);
    setFilteredUsers(props.users);
    setModalInstance(instance);
  }, [props.users.length]);

  const onSearch = (e) => {
    const { value } = e.target;
    setSearch(e.target.value);
    if (value && value.length) {
      setFilteredUsers(filterList(e.target.value, filteredUsers, "users"));
    } else setFilteredUsers(props.users);
  };

  const modalRef = useRef();

  const [selectedUser, setSelectedUser] = useState("");
  const handleChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleClick = () => {
    setShow(true);

    modalInstance.open();
  };

  const closeMenu = () => {
    setShow(false);
  };

  const startConv = (e) => {
    closeMenu();
    startConversation(selectedUser);
  };

  const usersList = () => {
    return (
      <>
        <Search search={search} handleChange={onSearch} />
        <form>
          {filteredUsers && filteredUsers.length ? (
            <>
              {filteredUsers
                .filter((val) => val.username !== props.username)
                .map((val, idx) => {
                  return (
                    <p key={"users " + idx}>
                      <label>
                        <input
                          name={val.username}
                          type="radio"
                          onChange={handleChange}
                          value={val.username}
                          checked={selectedUser === val.username}
                        />
                        <span>{val.username}</span>
                      </label>
                    </p>
                  );
                })}
            </>
          ) : null}
        </form>
      </>
    );
  };

  const handleRequestClose = () => {
    closeMenu();
    modalInstance.close();
  };

  const handleSelection = (e) => {
    startConv();
  };

  const { startConversation, directMessageErrorLog } = props;

  return (
    <div className="channel-add add-chanl">
      <Modal
        ref={modalRef}
        onCancel={handleRequestClose}
        onConfirm={handleSelection}
        confirmButton="add"
        cancelButton="close"
        title="Users"
      >
        {usersList()}
      </Modal>

      {directMessageErrorLog.length ? (
        <p className="red-text center-align">
          {
            directMessageErrorLog[directMessageErrorLog.length - 1].response
              .data.error
          }
        </p>
      ) : null}
      {/* <div className="channel-search">
            <form action="" onSubmit={startConv}>
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
          </div> */}
      {showmenu ? (
        <>{}</>
      ) : (
        <button
          style={{
            display: props.users && props.users.length > 1 ? "block" : "none",
          }}
          className="btn waves-effect waves-light"
          onClick={handleClick}
        >
          <i className="material-icons">add</i>
          {/* <a
          href="!"
          ref={dropdownRef}
          onClick={handleClick}
          className="btn waves-effect waves-light"
        >
          <i className="material-icons">add</i>
            </a> */}
        </button>
      )}
    </div>
  );
};

export default AddDMBtn;

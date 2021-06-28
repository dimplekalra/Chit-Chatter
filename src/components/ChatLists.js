import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import AddChannelBtn from "./AddChannelBtn";
import AddDMBtn from "./AddDMBtn";
import M from "materialize-css";
import Modal from "../controls/Modal";
import { filterList, removeDuplicates } from "../common/utility";
import Search from "../controls/Search";

const API_URL = "http://localhost:5000/api";

const ChatLists = (props) => {
  const [users, setUsers] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [search, setSearch] = useState("");
  const [channels, setChannels] = useState([]);
  const [modalInstance, setModalInstance] = useState(null);
  useEffect(() => {
    props.getUsersConversations();
    getUsersList();
    getChannelList();
    const instance = M.Modal.init(modalRef.current);

    setModalInstance(instance);
  }, []);

  const [selectedChannel, setSelectedChannel] = useState("");

  const modalRef = useRef();

  const handleRequestClose = () => {
    modalInstance.close();
  };

  const handleSelection = (e) => {
    props.joinChannel(selectedChannel);
  };

  const onSearch = (e) => {
    const { value } = e.target;
    setSearch(e.target.value);
    if (value && value.length) {
      setFilteredChannels(
        filterList(e.target.value, filteredChannels, "channels")
      );
    } else setFilteredChannels(channels);
  };

  const channelList = () => {
    const channelNameList = filteredChannels.map((val) => val.channelName);

    return (
      <>
        <Search search={search} handleChange={onSearch} />
        <form>
          {channelNameList && channelNameList.length ? (
            <>
              {removeDuplicates(channelNameList)
                .filter(
                  (val) =>
                    val.toLowerCase() !== props.currentChannel.toLowerCase()
                )
                .map((val, idx) => {
                  return (
                    <p key={"channels " + idx}>
                      <label>
                        <input
                          name={val}
                          type="radio"
                          onChange={(e) => setSelectedChannel(e.target.value)}
                          value={val}
                          checked={selectedChannel === val}
                        />
                        <span>{val}</span>
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

  const {
    usersChannel,
    handleChange,
    handleSubmit,
    createChannel,
    removeChannel,
    joinChannel,
    usersDirectMessages,
    leaveConversation,
    choosePrivateMessageRecipient,
  } = props;

  const getChannelList = async () => {
    try {
      const { token } = props;

      const result = await axios.get(`${API_URL}/chat/channels/list`, {
        headers: { Authorization: token },
      });

      if (!result.data) throw new Error("Not Found");

      if (!result.data.channels) throw new Error("No Channel Found");

      setChannels(result.data.channels);
      setFilteredChannels(result.data.channels);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getUsersList = async () => {
    try {
      const { token } = props;

      const result = await axios.get(`${API_URL}/user/list`, {
        headers: { Authorization: token },
      });

      if (!result.data) throw new Error("Not Found");

      if (!result.data.users) throw new Error("No User Found");

      setUsers(result.data.users);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="channels-container collection">
      <div className="channels-add collection-item">
        <p>channels</p>

        <span className="secondary">
          <div className="row">
            <div className="col s6 left">
              <AddChannelBtn
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                createChannel={createChannel}
              />
            </div>
            <div className="col s6 right">
              <button
                style={{
                  display: channels && channels.length > 1 ? "block" : "none",
                }}
                className="btn waves-light waves-effect teal "
                onClick={(e) => modalInstance.open()}
              >
                Join
              </button>
            </div>
          </div>
        </span>
      </div>
      <Modal
        ref={modalRef}
        onCancel={handleRequestClose}
        onConfirm={handleSelection}
        confirmButton="join"
        cancelButton="close"
        title="Channels"
      >
        {channelList()}
      </Modal>
      {usersChannel ? (
        <ul>
          {usersChannel.map((channel, index) => {
            return (
              <li
                className="collection-item"
                onClick={() => joinChannel(channel)}
                key={`userchannels - ${index}`}
              >
                <p>{channel}</p>
                {channel !== "Public-Main" ? (
                  <button
                    className="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeChannel(channel);
                    }}
                  >
                    X
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className="channels-container">
        <div className="channels-add collection-item">
          <p>Private Messages</p>
          <span className="secondary">
            <AddDMBtn {...props} users={users} />
          </span>
        </div>

        {usersDirectMessages.length ? (
          <ul>
            {usersDirectMessages.map((conversation, index) => {
              return (
                <li
                  className="collection-item"
                  onClick={() => choosePrivateMessageRecipient(conversation)}
                  key={`convoId - ${index}`}
                >
                  <p>{conversation.username}</p>
                  <span className="secondary">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        leaveConversation(
                          conversation._id,
                          conversation.username
                        );
                      }}
                    >
                      X
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default ChatLists;

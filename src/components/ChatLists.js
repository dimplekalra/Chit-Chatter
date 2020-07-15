import React, { useEffect } from "react";
import AddChannelBtn from "./AddChannelBtn";
import AddDMBtn from "./AddDMBtn";

const ChatLists = (props) => {
  useEffect(() => {
    props.getUsersConversations();
  }, []);

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

  return (
    <div className="channels-container collection">
      <div className="channels-add collection-item">
        <p>channels</p>

        <span className="secondary">
          <AddChannelBtn
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            createChannel={createChannel}
          />
        </span>
      </div>
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
                    onClick={() => removeChannel(channel)}
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
            <AddDMBtn {...props} />
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
                      onClick={() =>
                        leaveConversation(
                          conversation._id,
                          conversation.username
                        )
                      }
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

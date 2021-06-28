import React, { Component } from "react";
import Momment from "moment";
import ChatLists from "./ChatLists";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

export default class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.chatContainer = React.createRef();
    this.state = {
      shownEmoji: false,
    };
  }
  scrollDown = () => {
    this.chatContainer.current.scrollTop = this.chatContainer.current.scrollHeight;
  };

  componentDidMount() {
    this.scrollDown();
  }

  componentDidUpdate() {
    this.scrollDown();
  }

  handleShownEmoji = (e) => {
    this.setState((prevState) => {
      return { shownEmoji: !prevState.shownEmoji };
    });
  };

  render() {
    const {
      handleSubmit,
      handleChange,
      currentChannel,
      channelConversations,
      id,
      getUsersConversations,
      socketConversations,
      composedMessage,
      username,
      hasToken,
      guestUsername,
    } = this.props;

    return (
      <div className="chatapp__mainchat--container row">
        <div className="col s12 m4 l4 chatlists">
          {id ? (
            <ChatLists
              getUsersConversations={getUsersConversations}
              hasToken = {hasToken}
            
              {...this.props}
            />
          ) : null}
        </div>
        <div className="col s12 m8 l8 chatapp-Chatbox">
          <h6 className="right-align">Channel : {currentChannel}</h6>
          <div className="divider"></div>
          <div className="chatapp__chatbox--messages" ref={this.chatContainer}>
            {channelConversations ? (
              <ul>
                {channelConversations.map((message, index) => {
                  return (
                    <div className="row" key={index}>
                      <li
                        className={`col s3 ${
                          username !== message.author[0].item.username ||
                          message.author[0].item.guestName
                            ? guestUsername === message.author[0].item.guestName
                              ? "right red white-text"
                              : "chat-received left black white-text"
                            : "right red white-text"
                        }`}
                      >
                        <span></span>
                        <div className="author">
                          {username === message.author[0].item.username ? (
                            <p>you</p>
                          ) : (
                            <p>
                              {message.author[0].item.username ||
                                message.author[0].item.guestName}
                            </p>
                          )}
                          <p className="date">
                            {Momment(message.createdAt).fromNow()}
                          </p>
                        </div>
                        <div className="speech">{message.body}</div>
                      </li>
                    </div>
                  );
                })}
              </ul>
            ) : (
              <p>Nothing has posted in this channel</p>
            )}
            {socketConversations ? (
              <ul>
                {socketConversations.map((message, index) => {
                  return (
                    <li className="row" key={index}>
                      <div
                        className={`col  ${
                          !message.author
                            ? "user-joined center s12"
                            : message.author !== username
                            ? guestUsername
                              ? "chat-received left black white-text"
                              : "chat-received left black white-text"
                            : "right red white-text"
                        }`}
                      >
                        <span></span>
                        {username !== message.userJoined ? (
                          <p>{message.userJoined}</p>
                        ) : null}
                        <div className="author">
                          {username === message.author ? (
                            <p>you</p>
                          ) : (
                            <p>{message.author} </p>
                          )}
                          <p className="date">
                            {Momment(message.date).fromNow()}{" "}
                          </p>
                        </div>
                        {!message.userJoined ? (
                          <div className="message">
                            <p>{message.composedMessage}</p>
                          </div>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <form action="" className="row custom-input" onSubmit={handleSubmit}>
            <div className="emojis col s1">
              {/* <div onClick={this.handleShownEmoji}> */}
              <i className="material-icons small">insert_emoticon</i>
              {/* </div> */}
              {this.props.emojiWindowOpen ? (
                <Picker
                  showPreview={false}
                  showSkinTones={false}
                  onSelect={this.props.handleEmoji}
                />
              ) : null}
            </div>
            <input
              type="text"
              onChange={handleChange}
              value={composedMessage}
              className="col s9"
              name="composedMessage"
              placeholder="type a message here"
              autoComplete="off"
            />
            <div className="col s1">
              <button className="btn-floating waves-light waves-effect ">
                <i className="material-icons ">send</i>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

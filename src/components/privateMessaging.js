import React, { Component } from "react";
import Moment from "moment";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

export default class PrivateMessaging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTyping: false,
    };
    this.chatContainer = React.createRef();
  }
  scrollDown = () => {
    this.chatContainer.current.scrollTop = this.chatContainer.current.scrollHeight;
  };

  sendTyping = (e) => {
    this.lastUpdatedTime = Date.now();

    if (!this.state.isTyping && e.target.value.length) {
      this.setState({
        isTyping: true,
      });
      this.props.userTyping(true);
    } else {
      if (this.state.isTyping && e.target.value.length === 0) {
        this.setState({
          isTyping: false,
        });
        this.props.userTyping(false);
      }
    }
  };

  componentDidMount() {
    this.scrollDown();
  }
  componentDidUpdate(prevProps, prevState) {
    this.scrollDown();
  }
  componentWillUnmount() {
    this.props.userTyping(false);
  }

  render() {
    const {
      handlePrivateInput,
      handlePrivateSubmit,
      closePM,
      currentPrivateRecipient,
      privateMessageLog,
      socketPMs,
      privateMessageInput,
      showTyping,
      activeUserTyping,
      username,
    } = this.props;

    return (
      <div
        className="privateMessageWindow"
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
        <div className="chatapp-Chatbox row">
          <button
            onClick={(e) => {
              closePM(e);
            }}
            className="btn btn-flat  waves-effect waves-light right pull-l1 pull-m1 "
          >
            <i className="material-icons">close</i>
          </button>
          <p className="center">
            conversation with {currentPrivateRecipient.username}
          </p>
          <div className="divider"></div>
          <div
            className="chatapp__chatbox--messages row"
            ref={this.chatContainer}
          >
            {privateMessageLog.length ? (
              <ul>
                {privateMessageLog.map((message, index) => {
                  return (
                    <li className={`row`} key={index}>
                      <div
                        className={`col s4 ${
                          username !== message.author[0].item.username
                            ? "chat-received left black white-text"
                            : "right red"
                        }`}
                      >
                        <span></span>
                        <div className="speech-bubble-author">
                          {username === message.author[0].item.username ? (
                            <p>you</p>
                          ) : (
                            <p>{message.author[0].item.username}</p>
                          )}
                          <p className="speech-bubble-date">
                            {Moment(message.createdAt).fromNow()}
                          </p>
                        </div>
                        <div className="speech-bubble">
                          <p>{message.body}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {socketPMs.length ? (
              <ul>
                {socketPMs.map((message, index) => {
                  return (
                    <li
                      className={`row ${
                        username !== message.author[0].item.username
                          ? "chat-received left black white-text"
                          : "right red"
                      }`}
                      key={index}
                    >
                      <span></span>
                      <div className="col s12">
                        <div className="speech-bubble-author">
                          {username === message.author[0].item.username ? (
                            <p>you</p>
                          ) : (
                            <p>{message.author[0].item.username}</p>
                          )}
                          <p className="speech-bubble-date">
                            {Moment(message.createdAt).fromNow()}
                          </p>
                        </div>
                        <div className="speech-bubble">
                          <p>{message.body}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {activeUserTyping !== username ? (
              <div className="active-typing center red col s12">
                {showTyping ? <p>{`${activeUserTyping} is typing`}</p> : null}
              </div>
            ) : null}
          </div>
          <form
            onSubmit={handlePrivateSubmit}
            id="private__chatbox"
            className="row custom-input"
          >
            <div className="emojis col s1 center">
              <div onClick={this.props.handleShownEmoji}>
                <i className="material-icons small">insert_emoticon</i>
              </div>
              {this.props.shownEmoji ? (
                <Picker
                  showPreview={false}
                  showSkinTones={false}
                  onSelect={this.props.handleEmoji}
                />
              ) : null}
            </div>
            <div className="input-field col s9 ">
              <input
                type="text"
                onChange={handlePrivateInput}
                value={privateMessageInput}
                name="privateMessageInput"
                autoComplete="off"
                placeholder="Write a message"
                onKeyUp={(e) => {
                  e.keyCode !== 13 && this.sendTyping(e);
                }}
              />
            </div>
            <div className="col s1">
              <button className="btn btn-floating waves-light waves-effect">
                <i className="material-icons">send</i>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

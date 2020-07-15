import React, { Component } from "react";
// import PropTypes from "prop-types";
import axios from "axios";

import PrivateMessaging from "../privateMessaging";

// const SOCKET_URL = "http://localhost:5000";
// const socket = io(SOCKET_URL);
const API_URL = "http://localhost:5000/api";

export default class PrivateMessagingContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      privateMessageInput: "",
      privateMessageLog: [],
      conversationId: "",
      socketPMs: [],
      currentPrivateRecipient: this.props.currentPrivateRecipient,
      showTyping: false,
      activeUserTyping: "",
      shownEmoji: false,
    };
  }

  handleEmojiChange = (e) => {
    this.setState({
      privateMessageInput: this.state.privateMessageInput + e.native,
    });
  };

  handleShownEmoji = (e) => {
    this.setState((prevState) => {
      return { shownEmoji: !prevState.shownEmoji };
    });
  };

  handlePrivateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handlePrivateSubmit = (e) => {
    e.preventDefault();

    this.sendPrivateMessage();
  };

  sendPrivateMessage = async () => {
    const privateMessageInput = this.state.privateMessageInput;
    const recipientId = this.props.currentPrivateRecipient._id;
    const { socket } = this.props;

    await axios
      .post(
        `${API_URL}/chat/reply`,
        { privateMessageInput, recipientId },
        {
          headers: { Authorization: this.props.token },
        }
      )
      .then((res) => {
        const socketMsg = {
          body: privateMessageInput,
          conversationId: this.state.conversationId,
          author: [
            {
              item: {
                username: this.props.username,
              },
            },
          ],
        };

        socket.emit("new privateMessage", socketMsg);

        this.setState({
          privateMessageInput: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getPrivateMessages = async () => {
    const currentPrivateRecipient = this.props.currentPrivateRecipient;
    const { socket } = this.props;

    await axios
      .get(`${API_URL}/chat/privatemessages/${currentPrivateRecipient._id}`, {
        headers: { Authorization: this.props.token },
      })
      .then((res) => {
        socket.emit("enter privateMessage", res.data.conversationId);
        this.setState({
          privateMessageLog: res.data.conversation || [],
          conversationId: res.data.conversationId,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  userTyping = (isTyping) => {
    const { socket } = this.props;
    const conversationId = this.state.conversationId;
    const username = this.props.username;
    const data = {
      username,
      isTyping,
      conversationId,
    };

    socket.emit("user typing", data);
  };

  static getDerivedStateFromProps(props, state) {
    return (
      {
        currentPrivateRecipient: props.currentPrivateRecipient,
      },
      () => {
        props.getPrivateMessages();
      }
    );
  }

  componentDidMount() {
    this.getPrivateMessages();
    const { socket } = this.props;
    socket.on("refresh privateMessages", (data) => {
      const updatedMessages = Array.from(this.state.socketPMs);

      updatedMessages.push(data);

      this.setState({
        socketPMs: updatedMessages,
      });

      socket.on("typing", (data) => {
        this.setState({
          showTyping: data.isTyping,
          activeUserTyping: data.username,
        });
      });
    });
  }
  componentWillUnmount() {
    const { socket } = this.props;
    socket.emit("leave privateMessage", this.state.conversationId);
    socket.off("refresh privateMessages");
    socket.off("typing");
  }

  render() {
    const { closePM } = this.props;

    return (
      <div
        className="private_message--container grey darken-3"
        onClick={(e) => {
          closePM(e);
        }}
      >
        <PrivateMessaging
          handlePrivateInput={this.handlePrivateInput}
          handlePrivateSubmit={this.handlePrivateSubmit}
          userTyping={this.userTyping}
          handleEmoji={this.handleEmojiChange}
          handleShownEmoji={this.handleShownEmoji}
          {...this.props}
          {...this.state}
        />
      </div>
    );
  }
}

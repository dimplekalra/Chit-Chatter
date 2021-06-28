import React, { Component } from "react";
import LoginForm from "../LoginForm";
import RegisterForm from "../RegisterForm";
import { withCookies } from "react-cookie";
import axios from "axios";
import Navigation from "../Navigation";
import ChatBox from "../ChatBox";
import ChatSelector from "../chatSelector";

import Moment from "moment";
import PrivateMessagingContainer from "./PrivateMessageContainer";
import "materialize-css/dist/css/materialize.min.css";

// const SOCKET_URL = "http://localhost:5000";
// const socket = io(SOCKET_URL);
const API_URL = "http://localhost:5000/api";

class ChatUIContainer extends Component {
  constructor(props) {
    super(props);
    this.userLogin = this.userLogin.bind(this);
    this.guestLogin = this.guestLogin.bind(this);
    this.state = {
      username: "",
      id: "",
      loginError: [],
      registerationError: [],
      formsShown: false,
      formsMethod: "guest",
      chatsShown: false,
      socket: null,
      composedMessage: "",
      currentChannel: "Public-Main",
      conversations: [],
      channelConversations: [],
      guestSignup: "",
      guestUsername: "",
      socketConversations: [],
      usersChannel: [],
      createInput: "",
      startDMInput: "",
      usersDirectMessages: [],
      directMessageErrorLog: [],
      currentPrivateRecipient: {},
      token: "",
      emojiWindowOpen: false,
    };
  }

  componentDidMount() {
    this.initSocket();
    this.hasToken();
    this.getChannelConversations();

    document.addEventListener("click", this.handleEmojiOutside);
  }

  // If a token can be found, it will populate back the user's information on browser refresh
  hasToken = () => {
    const { cookies } = this.props;
    const token = cookies.get("token");
    const guestToken = cookies.get("guestToken");
    const tokenUser = cookies.get("user");
    const tokenGuestUser = cookies.get("guestUser");
    const usersChannel = cookies.get("usersChannels");
    const currentChannel = cookies.get("channel");

    if (token) {
      this.setState({
        username: tokenUser.username,
        guestUsername: "",
        guestSignup: "",
        id: tokenUser._id,
        token,
        usersChannel,
        currentChannel: currentChannel || "Public-Main",
        formsMethod: "",
        formsShown: false,
      });
    } else if (guestToken) {
      this.setState({
        guestUsername: tokenGuestUser,
        token: guestToken,
        formsMethod: "",
        formsShown: false,
      });
    }
  };

  initSocket = () => {
    this.setState({
      socket: this.props.socket,
    });

    const { socket } = this.props;

    socket.on("refresh messages", (data) => {
      const newSocketConversations = Array.from(this.state.socketConversations);
      //console.log(data);
      newSocketConversations.push(data);

      this.setState({
        socketConversations: newSocketConversations,
      });
    });

    socket.on("user joined", (data) => {
      const userJoined = Array.from(this.state.socketConversations);

      userJoined.push({
        userJoined: data,
      });

      this.setState({
        socketConversations: userJoined,
      });
    });

    socket.on("user left", (data) => {
      const newConversations = Array.from(this.state.socketConversations);

      newConversations.push({
        userJoined: data,
      });

      this.setState({
        socketConversations: newConversations,
      });
    });
  };

  componentDidUpdate(prevProps, prevState) {
    const { socket } = this.props;
    if (prevState.currentChannel !== this.state.currentChannel) {
      socket.emit(
        "leave channel",
        prevState.currentChannel,
        this.setUsername()
      );
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (
  //     nextState.usersChannel.length !== this.state.usersChannel.length ||
  //     nextState.currentChannel !== this.state.currentChannel
  //   ) {
  //     return true;
  //   }

  //   return false;
  // }

  setUsername = () => {
    const username = this.state.username;
    const guestname = this.state.guestUsername;

    if (!username) return guestname;
    else return username;
  };

  async userLogin({ username, password }) {
    const { cookies } = this.props;
    const currentChannel = this.state.currentChannel;

    const { socket } = this.props;
    try {
      const userData = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      cookies.set("token", userData.data.token, { path: "/", maxAge: 7200 });
      cookies.set("user", userData.data.user, { path: "/", maxAge: 7200 });
      cookies.set("usersChannels", userData.data.user.usersChannel, {
        path: "/",
        maxAge: 7200,
      });

      this.setState(
        {
          guestUsername: "",
          username: userData.data.user.username,
          formsShown: false,
          token: userData.data.token,
          id: userData.data.user._id,
          loginError: [],
          guestSignup: "",
          usersChannel: userData.data.user.usersChannel,
          formsMethod: "",
        },
        () => {
          socket.emit("enter channel", currentChannel, this.setUsername());
        }
      );
    } catch (err) {
      const logerrors = Array.from(this.state.loginError);

      logerrors.length = [];

      logerrors.push(err);

      this.setState({
        loginError: logerrors,
      });
    }
  }
  userLogout = () => {
    const { cookies } = this.props;
    const currentChannel = this.state.currentChannel;
    cookies.remove("token", { path: "/" });
    cookies.remove("user", { path: "/" });
    cookies.remove("guestToken", { path: "/" });
    cookies.remove("guestUser", { path: "/" });
    cookies.remove("usersChannels", { path: "/" });
    cookies.remove("channel", { path: "/" });

    const { socket } = this.props;
    socket.emit("leave channel", currentChannel, this.setUsername());

    this.setState({
      username: "",
      id: "",
      guestSignup: "",
      guestUsername: "",
      loginError: [],
      usersChannel: [],
      token: "",
      currentChannel: "Public-Main",
      formsMethod: "login",
      formsShown: true,
    });
  };

  userRegistration = async ({ username, password }) => {
    const currentChannel = this.state.currentChannel;
    const { cookies } = this.props;
    const { socket } = this.props;
    await axios
      .post(`${API_URL}/auth/register`, { username, password })
      .then((res) => {
        cookies.set("token", res.data.token, { path: "/", maxAge: 7200 });
        cookies.set("user", res.data.user, { path: "/", maxAge: 7200 });
        cookies.set("usersChannels", res.data.user.usersChannel, {
          path: "/",
          maxAge: 7200,
        });
        this.setState(
          {
            username: res.data.user.username,
            id: res.data.user._id,
            registerationError: [],
            guestSignup: "",
            guestUsername: "",
            formsShown: false,
            formsMethod: "",
            token: res.data.token,
            usersChannel: res.data.user.usersChannel,
          },
          () => {
            // Tells the backend sockets that a user has entered a channel
            socket.emit("enter channel", currentChannel, this.setUsername());
          }
        );
      })
      .catch((err) => {
        // Always show most recent errors
        const logerrors = Array.from(this.state.registerationError);

        logerrors.length = [];

        logerrors.push(err);

        this.setState({
          registerationError: logerrors,
        });
      });
  };

  // Guest signup, on successful POST call to our api, it returns a token and guest's data
  // Saves the token and guestname as cookies
  async guestLogin(e) {
    e.preventDefault();
    const { cookies } = this.props;
    const guestInputName = this.state.guestSignup;
    const currentChannel = this.state.currentChannel;

    const { socket } = this.props;

    try {
      const guestInfo = await axios.post(`${API_URL}/auth/guestLogin`, {
        guestInputName,
      });

      cookies.set("guestToken", guestInfo.data.token, {
        path: "/",
        maxAge: 7200,
      });
      cookies.set("guestUser", guestInfo.data.guest.guestName, {
        path: "/",
        maxAge: 7200,
      });

      this.setState(
        {
          guestUsername: guestInfo.data.guest.guestName,
          loginError: [],
          guestSignup: "",
          formsShown: false,
          formsMethod: "",
          token: guestInfo.data.token,
        },
        () => {
          socket.emit("enter channel", currentChannel, this.setUsername());
        }
      );
    } catch (err) {
      const guestError = Array.from(this.state.loginError);

      guestError.push(err);

      this.setState({
        loginError: guestError,
      });
    }
  }
  guestSignup = async (e) => {
    e.preventDefault();

    const guestInputName = this.state.guestSignup;

    const currentChannel = this.state.currentChannel;
    const { socket } = this.props;

    try {
      const guestInfo = await axios.post(`${API_URL}/auth/guestSignup`, {
        guestInputName,
      });

      this.setState(
        {
          guestUsername: guestInfo.data.guest.guestName,
          loginError: [],
          guestSignup: "",
          formsMethod: "",
          formsShown: false,
          token: guestInfo.data.token,
        },
        () => {
          socket.emit("enter channel", currentChannel, this.setUsername());
        }
      );
    } catch (err) {
      const guestError = Array.from(this.state.loginError);

      guestError.push(err);

      this.setState({
        loginError: guestError,
      });
    }
  };

  getChannelConversations = async () => {
    const { socket } = this.props;
    axios
      .get(`${API_URL}/chat/channel/${this.state.currentChannel}`)
      .then((res) => {
        const currentChannel = this.state.currentChannel;

        socket.emit("enter channel", currentChannel, this.setUsername());

        this.setState({
          channelConversations: res.data.channelMessages,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getUsersConversations = () => {
    axios
      .get(`${API_URL}/chat`, {
        headers: { Authorization: this.state.token },
      })
      .then((res) => {
        const updatedUsersDirectMessages = res.data.conversationWith;

        this.setState({
          usersDirectMessages: updatedUsersDirectMessages || [],
        });
      })
      .catch((Err) => console.log(Err));
  };

  sendMessage = (composedMessage, channel) => {
    const { socket } = this.props;
    const currentChannel = this.state.currentChannel;

    composedMessage = this.state.composedMessage;

    if (!composedMessage || !composedMessage.trim().length() < 1) return;

    axios
      .post(
        `${API_URL}/chat/postchannel/${currentChannel}`,
        {
          composedMessage,
        },
        {
          headers: { Authorization: this.state.token },
        }
      )
      .then((res) => {
        const socketMsg = {
          composedMessage,
          channel: currentChannel,
          author: this.state.guestUsername || this.state.username,
          date: Moment().format(),
        };

        socket.emit("new message", socketMsg);
        this.setState({
          composedMessage: "",
        });
      })
      .catch((err) => console.log(err));
  };
  handleEmojiChange = (e) => {
    this.setState({
      composedMessage: this.state.composedMessage + e.native,
    });
  };
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();

    this.sendMessage(this.state.composedMessage);
  };

  // Takes a channel name and then makes a POST call to the backend API,
  // requires a token for authorization to create a channel.
  // On success, the new array is pushed into the user's current user channel,
  // and saves the new channel list in cookie and refreshes channel conversations.
  createChannel = (e) => {
    const createInput = this.state.createInput;
    const { cookies } = this.props;
    e.preventDefault();

    axios
      .post(
        `${API_URL}/user/addchannel`,
        { createInput },
        {
          headers: { Authorization: this.state.token },
        }
      )
      .then((res) => {
        const updatedUserChannel = Array.from(this.state.usersChannel);

        cookies.set("usersChannels", updatedUserChannel, {
          path: "/",
          maxAge: 7200,
        });

        updatedUserChannel.push(createInput);

        this.setState(
          {
            usersChannel: [...updatedUserChannel],
            currentChannel: createInput,
            socketConversations: [],
            createInput: "",
          },
          () => {
            this.getChannelConversations();
          }
        );
      })
      .catch((err) => console.log(err));
  };

  // Takes a channel name parameter, then a POST call with authorization token to backend API,
  // On success, cookies are set of the updated user channels
  removeChannel = async (channel) => {
    const { cookies } = this.props;
    await axios
      .post(
        `${API_URL}/user/removechannel`,
        { channel },
        {
          headers: { Authorization: this.state.token },
        }
      )
      .then((res) => {
        const updatedChannels = res.data.updatedChannels;

        cookies.set("usersChannels", updatedChannels, {
          path: "/",
          maxAge: 7200,
        });

        this.joinChannel("Public-Main");
        this.setState({
          socketConversations: [],
          usersChannel: updatedChannels,
        });
      })
      .catch((err) => console.log(err));
  };

  // Takes a channel name parameter, saves it as a cookie, then sets the state of current channel,
  // to that channel paramter.
  joinChannel = (channel) => {
    const { cookies } = this.props;
    cookies.set("channel", channel, { path: "/", maxAge: 7200 });
    this.setState(
      {
        currentChannel: channel,
        socketConversations: [],
      },
      () => {
        this.getChannelConversations();
      }
    );
  };

  startConversation = async (val) => {
    const startDMInput = val;
    const usersDirectMessages = this.state.usersDirectMessages;

    const checkForCurrentConversations = usersDirectMessages.filter(
      (dm) => dm.username === startDMInput
    );

    if (
      checkForCurrentConversations.length === 0 ||
      usersDirectMessages.length === 0
    ) {
      await axios
        .post(
          `${API_URL}/chat/new`,
          { startDMInput },
          {
            headers: { Authorization: this.state.token },
          }
        )
        .then((res) => {
          const newUserDms = Array.from(this.state.usersDirectMessages);

          newUserDms.push({
            username: res.data.recipient,
            _id: res.data.recipientId,
          });

          this.setState({
            usersDirectMessages: newUserDms,
            directMessageErrorLog: [],
          });
        })
        .catch((err) => {
          const userDMError = Array.from(this.state.directMessageErrorLog);

          userDMError.push(err);

          this.setState({
            directMessageErrorLog: userDMError,
          });
        });
    } else {
      const updatedError = Array.from(this.state.directMessageErrorLog);

      updatedError.push({
        response: {
          data: {
            error: "Already in Conversation with that person",
          },
        },
      });

      this.setState({
        directMessageErrorLog: updatedError,
      });
    }
  };

  leaveConversation = (conversationId, user) => {
    axios
      .post(
        `${API_URL}/chat/leave`,
        { conversationId },
        {
          headers: { Authorization: this.state.token },
        }
      )
      .then((res) => {
        const updatedConversation = Array.from(
          this.state.usersDirectMessages
        ).filter((dms) => {
          return dms.username !== user;
        });

        this.setState({
          usersDirectMessages: updatedConversation,
        });
      })
      .catch((err) => console.log(err));
  };

  choosePrivateMessageRecipient = (recipient) => {
    this.setState({
      currentPrivateRecipient: recipient,
    });
  };

  displayForms = (method) => {
    if (method === "login") {
      this.setState({
        loginError: [],
        formsMethod: "login",
        formsShown: true,
        guestUsername: "",
      });
    } else if (method === "register") {
      this.setState({
        formsMethod: "register",
        formsShown: true,
        guestUsername: "",
      });
    } else if (method === "close") {
      this.setState({
        formsMethod: "",
        formsShown: false,
      });
    }
  };

  closeForm = () => {
    this.setState({
      formsMethod: "guest",
      formsShown: "false",
    });
  };

  closePM = async (e) => {
    e.stopPropagation();

    e.nativeEvent.stopImmediatePropagation();
    this.setState({
      currentPrivateRecipient: {},
    });
  };

  handleEmojiOutside = (e) => {
    // let emojiWindow = false;
    let flag = false;
    let el = e.target;

    try {
      do {
        if (el) {
          if (el.nodeName === "DIV" && el.classList.contains("emojis")) {
            flag = true;
            break;
          }
          if (el.getAttribute("id") === "root") {
            break;
          }
        }
      } while ((el = el.parentNode));

      if (flag) {
        this.setState({
          emojiWindowOpen: true,
        });

        return;
      } else {
        this.setState({
          emojiWindowOpen: false,
        });

        return;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  componentWillUnmount() {
    const { socket } = this.props;

    socket.emit(
      "leave channel ",
      this.state.currentChannel,
      this.setUsername()
    );
    socket.off("refresh messages");
    socket.off("user joined");
    socket.off("user left");
    document.removeEventListener("click", this.handleEmojiOutside);
  }

  render() {
    return (
      <div className="chatapp-container z-depth-2 section">
        <Navigation
          displayForms={this.displayForms}
          userLogout={this.userLogout}
          closeForm={this.closeForm}
          {...this.state}
        />
        {this.state.formsMethod === "login" && this.state.formsShown ? (
          <LoginForm
            userLogin={this.userLogin}
            closeForm={this.closeForm}
            {...this.state}
          />
        ) : null}

        {this.state.formsMethod === "register" && this.state.formsShown ? (
          <RegisterForm
            userRegistration={this.userRegistration}
            closeForm={this.closeForm}
            {...this.state}
          />
        ) : null}

        {this.state.formsMethod === "guest" ? (
          <ChatSelector
            handleChange={this.handleChange}
            handleGuestSignin={this.guestLogin}
            handleGuestRegister={this.guestSignup}
            {...this.state}
          />
        ) : null}
        {this.state.id || this.state.guestUsername ? (
          <ChatBox
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            handleEmoji={this.handleEmojiChange}
            createChannel={this.createChannel}
            removeChannel={this.removeChannel}
            startConversation={this.startConversation}
            leaveConversation={this.leaveConversation}
            joinChannel={this.joinChannel}
            choosePrivateMessageRecipient={this.choosePrivateMessageRecipient}
            getUsersConversations={this.getUsersConversations}
            getChannelConversations={this.getChannelConversations}
            hasToken={this.hasToken}
            {...this.state}
          />
        ) : null}
        {Object.getOwnPropertyNames(this.state.currentPrivateRecipient)
          .length !== 0 ? (
          <PrivateMessagingContainer
            usersDirectMessages={this.state.usersDirectMessages}
            closePM={this.closePM}
            currentPrivateRecipient={this.state.currentPrivateRecipient}
            username={this.state.username}
            {...this.state}
          />
        ) : null}
      </div>
    );
  }
}

export default withCookies(ChatUIContainer);

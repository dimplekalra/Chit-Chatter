import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
import { CookiesProvider } from "react-cookie";
import io from "socket.io-client";
import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css";

import ChatUIContainer from "./components/containers/ChatUIContainers";

const SOCKET_URL = "http://localhost:5000";
const socket = io(SOCKET_URL, {});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatShown: true,
    };
  }

  displayChat = (e) => {
    this.setState({
      chatShown: !this.state.chatShown,
    });
  };

  componentDidMount() {
    M.AutoInit();

    socket.on("connect", () => {
      console.log("connected");
    });
  }

  render() {
    return (
      <CookiesProvider>
        <div className="app-container container section">
          <div className="row">
            <div className="col s12">
              <h4 className="gray-text darken-text-2 chat-name">
                Chit - Chatter
              </h4>

              {this.state.chatShown ? (
                <ChatUIContainer socket={socket} />
              ) : null}

              {this.state.chatShown ? (
                <button
                  className="btn waves-light waves-effect btn-large "
                  onClick={this.displayChat}
                >
                  Leave the Chat
                </button>
              ) : (
                <button
                  className="btn waves-light waves-effect btn-large"
                  onClick={this.displayChat}
                >
                  Join the Chat
                </button>
              )}
            </div>
          </div>
        </div>
      </CookiesProvider>
    );
  }
}

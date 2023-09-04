import React, {Component} from "react";
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import HighlightOff from "@material-ui/icons/HighlightOff";
import Send from "@material-ui/icons/Send";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import "./ChatComponent.css";
import {Tooltip} from "@material-ui/core";
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
export default class ChatComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageList: [],
      message: "",
      sessionName: "",
    };
    this.chatScroll = React.createRef();
    this.state.sessionName = this.props.sessionName;
    console.log("props.sessionName === ", props.sessionName);
    this.handleChange = this.handleChange.bind(this);
    this.handlePressKey = this.handlePressKey.bind(this);
    this.close = this.close.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }
  onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(this.state.messageList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    this.setState({
      messageList: items,
    });
  };

  componentDidMount() {
    this.props.user
      .getStreamManager()
      .stream.session.on("signal:chat", (event) => {
        const data = JSON.parse(event.data);
        let messageList = this.state.messageList;
        messageList.push({
          connectionId: event.from.connectionId,
          nickname: data.nickname,
          message: data.message,
        });
        const document = window.document;
        setTimeout(() => {
          const userImg = document.getElementById(
            "userImg-" + (this.state.messageList.length - 1)
          );
          const video = document.getElementById("video-" + data.streamId);
          const avatar = userImg.getContext("2d");
          avatar.drawImage(video, 200, 120, 285, 285, 0, 0, 60, 60);
          this.props.messageReceived();
        }, 50);
        this.setState({messageList: messageList});
        this.scrollToBottom();
      });
  }

  handleChange(event) {
    this.setState({message: event.target.value});
  }

  handlePressKey(event) {
    if (event.key === "Enter") {
      this.sendMessage();
    }
  }

  sendMessage() {
    console.log(this.state.message);
    if (this.props.user && this.state.message) {
      let message = this.state.message.replace(/ +(?= )/g, "");
      if (message !== "" && message !== " ") {
        const data = {
          message: message,
          nickname: this.props.user.getNickname(),
          streamId: this.props.user.getStreamManager().stream.streamId,
        };
        this.props.user.getStreamManager().stream.session.signal({
          data: JSON.stringify(data),
          type: "chat",
        });
      }
    }
    this.setState({message: ""});
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.chatScroll.current.scrollTop =
          this.chatScroll.current.scrollHeight;
      } catch (err) {}
    }, 20);
  }

  close() {
    this.props.close(undefined);
  }

  render() {
    const styleChat = {display: this.props.chatDisplay};

    return (
      <div id="chatContainer">
        <div id="chatComponent" style={styleChat}>
          <div id="chatToolbar">
            <span>
              {/* {this.props.user.getStreamManager().stream.session.sessionId} */}
              {this.state.sessionName}
            </span>
            <IconButton id="closeButton" onClick={this.close}>
              <HighlightOff color="secondary" />
            </IconButton>
          </div>

          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="messages">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="message-wrap"
                >
                  {this.state.messageList.map((data, i) => (
                    <Draggable key={i} draggableId={String(i)} index={i}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          id="remoteUsers"
                          className={
                            "message" +
                            (data.connectionId !==
                            this.props.user.getConnectionId()
                              ? " left"
                              : " right")
                          }
                        >
                          <canvas
                            id={"userImg-" + i}
                            width="60"
                            height="60"
                            className="user-img"
                          />
                          <div className="msg-detail">
                            <div className="msg-info">
                              <p>{data.nickname}</p>
                            </div>
                            <div className="msg-content">
                              <span className="triangle" />
                              <p className="text">{data.message}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div id="messageInput">
            <input
              placeholder="Send a message"
              id="chatInput"
              value={this.state.message}
              onChange={this.handleChange}
              onKeyPress={this.handlePressKey}
            />
            <Tooltip title="Send message">
              <Fab size="small" id="sendButton" onClick={this.sendMessage}>
                <Send />
              </Fab>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}

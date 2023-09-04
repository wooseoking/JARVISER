import React, {useState, useEffect} from "react";
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import "./WebSocketComponent.css";
import SttComponent from "./stt/SttComponent";
import axios from "axios";

const ItemType = {
  MESSAGE: "message",
};

const DraggableMessage = ({ message, ws, messages, index, moveMessage, userId, meetingId }) => {
  const [{ isDragging }, ref] = useDrag({
    type: ItemType.MESSAGE,
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType.MESSAGE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveMessage(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
    drop: (draggedItem) => {
      if (JSON.parse(messages[index]).type !== "stt") {
        return;
      }
      console.log("메시지는 " + messages[index]);
      let myId = JSON.parse(messages[index]).sttId;
      let upId = -1;
      let downId = -1;
      for (let i = 1; index - i > -1; i++) {
        if (JSON.parse(messages[index - i]).type !== "stt") {
          continue;
        }
        upId = JSON.parse(messages[index - i]).sttId;
        break;
      }
      for (let i = 1; index + i < messages.length; i++) {
        if (JSON.parse(messages[index + i]).type !== "stt") {
          continue;
        }
        downId = JSON.parse(messages[index + i]).sttId;
        break;
      }
      console.log("myId : " + myId);
      console.log("upId : " + upId);
      console.log("downId : " + downId);

      ws.send(
        "/app/move-message",
        {},
        JSON.stringify({
          meetingId: meetingId,
          myId: Number.parseInt(myId),
          upId: Number.parseInt(upId),
          downId: Number.parseInt(downId),
        })
      );
    },
  });

  return (
    <>
      <div
        ref={(node) => ref(drop(node))}
        className={`chat-message ${isDragging ? "dragging" : ""} ${
          message.userId == userId ? "sent" : "received"
        }`}
      >
        <div id="sttChatUserName">{message.userName} : </div>
        {message.content}
      </div>
    </>
  );
};

class WebSocketComponent extends React.Component {
  constructor(props) {
    super(props);
    let meetingId = this.props.meetingId;
    this.state = {
      messages: [
        // '{"time": "16:32:50", "type": "connect", "userName": "1번참가자", "userId": "1", "content": "의뻘소리"}',
        // '{"time": "16:32:51", "type": "connect", "userName": "2번참가자", "userId": "2", "content": "의뻘소리"}',
        // '{"time": "16:32:52", "type": "connect", "userName": "3번참가자", "userId": "3", "content": "의뻘소리"}',
        // '{"time": "16:32:52", "type": "connect", "userName": "3번참가자", "userId": "3", "content": "의뻘소리"}',
        // '{"time": "16:32:52", "type": "connect", "userName": "3번참가자", "userId": "3", "content": "의뻘소리"}',
        // '{"time": "16:32:52", "type": "connect", "userName": "3번참가자", "userId": "3", "content": "의뻘소리"}',
        // '{"time": "16:32:52", "type": "connect", "userName": "3번참가자", "userId": "3", "content": "의뻘소리"}',
        // '{"time": "16:32:52", "type": "connect", "userName": "3번참가자", "userId": "3", "content": "의뻘소리"}',
        // '{"time": "16:32:52", "type": "connect", "userName": "3번참가자", "userId": "3", "content": "의뻘소리"}',
      ],
      ws: null,
      meetingId: meetingId,
      draggedIndex: null, // 드래그가 시작된 인덱스를 저장할 state
      userId: null, // userId 상태
    };
    this.chatContainerRef = React.createRef();
  }

  componentDidMount() {
    const that = this;
    // 로컬 스토리지에서 토큰을 가져옵니다.
    const token = localStorage.getItem("access-token");
    if (token) {
      const parsedToken = JSON.parse(atob(token.split(".")[1]));
      if (parsedToken && parsedToken.userId) {
        this.setState({ userId: parsedToken.userId });
      }
    }
    const socket = new SockJS(window.SERVER_URL + "/ws");
    const stompClient = Stomp.over(socket);
    const meetingId = this.state.meetingId;
    stompClient.connect({}, function (frame) {
      stompClient.subscribe("/topic/" + meetingId, function (messageOutput) {
        let message = JSON.parse(messageOutput.body);
        let type = message.type;
        if (type === "move-command") {
          let myId = message.myId;
          let upId = message.upId;
          let downId = message.downId;
          let fromIndex = that.state.messages.findIndex((mes) => JSON.parse(mes).sttId === myId);
          let upIndex =
            upId == -1
              ? -1
              : that.state.messages.findIndex((mes) => JSON.parse(mes).sttId === upId);
          let downIndex =
            downId == -1
              ? that.state.messages.length
              : that.state.messages.findIndex((mes) => JSON.parse(mes).sttId === downId);
          console.log("fromIndex : " + fromIndex);
          console.log("upIndex:" + upIndex);
          console.log("downIndex:" + downIndex);
          if (upIndex < fromIndex && fromIndex < downIndex) {
            console.log("이동이 필요하지 않음");
            return;
          }
          let toIndex = fromIndex < upIndex ? upIndex : downIndex;
          console.log("toIndex : " + toIndex);
          that.moveMessage(fromIndex, toIndex);
          return;
        }
        that.setState((prevState) => ({
          messages: [...prevState.messages, messageOutput.body],
        }));
      });
      stompClient.send(
        "/app/connect",
        {},
        JSON.stringify({ meetingId: meetingId, Authorization: "Bearer " + token })
      );
    });
    this.state.ws = stompClient;
    if (this.chatContainerRef.current) {
      const scrollHeight = this.chatContainerRef.current.scrollHeight;
      this.chatContainerRef.current.scrollTop = scrollHeight;
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.messages.length !== this.state.messages.length) {
      if (this.chatContainerRef.current) {
        const scrollHeight = this.chatContainerRef.current.scrollHeight;
        this.chatContainerRef.current.scrollTop = scrollHeight;
      }
    }
  }
  moveMessage = (fromIndex, toIndex) => {
    // 드래그 시작 시 draggedIndex를 설정
    if (this.state.draggedIndex === null) {
      this.setState({ draggedIndex: fromIndex });
      return; // 여기서 종료하면 아이템의 위치는 실제로 이동하지 않습니다.
    }

    const messages = [...this.state.messages];
    const [movedMessage] = messages.splice(fromIndex, 1);
    messages.splice(toIndex, 0, movedMessage);

    this.setState({
      messages,
    });

    // 끝날 때 draggedIndex와 toIndex를 함께 출력하고, draggedIndex를 다시 null로 초기화
    // this.printIndexes(this.state.draggedIndex, toIndex);
    this.setState({ draggedIndex: null });
  };

  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="chat-container" ref={this.chatContainerRef}>
          <div className="chat-title">STT 채팅</div>
          {this.state.messages.map((message, index) => (
            <DraggableMessage
              key={index}
              messages={this.state.messages}
              ws={this.state.ws}
              meetingId={this.state.meetingId}
              index={index}
              message={JSON.parse(message)}
              moveMessage={this.moveMessage}
              userId={this.state.userId}
              userName={this.state.userName}
            />
          ))}
        </div>
        <SttComponent meetingId={this.state.meetingId} muted={this.props.muted} />
      </DndProvider>
    );
  }
}

export default WebSocketComponent;

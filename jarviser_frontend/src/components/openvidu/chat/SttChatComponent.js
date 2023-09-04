import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import VAD from "./vad";
import { createAudioContext } from "./createAudioContext";
function SttChatComponent() {
  const [userText, setUserText] = useState(""); // 상태 변수와 상태 변경 함수를 선언

  const handleSubmit = (e) => {
    e.preventDefault();
    uploadText(userText); // 상태 변수를 사용하여 uploadText 함수를 호출
  };

  const handleInputChange = (e) => {
    setUserText(e.target.value); // 입력된 값을 상태 변수에 저장
  };

  var meetingId = 3; //FIXME: 회의 ID 설정하기 - 암호화된 회의의 id를 지정한다.
  const Received = {
    chat: receivedChat,
    stt: receivedStt,
    comeinsession: receivedComeIn,
    leavesession: receivedLeave,
  };
  var socket = new SockJS(window.SERVER_URL+"" + "/ws");
  var stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
    stompClient.subscribe(
      "/topic/meeting/" + meetingId,
      function (messageOutput) {
        let message = JSON.parse(messageOutput.body);
        let type = message.type;
        Received[type](message);
        console.log(stt);
        console.log(chat);
        console.log(participants);
        document.getElementById("response").innerText =
          "Received: " + messageOutput.body;
      }
    );
  });

  const stt = [];
  const chat = [];
  const participants = [];
  function receivedChat(data) {
    chat.push([data.userId, data.content]);
  }
  function receivedStt(data) {
    stt.push([data.userId, data.content]);
  }
  function receivedComeIn(data) {
    participants.push(data.userId);
  }
  function receivedLeave(data) {
    const index = participants.indexOf(data.userId);
    if (index > -1) {
      participants.splice(index, 1);
    }
  }

  function uploadText(userText) {
    var token = localStorage.getItem("access-token");
    var serverUrl = window.SERVER_URL+"" + "/meeting/message"; // 서버의 URL

    var formData = new FormData();
    formData.append("meetingId", meetingId);
    formData.append("content", userText);

    fetch(serverUrl, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }

  const handleVADStartClick = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => startVAD(stream))
      .catch((err) => console.log("getUserMedia() failed: ", err));
  };

  let vad;

  var audioContext = createAudioContext();

  function startVAD(stream) {
    var source = audioContext.createMediaStreamSource(stream);
    var options = {
      source: source,
      voice_stop: function () {
        stopAudio();
        console.log("voice_stop");
      },
      voice_start: function () {
        startAudio(stream); // Pass the 'stream' to the startAudio function
        console.log("voice_start");
      },
    };
    vad = VAD(options); // Initialize VAD with the correct options
    console.log("vad.start는 여기요여기 == ", vad.start);
    vad.start = true; // Start VAD
    console.log("startVAD");
  }

  function stopVAD() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(function (stream) {
        var audioTrack = stream.getAudioTracks()[0];
        audioTrack.enabled = false;
      })
      .catch(function (err) {
        console.log(err);
      });
    console.log("stopVAD");
  }

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [index, setIndex] = useState(0);

  const handleDataAvailable = (e) => {
    if (e.data.size > 0) {
      setRecordedChunks((prevChunks) => [...prevChunks, e.data]);
      console.log("pushing..");
    }
  };

  const handleStop = () => {
    let blob = new Blob(recordedChunks, { type: "audio/wav" });
    setRecordedChunks([]);
    sendAudio(blob);
    setIndex((prevIndex) => prevIndex + 1);
  };

  const startAudio = (stream) => {
    if (!mediaRecorder) {
      const recorder = new MediaRecorder(stream);

      recorder.addEventListener("dataavailable", handleDataAvailable);
      recorder.addEventListener("stop", handleStop);

      setMediaRecorder(recorder);

      recorder.start();
    } else {
      mediaRecorder.start();
    }
  };

  useEffect(() => {
    return () => {
      // Clean up event listeners and other resources
      if (mediaRecorder) {
        mediaRecorder.removeEventListener("dataavailable", handleDataAvailable);
        mediaRecorder.removeEventListener("stop", handleStop);
      }
    };
  }, [mediaRecorder]);

  function stopAudio() {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  }

  async function sendAudio(blob) {
    try {
      const url = window.SERVER_URL+"" + "/meeting/transcript";
      const formData = new FormData();
      const testID = 3; //임시로 넣은 testID
      formData.append("file", blob, "audio" + index + ".wav");
      formData.append("meetingId", testID);
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.text);

      // STT 결과를 <div id="stt-chatting"></div>에 추가하는 부분
      const chatDiv = document.getElementById("stt-chatting");
      const messageDiv = document.createElement("div");
      messageDiv.className = "stt-message"; // CSS 클래스 추가 (필요시 스타일링을 위해)
      messageDiv.textContent = data.text;
      chatDiv.appendChild(messageDiv);
    } catch (error) {
      console.error("Error sending audio", error);
    }
  }

  return (
    <div>
      <button id="vad_start" onClick={handleVADStartClick}>
        VAD Start
      </button>
      <button id="vad_stop" onClick={stopVAD}>
        VAD Stop
      </button>
      <form id="text-form" onSubmit={handleSubmit}>
        <input
          type="text"
          id="text-input"
          value={userText}
          onChange={handleInputChange}
          placeholder="Say something"
        />
        <button type="submit" id="text-send">
          Send
        </button>
      </form>
      <div id="response"></div>
      <div id="stt-chatting"></div>
    </div>
  );
}

export default SttChatComponent;

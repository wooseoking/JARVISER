document.getElementById("vad_start").addEventListener("click", () => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => startVAD(stream)) // Pass the 'stream' to the startVAD function
    .catch((err) => console.log("getUserMedia() failed: ", err));
});

document.getElementById("vad_stop").addEventListener("click", stopVAD);

let mediaRecorder;
let recordedChunks = [];
let vad;
let audioContext;
let time = 0;
let sampleRate;

function startVAD(stream) {
  if (vad) return;
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContext();
  let source = audioContext.createMediaStreamSource(stream);
  let startTime = 0;

  startRecording(stream);
  let options = {
    source: source,
    voice_start: function () {
      console.log("voice_start");
      startTime = new Date().getTime();
    },
    voice_stop: function () {
      console.log("voice_stop");
      time = new Date().getTime() - startTime;
      mediaRecorder.stop();
      mediaRecorder.start();
    },
  };
  vad = new window.VAD(options); // Initialize VAD with the correct options
  sampleRate = vad.options.context.sampleRate;
  console.log("startVAD");
}

function stopVAD() {
  vad.stop();
  mediaRecorder = null;
  audioContext.close();
  vad = null;
  console.log("stopVAD");
}

function startRecording(stream) {
  if (!mediaRecorder) {
    mediaRecorder = new MediaRecorder(stream); // Use the 'stream' parameter here

    mediaRecorder.addEventListener("dataavailable", function (e) {
      if (e.data.size > 0) {
        let data = e.data;
        e.data = new Blob([], { type: "audio/webm;codecs=opus" });
        recordedChunks.push(data);
        console.log("pushing..");
      }
    });

    mediaRecorder.addEventListener("stop", function () {
      setTimeout(() => {
        let blob = new Blob(recordedChunks, { type: "audio/webm;codecs=opus" });
        recordedChunks = [];
        sendAudio(blob);
      }, 0);
    });
    mediaRecorder.start();
  } else {
    mediaRecorder.start();
  }
}

async function sendAudio(blob) {
  try {
    let token = localStorage.getItem("access-token");
    const url = window.SERVER_URL+"" + "/audio/transcript";
    const formData = new FormData();
    const testID = "2HPBABTLLHGJ75UFSKDKTB422M======"; //임시로 넣은 testID
    formData.append("file", blob);
    formData.append("meetingId", testID);
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: { Authorization: "Bearer " + token },
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

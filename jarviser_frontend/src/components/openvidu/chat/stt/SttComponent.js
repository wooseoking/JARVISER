import React, { useEffect } from "react";

class SttComponent extends React.Component {
  async componentDidMount() {
    await this.initializeVAD();
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(!this.myvad){
      return true;
    }
    if(nextProps.muted && this.myvad.listening){
      this.myvad.pause();
    }
    if(!nextProps.muted && !this.myvad.listening){
      this.myvad.start();
    }
    return false;
  }

  async initializeVAD() {
    try {
      this.myvad = await window.vad.MicVAD.new({
        onSpeechStart: () => {
          console.log("speech start");
        },
        onSpeechEnd: (audio) => {
          console.log("speech end");
          const audioBlob = this.float32ArrayToWav(audio, 16000);
          this.sendAudio(audioBlob);
        },
      });
      this.myvad.start();
    } catch (error) {
      console.log(error);
    }
  }

  float32ArrayToWav(audioData, sampleRate) {
    const buffer = new ArrayBuffer(44 + audioData.length * 2);
    const view = new DataView(buffer);

    function writeString(view, offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }

    // RIFF header
    writeString(view, 0, "RIFF");
    view.setUint32(4, 32 + audioData.length * 2, true);
    writeString(view, 8, "WAVE");

    // fmt chunk
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);

    // data chunk
    writeString(view, 36, "data");
    view.setUint32(40, audioData.length * 2, true);

    const volume = 1;
    let index = 44;
    for (let i = 0; i < audioData.length; i++) {
      view.setInt16(index, audioData[i] * (0x7fff * volume), true);
      index += 2;
    }

    return new Blob([view], { type: "audio/wav" });
  }

  async sendAudio(blob) {
    try {
      let token = localStorage.getItem("access-token");
      const url = window.SERVER_URL+"" + "/audio/transcript";
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("meetingId", this.props.meetingId);
      console.log("sending audio");
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
    } catch (error) {
      console.error("Error sending audio", error);
    }
  }

  render() {
    return;
  }
}

export default SttComponent;

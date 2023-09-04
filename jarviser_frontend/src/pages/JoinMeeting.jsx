import { useState } from "react";
import VideoRoomComponent from "../components/openvidu/VideoRoomComponent";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAccessToken from "../components/useAccessToken";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import MainHeader from "../components/molecules/MainHeader";
const JoinMeeting = () => {
  const navigate = useNavigate();
  const { accessToken } = useAccessToken();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);

  const [userName, setUserName] = useState();
  const encryptedKey = useParams().urlKey;
  const [showVideoRoom, setShowVideoRoom] = useState(false);

  console.log("URL 주소창에 입력한 encrypted key 값 === ", encryptedKey);

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowVideoRoom(true);
    handleJoinMeeting();
  };
  function base64UrlDecode(str) {
    // Base64Url로 인코딩된 문자열을 일반 Base64로 변환
    str = str.replace(/-/g, "+").replace(/_/g, "/");

    // 패딩 추가
    const pad = str.length % 4;
    if (pad) {
      if (pad === 1) {
        throw new Error("Invalid length while decoding base64url");
      }
      str += new Array(5 - pad).join("=");
    }

    return atob(str);
  }

  const token = accessToken;
  const segments = token.split(".");
  const payload = JSON.parse(base64UrlDecode(segments[1]));
  const payloadUserName = payload["username"];

  const handleJoinMeeting = async () => {
    console.log("encryptedKey === ", encryptedKey);
    console.log("accessToken === ", accessToken);
    const endpoint = `${window.SERVER_URL+""}/meeting/joinMeeting/${encryptedKey}`;

    // 미팅에 참여하기 위해 서버에 요청을 보냅니다.
    try {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("response === ", response);
      if (response.status === 202) {
        console.log("Successfully joined the meeting!", response.data.meeting);

        // 미팅 참여에 성공했을 때 원하는 추가적인 로직을 수행할 수 있습니다.
      } else {
        console.error("Error joining the meeting:", response.data);
        alert("Error joining the meeting. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while joining the meeting. Please try again.");
    }
  };

  const JoinContainer = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f9f9f9;
    min-height: 100vh;
  `;

  const Form = styled.form`
    background-color: #f6f4eb;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    position: absolute;
    top: 30%;
    left: 35%;
  `;

  const Label = styled.label`
    display: block;
    margin-bottom: 15px;
  `;

  const Input = styled.input`
    width: 90%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  `;

  const Button = styled.button`
    background-color: #91c8e4;
    color: #fff;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background-color: #0056b3;
    }
  `;

  return (
    <>
      <MainHeader></MainHeader>

      <Form onSubmit={handleSubmit}>
        <Label>
          User Name:
          <Input type="text" value={payloadUserName} readOnly />
        </Label>
        <Label>
          Encrypted Key:
          <Input type="text" value={encryptedKey} readOnly />
        </Label>
        <Button type="submit" style={{ marginTop: "20px" }}>
          Submit
        </Button>
      </Form>
      {showVideoRoom && (
        <VideoRoomComponent
          userName={payloadUserName}
          meetingId={encryptedKey}
        />
      )}
    </>
  );
};

export default JoinMeeting;

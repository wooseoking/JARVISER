import { useState, useEffect } from "react";
import VideoRoomComponent from "../components/openvidu/VideoRoomComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAccessToken from "../components/useAccessToken";
import SttChatComponent from "../components/openvidu/chat/SttChatComponent";
import styled from "styled-components";
import MainHeader from "../components/molecules/MainHeader";
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
};

const CreateMeeting = () => {
  const navigate = useNavigate();
  const { accessToken } = useAccessToken();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);

  const [userName, setUserName] = useState();
  const [sessionName, setSessionName] = useState();
  const [showVideoRoom, setShowVideoRoom] = useState(false);
  const [encryptedKey, setEncryptedKey] = useState("");
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

  console.log("페이로드 정보!!! === ", payload); // 이렇게 하면 payload의 내용을 볼 수 있습니다.

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("sessionName === ", sessionName);
    console.log("accessToken === ", accessToken);
    const endpoint = `${window.SERVER_URL+""}/meeting/create/${sessionName}`;
    // 미팅을 생성하기 위해 서버에 요청을 보냅니다.
    try {
      const response = await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("response === ", response);
      if (response.status === 202) {
        console.log(
          "Meeting created successfully!",
          response.data.encryptedKey
        );

        // 미팅 생성에 성공했을 때만 VideoRoomComponent를 보여줍니다.
        setEncryptedKey(response.data.encryptedKey);
        // console.log("typeof encryptedKey === ", typeof encryptedKey);
        setShowVideoRoom(true);
      } else {
        console.error("Error creating meeting:", response.data);
        alert("Error creating meeting. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the meeting. Please try again.");
    }
  };
  // const handleCopy = () => {
  //   navigator.clipboard
  //     .writeText(sessionName)
  //     .then(() => {
  //       alert("Session Name copied to clipboard!");
  //     })
  //     .catch((err) => {
  //       alert("Failed to copy!");
  //     });
  // };
  const handleInputFocus = () => {
    if (!sessionName) {
      setSessionName("");
    }
  };
  const handleSessionNameChange = (event) => {
    setSessionName(event.target.value);
  };
  const handleUserNameChange = (event) => {
    setUserName(payloadUserName);
  };

  return (
    <>
      <MainHeader></MainHeader>

      <Form onSubmit={handleSubmit}>
        <Label>
          User Name:
          <Input
            type="text"
            value={payloadUserName}
            onChange={handleUserNameChange}
            readOnly
          />
        </Label>
        <Label>
          Session Name:
          <Input
            type="text"
            placeholder="방 이름을 입력해주세요"
            onChange={handleSessionNameChange}
          />
        </Label>
        <Button type="submit" style={{ marginTop: "20px" }}>
          Submit
        </Button>
      </Form>

      {showVideoRoom && (
        <VideoRoomComponent
          userName={payloadUserName}
          sessionName={sessionName}
          meetingId={encryptedKey}
        />
      )}
    </>
  );
};
const CreateContainer = styled.div`
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
export default CreateMeeting;

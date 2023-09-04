import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useAccessToken from "../components/useAccessToken";
import Sidebar from "../components/molecules/Sidebar";
import AudioMessage from "../components/molecules/AudioMessage";
import Speech from "../components/molecules/Speech";
import Keyword from "../components/molecules/Keyword";
import MainHeader from "../components/molecules/MainHeader";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

const ReportDetail = () => {
  const navigate = useNavigate();
  const { accessToken } = useAccessToken();
  const { id } = useParams();
  const [audioMessages, setAudioMessages] = useState([]);
  const [speechPercentage, setSpeechPercentage] = useState({});
  const [staticsOfKeywords, setStaticsOfKeywords] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const encryptedKey = location.state?.encryptedKey;
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    } else {
      getMeetingDetails();
    }
  }, [accessToken, navigate]);

  console.log("encryptedKey", encryptedKey);
  const getMeetingDetails = async () => {
    try {
      const responseAudioMessage = await axios.get(
        `${window.SERVER_URL}/meeting/audiomessage/${encryptedKey}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          data: { meetingId: id },
        }
      );

      const responseSpeech = await axios.get(
        `${window.SERVER_URL}/meeting/speech/${encryptedKey}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          data: { meetingId: id },
        }
      );

      const responseKeywords = await axios.get(
        `${window.SERVER_URL}/meeting/keywords/${encryptedKey}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          data: { meetingId: id },
        }
      );

      const responseSummary = await axios.get(
        `${window.SERVER_URL}/meeting/summary/${encryptedKey}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          data: { meetingId: id },
        }
      );
      setSummaryData(responseSummary.data);

      const handleSaveClick = async (index, newContent) => {
        try {
          // 현재 수정된 내용을 DB에 업데이트
          const response = await axios.post(
            window.SERVER_URL+"/meeting/audiomessage/update",
            {
              audioMessageId: audioMessages[index].audioMessageId,
              content: newContent,
            },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          if (response.status === 200) {
            const newAudioMessages = [...audioMessages];
            newAudioMessages[index].content = newContent;
            newAudioMessages[index].isEditing = false;
            setAudioMessages(newAudioMessages);
          }
        } catch (error) {
          console.error("Error updating audio message:", error);
        }
      };

      setAudioMessages(
        responseAudioMessage.data.audioMessages.map((audioMessage) => ({
          ...audioMessage,
          isEditing: false,
        }))
      );
      setSpeechPercentage(responseSpeech.data.statistics);
      setStaticsOfKeywords(responseKeywords.data.statistics);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleEditClick = (index) => {
    const newAudioMessages = [...audioMessages];
    newAudioMessages[index].isEditing = true;
    setAudioMessages(newAudioMessages);
  };

  const handleSaveClick = async (index, newContent) => {
    try {
      const response = await axios.post(
        window.SERVER_URL+"/meeting/audiomessage/update",
        {
          audioMessageId: audioMessages[index].audioMessageId,
          content: newContent,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.status === 200) {
        const newAudioMessages = [...audioMessages];
        newAudioMessages[index].content = newContent;
        newAudioMessages[index].isEditing = false;
        setAudioMessages(newAudioMessages);
      }
    } catch (error) {
      console.error("Error updating audio message:", error);
    }
  };

  const downloadTextFile = () => {
    const combinedMessages = audioMessages
      .map((audioMessage) => `${audioMessage.name}: ${audioMessage.content}`)
      .join("\n");

    const blob = new Blob([combinedMessages], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "combined_audio_messages.txt";
    link.click();
  };

  return (
    <>
      <MainHeader />
      <MainContainer>
        <Sidebar />
        <ContentContainer>
          <h1>회의 상세 정보</h1>
          <p>
            <Summarydiv>회의 요약 : {summaryData?.statistics}</Summarydiv>
          </p>
          {isLoading ? (
            <LoadingSpinner /> // 또는 <LoadingMessage />
          ) : (
            <ContentWrapper>
              <AudioWrapper>
                {audioMessages.map((audio, index) => (
                  <AudioBox key={index}>
                    <AudioMessage
                      audioMessage={audio}
                      onEditClick={() => handleEditClick(index)}
                      onSaveClick={(newContent) =>
                        handleSaveClick(index, newContent)
                      }
                    />
                  </AudioBox>
                ))}
                <DownloadButton onClick={downloadTextFile}>
                  오디오 메시지 다운로드
                </DownloadButton>
              </AudioWrapper>
              <GraphWrapper>
                <GraphTop>
                  <SpeechWrapper>
                    <Speech speechPercentage={speechPercentage} />
                  </SpeechWrapper>
                </GraphTop>
                <GraphBottom>
                  <KeywordWrapper>
                    <Keyword staticsOfKeywords={staticsOfKeywords} />
                  </KeywordWrapper>
                </GraphBottom>
              </GraphWrapper>
            </ContentWrapper>
          )}
        </ContentContainer>
      </MainContainer>
    </>
  );
};

export default ReportDetail;

const Summarydiv = styled.div`
  display: flex;
`;
const MainContainer = styled.div`
  display: flex;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
  max-height: calc(
    100vh - 70px
  ); /* 페이지 높이 조절 (70px는 MainHeader의 높이) */
  overflow: auto; /* 내용이 페이지를 벗어나면 스크롤 생성 */
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const AudioWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto; /* 세로 스크롤 바 생성 */
  max-height: 520px; /* 최대 높이 설정 */
`;

const AudioBox = styled.div`
  margin: 10px;
  padding: 10px;
  width: 600px;
  border: 1px solid #dde1e6;
  border-radius: 10px;
`;

const GraphWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto; /* 세로 스크롤 바 생성 */
  max-height: 520px; /* 최대 높이 설정 */
  width: 600px;
`;

const GraphTop = styled.div`
  flex: 1;
`;

const GraphBottom = styled.div`
  flex: 1;
`;

const SpeechWrapper = styled.div`
  width: 30rem;
  height: 30rem;
  margin-bottom: 50px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
`;

const KeywordWrapper = styled.div`
  flex: 1;
`;

const DownloadButton = styled.button`
  background-color: #4682a9;
  color: #f6f4eb;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  margin-top: 10px;
  cursor: pointer;
`;

const LoadingSpinner = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 15px solid rgba(0, 0, 0, 0.1);
  border-top: 15px solid #4682a9;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// ... (기타 스타일 계속 유지)

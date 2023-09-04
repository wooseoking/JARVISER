import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAccessToken from "../components/useAccessToken";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";

function JoinMeetingModal({ closeModal }) {
  const navigate = useNavigate();
  const { accessToken } = useAccessToken();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitted, errors },
  } = useForm();

  const onSubmit = (data) => {
    let url = data.title;

    // URL에 http:// 또는 https:// 접두사가 없으면 추가
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }

    window.location.href = url; // 해당 URL로 이동

    closeModal();
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <ModalBackdrop onClick={closeModal}>
      <ModalContent onClick={handleContentClick}>
        <CloseButton onClick={closeModal}>X</CloseButton>
        <ModalHeader>
          <h1>입장하기</h1>
        </ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          {" "}
          {/* Add the form here */}
          <LeftContainer>
            <ContentLabel htmlFor="title">URL</ContentLabel>
            <TitleField>
              <TitleText
                id="title"
                type="text"
                placeholder="URL을 입력해주세요."
                aria-invalid={
                  isSubmitted ? (errors.title ? "true" : "false") : undefined
                }
                {...register("title", {
                  required: "URL은 필수 입력입니다.",
                })}
              />
            </TitleField>
            {errors.content && (
              <small role="alert">{errors.content.message}</small>
            )}
          </LeftContainer>
          <RightContainer>
            <SubmitButton type="submit" disabled={isSubmitting}>
              입장
            </SubmitButton>
          </RightContainer>
        </form>
      </ModalContent>
    </ModalBackdrop>
  );
}

const ReservationHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const RightContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column; // 수직 배치
  align-items: flex-end; // 오른쪽 정렬
`;

const SubmitButton = styled.button`
  padding: 15px 30px;
  background: #749bc2;
  color: #fff;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.3s;
  margin-top: 10px; // 상단에 여백 추가
  &:hover {
    background: #218838;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TitleField = styled.div`
  margin-bottom: 15px;
`;

const ContentLabel = styled.label`
  display: block;
  font-size: 18px;
  margin-bottom: 5px;
  color: #333; // 색상을 더 진하게 합니다.
  font-weight: 600; // 더 굵게 만듭니다.
`;

const TitleText = styled.input`
  width: 100%;
  height: 32px;
  font-size: 15px;
  border: 0;
  border-radius: 15px;
  outline: none;
  padding-left: 10px;
  background-color: #91c8e4;
`;

const TimeField = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const TimeText = styled.input`
  width: 48%;
  height: 32px;
  font-size: 15px;
  border: 0;
  border-radius: 15px;
  outline: none;
  padding-left: 10px;
  background-color: #91c8e4;
`;

const DescField = styled.div`
  margin-bottom: 15px;
`;

const DescText = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 20px;
  font-size: 16px;
  min-height: 100px;
  background-color: #91c8e4;
`;

const EmailField = styled.div`
  margin-bottom: 15px;
`;

const EmailText = styled.input`
  width: 100%;
  height: 32px;
  font-size: 15px;
  border: 0;
  border-radius: 15px;
  outline: none;
  padding-left: 10px;
  background-color: #91c8e4;
`;

const ModalContent = styled.div`
  background-color: #f3f4f6; // 밝은 회색으로 변경
  padding: 20px;
  border-radius: 10px; // 모서리를 둥글게 만듭니다.
  position: relative;
  max-width: 100%; // 모달의 최대 너비를 설정합니다.
  max-height: 80%; // 모달의 최대 높이를 설정합니다.
  overflow: auto; // 내용이 너무 길면 스크롤이 생깁니다.
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); // 모달에 그림자 효과를 추가합니다.
  width: 800px; // 원하는 너비로 설정합니다.
  min-height: 300px; // 원하는 최소 높이로 설정합니다.
`;

const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const ModalHeader = styled.div`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 10px;
  background: #007bff;
  color: #fff;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
  width: 60px; // 버튼의 너비를 100px로 설정
  margin-left: 10px; // 왼쪽 여백 추가
  margin-bottom: 0px;
  &:hover {
    background: #0056b3;
  }
`;

const AddButton = styled.button`
  padding: 10px 10px;
  background: #749bc2;
  color: #fff;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
  width: 60px; // 버튼의 너비를 100px로 설정
  margin-left: 10px; // 왼쪽 여백 추가
  margin-bottom: 10px;
  &:hover {
    background: #0056b3;
  }
`;

const EmailItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; // 항목 사이에 공간을 최대로 둡니다.
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 3px 8px; // 높이와 좌우 패딩을 조금 줄입니다.
  margin-bottom: 10px;
  background-color: #f3f4f6;
`;

const Form = styled.form`
  display: flex;
  justify-content: space-between; // 필요에 따라 조정
  max-width: 700px;
  margin: 0 auto;
`;

const LeftContainer = styled.div`
  flex: 1;
  padding-right: 40px; // 오른쪽 컨테이너와 간격을 조정
`;
const DeleteIcon = styled(FaTimes)`
  color: #ff0000;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #cc0000;
  }
`;
// const RightContainer = styled.div`
//   flex: 1;
// `;

const EmailContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center; // 항목들을 중앙에 정렬
  margin-bottom: 0px;
`;

// const SubmitButton = styled.button`
//   padding: 15px 30px;
//   background: #28a745; // 녹색 배경
//   color: #fff;
//   border-radius: 10px;
//   border: none;
//   cursor: pointer;
//   font-size: 18px; // 큰 글씨
//   transition: background 0.3s;
//   position: absolute;
//   right: 20px; // 우측 하단에 배치
//   bottom: 20px;

//   &:hover {
//     background: #218838;
//   }
// `;

export default JoinMeetingModal;

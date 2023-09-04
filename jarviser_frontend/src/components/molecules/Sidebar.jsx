import { useState } from "react";
import { useForm } from "react-hook-form";
import Signup from "../../pages/Signup";
import Login from "../../pages/Login";
import { Link } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Calendar from "../../logo/calendar.png";
import User from "../../logo/user.png";
import Document from "../../logo/document.png";
import LogoutIcon from "../../logo/logout.png";
import MainHeader from "./MainHeader";
import Modal from "react-modal";
import axios from "axios";
import useAccessToken from "../useAccessToken";
Modal.setAppElement("#root");

function Sidebar() {
  const navigate = useNavigate();
  const { accessToken } = useAccessToken();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menus = [
    { name: "회원정보", path: "/myPage" },
    { name: "캘린더", path: "/myCalendar" },
    { name: "회의록", path: "/myReport" },
    { name: "로그아웃", path: "/" },
  ];
  const Logout = () => {
    localStorage.removeItem("access-token");
    navigate("/");
  };
  const handleUserImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const { register, handleSubmit, getValues } = useForm();

  const checkPassword = async (data) => {
    const { password } = data;

    const payload = JSON.parse(`{ "password": "${password}" }`);
    try {
      const response = await axios.post(
        window.SERVER_URL+"/user/check",
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.response) {
        console.log("비밀번호가 일치합니다.");
        navigate("/myPage");
      } else {
        console.log("비밀번호가 일치하지 않습니다.");
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("API 요청 중 에러 발생:", error);
    }
  };

  return (
    <>
      <SidebarContianer>
        <LogoImage src={User} alt="회원정보" onClick={handleUserImageClick} />
        <a href="/myCalendar">
          <LogoImage src={Calendar} alt="달력" />
        </a>
        <a href="/myReport">
          <LogoImage src={Document} alt="미팅내역" />
        </a>
        <a href="/">
          <LogoImage src={LogoutIcon} alt="로그아웃" onClick={Logout} />
        </a>
      </SidebarContianer>
      <StyledModal isOpen={isModalOpen} onRequestClose={closeModal}>
        <h2>비밀번호 확인</h2>
        <form onSubmit={handleSubmit(checkPassword)}>
          {" "}
          {/* 폼 제출 시 checkPassword 함수를 실행합니다. */}
          <PasswordInput
            type="password"
            placeholder="비밀번호를 입력해주세요"
            {...register("password")} // 입력 필드를 react-hook-form에 등록합니다.
          />
          <LoginButton type="submit">확인</LoginButton>
        </form>
        <CloseButton onClick={closeModal}>닫기</CloseButton>
      </StyledModal>
    </>
  );
}
export default Sidebar;

const LogoImage = styled.div`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  margin-left: 20px;
  margin: 40px;
  cursor: pointer;
  transition: transform 0.3s;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  position: relative;

  &:hover {
    transform: scale(1.2);

    &::before {
      content: "${(props) => props.alt}"; // 이미지의 alt 텍스트를 사용
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 1;
      z-index: 2;
      font-size: 1rem; // 원하는 폰트 크기로 조절
      color: white; // 원하는 색상으로 설정
      white-space: nowrap;
    }

    & img {
      opacity: 0;
    }
  }
`;

const SidebarContianer = styled.div`
  display: flex;
  flex-direction: column;
  width: 170px;
  height: 104%;
  flex-shrink: 0;
  background-color: #91c8e4;
`;

const StyledModal = styled(Modal)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  outline: none;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  background-color: #f4f4f4;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
`;

const PasswordInput = styled.input`
  width: 250px;
  height: 32px;
  font-size: 15px;
  border: 0;
  border-radius: 15px;
  outline: none;
  padding-left: 10px;
  background-color: rgb(233, 233, 233);
`;

const LoginButton = styled.button`
  background-color: #91c8e4;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  margin: 20px;
`;

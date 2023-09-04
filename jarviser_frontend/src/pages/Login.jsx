import styled from "styled-components";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAccessToken from "../components/useAccessToken";
import Header from "../components/molecules/Navigation";
import { useEffect } from "react";

function Login() {
  const navigate = useNavigate();
  const { accessToken } = useAccessToken();

  useEffect(() => {
    if (accessToken) {
      navigate("/usermain");
    }
  }, [accessToken, navigate]);

  const onSubmit = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const response = await axios.post(
        window.SERVER_URL+"" + "/user/login",
        data
      );
      const accessToken = response.data["access-token"];
      localStorage.setItem("access-token", accessToken);
      navigate("/userMain");
    } catch (error) {
      console.error("로그인 요청 에러:", error);
      alert("아이디 또는 비밀번호가 틀렸습니다"); // 로그인 실패 시 알림 추가
    }
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitted, errors },
  } = useForm();

  return (
    <>
      <Header />

      <Whole>
        <RightColumn>
          <LoginHeadLine>
            <h1>Login</h1>
          </LoginHeadLine>
          <LoginForm onSubmit={handleSubmit(onSubmit)}>
            <LoginLabel htmlFor="email">이메일</LoginLabel>
            <LoginField
              id="email"
              type="email"
              placeholder="아이디를 입력해주세요."
              aria-invalid={
                isSubmitted ? (errors.email ? "true" : "false") : undefined
              }
              {...register("email", {
                required: "이메일은 필수 입력입니다.",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "이메일 형식에 맞지 않습니다.",
                },
              })}
            />
            <ErrorMessage>
              {errors.email ? errors.email.message : ""}
            </ErrorMessage>
            <LoginLabel htmlFor="password">비밀번호</LoginLabel>
            <LoginField
              id="password"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              aria-invalid={
                isSubmitted ? (errors.password ? "true" : "false") : undefined
              }
              {...register("password", {
                required: "비밀번호는 필수 입력입니다.",
                minLength: {
                  value: 8,
                  message: "8자리 이상 비밀번호를 사용하세요.",
                },
              })}
            />
            <ErrorMessage>
              {errors.password ? errors.password.message : ""}
            </ErrorMessage>
            <LoginButton type="submit" disabled={isSubmitting}>
              로그인
            </LoginButton>
          </LoginForm>
        </RightColumn>
      </Whole>
    </>
  );
}

// Styled Components (스타일 부분)
const ErrorMessage = styled.small`
  min-height: 20px; // Adjust this value based on your design
  display: block;
  color: red;
`;
const Whole = styled.div`
  display: flex;
  width: 100%;
  height: 60vh;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  margin-top: 6%;
  margin-bottom: 100px;
`;

const Wrapper = styled.div`
  width: 88%;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff; // 옅은 회색 배경
  padding: 40px;
  border-radius: 20px; // 둥근 모서리
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); // 그림자 효과
`;

const ImageLogo = styled.img`
  width: 30%;
  height: 80%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin-left: 0px;
  margin-right: 50px;
`;

const RightColumn = styled.div`
  display: flex;
  width: 50%;
  height: 80%;
  padding: 40px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  margin-bottom: 100px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 40%;
  gap: 8px; // 각 필드와 레이블 사이의 간격
`;

const LoginLabel = styled.label`
  align-self: stretch;
  color: var(--cool-gray-70, #4d5358); // 글씨 색상 변경
  font-family: "Roboto", sans-serif;
  font-size: 16px; // 글자 크기 조정
  font-weight: 500; // 글씨 두께 조정
  margin-bottom: 4px; // 아래쪽 마진 추가
  letter-spacing: 0.5px; // 글자 간격 조정
  text-transform: uppercase; // 대문자 변환
`;

const LoginField = styled.input`
  width: 500px;
  height: 32px;
  font-size: 15px;
  border: 0;
  border-radius: 15px;
  outline: none;
  padding-left: 10px;
  background-color: #f6f4eb;

  color: var(--cool-gray-60, #697077);
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  transition: border 0.3s ease;

  &:focus {
    border: 1px solid var(--primary-60, #0f62fe);
  }

  &::placeholder {
    color: var(--cool-gray-30, #c1c7cd);
  }
`;

const LoginButton = styled.button`
  width: 200px; // 너비 조정
  width: 100%; // 전체 너비
  height: 48px;
  padding: 12px;
  border: none; // 테두리 제거
  border-radius: 4px; // 모서리 둥글게
  background: #4682a9;
  color: white; // 글씨색 변경
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  font-weight: 500; // 글씨 두껍게
  cursor: pointer; // 마우스 커서 변경
  transition: background 0.3s ease; // 효과 추가
  margin-top: 10px;
  margin-left: 45%;
  &:hover {
    background: #91c8e4; // 마우스 오버시 색상 변경
  }

  &:active {
    transform: translateY(0); // 클릭 시 원래 위치로
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); // 클릭 시 그림자 크기 조정
  }

  &:disabled {
    background: var(--cool-gray-30, #c1c7cd);
    cursor: not-allowed;
  }
`;

const LoginHeadLine = styled.h1`
  font-family: "Roboto", sans-serif;
  font-size: 24px; // 글자 크기 조정
  font-weight: 500; // 글씨 두껍게
  color: #4682a9; // 글씨 색상 변경
  text-align: left; // 왼쪽 정렬
  letter-spacing: -1px; // 글자 간격 조정
  margin-bottom: 0px; // Header와 Form 간격 조정
`;

export default Login;

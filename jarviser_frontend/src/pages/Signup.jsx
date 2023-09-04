import styled from "styled-components";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jarviserImg from "../assets/images/Jarviser_logo.jpg";
import Navigation from "../components/molecules/Navigation";
import { useState } from "react";

function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitted, errors },
    watch,
  } = useForm();

  const email = watch("email");
  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const password = watch("password");
  const [emailChecked, setEmailChecked] = useState(false);

  const onSubmit = async (data) => {
    if (!emailChecked) {
      alert("이메일 중복 검사를 해주세요!"); // 모달창 대신 alert 사용
      return;
    }

    await new Promise((r) => setTimeout(r, 1000));
    axios.post(window.SERVER_URL+"" + "/user/signup", data);
    alert("회원가입 성공!");
    navigate("/login");
  };

  const checkEmailDuplication = async () => {
    const response = await axios.get(
      `${window.SERVER_URL+""}/user/${email}`
    );
    if (response.data.message === "success") {
      console.log(response.data);
      setEmailChecked(true);
      console.log(emailChecked);
      alert("사용 가능한 이메일입니다.");
    } else {
      setEmailChecked(false);
      alert(response.data.message);
    }
  };

  return (
    <>
      <Navigation />
      <Whole>
        {/* <ImageLogo src={jarviserImg} alt="Jarviser Logo" /> */}
        <RightColumn>
          <SignupHeadLine>
            <h1>Sign up</h1>
          </SignupHeadLine>
          <SignupForm onSubmit={handleSubmit(onSubmit)}>
            <SignupLabel htmlFor="email">이메일</SignupLabel>
            <SignupField
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
            <CheckEmailButton
              onClick={checkEmailDuplication}
              disabled={!isEmailValid}
              type="button"
            >
              이메일 중복 검사
            </CheckEmailButton>
            <ErrorMessage>
              {errors.email ? errors.email.message : ""}
            </ErrorMessage>

            <SignupLabel htmlFor="password">비밀번호</SignupLabel>
            <SignupField
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

            <SignupLabel htmlFor="passwordConfirm">비밀번호 확인</SignupLabel>
            <SignupField
              id="passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요."
              aria-invalid={
                isSubmitted
                  ? errors.passwordConfirm
                    ? "true"
                    : "false"
                  : undefined
              }
              {...register("passwordConfirm", {
                required: "비밀번호 확인은 필수 입력입니다.",
                validate: (value) =>
                  value === password || "비밀번호가 일치하지 않습니다.",
              })}
            />
            <ErrorMessage>
              {errors.passwordConfirm ? errors.passwordConfirm.message : ""}
            </ErrorMessage>

            <SignupLabel htmlFor="name">이름</SignupLabel>
            <SignupField
              id="name"
              type="text"
              placeholder="이름을 입력해주세요."
              aria-invalid={
                isSubmitted ? (errors.name ? "true" : "false") : undefined
              }
              {...register("name", {
                required: "이름은 필수 입력입니다.",
                minLength: {
                  value: 2,
                  message: "2자리 이상 이름을 입력하세요.",
                },
              })}
            />
            <ErrorMessage>
              {errors.name ? errors.name.message : ""}
            </ErrorMessage>

            <RegisterButton type="submit" disabled={isSubmitting}>
              회원가입
            </RegisterButton>
          </SignupForm>
        </RightColumn>
      </Whole>
    </>
  );
}
const Whole = styled.div`
  display: flex;
  width: 100%;
  height: 60vh;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  margin-top: 120px;
`;

const ImageLogo = styled.img`
  width: 50%;
  height: 90%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin-left: 20px;
  margin-right: -20px;
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

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 40%;
  gap: 8px; // 각 필드와 레이블 사이의 간격
`;

const SignupLabel = styled.label`
  align-self: stretch;
  color: var(--cool-gray-70, #4d5358); // 글씨 색상 변경
  font-family: "Roboto", sans-serif;
  font-size: 16px; // 글자 크기 조정
  font-weight: 500; // 글씨 두께 조정
  margin-bottom: 4px; // 아래쪽 마진 추가
  letter-spacing: 0.5px; // 글자 간격 조정
  text-transform: uppercase; // 대문자 변환
`;

const SignupField = styled.input`
  width: 500px;
  height: 32px;
  font-size: 15px;
  border: 0;
  border-radius: 15px;
  outline: none;
  padding-left: 10px;
  background-color: #f6f4eb;
`;

const CheckEmailButton = styled.button`
  width: 40%; // 전체 너비
  height: 10;
  border: none; // 테두리 제거
  border-radius: 4px; // 모서리 둥글게
  background: #4682a9;
  color: white; // 글씨색 변경
  font-size: 12px;
  cursor: pointer; // 마우스 커서 변경
  transition: background 0.3s ease; // 효과 추가
  margin-top: 10px;

  &:hover {
    background: #91c8e4; // 마우스 오버시 색상 변경
  }

  &:disabled {
    background: #4682a9; // 비활성화시 색상 변경
    cursor: not-allowed; // 마우스 커서 변경
  }
`;

const RegisterButton = styled.button`
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

  &:disabled {
    background: #f6f4eb; // 비활성화시 색상 변경
    cursor: not-allowed; // 마우스 커서 변경
  }
`;

const SignupHeadLine = styled.div`
  font-family: "Roboto", sans-serif;
  font-size: 24px; // 글자 크기 조정
  font-weight: 500; // 글씨 두껍게
  color: #4682a9; // 글씨 색상 변경
  text-align: left; // 왼쪽 정렬
  letter-spacing: -1px; // 글자 간격 조정
  margin-bottom: 0px; // Header와 Form 간격 조정
`;

const ErrorMessage = styled.small`
  min-height: 20px; // Adjust this value based on your design
  display: block;
  color: red;
`;

export default Signup;

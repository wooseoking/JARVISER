import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function Login() {
  const onSubmit = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const response = await axios.post(
        window.SERVER_URL+"/user/login",
        data
      );
      const accessToken = response.data["access-token"];
      localStorage.setItem("access-token", accessToken);
    } catch (error) {
      console.error("로그인 요청 에러:", error);
    }
    alert(JSON.stringify(data));
  };
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitted, errors },
  } = useForm();

  return (
    <>
      <div>
        <h1>로그인</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">이메일</label>
        <input
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
        {errors.email && <small role="alert">{errors.email.message}</small>}
        <br />
        <label htmlFor="password">비밀번호</label>
        <input
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
        {errors.password && (
          <small role="alert">{errors.password.message}</small>
        )}
        <br />
        <button type="submit" disabled={isSubmitting}>
          로그인
        </button>
      </form>
    </>
  );
}
export default Login;

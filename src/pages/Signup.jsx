import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function Signup() {
  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 1000));
    axios.post(window.SERVER_URL+"/user/signup", data);
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
        <h1>회원가입</h1>
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
        <label htmlFor="name">이름</label>
        <input
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
        {errors.name && <small role="alert">{errors.name.message}</small>}
        <br />
        <button type="submit" disabled={isSubmitting}>
          회원가입
        </button>
      </form>
    </>
  );
}
export default Signup;

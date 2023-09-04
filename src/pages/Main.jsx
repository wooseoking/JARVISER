import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Signup from "../pages/Signup";

function Main() {
  return (
    <>
      <div>
        <h1>업무를 더욱 가볍게.</h1>
      </div>
      <div>그럴싸한 설명</div>
      <div>
        <a href="#needs">더 알아보기 &rarr;</a>
      </div>
      <button type="button" id="join_meeting_button">
        참여하기 &rarr;
      </button>
      <p id="needs">jarviser is the tool you need.</p>
      <p>
        <h1>한 번 사용하면 빠져나올 수 없다.</h1>
      </p>
      <div>
        <div>실시간 반영</div>
        <div>다시 듣기</div>
        <div>통계</div>
        <div>랭킹</div>
      </div>

      <Link to="/signup">
        <button type="button" id="register_button">
          가입하러 가기
        </button>
      </Link>

      <p>INSTRUCTION</p>
      <div>1단계</div>
      <div>2단계</div>
      <div>3단계</div>
      <div>4단계</div>

      <p>개발한 사람들</p>
      <div>나현웅</div>
      <div>주창훈</div>
      <div>김민우</div>
      <div>김태현</div>
      <div>문홍웅</div>
      <div>최우석</div>

      <div>
        <a href="/">처음으로</a>
      </div>
    </>
  );
}
export default Main;

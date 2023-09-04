import {useState} from "react";
import {useForm} from "react-hook-form";
import {BrowserRouter, Route} from "react-router-dom";
import Register from "../pages/Register";
import Sidebar from "../components/molecules/Sidebar";
import MyPage from "./MyPage";
import MyCalendar from "./MyCalendar";
import MyReport from "./MyReport";

function UserMain() {
  return (
    <>
      {/* <div className="App"> */}
      <Sidebar />
      {/* </div> */}
      <button type="button" id="create_meeting_button">
        생성하기
      </button>
      <button type="button" id="join_meeting_button">
        입장하기
      </button>
      <button type="button" id="reserve_meeting_button">
        예약하기
      </button>
    </>
  );
}
export default UserMain;

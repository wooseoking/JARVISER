import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "../components/CSS/calendarCSS.css";
import moment from "moment";
import MeetingInfo from "../components/meetingInfo";
import { useNavigate } from "react-router-dom";
import useAccessToken from "../components/useAccessToken";
import Sidebar from "../components/molecules/Sidebar";
import styled from "styled-components";
import MainHeader from "../components/molecules/MainHeader";

function MyCalendar() {
  const navigate = useNavigate();
  const { accessToken } = useAccessToken();
  const [marks, setMarks] = useState([]);
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }

    // 병렬 API 호출
    Promise.all([
      axios.get(window.SERVER_URL+"" + "/user/meetinglist", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      axios.get(window.SERVER_URL+"" + "/reservation", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    ])
      .then(([meetinglistResponse, reservationResponse]) => {
        const meetingDates = meetinglistResponse.data.meetinglist.map(
          (meeting) => moment(meeting.date).format("DD-MM-YYYY")
        );
        const reservationDates =
          reservationResponse.data.reservatedMeetings.map(
            (meeting) => moment(meeting.startTime).format("DD-MM-YYYY") // API 응답 형태에 따라 필요한 필드를 사용해야 합니다.
          );
        setMarks([...new Set([...meetingDates, ...reservationDates])]);
      })
      .catch((error) => console.error("Error fetching the data:", error));
  }, [accessToken, navigate]);
  const [date, setDate] = useState(new Date());

  const handleDateChange = (date) => {
    const localDateStr = moment(date).format("YYYY-MM-DD");
    const localDate = new Date(localDateStr);
    setDate(localDate);
  };

  return (
    <>
      <MainHeader />
      <PageWrapper>
        <Sidebar />
        <CalendarWrapper>
          <CalendarContainer>
            <Calendar
              onChange={handleDateChange} // 수정된 핸들러를 사용합니다.
              value={date} // 'date' 대신 'value' prop을 사용합니다.
              locale="ko-Ko"
              formatDay={(locale, date) => moment(date).format("D")}
              tileClassName={({ date, view }) => {
                if (marks.includes(moment(date).format("DD-MM-YYYY"))) {
                  return "dot";
                }
              }}
            />
          </CalendarContainer>
          <CalendarData>
            <MeetingInfo date={date} />
          </CalendarData>
        </CalendarWrapper>
      </PageWrapper>
    </>
  );
}
export default MyCalendar;

const PageWrapper = styled.div`
  display: flex;
`;
const CalendarContainer = styled.div`
  margin: 100px;
`;
const CalendarData = styled.div`
  display: flex;
  width: 350px;
  height: 400px;
  max-height: 400px; /* 최대 높이 설정 */
  overflow-y: auto; /* 세로 스크롤 생성 */
  position: relative;
  flex-direction: column;
  justify-content: start;
  flex-shrink: 0;
  color: black;
  background-color: #white;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  line-height: normal;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1), 0px 0px 5px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
`;
const CalendarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

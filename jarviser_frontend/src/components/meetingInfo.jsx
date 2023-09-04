import React, { useState, useEffect } from "react";
import moment from "moment";
import styled from "styled-components";
import axios from "axios";
import useAccessToken from "../components/useAccessToken";

function MeetingInfo({ date }) {
  const [meetingData, setMeetingData] = useState([]);
  const { accessToken } = useAccessToken();
  useEffect(() => {
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
        const meetings = meetinglistResponse.data.meetinglist;
        const reservations = reservationResponse.data.reservatedMeetings.map(
          (reservation) => ({
            ...reservation,
            date: reservation.startTime, // 모든 항목에 일관된 'date' 필드를 만듭니다.
          })
        );

        const combinedData = [...meetings, ...reservations];
        setMeetingData(combinedData);
        console.log(combinedData);
      })
      .catch((error) =>
        console.error("Error fetching the meeting list:", error)
      );
  }, []);

  const getMeetingsOfTheDay = (selectedDate) => {
    return meetingData.filter(
      (meeting) =>
        moment(meeting.date).format("YYYY-MM-DD") ===
        moment(selectedDate).format("YYYY-MM-DD")
    );
  };

  // 선택한 날짜에 따른 회의 정보를 가져옵니다.
  const meetingsOfTheDay = getMeetingsOfTheDay(
    date.toISOString().split("T")[0]
  );

  return (
    <div>
      {meetingsOfTheDay.length > 0 ? (
        <>
          <MeetingTime>
            <span>{moment(date).format("YYYY-MM-DD")}</span>
          </MeetingTime>
          {meetingsOfTheDay.map((meeting, index) => (
            <CalendarData key={index}>
              <span>{moment(meeting.date).format("HH:mm")}</span>
              <span>{meeting.meetingName}</span>
            </CalendarData>
          ))}
        </>
      ) : (
        <>
          <NoneMeeting>{date.toISOString().split("T")[0]}</NoneMeeting>
          <p>미팅이 없습니다</p>
        </>
      )}
    </div>
  );
}

export default MeetingInfo;

const CalendarData = styled.div`
  display: flex;
  justify-content: between;
  gap: 30px;
  margin-left: 20px;
  margin: 20px;
`;

const MeetingTime = styled.div`
  span {
    font-size: 30px;
    background-color: #91c8e4;
    border-radius: 10px;
    padding: 0 5px; // 배경색이 텍스트를 약간 감싸도록 패딩 추가
  }
  margin: 20px;
`;

const NoneMeeting = styled.div`
  font-size: 30px;
  margin: 20px;
`;

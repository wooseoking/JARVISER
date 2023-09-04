import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import useAccessToken from "../components/useAccessToken";
import Sidebar from "../components/molecules/Sidebar";
import styled from "styled-components";
import MainHeader from "../components/molecules/MainHeader";

function MyReport() {
  const navigate = useNavigate();
  const { accessToken } = useAccessToken();

  const itemsPerPage = 4; // 한 페이지당 표시할 아이템 개수
  const [currentPage, setCurrentPage] = useState(1);
  const [myReport, setMyReport] = useState([]);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    getMyReport();
  }, [currentPage]); // 페이지 변경 시에만 데이터를 가져오도록 변경

  async function getMyReport() {
    try {
      const response = await axios.get(
        window.SERVER_URL+"" + "/user/meetinglist",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log("response.data.meetinglist", response.data.meetinglist);
      setMyReport(response.data.meetinglist);
    } catch (error) {
      console.log(error);
    }
  }

  // 현재 페이지에 해당하는 데이터만 반환하는 함수
  function getCurrentPageData() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return myReport.slice(startIndex, endIndex);
  }

  return (
    <>
      <MainHeader />
      <AllContainer>
        <Sidebar />
        <div>{/* <h1>회의록</h1> */}</div>
        <ul>
          {getCurrentPageData().map((report, index) => {
            console.log("encryptedKey:", report.encryptedKey);
            return (
              <MeetingLi key={index}>
                <MeetingInfo>
                  <h2>{report.meetingName}</h2>
                  <p>Host: {report.hostName}</p>
                  <p>Date: {report.date}</p>
                </MeetingInfo>
                <DetailButton>
                  <Link
                    to={"/reportdetail"}
                    state={{ encryptedKey: report.encryptedKey }}
                    className="no-underline"
                  >
                    통계보기
                  </Link>
                </DetailButton>
              </MeetingLi>
            );
          })}
        </ul>
        <Pagination>
          <PaginationButton
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </PaginationButton>
          <p>{currentPage}</p>
          <PaginationButton
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={getCurrentPageData().length < itemsPerPage} // 변경된 조건
          >
            다음
          </PaginationButton>
        </Pagination>
      </AllContainer>
    </>
  );
}

export default MyReport;

const MeetingLi = styled.li`
  display: flex;
  width: 1100px;
  height: 88px;
  padding: 16px;
  justify-content: space-between; /* 내부 컨텐츠를 양쪽으로 정렬 */
  align-items: center;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid #dde1e6;
  background-color: #ffffff;
  margin-bottom: 20px;
`;

const MeetingInfo = styled.div`
  flex: 1; /* 나머지 공간을 모두 차지하도록 설정 */
`;

const DetailButton = styled.button`
  display: flex;
  width: 100px;
  height: 40px;
  padding: 2px 0px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 999px;
  border: none; /* Remove the border color property */
  background-color: #4682a9;
  color: #f6f4eb !important;
`;

const AllContainer = styled.div`
  display: flex;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px; /* 하단 마진 추가 */
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const PaginationButton = styled.button`
  margin: 0 10px;
  padding: 5px 10px;
  border: none;
  background-color: ${(props) => (props.disabled ? "#f0f0f0" : "#4682A9")};
  color: ${(props) => (props.disabled ? "#999" : "white")};
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
`;

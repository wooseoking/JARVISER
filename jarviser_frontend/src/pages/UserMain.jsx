import { useState } from "react";
import Sidebar from "../components/molecules/Sidebar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAccessToken from "../components/useAccessToken";
import { useEffect } from "react";
import styled from "styled-components";
import MainHeader from "../components/molecules/MainHeader";
import JoinMeetingModal from "./JoinMeetingModal";
import Reservation from "./Reservation";
import "animate.css";

function UserMain() {
  const [isReservationModalOpen, setIsReservatopmModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const openModal = () => {
    setIsReservatopmModalOpen(true);
  };

  const closeModal = () => {
    setIsReservatopmModalOpen(false);
  };

  const openJoinModal = () => {
    console.log("여기다");
    setIsJoinModalOpen(true);
    console.log(isJoinModalOpen);
  };

  const closeJoinModal = () => {
    setIsJoinModalOpen(false);
  };

  const navigate = useNavigate();
  const { accessToken } = useAccessToken();
  const reservation = () => {
    navigate("/reservation");
  };
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);
  return (
    <>
      <MainHeader />
      <PageContent>
        <Sidebar />
        <ButtonFrame>
          <Link to="/createmeeting" className="no-underline">
            <ButtonWithImage>
              <StyledSVGButton>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="132"
                  height="125"
                  viewBox="0 0 132 125"
                  fill="none"
                >
                  <SVGPath d="M66 0C29.634 0 0 28.0625 0 62.5C0 96.9375 29.634 125 66 125C102.366 125 132 96.9375 132 62.5C132 28.0625 102.366 0 66 0ZM92.4 67.1875H70.95V87.5C70.95 90.0625 68.706 92.1875 66 92.1875C63.294 92.1875 61.05 90.0625 61.05 87.5V67.1875H39.6C36.894 67.1875 34.65 65.0625 34.65 62.5C34.65 59.9375 36.894 57.8125 39.6 57.8125H61.05V37.5C61.05 34.9375 63.294 32.8125 66 32.8125C68.706 32.8125 70.95 34.9375 70.95 37.5V57.8125H92.4C95.106 57.8125 97.35 59.9375 97.35 62.5C97.35 65.0625 95.106 67.1875 92.4 67.1875Z" />
                </svg>
              </StyledSVGButton>
              <Button type="button" id="create_meeting_button">
                생성하기
              </Button>
            </ButtonWithImage>
          </Link>

          <ButtonWithImage>
            <StyledSVGButton onClick={openJoinModal}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="133"
                height="134"
                viewBox="0 0 133 134"
                fill="none"
              >
                <SVGPath
                  d="M66.5 0C29.8585 0 0 29.9541 0 66.7129C0 103.472 29.8585 133.426 66.5 133.426C103.142 133.426 133 103.472 133 66.7129C133 29.9541 103.142 0 66.5 0ZM85.0535 70.2487L61.579 93.7984C60.5815 94.7991 59.318 95.2661 58.0545 95.2661C56.791 95.2661 55.5275 94.7991 54.53 93.7984C52.6015 91.8637 52.6015 88.6615 54.53 86.7268L74.48 66.7129L54.53 46.6991C52.6015 44.7644 52.6015 41.5622 54.53 39.6275C56.4585 37.6928 59.6505 37.6928 61.579 39.6275L85.0535 63.1772C87.0485 65.1118 87.0485 68.314 85.0535 70.2487Z"
                  fill="#292D32"
                />
              </svg>
            </StyledSVGButton>

            <Button
              type="button"
              id="join_meeting_button"
              onClick={openJoinModal}
            >
              입장하기
            </Button>
          </ButtonWithImage>

          {/* <MainImage
            className="animate__animated animate__bounce"
            src={man}
            alt="man"
          /> */}

          <ButtonWithImage>
            <StyledSVGButton onClick={openModal}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="108"
                height="140"
                viewBox="0 0 108 140"
                fill="none"
              >
                <SVGPath
                  d="M104.952 87.2194L97.9689 75.6274C96.5025 73.0436 95.1757 68.1554 95.1757 65.2924V47.625C95.1757 31.2146 85.539 17.0389 71.6425 10.4049C68.0113 3.98039 61.3075 0 53.626 0C46.0144 0 39.1712 4.12005 35.54 10.6144C21.9228 17.388 12.4956 31.4241 12.4956 47.625V65.2924C12.4956 68.1554 11.1688 73.0436 9.70234 75.5576L2.64937 87.2194C-0.143882 91.8981 -0.772363 97.0656 0.973422 101.814C2.64937 106.493 6.62976 110.124 11.7973 111.87C25.3446 116.479 39.5902 118.713 53.8355 118.713C68.0811 118.713 82.3267 116.479 95.874 111.94C100.762 110.334 104.533 106.633 106.349 101.814C108.164 96.9958 107.675 91.6886 104.952 87.2194Z"
                  fill="#292D32"
                />
                <SVGPath
                  d="M73.4566 125.783C70.5237 133.884 62.7724 139.68 53.6943 139.68C48.1777 139.68 42.7308 137.445 38.89 133.465C36.6554 131.37 34.9795 128.576 34.0018 125.713C34.9096 125.853 35.8174 125.923 36.7951 126.063C38.4012 126.272 40.0772 126.482 41.7532 126.621C45.7336 126.97 49.7838 127.18 53.834 127.18C57.8144 127.18 61.7948 126.97 65.7053 126.621C67.1718 126.482 68.6383 126.412 70.0349 126.202C71.1522 126.063 72.2695 125.923 73.4566 125.783Z"
                  fill="#292D32"
                />
              </svg>
            </StyledSVGButton>
            <Button
              type="button"
              id="reserve_meeting_button"
              onClick={openModal}
            >
              예약하기
            </Button>
          </ButtonWithImage>
        </ButtonFrame>
      </PageContent>
      {isReservationModalOpen && <Reservation closeModal={closeModal} />}
      {isJoinModalOpen && <JoinMeetingModal closeModal={closeJoinModal} />}
    </>
  );
}

const PageContent = styled.div`
  display: flex;
  width: 80%; // 너비를 100%로 설정
  height: 85.5vh; // 높이를 화면 높이의 100%로 설정
  align-items: center;
  flex-shrink: 0;
`;

const ButtonFrame = styled.div`
  margin-left: 10%;
  display: flex;
  width: 100%; // 너비를 100%로 설정
  height: auto; // 높이를 자동으로 설정
  justify-content: between;
  align-items: between;
  gap: 20%; // 버튼 사이의 간격을 퍼센티지로 설정
  flex-shrink: 0;
`;

const Button = styled.button`
  display: flex;
  width: 150px;
  height: 50px;
  padding: 8px;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  border: solid 2px #749bc2;
  background-color: white;
  color: #749bc2;
  cursor: pointer;

  /* Button/L */
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%; /* 20px */
  letter-spacing: 0.5px;
  font-color: #f6f4eb;
`;

const ButtonWithImage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px; // SVG 버튼과 일반 버튼 사이의 간격
`;

const MainImage = styled.img`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledSVGButton = styled.button`
  width: 132px;
  height: 125px;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
`;

const SVGPath = styled.path`
  fill: #4682a9;
  &:hover {
    fill: #91c8e4;
  }
`;

export default UserMain;

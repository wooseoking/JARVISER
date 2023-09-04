import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Signup from "../pages/Signup";
import Navigation from "../components/molecules/Navigation";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAccessToken from "../components/useAccessToken";
import styled from "styled-components";
import MainImage from "../logo/Main.png";
import Chart from "../logo/chart.png";
import Keyword from "../logo/keyword.png";
import Music from "../logo/music.png";
import Stream from "../logo/stream.png";
import { Icon } from "@material-ui/core";
import developer1Img from "../developer/developer-1.jpg";
import developer2Img from "../developer/developer-2.jpg";
import developer3Img from "../developer/developer-3.jpg";
import developer4Img from "../developer/developer-4.jpg";
import developer5Img from "../developer/developer-5.jpg";
import developer6Img from "../developer/developer-6.jpg";

function Main() {
  const navigate = useNavigate();
  const { accessToken } = useAccessToken();
  const needsSectionRef = useRef(null);

  const scrollToNeedsSection = () => {
    const yOffset = -70; // 원하는 만큼 조정값을 설정합니다
    const y =
      needsSectionRef.current.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // 맨 위로 스크롤
  };

  useEffect(() => {
    if (accessToken) {
      navigate("/usermain");
    }
  }, [accessToken, navigate]);
  return (
    <>
      <Navigation></Navigation>
      <MainContianer>
        <TextsContainer>
          <TextContainer>
            <h1>업무를 더욱 가볍게</h1>

            <h2>"당신의 회의, 자동으로 기록하고 텍스트로 표현하세요!"</h2>
            <h4>
              👄✍️ 회의 참여자의 말을 텍스트로 변환해주는 마법같은 서비스로
              <br />
              아이디어를 시각화하여, 목소리를 보여주세요.💬📊
            </h4>

            <HashTag>#팀워크의마법 #아이디어를펼치다 #생산적인회의</HashTag>
          </TextContainer>
          <MoreButton onClick={scrollToNeedsSection}>
            더 알아보기 &rarr;
          </MoreButton>
        </TextsContainer>
        <MainPageImage src={MainImage} alt="JARVISER" />
      </MainContianer>

      <MainContianer2 ref={needsSectionRef}>
        <TextContainer2 id="needs">
          jarviser is the tool you need
        </TextContainer2>
        <TextContainer2>
          <h1>한 번 사용하면 빠져나올 수 없다</h1>
        </TextContainer2>
        <AllIconContainer>
          <BigIconContainer>
            <IconContainer src={Stream} alt="STREAM" />
            <IconText>실시간 반영</IconText>
            <IconText>실시간 음성을 채팅형식으로 받아보기</IconText>
          </BigIconContainer>
          <BigIconContainer>
            <IconContainer src={Music} alt="REPLAY" />
            <IconText>다시 듣기</IconText>
            <IconText>텍스트를 클릭하여 음성 다시듣기</IconText>
          </BigIconContainer>
          <BigIconContainer>
            <IconContainer src={Keyword} alt="Keywod" />
            <IconText>통계</IconText>
            <IconText>오늘의 키워드를 받아보기</IconText>
          </BigIconContainer>
          <BigIconContainer>
            <IconContainer src={Chart} alt="Chart" />
            <IconText>랭킹</IconText>
            <IconText>참여도가 가장 높은 유저 확인하기</IconText>
          </BigIconContainer>
        </AllIconContainer>
        <Link to="/signup" className="no-underline">
          <SignupButton type="button" id="register_button">
            가입하러 가기
          </SignupButton>
        </Link>
      </MainContianer2>

      <MainContianer3>
        <TeamError506>Team: 506 Error</TeamError506>
        <DevelopersContainer>
          <DeveloperCard>
            <DeveloperImage src={developer1Img} alt="Developer 1" />
            <DeveloperInfoContainer>
              <DeveloperName>NaHyunWoong</DeveloperName>
              <DeveloperInfo>Infra + QA Leader</DeveloperInfo>
            </DeveloperInfoContainer>
          </DeveloperCard>
          <DeveloperCard>
            <DeveloperImage src={developer2Img} alt="Developer 2" />
            <DeveloperInfoContainer>
              <DeveloperName>JooChangHoon</DeveloperName>
              <DeveloperInfo>PM + Front-End Leader</DeveloperInfo>
            </DeveloperInfoContainer>
          </DeveloperCard>
          <DeveloperCard>
            <DeveloperImage src={developer3Img} alt="Developer 3" />
            <DeveloperInfoContainer>
              <DeveloperName>KimMinWoo</DeveloperName>
              <DeveloperInfo>UI + UX Leader</DeveloperInfo>
            </DeveloperInfoContainer>
          </DeveloperCard>
          <DeveloperCard>
            <DeveloperImage src={developer4Img} alt="Developer 4" />
            <DeveloperInfoContainer>
              <DeveloperName>KimTaeHyun</DeveloperName>
              <DeveloperInfo>Infra + DB Leader</DeveloperInfo>
            </DeveloperInfoContainer>
          </DeveloperCard>
          <DeveloperCard>
            <DeveloperImage src={developer5Img} alt="Developer 5" />
            <DeveloperInfoContainer>
              <DeveloperName>MoonHongWoong</DeveloperName>
              <DeveloperInfo>Front-End Leader</DeveloperInfo>
            </DeveloperInfoContainer>
          </DeveloperCard>
          <DeveloperCard>
            <DeveloperImage src={developer6Img} alt="Developer 6" />
            <DeveloperInfoContainer>
              <DeveloperName>ChoiWooSeok</DeveloperName>
              <DeveloperInfo>Back_End Leader</DeveloperInfo>
            </DeveloperInfoContainer>
          </DeveloperCard>
        </DevelopersContainer>

        <RollbackButton to="/" onClick={scrollToTop}>
          처음으로
        </RollbackButton>
      </MainContianer3>
    </>
  );
}
export default Main;

const HashTag = styled.div`
  align-self: stretch;
  color: #91c8e4;
  font-family: Roboto;
  font-size: 15px;
  font-style: normal;
  font-weight: 350px;
  line-height: 59.4px;
`;

const TextContainer = styled.div`
  align-self: stretch;
  color: var(--cool-gray-90, #21272a);
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 350px;
  line-height: 59.4px;
`;

const TextsContainer = styled.div`
  display: flex;
  width: 797px;
  height: 301px;
  flex-direction: column;
  align-items: flex-start;
  gap: none;
  flex-shrink: 0;
  margin-top: 100px;
  margin-bottom: 20px; /* 추가 */
`;

const MoreButton = styled.button`
  display: flex;
  width: 160px;
  height: 70px;
  padding: 16px 12px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 999px;
  border: none;
  background: var(--primary-60, #4682a9);
  color: #f6f4eb;
  margin: 2px;
  font-size: 15px;
`;

const SignupButton = styled.button`
  display: flex;
  width: 160px;
  height: 70px;
  padding: 16px 12px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 999px;
  border: 2px solid #4682a9;
  background: #4682a9;
  color: #f6f4eb;
  margin-left: 700px;
  font-size: 15px;
`;

const MainPageImage = styled.img`
  width: 570px;
  height: 500px;
  flex-shrink: 0;
  background: url(<path-to-image>), lightgray 50% / cover no-repeat;
  margin-top: 100px;
`;

const MainContianer = styled.div`
  display: flex;
  justify-content: center;
  height: 680px;
  background: #f6f4eb;
`;

const MainContianer2 = styled.div`
  justify-content: center;
  height: 680px;
  background: white;
`;

const MainContianer3 = styled.div`
  justify-content: center;
  height: 750px;
  background: #f0f0f0;
`;

const TextContainer2 = styled.div`
  align-self: stretch;
  color: var(--primary-90, #749bc2);
  text-align: center;
  /* Other/Caption */
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%; /* 20px */
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 100px;
`;

const IconContainer = styled.img`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  fill: var;
`;

const IconText = styled.div`
  color: var(--cool-gray-90, #21272a);
  text-align: center;
  font-family: Roboto;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
`;

const BigIconContainer = styled.div`
  display: flex;
  padding: 0px 16px;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex: 1 0 0;
`;

const AllIconContainer = styled.div`
  display: flex;
  width: 1532px;
  height: 256px;
  align-items: flex-start;
  gap: 16px;
  flex-shrink: 0;
  margin-top: 100px;
`;

const DevelopersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 80px;
  margin-top: 20px;
  margin-bottom: 40px;
  justify-content: center;
`;

const DeveloperCard = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-top: 10px;
  border: 2px solid #4682a9;
  padding: 10px;
  width: 300px;
  height: 170px;
  border-radius: 10px;
`;

const DeveloperImage = styled.img`
  width: 100px;
  height: 120px;
  // border-radius: 50%;
  border: 2px solid #4682a9;
`;

const DeveloperInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const DeveloperName = styled.div`
  font-size: 20px;
  color: var(--cool-gray-90, #21272a);
`;

const DeveloperInfo = styled.div`
  font-size: 13px;
  color: var(--cool-gray-60, #74788d);
  margin-top: auto; /* Push info to the bottom */
`;

const TeamError506 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 44px;
  font-weight: bold;
  color: #4682a9;

  background-color: #f0f0f0;
  padding-top: 40px;
`;

const RollbackButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 70px; /* 변경: 버튼 높이를 조정 */
  // padding: 16px; /* 변경: 패딩을 조정 */
  // margintop: 10px;
  border-radius: 999px;
  border: 2px solid #4682a9;
  background: #4682a9;
  color: #f6f4eb;
  text-decoration: none;
  font-size: 15px;
  margin: 0 auto;
`;

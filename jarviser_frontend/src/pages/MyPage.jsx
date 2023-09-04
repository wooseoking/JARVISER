import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAccessToken from "../components/useAccessToken";
// import jwt_decode from "jwt-decode"; // jwt-decode 라이브러리를 사용합니다.
import Sidebar from "../components/molecules/Sidebar";
import styled from "styled-components";
import MainHeader from "../components/molecules/MainHeader";

function MyPage() {
  const navigate = useNavigate();
  const { accessToken } = useAccessToken();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);

  // const { userId } = jwt_decode(accessToken); // 토큰에서 userId 가져오기
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // 모달창 띄우기 여부 상태
  const [isDeleting, setIsDeleting] = useState(false); // 회원 탈퇴 중 여부 상태
  const [profileImage, setProfileImage] = useState(null); // 사용자의 프로필 이미지를 저장할 상태

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // 이미지 파일의 내용을 base64 형식으로 상태에 저장
      };
      reader.readAsDataURL(file);
      axios
        .post(window.SERVER_URL+"" + "/user/upload", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(formData);
          console.log("이미지 업로드에 성공했습니다: ", response);
        })
        .catch((error) => {
          console.log("이미지 업로드 중 에러가 발생했습니다: ", error);
        });
    }
  };
  useEffect(() => {
    GetUser();
  }, []);

  async function GetUser() {
    try {
      const response = await axios.get(
        window.SERVER_URL+"" + "/user/mypage",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const { email, name } = response.data.response; // 객체에서 이메일과 이름 정보 가져오기
      console.log(response.data.imgPath);
      const url = response.data.imgPath;
      const cleanedUrl = url.replace(/"/g, "");
      setUserEmail(email);
      setUserName(name);
      setProfileImage(cleanedUrl);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangeName = (e) => {
    e.preventDefault();
    setUserName(e.target.value);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setUserPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        window.SERVER_URL+"" + "/user/update",
        {
          name: userName,
          password: userPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      window.location.href = "/usermain";
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true); // 탈퇴 중 상태로 변경
      await axios.delete(window.SERVER_URL+"" + "/user/delete", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // 회원 탈퇴 성공시 토큰 삭제 및 "/" 페이지로 이동
      localStorage.removeItem("access-token");
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <MainHeader />
      <PageContent>
        <Sidebar />
        <ImgContainger>
          {/* <ProfileImageContainer $imgUrl={profileImage}>
            <ProfileImage src={profileImage} alt="Profile" />
          </ProfileImageContainer> */}
          <ProfileImageContainer>
            <ProfileImage src="/프로필.png" alt="Profile" />
          </ProfileImageContainer>
          <ProfileInput
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
        </ImgContainger>
        <DataContainer>
          <BigBox>
            <Box>
              <h2>이메일</h2>
            </Box>
            <DataBox>{userEmail}</DataBox>
          </BigBox>
          <form onSubmit={handleSubmit}>
            <BigBox>
              <Box>
                <h2>이름</h2>
              </Box>
              <DataInput
                type="text"
                value={userName}
                onChange={handleChangeName}
              />
            </BigBox>
            <BigBox>
              <Box>
                <h2>비밀번호</h2>
              </Box>
              <DataInput
                type="password"
                value={userPassword}
                onChange={handleChangePassword}
              />
            </BigBox>
            <ButtonContainer>
              <ChangeButton type="submit">수정</ChangeButton>
              <WithdrawButton onClick={handleModalOpen}>
                탈퇴하기
              </WithdrawButton>
            </ButtonContainer>
          </form>

          {modalOpen && (
            <div>
              <div>정말로 탈퇴하시겠습니까?</div>
              <button onClick={handleModalClose}>취소</button>
              <button onClick={handleDelete} disabled={isDeleting}>
                확인
              </button>
            </div>
          )}
        </DataContainer>
      </PageContent>
    </>
  );
}

export default MyPage;
const ImgContainger = styled.div`
  align-items: center;
  justify-content: center;
  margin-left: 10%;
`;
const ProfileImageContainer = styled.div`
  width: 300px;
  height: 300px;
  border: 1px solid #ddd;
  border-radius: 40%;
  overflow: hidden;
  margin-bottom: 20px;
  background-image: url(${(props) =>
    props.$imgUrl || "defaultProfileImagePath.jpg"});
  background-size: cover;
  background-position: center;
  margin: 20%;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileInput = styled.input`
  display: flex;
  margin-left: 36%;
  margin-bottom: 20px;
`;
const PageContent = styled.div`
  display: flex;
  width: 80%; // 너비를 100%로 설정
  height: 85.5vh; // 높이를 화면 높이의 100%로 설정
  align-items: center;
  flex-shrink: 0;
`;

const Box = styled.div`
  width: 140px;
  height: 100px;
  flex-shrink: 0;
  background-color: #91c8e4;
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
`;

const DataBox = styled.div`
  display: flex;
  width: 432px;
  height: 99px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-shrink: 0;
  border: 1px solid var(--cool-gray-20, #dde1e6);
  background: var(--default-white, #fff);
  justify-content: center;
  align-items: center;
`;

const DataInput = styled.input`
  display: flex;
  width: 400px;
  height: 66px;
  padding: 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-shrink: 0;
  border: 1px solid var(--cool-gray-20, #dde1e6);
  background: var(--default-white, #fff);
`;

const BigBox = styled.div`
  display: flex;
  boarder: 1px solid black;
  margin: 20px;
`;

const ChangeButton = styled.button`
  display: flex;
  width: 100px;
  height: 50px;
  padding: 2px 0px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background: #4682a9;
  color: #f6f4eb;
  border: none;
  border-radius: 999px;
  margin: 20px;
`;

const WithdrawButton = styled.button`
  display: flex;
  width: 100px;
  height: 50px;
  padding: 2px 0px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background: red;
  color: #f6f4eb;
  border-radius: 999px;
  border: none;
  margin: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-left: 35%;
`;

const DataContainer = styled.div`
  align-items: center;
  margin-left: 10%;
`;

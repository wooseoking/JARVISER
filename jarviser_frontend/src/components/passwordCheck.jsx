import React from "react";
import styled from "styled-components";

function PasswordModal({ isOpen, onClose }) {
  if (!isOpen) return null; // 모달이 닫혀있으면 아무것도 렌더링하지 않음

  return (
    <ModalOverlay>
      <ModalWrapper>
        <ModalContent>
          <h2>비밀번호 확인</h2>
          <p>비밀번호를 입력하세요.</p>
          <input type="password" placeholder="비밀번호" />
          <ButtonContainer>
            <CancelButton onClick={onClose}>취소</CancelButton>
            <ConfirmButton>확인</ConfirmButton>
          </ButtonContainer>
        </ModalContent>
      </ModalWrapper>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalWrapper = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
`;

const ModalContent = styled.div`
  text-align: center;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background-color: #ccc;
`;

const ConfirmButton = styled(Button)`
  background-color: #0f62fe;
  color: white;
`;

export default PasswordModal;

import {useState} from "react";
import {useForm} from "react-hook-form";
import Signup from "../../pages/Signup";
import Login from "../../pages/Login";
import {Link} from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";
function Navigation() {
  return (
    <nav>
      <HeaderContainer>
        <Header />
        <NavigationContainer>
          <Link to="/Login" className="no-underline">
            <LoginButton type="button" id="login_button">
              Login
            </LoginButton>
          </Link>
          <Link to="/Signup" className="no-underline">
            <SignupButton type="button" id="signup_button">
              Signup
            </SignupButton>
          </Link>
        </NavigationContainer>
      </HeaderContainer>
    </nav>
  );
}
export default Navigation;

const LoginButton = styled.button`
  display: flex;
  width: 100px;
  height: 45px;
  padding: 16px 12px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 999px;
  border: none;
  border: 2px solid #4682a9;
  background-color: #f6f4eb;
  color: #4682a9;
  margin-right: 10px;
  cursor: pointer;
`;

const SignupButton = styled.button`
  display: flex;
  width: 100px;
  height: 45px;
  padding: 16px 12px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 999px;
  border: 2px solid var(--primary-60, #4682a9);
  background: var(--primary-60, #4682a9);
  color: #f6f4eb;
  margin: 2px;
  cursor: pointer;
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: flex-between;
  align-items: center;
  margin-right: 80px;
`;

const HeaderContainer = styled.div`
  display: flex;
  width: 1800;
  height: 94px;
  flex-shrink: 0;
  background-color: #91c8e4;
  justify-content: space-between;
  align-items: center;
`;

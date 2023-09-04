     
    import Logo from "../../logo/Logo.png";
    import styled from "styled-components";
    function Header() {
      return (
        <>
          <header>
            <h1>
              <a href="/">
                <LogoImage src={Logo} alt="JARVISER" />
              </a>
            </h1>
          </header>
        </>
      );
    }
    export default Header;
    
    const LogoImage = styled.img`
      width: 150px;
      height: 78px;
      flex-shrink: 0;
      margin-left: 20px;
    `;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Person } from '@styled-icons/ionicons-solid';
import { Navicon } from '@styled-icons/evil';
import { Close } from '@styled-icons/material';
import Button from '../Button';

const Container = styled.div`
  display: none;
  align-items: center;
  width: 100%;
  padding: 14px 30px;
  background-color: #181A20;
  border-bottom: 1px solid #F5F5F5;
  @media (min-width: 992px) {
    display: flex;
  }
`;
const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
`;
const RightContainer = styled.div`
  display: flex;
  align-items: center;
`;
const Logo = styled.div`
  padding-bottom: ${(props) => (props.mb ? '50px' : '0')};

  color: #F0B90B;
  font-size: 36px;
  font-weight: bold;
  cursor: pointer;
  @media (min-width: 992px) {
    margin-right: 30px;
    font-size: 40px;
  }
`;
const NavItem = styled.div`
  margin-right: ${(props) => (props.mr ? '20px' : '0')};
  padding: ${(props) => (props.px1 ? '15px 0' : '0')};
  font-size: ${(props) => (props.fzBig ? '20px' : '18px')};

  font-weight: 500;
  color: #EAECEF;
  cursor: pointer;
  transition: color 0.1s linear;
  :hover {
    color: #F0B90B;
  }
`;
const PersonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: auto;
  border-radius: 4px;
  cursor: pointer;
  :hover {
    color: #F5F5F5;
  }
`;
const PersonIcon = styled(Person)`
  width: 2rem;
  height: 2rem;
  margin-right: 15px;
  color: #FCD535;
  cursor: pointer;
  tension: opacity 0.1s linear;
  :hover {
    opacity: 0.9;
  }
`;

const MobileHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  background-color: #181A20;
  width: 100%;
  height: 80px;
  padding: 0px 30px;
  
  @media (min-width: 992px) {
    display: none;
    padding: 0 32px;
  }
`;
const NavigationIcon = styled(Navicon)` 
  width: 45px;
  height: 45px;
  margin-top: 5px;
  color: #FCD535;
  cursor: pointer;
  transition: color 0.1s linear;
  :hover {
    opacity: 0.9;
  }
`;
const MobileBackground = styled.div`
  display: ${(props) => (props.displayBlock ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
 
  @media (min-width: 992px) {
    display: none;
  }
`;
const CloseIcon = styled(Close)`
  display: flex;
  width: 35px;
  height: 35px;
  margin-left: auto;
  margin-bottom: 30px;
  color: #F0B90B;
  cursor: pointer;
  transition: color 0.1s linear;
  :hover {
    opacity: 0.9;
  }
`;
const MobileNavContainer = styled.div`
  padding: 94px 48px;
  background-color: #181A20;
  width: 300px;
  height: 100vh;
`;

function Header() {
  const [openNav, setOpenNav] = useState(false);

  return (
    <>
      <Container>
        <Link to="/home">
          <Logo>iStock</Logo>
        </Link>
        <LeftContainer>
          <NavItem mr>當日行情</NavItem>
          <NavItem mr>個股</NavItem>
          <Link to="/track">
            <NavItem mr>走勢圖</NavItem>
          </Link>
          <NavItem mr>券商位置</NavItem>
          <NavItem>討論區</NavItem>
        </LeftContainer>
        <RightContainer>
          <PersonContainer>
            <PersonIcon />
          </PersonContainer>
          <Button md>登出</Button>
        </RightContainer>
      </Container>
      <MobileHead>
        <Link to="/home">
          <Logo>iStock</Logo>
        </Link>
        <NavigationIcon onClick={() => { setOpenNav(true); }} />
      </MobileHead>
      {openNav && (
        <MobileBackground displayBlock>
          <MobileNavContainer displayBlock>
            <CloseIcon onClick={() => { setOpenNav(false); }} />
            <Button sm w100 mb1>登出</Button>
            <NavItem px1 fzBig>當日行情</NavItem>
            <NavItem px1 fzBig>個股</NavItem>
            <Link to="/track">
              <NavItem px1 fzBig>走勢圖</NavItem>
            </Link>
            <NavItem px1 fzBig>券商位置</NavItem>
            <NavItem px1 fzBig>討論區</NavItem>
          </MobileNavContainer>
        </MobileBackground>
      )}
    </>
  );
}

export default Header;

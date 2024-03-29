import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Navicon } from '@styled-icons/evil';
import { Close } from '@styled-icons/material';
import { AlertOn, AlertOff } from '@styled-icons/fluentui-system-regular';
import { getUserUnReadResponses, updateRead } from '../../utils/firebase';

const Container = styled.div`
  position: fixed;
  display: none;
  align-items: center;
  width: 100%;
  height: 70px;
  padding: 0 30px;
  background-color: #181A20;
  z-index: 100;
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
const Div = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;
const Logo = styled.div`
  padding-bottom: ${(props) => (props.mb ? '50px' : '0')};
  color: #F0B90B;
  font-size: 36px;
  font-weight: bold;
  cursor: pointer;
  @media (min-width: 992px) {
    margin-right: 30px;
  }
`;
const NavItem = styled.div`
  margin-right: ${(props) => (props.mr ? '20px' : '0')};
  padding: ${(props) => (props.px1 ? '15px 0' : '0')};
  font-size: ${(props) => (props.fzBig ? '20px' : '18px')};
  color: ${(props) => (props.active ? '#FCD535' : '#EAECEF')};
  font-weight: 500;
  cursor: pointer;
  transition: color 0.1s linear;
  :hover {
    color: #FCD535;
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
const MobileHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  background-color: #181A20;
  width: 100%;
  height: 70px;
  padding: 0px 30px;
  z-index: 100;
  @media (min-width: 992px) {
    display: none;
    padding: 0 32px;
  }
`;
const NavigationIcon = styled(Navicon)` 
  width: 45px;
  height: 45px;
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
const ProfileIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #181A20;
  background-color: #FCD535;
  text-align: center;
  line-height: 32px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.1s linear;
  :hover {
    opacity: 0.9;
  }
`;
const ProfileImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;
const AlertOnIcon = styled(AlertOn)`
  width: 25px;
  height: 25px;
  margin: 5px;
  color: #FCD535;
  cursor: pointer;
  @media(min-width: 992px){
    margin: 5px 25px;
  }
`;
const AlertOffIcon = styled(AlertOff)`
  width: 25px;
  height: 25px;
  margin: 5px;
  color: #848E9C;
  @media(min-width: 992px){
    margin: 5px 25px;
  }
`;
const DropDown = styled.div`
  display: ${(props) => (props.open ? 'block' : 'none')};
  position: absolute;
  top: 95%;
  width: 100px;
  right: 0;
  font-size: 14px;
  text-align: center;
  background-color: #2D3137;
  border-radius: 3px;
`;
const Item = styled.div`
  padding: 10px 0;
  color: #fff;
  :hover {
    color: #FCD535;
  }
`;

function Header() {
  const [img, setImg] = useState(null);
  const [path, setPath] = useState('');
  const [open, setOpen] = useState(false);
  const [unReadData, setUnReadData] = useState(null);
  const [openNav, setOpenNav] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const ifo = useLocation();

  const fetchUnRead = async (email) => {
    const unReadList = await getUserUnReadResponses(email);
    if (unReadList.length > 0) {
      setUnReadData(unReadList);
    }
  };

  const getUserInfo = () => {
    const data = window.localStorage.getItem('user');
    const { email, photoURL } = JSON.parse(data);
    if (photoURL) {
      setImg(photoURL);
    } else {
      const emailFirst = email.slice(0, 1).toUpperCase();
      setUserEmail(emailFirst);
    }
    fetchUnRead(email);
  };

  const verifyLocation = () => {
    if (ifo.pathname) {
      setPath(ifo.pathname);
    }
  };

  const renderUnReadList = () => {
    const output = unReadData.map((item) => (
      <Link to={`/post/response/${item.uuid}`} key={`unRead-${item.uuid}`}>
        <Item onClick={() => { updateRead(item.uuid); }}>{`${item.postTitle}...`}</Item>
      </Link>
    ));
    return output;
  };

  const renderBells = () => (
    <Div>
      <AlertOnIcon
        onMouseEnter={() => { setOpen(true); }}
        onClick={() => { setOpen(!open); }}
      />
      <DropDown open={open} onMouseLeave={() => { setOpen(false); }}>
        {unReadData && renderUnReadList()}
      </DropDown>
    </Div>
  );

  useEffect(() => {
    getUserInfo();
    verifyLocation();
  }, []);

  return (
    <>
      <Container>
        <Link to="/home">
          <Logo>iStock</Logo>
        </Link>
        <LeftContainer>
          <Link to="/individual">
            <NavItem mr active={path === '/individual'}>個股資訊</NavItem>
          </Link>
          <Link to="/track">
            <NavItem mr active={path === '/track'}>走勢圖</NavItem>
          </Link>
          <Link to="/post">
            <NavItem mr active={path === '/post'}>討論區</NavItem>
          </Link>
          <Link to="/location">
            <NavItem active={path === '/location'}>券商位置</NavItem>
          </Link>
        </LeftContainer>
        <RightContainer>
          <PersonContainer>
            {unReadData
              ? renderBells()
              : <AlertOffIcon />}
            <Link to="/profile">
              {img
                ? <ProfileImg src={img} />
                : <ProfileIcon>{userEmail}</ProfileIcon>}
            </Link>
          </PersonContainer>
        </RightContainer>
      </Container>
      <MobileHead>
        <Link to="/home">
          <Logo>iStock</Logo>
        </Link>
        <Div>
          {!unReadData
            ? <AlertOffIcon />
            : renderBells()}
          <NavigationIcon onClick={() => { setOpenNav(true); }} />
        </Div>
      </MobileHead>
      {openNav && (
        <MobileBackground displayBlock>
          <MobileNavContainer displayBlock>
            <CloseIcon onClick={() => { setOpenNav(false); }} />
            <Link to="/profile">
              <NavItem px1 fzBig active={path === '/profile'}>我的收藏</NavItem>
            </Link>
            <Link to="/individual">
              <NavItem px1 fzBig active={path === '/individual'}>個股資訊</NavItem>
            </Link>
            <Link to="/track">
              <NavItem px1 fzBig active={path === '/track'}>走勢圖</NavItem>
            </Link>
            <Link to="/post">
              <NavItem px1 fzBig active={path === '/post'}>討論區</NavItem>
            </Link>
            <Link to="/location">
              <NavItem px1 fzBig active={path === '/location'}>券商位置</NavItem>
            </Link>
          </MobileNavContainer>
        </MobileBackground>
      )}
    </>
  );
}

export default Header;

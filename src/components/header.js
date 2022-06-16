import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Person } from '@styled-icons/ionicons-solid';

const Container = styled.div`
  display: none;
  align-items: center;
  width: 100%;
  padding: 14px 30px;
  background-color: #424242;
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
  margin-right: 30px;
  color: #FFD366;
  font-size: 32px;
  cursor: pointer;
`;
const NavItem = styled.div`
  margin-right: ${(props) => (props.marginRight ? props.marginRight : '20px')};

  color: #FFD366;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.2s linear;
  :hover {
    color: #F5F5F5;
  }
`;
const PersonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 125px;
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
  color: #FFD366;
`;

function Header() {
  return (
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
          <NavItem>我的追蹤</NavItem>
        </PersonContainer>
        <NavItem>登出</NavItem>
      </RightContainer>
    </Container>
  );
}

export default Header;

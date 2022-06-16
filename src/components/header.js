import styled from 'styled-components';
import { Person } from '@styled-icons/ionicons-solid';

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 30px;
  background-color: #424242;
  border-bottom: 1px solid #F5F5F5;
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
  color: #FFD366;
  font-size: 32px;
`;
const NavItem = styled.div`

  color: #FFD366;
  font-size: 18px;
`;
const PersonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
`;
const PersonIcon = styled(Person)`
  width: 2rem;
  height: 2rem;
  color: #FF1593;
  cursor: pointer;
  :hover {
    background-color: #FAEBD7;
    border-radius: 50%;
  }
`;

function Header() {
  return (
    <Container>
      <Logo>iStock</Logo>
      <LeftContainer>
        <NavItem>當日行情</NavItem>
        <NavItem>個股</NavItem>
        <NavItem>走勢圖</NavItem>
        <NavItem>券商位置</NavItem>
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

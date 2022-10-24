import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: #0B0E11;
`;
const MainContainer = styled.div`
`;
const Title = styled.div`
  margin-bottom: 20px;
  font-size: 44px;
  font-weight: bold;
  color: #EAECEF;
  @media (min-width: 576px) {
    font-size: 72px;
  }
`;
const SubTitle = styled.div`
  text-align: center;
  font-size: 36px;
  font-weight: bold;
  color: #F5C829;
  cursor: pointer;
  opacity: 0.9;
  transition: all 0.1s linear;
  :hover {
    opacity: 0.9;
  }
`;

function NotFound() {
  return (
    // <Navigate to="/login" /> // 可以直接導回首頁
    <Container>
      <MainContainer>
        <Title>404 Error Page</Title>
        <Link to="/home">
          <SubTitle>回到首頁</SubTitle>
        </Link>
      </MainContainer>
    </Container>
  );
}

export default NotFound;

// import { useEffect } from 'react';
import styled from 'styled-components';
// import api from '../utils/api';

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  position: relative;
  @media (min-width: 992px) {
    display: flex;
    justify-content: center;
    align-items: space-between;
    width: 992px;
  }
  @media (min-width: 1280px) {
    display: flex;
    justify-content: center;
    align-items: space-between;
    width: 1280px;
  }
`;

function Login() {
  // useEffect(() => {
  // }, []);

  return (
    <Container />
  );
}

export default Login;

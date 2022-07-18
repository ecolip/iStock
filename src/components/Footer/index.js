import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
  margin-top: auto;
  font-size: 14px;
  background-color: #181A20;
  color: #848E9C;
`;

function Footer() {
  return (
    <Container>
      iStock © 版權所有
    </Container>
  );
}

export default Footer;

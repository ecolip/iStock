import styled from 'styled-components';

const Container = styled.div`
  margin-top: auto;
  padding: 30px 0;
  font-size: 14px;
  // border-top: 1px solid #272A2E;
  background-color: #181A20;
  color: #848E9C;
  text-align: center;
`;

function Footer() {
  return (
    <Container>
      版權所有 © 2022 ~ 2024 iStock 資訊股份有限公司
    </Container>
  );
}

export default Footer;

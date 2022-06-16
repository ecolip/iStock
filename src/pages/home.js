import { useEffect } from 'react';
import styled from 'styled-components';
// import api from '../utils/api';

// const data = [
//   {
//     Trading_Volume: 18437079,
//     Trading_money: 2280313744,
//     Trading_turnover: 32400,
//     close: 123.55,
//     date: '2022-06-13',
//     max: 124.25,
//     min: 123.45,
//     open: 124.1,
//     spread: -3.55,
//     stock_id: '0050',
//   },
//   {
//     Trading_Volume: 32096,
//     Trading_money: 1802337,
//     Trading_turnover: 244,
//     close: 56.2,
//     date: '2022-06-13',
//     max: 56.3,
//     min: 55.85,
//     open: 56.3,
//     spread: -1.1,
//     stock_id: '0051',
//   },
// ];

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

function Home() {
  const getDayPrice = () => {
    // api.getDayPrice().then((res)=>{
    //   console.log(res);
    // });
  };
  useEffect(() => {
    getDayPrice();
  }, []);

  return (
    <Container />
  );
}

export default Home;

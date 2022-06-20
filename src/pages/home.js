import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import api from '../utils/api';
import bannerImg from '../imgs/banner1.jpg';
import { today, preDay } from '../utils/formatDate';

// demo
// import { useEffect } from 'react';
// import styled from 'styled-components';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import Button from '../components/Button';
// import bannerImg from '../imgs/banner1.jpg';
// import { dataHome2 } from '../utils/defaultData';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;
const Banner = styled.div`
  width: 100%;
  background-color: #0B0E11;
  padding: 50px 20px;

  @media (min-width: 1200px){
    padding: 100px 20px;
  }
`;
const BannerContainer = styled.div`
  padding: 50px 20px;

  @media (min-width: 992px){
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row-reverse;
    padding: 20px 0;
  }
  @media (min-width: 1200px) {
    width: 1200px;
    margin: 0 auto;
  }
`;
const LeftContainer = styled.div`
  width: 100%;

  @media (min-width: 992px){
    width: 45%;
  }
`;
const Title = styled.div`
  padding: 50px 0 30px;
  font-size: 32px;
  color: white;

  @media (min-width: 992px){
    padding: 0 0 30px 0;
  }
`;
const Img = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  @media (min-width: 992px){
    width: 45%;
  }
`;
const ListsDiv = styled.div`
  width: 100%;
  background-color: #0B0E11;
  padding: 50px 0;
`;
const ListsContainer = styled.div`
  padding: 0 30px;

  @media (min-width: 1200px) {
    width: 1200px;
    margin: 0 auto;
  }
`;
const ListContainer = styled.div`
  @media (min-width: 576px){
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    gap: 30px calc((100% - 48%*2));
  }
  @media (min-width: 768px){
    gap: 30px calc((100% - 30%*3)/2);
  }
  @media (min-width: 1200px){
    gap: 30px calc((100% - 18%*5) / 4);
  }
`;
const ListTitle = styled.div`
  text-align: center;
  padding-bottom: 40px;
  font-size: 32px;
  color: #fff;

  @media (min-width: 576px){
    text-align: left;
  }
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 250px;
  margin-bottom: 30px;
  font-size: 28px;
  color: white;
  background-color: #181A20;
  box-shadow: 0 1px 3px rgb(0 0 0 / 20%);
  border-radius: 20px;
  cursor: pointer;
  transition: color 0.1s linear;
  :hover {
    background-color: #2B313A;
  }

  @media (min-width: 576px){
    width: 48%;
  }
  @media (min-width: 768px){
    width: 30%;
  }
  @media (min-width: 1200px){
    width: 18%;
  }
`;
const StockName = styled.div`
  padding-bottom: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #EAECEF;
`;
const StockClose = styled.div`
  padding-bottom: 10px;
  font-size: 28px;
  font-weight: bold;
  color: white;
  padding-bottom: 20px;
`;
const StockSpread = styled.div`
  color: ${(props) => (props.green ? '#0ECB81' : '#F6465D')};

  font-weight: bold;
  font-size: 26px;
`;
const StockText = styled.div`
  color: #EAECEF;
  font-weight: 500;
  font-size: 18px;
`;

function Home() {
  const [stockLists, setStockLists] = useState(null);

  const fetchStockIdAndName = () => new Promise((resolve) => {
    const finToken = window.localStorage.getItem('finToken');
    const indexList = [];
    api.getStockList(finToken).then((res) => {
      res.data.forEach((item) => {
        if (item.industry_category === '大盤') {
          const newItem = {};
          newItem.stock_id = item.stock_id;
          newItem.stock_name = item.stock_name;
          indexList.push(newItem);
        }
      });
      res.data.forEach((item) => {
        if (item.industry_category === 'Index') {
          const newItem = {};
          newItem.stock_id = item.stock_id;
          newItem.stock_name = item.stock_name;
          indexList.push(newItem);
        }
      });
      resolve(indexList);
    });
  });

  const fetchPrice = (item, day) => new Promise((resolve) => {
    const finToken = window.localStorage.getItem('finToken');
    api.getTodayPrice(finToken, item.stock_id, day).then((res) => {
      // console.log(res.data);
      if (res.data.length > 0) {
        // console.log('有資料日期:', day);
        const newItem = {
          ...item, close: res.data[0].close, spread: res.data[0].spread, date: day,
        };
        // console.log(newItem);
        // console.log('成功有資料');
        resolve(newItem);
      }
      fetchPrice(item, preDay(day));
    });
  });

  const fetchStockLists = () => {
    fetchStockIdAndName().then((indexList) => {
      const newItems = [];
      indexList.forEach((item) => {
        // 暫時給預設日期'2022-06-17', 要改回today()
        fetchPrice(item, today()).then((newItem) => {
          // console.log(newItem);
          newItems.push(newItem);
        });
      });
      // console.log(newItems);
      setStockLists(newItems);
    });
  };

  const verifySpread = (spread) => {
    if (spread < 0) {
      return true;
    }
    return false;
  };

  const renderList = () => {
    const output = stockLists.map((item) => (
      <List key={`stock_id_${item.stock_id}`}>
        <StockName>{item.stock_name}</StockName>
        <StockText>今日收盤</StockText>
        <StockClose>{item.close}</StockClose>
        <StockText>漲跌幅</StockText>
        <StockSpread green={verifySpread(item.spread)}>{item.spread}</StockSpread>
      </List>
    ));
    return output;
  };

  useEffect(() => {
    fetchStockLists();
  }, []);

  return (
    <Container>
      <Header />
      <Banner>
        <BannerContainer>
          <Img src={bannerImg} alt="banner-image" />
          <LeftContainer>
            <Title>Taiwan Stock Market Timing, Track and manage you interested stocks</Title>
            <Button>我的收藏</Button>
          </LeftContainer>
        </BannerContainer>
      </Banner>
      <ListsDiv>
        <ListsContainer>
          <ListTitle>台股大盤與類股表現</ListTitle>
          <ListContainer>
            {stockLists && renderList()}
            {/* {renderList()} */}
          </ListContainer>
        </ListsContainer>
      </ListsDiv>
      <Footer />
    </Container>
  );
}

export default Home;

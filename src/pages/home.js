import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AppContext from '../AppContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ScrollTop from '../components/ScrollTop';
import bannerImg from '../imgs/banner1.jpg';
import { getNewCategoryPrice } from '../utils/firebase';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #0B0E11;
`;
const Div = styled.div`
  display: flex;
`;
const Banner = styled.div`
  width: 100%;
  padding: 100px 30px 10px;
  @media (min-width: 1200px){
    padding: 160px 0 100px;
  }
`;
const BannerContainer = styled.div`
  padding: 50px 0;
  @media (min-width: 992px){
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row-reverse;
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
    padding: 0;
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
  padding-bottom: 2px;
  border-bottom: 2px solid #F5C829;
  margin-bottom: 30px;
  font-size: 22px;
  color: #EAECEF;
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
  border-radius: 20px;
  cursor: pointer;
  transition: color 0.1s linear;
  :hover {
    box-shadow: 2px 5px 5px rgb(255 255 255 / 50%);
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
  color: #EAECEF;
`;
const StockClose = styled.div`
  color: ${(props) => (props.green ? '#0ECB81' : '#F6465D')};
  padding-bottom: 10px;
  font-size: 28px;
  font-weight: bold;
  padding-bottom: 20px;
`;
const StockSpread = styled.div`
  color: ${(props) => (props.green ? '#0ECB81' : '#F6465D')};
  font-weight: bold;
  font-size: 26px;
`;
const StockText = styled.div`
  color: #848E9C;
  font-weight: 500;
  font-size: 20px;
`;
const ButtonContainer = styled.div`
  display: inline-block;
`;

function Home() {
  const [stockLists, setStockLists] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [state, dispatch] = useContext(AppContext);
  const navigate = useNavigate();

  const verifySpread = (spread) => {
    if (spread < 0) {
      return true;
    }
    return false;
  };

  const redirectToCategory = (stockId) => {
    dispatch({ category: stockId });
    navigate('/category', { replace: true });
  };

  const renderList = () => {
    const output = stockLists.map((item) => (
      <List
        key={`stock_id_${item.stock_id}`}
        onClick={() => { redirectToCategory(item.stock_id); }}
      >
        <StockName>{item.stock_name}</StockName>
        <StockText>今日收盤</StockText>
        <StockClose green={verifySpread(item.spread)}>{item.close}</StockClose>
        <StockText>漲跌</StockText>
        <StockSpread green={verifySpread(item.spread)}>{item.spread}</StockSpread>
      </List>
    ));
    return output;
  };

  useEffect(() => {
    getNewCategoryPrice().then((lists) => {
      setStockLists(lists);
      setIsLoaded(false);
    });
  }, []);

  return (
    <Container>
      <Header />
      <Banner>
        <BannerContainer>
          <Img src={bannerImg} alt="banner-image" />
          <LeftContainer>
            <Title>Taiwan Stock Market Timing, Track and manage you interested stocks</Title>
            <Link to="/profile">
              <ButtonContainer><Button>我的追蹤</Button></ButtonContainer>
            </Link>
          </LeftContainer>
        </BannerContainer>
      </Banner>
      <ListsDiv>
        <ListsContainer>
          <Div>
            <ListTitle>類股收盤 / 漲跌</ListTitle>
          </Div>
          {isLoaded
            ? <Loading />
            : (
              <ListContainer>
                {stockLists && renderList()}
              </ListContainer>
            )}
        </ListsContainer>
      </ListsDiv>
      <ScrollTop />
      <Footer />
    </Container>
  );
}

export default Home;

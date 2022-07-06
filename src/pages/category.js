/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Star } from '@styled-icons/boxicons-regular';
import { Star as filledStar } from '@styled-icons/boxicons-solid';
import { ArrowSortedUp, ArrowSortedDown } from '@styled-icons/typicons';
import AppContext from '../AppContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import ScrollTop from '../components/ScrollTop';
import { handelColor } from '../utils/formatDate';
import { transferRedirectKey } from '../utils/table';
import {
  getTrack, addTrackStock, removeTrackStock, getOpenDate,
} from '../utils/firebase';
import api from '../utils/api';

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
const TitleText = styled.div`
  padding-bottom: 2px;
  border-bottom: 2px solid #F5C829;
  margin-bottom: 30px;
  font-size: 22px;
  color: #EAECEF;
  @media (min-width: 992px) {
    padding-left: 0;
    text-align: left;
  }
`;
const TableContainer = styled.div`
  min-height: 55vh;
  padding: 0 30px;
  @media (min-width: 1260px) {
    margin: 0 -15px;
    padding: 0;
  }
`;
const MainContainer = styled.div`
  position: relative;
  padding: 120px 0 30px;
  @media (min-width: 1260px) {
    width: 1260px;
    margin: 0 auto;
    padding: 120px 30px 30px;
  }
`;
const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  font-size: 14px;
  color: #848E9C;
`;
const Title = styled.div`
  display: ${(props) => (props.df ? 'flex' : 'block')};
  justify-content: ${(props) => (props.jce ? 'end' : 'start')};
  margin-left: ${(props) => (props.ml70 ? '-70px' : '0')};
  width: 100px;
`;
const ItemContainer = styled.div`
`;
const Items = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-radius: 3px;
  :hover {
    background-color: #2B3139;
  }
`;
const Item = styled.div`
  color: ${(props) => handelColor(props)};
  display: ${(props) => (props.df ? 'flex' : 'flex')};
  justify-content: ${(props) => (props.jce ? 'end' : 'start')};
  margin-left: ${(props) => (props.ml70 ? '-70px' : '0')};
  width: 100px;
  font-size: 17px;
`;
const FilledStarIcon = styled(filledStar)`
  width: 20px;
  height: 20px;
  padding: 1px;
  color: #F5C829;
  cursor: pointer;
  :hover {
    opacity: 0.6;
  }
  @media (min-width: 576px) {
    width: 25px;
    height: 25px;
  }
`;
const StarIcon = styled(Star)`
  width: 20px;
  height: 20px;
  padding: 1px;
  color: #F5C829;
  cursor: pointer;
  :hover {
    opacity: 0.6;
  }
  @media (min-width: 576px) {
    width: 25px;
    height: 25px;
  }
`;
const ArrowUp = styled(ArrowSortedUp)`
  width: 23px;
  height: 23px;
  color: #F5C829;
  cursor: pointer;
    @media (min-width: 576px) {
    width: 28px;
    height: 28px;
  }
`;
const ArrowDown = styled(ArrowSortedDown)`
  width: 18px;
  height: 18px;
  color: #F5C829;
  cursor: pointer;
  @media (min-width: 576px) {
    width: 20px;
    height: 20px;
  }
`;
const LoadContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
`;

function Category() {
  const [title, setTitle] = useState('');
  const [lists, setLists] = useState([]);
  const [isCloseUp, setIsCloseUp] = useState(false);
  const [isSpreadUp, setIsSpreadUp] = useState(false);
  const [state, dispatch] = useContext(AppContext);

  const verifySpread = (spread) => {
    if (spread < 0) {
      return true;
    }
    return false;
  };

  const updateLists = (id) => {
    const output = lists.map((item) => {
      if (item.stock_id === id) {
        const newItem = {
          ...item,
          star: !item.star,
        };
        return newItem;
      }
      return item;
    });
    setLists(output);
  };

  const removeDBTrack = (id) => {
    updateLists(id);
    removeTrackStock(id);
  };

  const addDBTrack = (id) => {
    updateLists(id);
    addTrackStock(id);
  };

  const sortSpread = (method) => {
    if (method === 'down') {
      setIsSpreadUp(false);
      lists.sort((a, b) => b.spread - a.spread);
    } else {
      setIsSpreadUp(true);
      lists.sort((a, b) => a.spread - b.spread);
    }
  };

  const sortClose = (method) => {
    if (method === 'down') {
      setIsCloseUp(false);
      lists.sort((a, b) => b.close - a.close);
    } else {
      setIsCloseUp(true);
      lists.sort((a, b) => a.close - b.close);
    }
  };

  const fetchCategoryStocks = async () => {
    const token = window.localStorage.getItem('finToken');
    const category = transferRedirectKey(state.category);
    const res = await api.getStockList(token);
    const { data } = res;
    const stockList = data.filter((item) => item.industry_category === category);
    return stockList;
  };

  const initTitle = () => {
    const category = transferRedirectKey(state.category);
    setTitle(category);
  };

  const fetchCategoryPrice = async (tracks) => {
    const stockPrices = [];
    const token = window.localStorage.getItem('finToken');
    const openDate = await getOpenDate();
    const stockList = await fetchCategoryStocks();
    await Promise.all(stockList.map(async (item) => {
      const res = await api.getTodayPrice(token, item.stock_id, openDate);
      const stockItem = res.data[0];
      if (stockItem) {
        const newItem = {
          ...stockItem,
          stock_name: item.stock_name,
          industry_category: item.industry_category,
          star: tracks.includes(item.stock_id),
        };
        stockPrices.push(newItem);
      }
    }));
    stockPrices.sort((a, b) => b.close - a.close);
    setLists(stockPrices);
  };

  const renderList = () => {
    const output = lists.map((item) => (
      <Items key={item.stock_id}>
        <Item>{item.stock_id}</Item>
        <Item>{item.stock_name}</Item>
        <Item>${item.close}</Item>
        <Item
          green={verifySpread(item.spread)}
          red={!verifySpread(item.spread)}
        >
          {item.spread === 0 ? '-' : item.spread}
        </Item>
        <Item df jce ml70>
          {item.star
            ? <FilledStarIcon onClick={() => { removeDBTrack(item.stock_id); }} />
            : <StarIcon onClick={() => { addDBTrack(item.stock_id); }} />}
        </Item>
      </Items>
    ));
    return output;
  };

  useEffect(() => {
    initTitle();
    getTrack('track').then((tracks) => {
      fetchCategoryPrice(tracks);
    });
  }, []);

  return (
    <Container>
      <Header />
      <MainContainer>
        <Div>
          <TitleText>{title} 最新收盤行情</TitleText>
        </Div>
        <TableContainer>
          <TitleContainer>
            <Title>代號</Title>
            <Title>名稱</Title>
            <Title>
              價格
              {isCloseUp
                ? <ArrowUp onClick={() => { sortClose('down'); }} />
                : <ArrowDown onClick={() => { sortClose('up'); }} />}
            </Title>
            <Title>
              漲跌
              {isSpreadUp
                ? <ArrowUp onClick={() => { sortSpread('down'); }} />
                : <ArrowDown onClick={() => { sortSpread('up'); }} />}
            </Title>
            <Title df jce ml70>追蹤</Title>
          </TitleContainer>
          <ItemContainer>
            {lists.length > 0 ? renderList() : <LoadContainer><Loading /></LoadContainer>}
          </ItemContainer>
        </TableContainer>
      </MainContainer>
      <ScrollTop />
      <Footer />
    </Container>
  );
}

export default Category;

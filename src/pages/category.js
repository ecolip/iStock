/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { ArrowSortedUp, ArrowSortedDown } from '@styled-icons/typicons';
import { Star } from '@styled-icons/boxicons-regular';
import { Star as filledStar } from '@styled-icons/boxicons-solid';
import AppContext from '../AppContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import api from '../utils/api';
import { transferRedirectKey } from '../utils/table';
import { getTrackStock, addTrackStock, removeTrackStock } from '../utils/firebase';

const handelColor = (props) => {
  if (props.green) {
    return '#0ECB81';
  }
  if (props.red) {
    return '#F6465D';
  }
  return '#EAECEF';
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding-top: 50px;
  background-color: #0B0E11;
`;
const ContextDiv = styled.div`
  width: 100%;
  height: 100%;
  background-color: #0B0E11;
`;
const ContextContainer = styled.div`
  padding: 80px 30px 30px;
  @media (min-width: 1200px) {
    width: 1200px;
    margin: 0 auto;
  }
`;
const TitleGroup = styled.div`
  padding: 30px 0;
  @media (min-width: 992px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40px 0;
  }
`;
const Title = styled.div`
  padding-bottom: 10px;
  text-align: center;
  font-size: 32px;
  color: white;
  @media (min-width: 992px) {
    padding-bottom: 0;
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
  width: 23px;
  height: 23px;
  color: #F5C829;
  cursor: pointer;
  @media (min-width: 576px) {
    width: 28px;
    height: 28px;
  }
`;
const ListsContainer = styled.div`
  min-height: 55vh;
  padding: 10px 20px;
  background-color: #181A20;
  border-radius: 8px;
  @media (min-width: 576px) {
    padding: 20px 50px;
  }
`;
const Table = styled.table`
  margin-bottom: ${(props) => (props.mb100 ? '100px' : '0')};
  width: 100%;
`;
const TrTitle = styled.tr`
  height: 55px;
`;
const Tr = styled.tr`
  height: 65px;
  border-bottom: 1px solid #474D57;
  :hover{
    background-color: #0B0E11;
  }
`;
const Thead = styled.thead`
`;
const Tbody = styled.tbody`
`;
const Th = styled.th`
  padding-top: ${(props) => (props.pt10 ? '5px' : '0')};
  color: white;
  font-size: 15px;
  @media (min-width: 576px) {
    font-size: 18px;
  }
`;
const Td = styled.td`
  color: ${(props) => handelColor(props)};
  font-size: 15px;
  font-weight: bold;
  @media (min-width: 576px) {
    font-size: 18px;
  }
`;
const StarIcon = styled(Star)`
  width: 25px;
  height: 25px;
  padding: 1px;
  color: #F5C829;
  cursor: pointer;
  :hover {
    opacity: 0.6;
  }
  @media (min-width: 576px) {
    width: 28px;
    height: 28px;
  }
`;
const FilledStarIcon = styled(filledStar)`
  width: 25px;
  height: 25px;
  padding: 1px;
  color: #F5C829;
  cursor: pointer;
  :hover {
    opacity: 0.6;
  }
  @media (min-width: 576px) {
    width: 28px;
    height: 28px;
  }
`;

function Category() {
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

  const fetchCategoryStocks = async () => {
    const category = transferRedirectKey(state.category);
    const token = window.localStorage.getItem('finToken');
    const res = await api.getStockList(token);
    const { data } = res;
    const stockList = data.filter((item) => item.industry_category === category);
    return stockList;
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

  const fetchCategoryPrice = async (tracks) => {
    const stockPrices = [];
    const token = window.localStorage.getItem('finToken');
    const stockList = await fetchCategoryStocks();
    await Promise.all(stockList.map(async (item) => {
      const res = await api.getTodayPrice(token, item.stock_id, state.openDate);
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

  const renderList = () => {
    const output = lists.map((item) => (
      <Tr key={item.stock_id}>
        <Td>{item.stock_id}</Td>
        <Td>{item.stock_name}</Td>
        <Td
          green={verifySpread(item.spread)}
          red={!verifySpread(item.spread)}
        >
          {item.close}
        </Td>
        <Td
          green={verifySpread(item.spread)}
          red={!verifySpread(item.spread)}
        >
          {item.spread === 0 ? '-' : item.spread}
        </Td>
        <Td>
          {item.star
            ? <FilledStarIcon onClick={() => { removeDBTrack(item.stock_id); }} />
            : <StarIcon onClick={() => { addDBTrack(item.stock_id); }} />}
        </Td>
      </Tr>
    ));
    return output;
  };

  useEffect(() => {
    getTrackStock().then((tracks) => {
      fetchCategoryPrice(tracks);
    });
  }, []);

  return (
    <Container>
      <Header />
      <ContextDiv>
        <ContextContainer>
          <TitleGroup>
            <Title>最新收盤行情</Title>
          </TitleGroup>
          <ListsContainer>
            <Table mb100={lists.length < 1}>
              <Thead>
                <TrTitle>
                  <Th>代號</Th>
                  <Th>名稱</Th>
                  <Th pt10>價格
                    {isCloseUp
                      ? <ArrowUp onClick={() => { sortClose('down'); }} />
                      : <ArrowDown onClick={() => { sortClose('up'); }} />}
                  </Th>
                  <Th pt10>漲跌
                    {isSpreadUp
                      ? <ArrowUp onClick={() => { sortSpread('down'); }} />
                      : <ArrowDown onClick={() => { sortSpread('up'); }} />}
                  </Th>
                  <Th pt10>追蹤</Th>
                </TrTitle>
              </Thead>
              <Tbody>
                {lists.length > 0 && renderList()}
              </Tbody>
            </Table>
            {lists.length < 1 && <Loading />}
          </ListsContainer>
        </ContextContainer>
      </ContextDiv>
      <Footer />
    </Container>
  );
}

export default Category;

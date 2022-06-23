/* eslint-disable consistent-return */
import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { SearchOutline } from '@styled-icons/evaicons-outline';
import { ArrowSortedUp, ArrowSortedDown } from '@styled-icons/typicons';
import { Star } from '@styled-icons/boxicons-regular';
import AppContext from '../AppContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import api from '../utils/api';
import { transferRedirectKey } from '../utils/table';

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
  background-color: #0B0E11;
`;
const ContextDiv = styled.div`
  width: 100%;
  height: 100%;
  background-color: #0B0E11;
`;
const ContextContainer = styled.div`
  
  @media (min-width: 1200px) {
    width: 1200px;
    margin: 0 auto;
  }
`;
const TitleGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px 0;
`;
const Title = styled.div`
  font-size: 32px;
  color: white;
`;
const SearchGroup = styled.div`
  border: ${(props) => (props.focus ? '1px solid #F0B90B' : '1px solid #848E9C')};

  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 300px;
  padding: 0 13px;
  border-radius: 5px;
`;
const Input = styled.input`
  width: 70%;
  height: 40px;
  border: none;
  border-radius: 5px;
  outline: none;
  font-size: 20px;
  color: white;
  background: transparent;
  ::placeholder {
    color: white;
  }
  ::-webkit-input-placeholder {
    color: white;
  }
  :-ms-input-placeholder {
    color: white;
  }
  ::-moz-placeholder {
    color: white;
    opacity: 1;
  }
`;
const SearchIcon = styled(SearchOutline)`
  width: 28px;
  height: 28px;
  padding: 2px;
  color: #F5C829;
  cursor: pointer;
  :hover {
    width: 30px;
    height: 30px;
  }
`;
const ArrowUp = styled(ArrowSortedUp)`
  width: 28px;
  height: 28px;
  color: #F5C829;
  cursor: pointer;
`;
const ArrowDown = styled(ArrowSortedDown)`
  width: 28px;
  height: 28px;
  color: #F5C829;
  cursor: pointer;
`;
const ListsContainer = styled.div`
  min-height: 55vh;
  padding: 20px 20px;
  background-color: #181A20;
  border-radius: 8px;
  @media (min-width: 360px) {
    padding: 20px 50px;
  }
`;
const Table = styled.table`
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
  color: white;
`;
const Td = styled.td`
  color: ${(props) => handelColor(props)};
  font-size: 15px;
  font-weight: bold;
  @media (min-width: 360px) {
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
  @media (min-width: 360px) {
    width: 28px;
    height: 28px;
  }
`;

function Category() {
  const [isFocus, setIsFocus] = useState(false);
  const [stockId, setStockId] = useState('');
  const [lists, setLists] = useState([]);
  const [isCloseUp, setIsCloseUp] = useState(false);
  const [isSpreadUp, setIsSpreadUp] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [state, dispatch] = useContext(AppContext);

  const verifySpread = (spread) => {
    if (spread < 0) {
      return true;
    }
    return false;
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
          {item.spread}
        </Td>
        <Td>
          <StarIcon />
        </Td>
      </Tr>
    ));
    return output;
  };

  const fetchCategoryStocks = async () => {
    const category = transferRedirectKey(state.category);
    const token = window.localStorage.getItem('finToken');
    const res = await api.getStockList(token);
    const { data } = res;
    const stockList = data.filter((item) => item.industry_category === category);
    return stockList;
  };

  const fetchCategoryPrice = async () => {
    const stockPrices = [];
    const token = window.localStorage.getItem('finToken');
    const stockList = await fetchCategoryStocks();
    await Promise.all(stockList.map(async (item) => {
      const res = await api.getTodayPrice(token, item.stock_id, state.openDate);
      const stockItem = res.data[0];
      if (item.stock_id) {
        const newItem = {
          ...stockItem,
          stock_name: item.stock_name,
          industry_category: item.industry_category,
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

  useEffect(() => {
    fetchCategoryPrice();
  }, []);

  return (
    <Container>
      <Header />
      <ContextDiv>
        <ContextContainer>
          <TitleGroup>
            <Title>當日收盤行情</Title>
            <SearchGroup focus={isFocus}>
              <Input
                type="text"
                value={stockId}
                placeholder="請輸入股票代號"
                onChange={(e) => { setStockId(e.target.value); }}
                onFocus={() => { setIsFocus(true); }}
                onBlur={() => { setIsFocus(false); }}
              />
              <SearchIcon />
            </SearchGroup>
          </TitleGroup>
          <ListsContainer>
            <Table>
              <Thead>
                <TrTitle>
                  <Th>代號</Th>
                  <Th>名稱</Th>
                  <Th>價格
                    {isCloseUp
                      ? <ArrowUp onClick={() => { sortClose('down'); }} />
                      : <ArrowDown onClick={() => { sortClose('up'); }} />}
                  </Th>
                  <Th>漲跌
                    {isSpreadUp
                      ? <ArrowUp onClick={() => { sortSpread('down'); }} />
                      : <ArrowDown onClick={() => { sortSpread('up'); }} />}
                  </Th>
                  <Th>追蹤</Th>
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

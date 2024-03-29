/* eslint-disable consistent-return */
import { useState, useEffect, useRef } from 'react';
import * as dayjs from 'dayjs';
import styled from 'styled-components';
import useEventListener from '@use-it/event-listener';
import { SearchOutline } from '@styled-icons/evaicons-outline';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Revenue from '../components/Revenue';
import Dividend from '../components/Dividend';
import Holding from '../components/Holding';
import Financial from '../components/Financial';
import ScrollTop from '../components/ScrollTop';
import { today, preYear } from '../utils/formatDate';
import { compareStockId2 } from '../utils/firebase';
import api from '../utils/api';

const Items = [
  '月營收表',
  '股利政策',
  '綜合損益',
  '外資持股',
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #0B0E11;
`;
const MainContainer = styled.div`
  width: 100%;
  padding: 120px 30px 100px;
  @media (min-width: 1200px) {
    width: 1200px;
    padding: 120px 30px 80px;
    margin: 0 auto;
  }
`;
const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;
const SearchGroup = styled.div`
  border: ${(props) => (props.focus ? '1px solid #F0B90B' : '1px solid #848E9C')};
  width: 190px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 13px;
  border-radius: 5px;
  @media (min-width: 576px) {
    width: 300px;
    margin-left: 20px;
  }
`;
const Input = styled.input`
  border: ${(props) => (props.border ? '1px solid #848E9C' : 'none')};
  width:80%;
  height: 40px;
  font-size: 16px;
  border-radius: 5px;
  outline: none;
  color: white;
  background: transparent;
  ::placeholder {
    color: #848E9C;
  }
  ::-webkit-input-placeholder {
    color: #848E9C;
  }
  :-ms-input-placeholder {
    color: #848E9C;
  }
  ::-moz-placeholder {
    color: #848E9C;
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
const Lists = styled.div`
  text-align: center;
  padding: 10px 0;
  margin: 0 -15px 30px;
  @media (min-width: 576px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;
const List = styled.div`
  color: ${(props) => (props.active ? '#EAECEF' : '#848E9C')};
  margin: 10px 0;
  padding: 0 0 5px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.1s linear;
  :hover {
    color: #EAECEF;
  }
  @media (min-width: 576px) {
    border-bottom: ${(props) => (props.active ? '2px solid #F0B90B' : '2px solid transparent')};
  }
  @media (min-width: 768px) {
    font-size: 22px;
  }
`;
const InfoTable = styled.div`
`;

function Individual() {
  const [list, setList] = useState(null);
  const [stockId, setStockId] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const stockIdRef = useRef('2330');

  const fetchHistoryFinancial = async () => {
    const revenue = await api.getHistoryFinancial(stockIdRef.current, today());
    if (revenue.data.length > 0) {
      const newData = [];
      revenue.data.forEach((item) => {
        if (item.type === 'TotalConsolidatedProfitForThePeriod') {
          newData.push(item);
        }
      });
      setList(newData);
    } else {
      alert('查無資料');
    }
  };

  const fetchHistoryHolding = async () => {
    const preWeek = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
    const revenue = await api.getHistoryHolding(stockIdRef.current, today(), preWeek);
    if (revenue.data.length > 0) {
      setList(revenue.data);
    } else {
      alert('查無資料');
    }
  };

  const fetchHistoryDividend = async () => {
    const revenue = await api.getHistoryDividend(stockIdRef.current, today());
    if (revenue.data.length > 0) {
      setList(revenue.data);
    } else {
      alert('查無資料');
    }
  };

  const fetchMonthRevenue = async () => {
    const revenue = await api.getMonthRevenue(stockIdRef.current, today(), preYear());
    if (revenue.data.length > 0) {
      setList(revenue.data);
      setStockId('');
    } else {
      alert('查無資料');
    }
  };

  const handleSearch = async () => {
    const name = await compareStockId2(stockId);
    if (name) {
      stockIdRef.current = stockId;
      switch (activeIndex) {
        case 0:
          fetchMonthRevenue(stockId);
          break;
        case 1:
          fetchHistoryDividend(stockId);
          break;
        case 2:
          fetchHistoryFinancial(stockId);
          break;
        default:
          fetchHistoryHolding(stockId);
          break;
      }
    } else {
      alert('請輸入正確股票代號');
    }
    setStockId('');
  };

  const handleSelect = async (index) => {
    const id = stockId !== '' ? stockId : '2330';
    setActiveIndex(index);
    switch (index) {
      case 0:
        fetchMonthRevenue(id);
        break;
      case 1:
        fetchHistoryDividend(id);
        break;
      case 2:
        fetchHistoryFinancial(id);
        break;
      default:
        fetchHistoryHolding(id);
        break;
    }
  };

  const renderLists = () => {
    const output = Items.map((item, index) => (
      <List
        key={item}
        active={index === activeIndex}
        onClick={() => { handleSelect(index); }}
      >
        {item}
      </List>
    ));
    return output;
  };

  const renderSelect = () => {
    switch (activeIndex) {
      case 0:
        return (<Revenue list={list} />);
      case 1:
        return (<Dividend list={list} />);
      case 2:
        return (<Financial list={list} />);
      default:
        return (<Holding list={list} />);
    }
  };

  const initList = () => {
    fetchMonthRevenue(stockIdRef.current);
  };

  useEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });

  useEffect(() => {
    initList();
  }, []);

  return (
    <Container>
      <Header />
      <MainContainer>
        <SearchContainer>
          <SearchGroup focus={isFocus}>
            <Input
              type="text"
              value={stockId}
              placeholder="請輸入股票代號"
              onChange={(e) => { setStockId(e.target.value); }}
              onFocus={() => { setIsFocus(true); }}
              onBlur={() => { setIsFocus(false); }}
            />
            <SearchIcon onClick={() => { handleSearch(); }} />
          </SearchGroup>
        </SearchContainer>
        <Lists>{renderLists()}</Lists>
        <InfoTable>
          {list && renderSelect()}
        </InfoTable>
      </MainContainer>
      <ScrollTop />
      <Footer />
    </Container>
  );
}

export default Individual;

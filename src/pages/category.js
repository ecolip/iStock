import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SearchOutline } from '@styled-icons/evaicons-outline';
import { Star } from '@styled-icons/boxicons-regular';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { dataDay } from '../utils/defaultData';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
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
  color: white;
  cursor: pointer;
  :hover {
    width: 30px;
    height: 30px;
  }
`;
const ListsContainer = styled.div`
`;
const Table = styled.table`
  width: 100%;
`;
const Tr = styled.tr`
`;
const Thead = styled.thead`
`;
const Tbody = styled.tbody`
`;
const Th = styled.th`
  color: #848E9C;
`;
const Td = styled.td`
  color: #EAECEF;
`;
const StarIcon = styled(Star)`
  width: 28px;
  height: 28px;
  padding: 2px;
  color: #4A4A4A;
  cursor: pointer;
  :hover {
    width: 30px;
    height: 30px;
  }
`;

function Day() {
  const [isFocus, setIsFocus] = useState(false);
  const [stockId, setStockId] = useState('');
  const [lists, setLists] = useState(null);

  const renderList = () => {
    const output = lists.map((item) => (
      <Tr key={item.stock_id}>
        <Td>{item.stock_id}</Td>
        <Td>{item.stock_name}</Td>
        <Td>{item.close}</Td>
        <Td>{item.spread}</Td>
        <Td>
          <StarIcon />
        </Td>
      </Tr>
    ));
    return output;
  };

  useEffect(() => {
    // 打get data api
    setLists(dataDay);
    console.log(1);
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
                <Tr>
                  <Th>代號</Th>
                  <Th>名稱</Th>
                  <Th>價格</Th>
                  <Th>漲跌</Th>
                  <Th>追蹤</Th>
                </Tr>
              </Thead>
              <Tbody>
                {lists && renderList()}
              </Tbody>
            </Table>
            {/* {lists && renderList()} */}
          </ListsContainer>
        </ContextContainer>
      </ContextDiv>
      <Footer />
    </Container>
  );
}

export default Day;

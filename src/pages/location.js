import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Map } from '@styled-icons/boxicons-solid';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import ScrollTop from '../components/ScrollTop';
import { getBanks, getCities, getBrokerages } from '../utils/firebase';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #0B0E11;
`;
const MainContainer = styled.div`
  width: 100%;
  padding: 120px 30px 30px;
  @media (min-width: 1200px) {
    width: 1200px;
    padding: 150px 30px 80px;
    margin: 0 auto;
  }
`;
const Title = styled.div`
  padding-bottom: 30px;
  font-size: 32px;
  color: #EAECEF;
`;
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  height: 90px;
  padding: 0 30px;
  margin-bottom: 30px;
  background-color: #181A20;
  border-radius: 8px;
`;
const SearchTitle = styled.div`
  padding-right: 20px;
  color: #EAECEF;
  font-size: 22px;
`;
const SearchGroup = styled.div`
  display: flex;
  align-items: center;
`;
const Select = styled.select`
  margin-right: ${(props) => (props.mr20 ? '20px' : '0')};

  width: 160px;
  height: 50px;
  font-size: 20px;
  color: #EAECEF;
  padding: 8px 10px 8px 8px;
  background-color: transparent;
  border: 1.5px solid #848E9C;
  cursor: pointer;
  outline: none;
  :hover {
    border-color: #F5C829;
  }
`;
const Option = styled.option`
`;
const ListMapGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ListContainer = styled.div`
  width: 100%;
  @media (min-width: 1200px) {
    width: 34%;
  }
`;
const List = styled.div`
  padding: 20px;
  margin-bottom: 20px;
  background-color: #181A20;
  border-radius: 8px;
  :hover {
    background-color: #2D3137;
    box-shadow: 2px 5px 5px rgb(255 255 255 / 50%);
  }
`;
const Name = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #EAECEF;
`;
const Address = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  font-size: 16px;
  color: #EAECEF;
`;
const Phone = styled.div`
  font-size: 16px;
  color: #EAECEF;
`;
const MapContainer = styled.div`
  width: 100%;
  @media (min-width: 1200px) {
    width: 64%;
  }
`;
const MapIconGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 58px;
  height: 22px;
  margin-left: 10px;
  color: #181A20;
  background-color: #F5C829;
  border-radius: 10px;
  opacity: 0.8;
  cursor: pointer;
  ${List}:hover & {
    opacity: 1;
    background-color: #F5C829;
  }
`;
const MapText = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #181A20;
`;
const MapIcon = styled(Map)`
  width: 16px;
  height: 16px;
`;
const Message = styled.div`
  padding: 30px 0;
  text-align: center;
  font-weight: 600;
  color: #848E9C;
  font-size: 18px;
  background-color: #181A20;
  border-radius: 8px;
`;

function Location() {
  const [banks, setBanks] = useState(null);
  const [cities, setCities] = useState(null);
  const [selectBank, setSelectBank] = useState('元大');
  const [selectCity, setSelectCity] = useState('台北市');
  const [list, setList] = useState([]);

  const fetchBrokerages = async () => {
    const res = await getBrokerages(selectBank, selectCity);
    setList(res);
  };

  const fetchCities = async () => {
    const res = await getCities();
    setCities(res);
  };

  const fetchBanks = async () => {
    const res = await getBanks();
    setBanks(res);
  };

  const handleSearch = () => {
    fetchBrokerages();
  };

  const renderList = () => {
    const output = list.map((item) => (
      <List key={`brokerages-list-${item.id}`}>
        <Name>{item.id} {item.name}</Name>
        <Address>
          {item.address}
          <MapIconGroup>
            <MapIcon />
            <MapText>MAP</MapText>
          </MapIconGroup>
        </Address>
        <Phone>{item.tel}</Phone>
      </List>
    ));
    return output;
  };

  const renderCity = () => {
    const output = cities.map((item) => (
      <Option key={`city-${item}`}>{item}</Option>
    ));
    return output;
  };

  const renderBank = () => {
    const output = banks.map((item) => (
      <Option key={`bank-${item}`}>{item}</Option>
    ));
    return output;
  };

  useEffect(() => {
    fetchBanks();
    fetchCities();
    fetchBrokerages();
  }, []);

  return (
    <Container>
      <Header />
      <MainContainer>
        <Title>券商據點</Title>
        <SearchContainer>
          <SearchTitle>尋找據點</SearchTitle>
          <SearchGroup>
            <Select mr20 onChange={(e) => { setSelectBank(e.target.value); }}>
              {banks && renderBank()}
            </Select>
            <Select mr20 onChange={(e) => { setSelectCity(e.target.value); }}>
              {cities && renderCity()}
            </Select>
            <Button onClick={() => { handleSearch(); }}>搜尋</Button>
          </SearchGroup>
        </SearchContainer>
        <ListMapGroup>
          <ListContainer>
            {list.length > 0 ? renderList() : <Message>無符合搜尋結果</Message>}
          </ListContainer>
          <MapContainer>map</MapContainer>
        </ListMapGroup>
      </MainContainer>
      <ScrollTop />
      <Footer />
    </Container>
  );
}

export default Location;

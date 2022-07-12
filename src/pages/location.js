/* eslint-disable no-nested-ternary */
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Map } from '@styled-icons/boxicons-solid';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ScrollTop from '../components/ScrollTop';
import GoogleMap from '../components/GoogleMap';
import arrowIcon from '../imgs/arrow.png';
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
  padding: 110px 0 100px;
  @media (min-width: 1200px) {
    width: 1200px;
    padding: 110px 30px 80px;
    margin: 0 auto;
  }
`;
const Div = styled.div`
  display: flex;
`;
const Title = styled.div`
  padding-bottom: 2px;
  border-bottom: 2px solid #F5C829;
  margin-bottom: 30px;
  font-size: 22px;
  color: #EAECEF;
`;
const SearchContainer = styled.div`
  padding: 0 0 0 10px;
  margin-bottom: 30px;
  border-radius: 8px;
  @media (min-width: 576px) {
    padding: 10px;
  }
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }
`;
const SearchTitle = styled.div`
  padding-right: 20px;
  color: #EAECEF;
  font-size: 20px;
`;
const SearchGroup = styled.div`
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }
  @media (min-width: 992px) {
    margin: 0;
  }
  @media (min-width: 1200px) {
    align-items: center;
  }
`;
const Select = styled.select`
  margin-right: ${(props) => (props.mr20 ? '20px' : '0')};
  width: 100%;
  height: 45px;
  margin: 10px 0;
  font-size: 16px;
  color: #EAECEF;
  padding: 5px 10px 5px 35px;
  background-color: transparent;
  border: 1.5px solid #848E9C;
  border-radius: 3px;
  cursor: pointer;
  outline: none;
  appearance:none;
  -moz-appearance:none;
  -webkit-appearance:none;;
  padding-right: 14px;
  :hover {
    border-color: #F5C829;
  }
  @media (min-width: 768px) {
    width: 227px;
    height: 40px;
    margin: 0 20px 0 0;
    padding: 5px 10px 5px 20px;
  }
`;
const Option = styled.option`
`;
const ListMapGroup = styled.div`
  @media (min-width: 1200px) {
    display: flex;
    justify-content: space-between;
  }
`;
const ListContainer = styled.div`
  width: 100%;
  margin-bottom: 50px;
  height: 600px;
  overflow: auto;
  @media (min-width: 1200px) {
    width: 25%;
    height: 700px;
    overflow: auto;
    margin-bottom: 0;
  }
`;
const List = styled.div`
  position: relative;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #181A20;
  border-radius: 3px;
  :hover {
    background-color: #2D3137;
  }
`;
const Name = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #EAECEF;
`;
const Address = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
  color: #EAECEF;
`;
const Phone = styled.div`
  font-size: 13px;
  color: #EAECEF;
`;
const MapContainer = styled.div`
  position: relative;
  width: 100%;
  @media (min-width: 1200px) {
    width: 73%;
  }
`;
const MapIconGroup = styled.div`
  position: absolute;
  right: 10px;
  bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1px 6px;
  margin-left: 10px;
  color: #181A20;
  background-color: #FFDA6A;
  border-radius: 10px;
  cursor: pointer;
  ${List}:hover & {
    color: #181A20;
    background-color: #F5C829;
  }
`;
const MapText = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #181A20;
`;
const MapIcon = styled(Map)`
  width: 14px;
  height: 14px;
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
const MapDescribe = styled.div`
  text-align: center;
  @media (min-width: 1200px) {
    display: none;
  }
`;
const Hr = styled.hr`
  width: 15%;
  margin: 0 auto;
  border-bottom: 1px solid #848E9C;
`;
const DescribeText = styled.div`
  margin: 30px 0 20px;
  color: #EAECEF;
  font-size: 22px;
  font-style: italic;
`;
const SelectDiv = styled.div`
  position: relative;
`;
const ArrowImg = styled.img`
  position: absolute;
  right: 40px;
  top: 24px;
  width: 20px;
  height: 20px;
  @media (min-width: 768px) {
    top: 12px;
  }
`;

function Location() {
  const [banks, setBanks] = useState(null);
  const [cities, setCities] = useState(null);
  const [selectBank, setSelectBank] = useState('元大');
  const [selectCity, setSelectCity] = useState('台北市');
  const [name, setName] = useState('元大-松江');
  const [address, setAddress] = useState('台北市中山區松江路139號3樓及3樓之1');
  const [list, setList] = useState([]);
  const [message, setMessage] = useState(false);
  const mapRef = useRef(null);

  const scrollToMap = () => {
    window.scrollTo({
      top: mapRef.current.offsetTop - 100,
      behavior: 'smooth',
    });
  };

  const handleInfo = (selectName, selectAddress) => {
    setName(selectName);
    setAddress(selectAddress);
    scrollToMap();
  };

  const fetchBrokerages = async () => {
    const res = await getBrokerages(selectBank, selectCity);
    if (!res.length > 0) {
      setMessage(true);
    } else {
      setMessage(false);
      setList(res);
    }
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
          <MapIconGroup
            onClick={() => { handleInfo(item.name, item.address); }}
          >
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
        <Div>
          <Title>券商據點</Title>
        </Div>
        <SearchContainer>
          <SearchTitle>尋找據點</SearchTitle>
          <SearchGroup>
            <SelectDiv>
              <Select mr20 onChange={(e) => { setSelectBank(e.target.value); }}>
                {banks && renderBank()}
              </Select>
              <ArrowImg src={arrowIcon} alt="arrow" />
            </SelectDiv>
            <SelectDiv>
              <Select mr20 onChange={(e) => { setSelectCity(e.target.value); }}>
                {cities && renderCity()}
              </Select>
              <ArrowImg src={arrowIcon} alt="arrow" />
            </SelectDiv>
            <Button w100 md onClick={() => { handleSearch(); }}>搜尋</Button>
          </SearchGroup>
        </SearchContainer>
        <ListMapGroup>
          <ListContainer>
            { message ? <Message>無符合搜尋結果</Message>
              : list.length > 0 ? renderList()
                : <Loading />}
          </ListContainer>
          <MapDescribe>
            <Hr />
            <DescribeText>Google Map</DescribeText>
          </MapDescribe>
          <MapContainer ref={mapRef}>
            <GoogleMap address={address} name={name} />
          </MapContainer>
        </ListMapGroup>
      </MainContainer>
      <ScrollTop />
      <Footer />
    </Container>
  );
}

export default Location;

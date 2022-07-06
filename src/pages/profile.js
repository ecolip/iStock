/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Close } from '@styled-icons/material';
import { PersonSquare } from '@styled-icons/bootstrap';
import { DragIndicator } from '@styled-icons/material-twotone';
import useEventListener from '@use-it/event-listener';
import * as dayjs from 'dayjs';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ScrollTop from '../components/ScrollTop';
import {
  getTrack, addTrackStock, removeTrackStock, compareStockId2,
} from '../utils/firebase';
import { handelColor } from '../utils/formatDate';
import api from '../utils/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #0B0E11;
`;
const MainContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
  padding: 120px 30px 30px;
  @media (min-width: 1200px) {
    flex-direction: row;
    justify-content: space-between;
    width: 1200px;
    padding: 120px 0 80px;
    margin: 0 auto;
  }
`;
const Div = styled.div`
  margin-right: auto;
  padding: 20px 0;
`;
const UserInfoDiv = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  @media (min-width: 576px) {
    font-size: 16px;
  }
`;
const UserIcon = styled(PersonSquare)`
  width: 40px;
  height: 40px;
`;
const DragIcon = styled(DragIndicator)`
  width: 20px;
  height: 30px;
  margin-right: 5px;
`;
const CloseIcon = styled(Close)`
  width: 20px;
  height: 20px;
  margin-right: 5px;
  color: #F5C829;
  cursor: pointer;
  :hover {
    opacity: 0.6;
  }
`;
const UserImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
`;
const UserName = styled.div`
`;
const UserEmail = styled.div`
`;
const NewsContainer = styled.div`
  position: relative;
  min-height: 30vh;
  margin-top: 100px;
  padding: 0 30px;
  @media (min-width: 1200px) {
    width: 63%;
    min-height: 70vh;
    margin-top: 0;
  }
`;
const NavGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const NewsNav = styled.div`
  border-bottom: ${(props) => (props.active ? '2px solid #F0B90B' : '2px solid transparent')};
  color: ${(props) => (props.active ? '#EAECEF' : '#848E9C')};

  display: flex;
  width: 20%;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  font-size: 20px;
  font-weight: bold;
  transition: all 0.1s linear;
  cursor: pointer;
  :hover {
    color: #EAECEF;
  }
`;
const TrackContainer = styled.div`
  @media (min-width: 1200px) {
    width: 35%;
  }
`;
const TrackTitle = styled.div`
  margin: 30px 0 0;
  font-size: 25px;
  font-weight: bold;
  color: #EAECEF;
`;
const TrackItemsContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  @media (min-width: 1200px) {
    flex-direction: column;
  }
`;
const TrackItems = styled.div`
  position: relative;
  min-height: 30vh;
  padding: 15px 0;
`;
const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  color: #EAECEF;
  font-size: 14px;
  font-weight: bold;
  border-radius: 3px;
  background-color: #181A20;
  :hover {
    background-color: #2D3137;
  }
`;
const ItemId = styled.div`
  display: flex;
  align-items: center;
  width: 35%;
  color: #EAECEF;
`;
const ItemText = styled.div`
  color: ${(props) => handelColor(props)};
  width: 15%;
`;
const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  @media (min-width: 576px) {
    justify-content: start;
  }
  @media (min-width: 1200px) {
    justify-content: space-between;
    padding: 20px 0 0;
  }
`;
const WriteInput = styled.input`
  width: 60%;
  height: 37px;
  padding: 10px;
  font-size: 15px;
  border: 1px solid #848E9C;
  border-radius: 5px;
  outline: none;
  color: white;
  background: transparent;
  :focus {
    border: 1px solid #F0B90B;
  }
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
  @media (min-width: 576px) {
    width: 300px;
    margin-right: 20px;
    font-size: 16px;
  }
`;
const NewsItems = styled.div`
  padding-top: 50px;
`;
const NewsItem = styled.div`
  margin-bottom: 25px;
  padding: 10px 20px;
  border-radius: 3px;
  background-color: #181A20;
  :hover {
    background-color: #2D3137;
  }
`;
const NewsTitle = styled.div`
  padding-bottom: 5px;
  font-size: 18px;
  font-weight: bold;
  color: #EAECEF;
`;
const NewsLink = styled.a`
  position: relative;
  min-height: 30vh;
  padding: 5px 0;
  font-size: 15px;
  color: #EAECEF;
  transition: all 0.1s linear;
  ${NewsItem}:hover & {
    color: #F0B90B;
  }
`;
const NewTime = styled.div`
  padding-top: 5px;
  text-align: right;
  font-style: italic;
  font-size: 13px;
  color: #848E9C;
`;
const LoadContainer = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translateX(-50%);
`;

function Profile() {
  const [user, setUser] = useState({});
  const [detail, setDetail] = useState(null);
  const [index, setIndex] = useState(1);
  const [stockId, setStockId] = useState('');
  const [news, setNews] = useState(null);
  const [isLoadedNews, setIsLoadedNews] = useState(true);
  const [isLoadedDetail, setIsLoadedDetail] = useState(true);
  const navigate = useNavigate();

  // const compareStockId = async (id) => {
  //   const token = window.localStorage.getItem('finToken');
  //   const res = await api.getStockList(token);
  //   const { data } = res;
  //   const items = data.filter((item) => item.stock_id === id);
  //   const item = items[0];
  //   if (item) {
  //     return item.stock_name;
  //   }
  //   return false;
  // };

  const logout = () => {
    window.localStorage.removeItem('firToken');
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('finToken');
    navigate('/', { replace: true });
  };

  const fetchTrack = async () => {
    const trackList = await getTrack('track');
    return trackList;
  };

  const fetchDetail = async () => {
    const res = await getTrack('detail');
    setDetail(res);
    setIsLoadedDetail(false);
  };

  const fetchNews = async () => {
    const res = await getTrack('news');
    setNews(res);
    setIsLoadedNews(false);
  };

  const updateTrack = () => {
    fetchDetail();
    fetchNews();
  };

  const addTrack = async () => {
    const stockTrim = stockId.trim();
    setStockId('');
    const trackList = await fetchTrack();
    const isTrack = trackList.includes(stockTrim);
    if (isTrack) {
      alert('已在追蹤清單!');
      return;
    }
    const name = await compareStockId2(stockTrim);
    console.log('抓名稱', name);
    if (name) {
      setIsLoadedDetail(true);
      setIsLoadedNews(true);
      const res = await addTrackStock(stockTrim);
      console.log('新增資料回覆', res);
      if (res) {
        updateTrack();
      }
    } else {
      alert('請輸入正確股票代號');
    }
  };

  const removeTrack = async (id) => {
    setIsLoadedDetail(true);
    setIsLoadedNews(true);
    const res = await removeTrackStock(id);
    if (res) {
      updateTrack();
    }
  };

  const renderList = () => {
    const output = detail.map((item) => (
      <Item key={`track-${item.stock_id}`}>
        <ItemId><DragIcon /> {item.stock_id} {item.stock_name}</ItemId>
        <ItemText green={item.spread < 0} red={item.spread > 0}>{item.close}</ItemText>
        <ItemText
          green={item.spread < 0}
          red={item.spread > 0}
        >{item.spread}
        </ItemText>
        <CloseIcon onClick={() => { removeTrack(item.stock_id); }} />
      </Item>
    ));
    return output;
  };

  const renderNews = () => {
    const output = news.map((item) => (
      <NewsItem key={`news-${item.stock_id}`}>
        <NewsTitle>{item.stock_id} {item.stock_name}</NewsTitle>
        <NewsLink href={item.link} target="_blank">{item.title}</NewsLink>
        <NewTime>{item.date}</NewTime>
      </NewsItem>
    ));
    return output;
  };

  const getUserInfo = () => {
    const data = window.localStorage.getItem('user');
    const result = JSON.parse(data);
    setUser(result);
  };

  useEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addTrack();
    }
  });

  useEffect(() => {
    getUserInfo();
    updateTrack();
  }, []);

  return (
    <Container>
      <Header />
      <MainContainer>
        <NewsContainer>
          <NavGroup>
            <NewsNav active={index === 1} onClick={() => { setIndex(1); }}>全部</NewsNav>
            <NewsNav active={index === 2} onClick={() => { setIndex(2); }}>新聞</NewsNav>
            <NewsNav active={index === 3} onClick={() => { setIndex(3); }}>公告</NewsNav>
          </NavGroup>
          <NewsItems>
            {!isLoadedNews ? renderNews() : <LoadContainer><Loading /></LoadContainer>}
          </NewsItems>
        </NewsContainer>
        <TrackContainer>
          <UserInfoDiv>
            <Div>
              {user.displayName && <UserName>姓名: {user.displayName}</UserName>}
              <UserEmail>帳號: {user.email}</UserEmail>
            </Div>
            <Button logout onClick={() => { logout(); }}>登出</Button>
          </UserInfoDiv>
          <TrackTitle>追蹤清單</TrackTitle>
          <TrackItemsContainer>
            <TrackItems>
              {!isLoadedDetail ? renderList() : <LoadContainer><Loading /></LoadContainer>}
            </TrackItems>
            <InputContainer>
              <WriteInput
                type="text"
                value={stockId}
                placeholder="新增個股到此清單"
                onChange={(e) => { setStockId(e.target.value); }}
              />
              <Button md onClick={() => { addTrack(); }}>新增</Button>
            </InputContainer>
          </TrackItemsContainer>
        </TrackContainer>
      </MainContainer>
      <ScrollTop />
      <Footer />
    </Container>
  );
}

export default Profile;

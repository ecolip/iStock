import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { SearchOutline } from '@styled-icons/evaicons-outline';
import { Close } from '@styled-icons/material';
// import DiscussionIcon from '../imgs/discussion.png';
import HeartImg from '../imgs/heart.svg';
import ChatImg from '../imgs/chat.svg';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ScrollTop from '../components/ScrollTop';
import {
  getAllPosts, getStockPosts, addStockPosts, addHeart, getResponsePosts, addResponsePost,
} from '../utils/firebase';
import { getDateDiff } from '../utils/formatDate';
import api from '../utils/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #0B0E11;
`;
const MainContainer = styled.div`
  padding: 100px 30px 30px;
  @media (min-width: 768px) {
    width: 768px;
    padding: 30px 0;
    margin: 0 auto;
    padding-top: 120px;
  }
`;
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;
const LoadContainer = styled.div`
  padding-top: 50px;
`;
// const DiscussionImg = styled.img`
//   width: 50px;
//   height: 50px;
//   margin-right: 20px;
// `;
const Title = styled.div`
  padding-bottom: 2px;
  border-bottom: 2px solid #F5C829;
  margin-bottom: 30px;
  font-size: 22px;
  color: #EAECEF;
`;
const ButtonGroup = styled.div`
  margin-bottom: ${(props) => (props.mb100 ? '100px' : '0')};

  display: flex;
  align-items: center;
  padding-bottom: 15px;
`;
const SearchGroup = styled.div`
  border: ${(props) => (props.focus ? '1px solid #F0B90B' : '1px solid #848E9C')};

  width: 190px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: auto;
  padding: 0 13px;
  border-radius: 5px;
  @media (min-width: 576px) {
    width: 250px;
    margin-left: 20px;
    height: 40px;
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
const WriteContainer = styled.div`
  padding: 40px 0;
`;
const WriteTitle = styled.div`
  margin-bottom: ${(props) => (props.mb20 ? '20px' : '0')};
  padding-bottom: ${(props) => (props.pb10 ? '10px' : '0')};
  font-size: 22px;
  padding-right: 20px;
  color: #EAECEF;
`;
const WriteTextarea = styled.textarea`
  width: 100%;
  height: 150px;
  border-radius: 5px;
  padding: 10px 15px;
  margin-bottom: 15px;
  font-size: 16px;
  color: #0B0E11;
  outline: none;
  resize: none;
`;
const PostContainer = styled.div`
  min-height: 300px;
  padding: 30px 0 10px;
  border-top: 1px solid #474D57;
  border-bottom: 1px solid #474D57;
`;
const PostItem = styled.div`
  padding-bottom: 40px;
`;
const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
`;
const Author = styled.div`
  padding-right: 10px;
  padding-bottom: 6px;
  color: #848E9C;
  font-size: 13px;
  font-style: italic;
`;
const Time = styled.div`
  padding-bottom: 6px;
  color: #848E9C;
  font-size: 13px;
  font-style: italic;
`;
const StockId = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  color: #EAECEF;
  font-size: 18px;
  font-weight: bold;

`;
const Context = styled.div`
  padding-bottom: 15px;
  color: #EAECEF;
  font-size: 16px;
  font-weight: 500;
`;
const Div = styled.div`
  padding-bottom: ${(props) => (props.pb20 ? '20px' : '0')};

  display: flex;
  align-items: center;
`;
const HeartDiv = styled.div`
  display: flex;
  align-items: center;
  padding-right: 30px;
`;
const Img = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  cursor: pointer;
  @media (min-width: 576px) {
    width: 22px;
    height: 22px;
  }
`;
const Num = styled.div`
  color: #848E9C;
  font-size: 14px;
`;
const ChatDiv = styled.div`
  display: flex;
  align-items: center;
`;
const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
`;
const MessageText = styled.div`
  padding: 100px 0;
  text-align: center;
  color: #848E9C;
  font-size: 18px;
  font-weight: 500;
`;
const WriteInput = styled.input`
  width: 150px;
  height: 40px;
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
    font-size: 16px;
  }
`;
const DialogContainer = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255,255,255,0.5);
  z-index: 100;
  opacity: 1;
`;
const Dialog = styled.div`
  box-shadow: 0 2px 8px rgba(255, 255, 255, .5);
  padding: 20px;
  margin-bottom: 40px;
`;
const CloseIcon = styled(Close)`
  display: flex;
  width: 35px;
  height: 35px;
  margin-left: auto;
  margin-bottom: 30px;
  color: #F0B90B;
  cursor: pointer;
  transition: color 0.1s linear;
  :hover {
    opacity: 0.9;
  }
`;
const RenderDialogDiv = styled.div`
  min-height: 200px;
`;
const DialogDiv = styled.div`
  height: 100vh;
  padding: 30px 80px;
  background-color: #0B0E11;
  overflow: auto;
  border-radius: 8px;
  @media (min-width: 768px) {
    width: 768px;
    margin: 0 auto;
  }
`;

function Post() {
  const [chat, setChat] = useState('');
  const [chatId, setChatId] = useState('');
  const [posts, setPosts] = useState(null);
  const [stockId, setStockId] = useState('');
  const [resInfo, setResInfo] = useState('');
  const [resChat, setResChat] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const [responsePosts, setResponsePosts] = useState(null);
  const postRef = useRef(null);

  const scrollToPost = () => {
    window.scrollTo({
      top: postRef.current.offsetTop - 100,
      behavior: 'smooth',
    });
  };

  const fetchPosts = async () => {
    const res = await getAllPosts();
    setIsLoaded(false);
    setPosts(res);
  };

  const addHeartNum = (uuid, heart) => {
    const uuidTrim = uuid.trim();
    addHeart(uuidTrim, heart);
    fetchPosts();
  };

  const compareStockId = async (id) => {
    const token = window.localStorage.getItem('finToken');
    const res = await api.getStockList(token);
    const { data } = res;
    const items = data.filter((item) => item.stock_id === id);
    const item = items[0];
    if (item) {
      return item.stock_name;
    }
    return false;
  };

  const sendPost = async () => {
    const chatTrim = chat.trim();
    if (!chatTrim.length > 0) {
      alert('請輸入討論文字！');
      return;
    }
    if (!chatId.length > 0) {
      setChatId('');
      setChat('');
      addStockPosts('TAIEX', '加權指數', chatTrim);
      fetchPosts();
      scrollToPost();
    } else {
      const name = await compareStockId(chatId);
      if (name) {
        setChatId('');
        setChat('');
        addStockPosts(chatId, name, chatTrim);
        fetchPosts();
        scrollToPost();
      } else {
        alert('請輸入正確股票代號');
      }
    }
  };

  const searchStockPosts = async () => {
    setIsLoaded(true);
    const res = await getStockPosts(stockId);
    if (!res.length > 0) {
      setMessage('無符合搜尋討論串');
    } else {
      setMessage(null);
      setPosts(res);
    }
    setStockId('');
    setIsLoaded(false);
  };

  const openDialog = (uuid, id, name, chatNum) => {
    getResponsePosts(uuid).then((data) => {
      setResInfo({
        id,
        name,
        uuid,
        chatNum,
      });
      setResponsePosts(data);
      setIsOpen(true);
    });
  };

  const closeDialog = () => {
    setResInfo({});
    setIsOpen(false);
  };

  const sendResponse = async () => {
    const { uuid, chatNum } = resInfo;
    const resChatTrim = resChat.trim();
    if (!resChatTrim.length > 0) {
      alert('請輸入討論文字！');
    } else {
      const res = await addResponsePost(uuid, resChatTrim, chatNum);
      if (res) {
        setResChat('');
        const data = await getResponsePosts(uuid);
        setResponsePosts(data);
        fetchPosts();
      }
    }
  };

  const renderPost = () => {
    const output = posts.map((item) => (
      <PostItem key={`post-${item.uuid}`}>
        <AuthorContainer>
          <Author>{item.author}</Author>
          <Time>{getDateDiff(item.timestamp * 1000)}</Time>
        </AuthorContainer>
        <StockId>{item.stock_id} {item.stock_name}</StockId>
        <Context>{item.context}</Context>
        <Div>
          <HeartDiv>
            <Img
              src={HeartImg}
              onClick={() => { addHeartNum(item.uuid, item.heart); }}
            />
            <Num>{item.heart}</Num>
          </HeartDiv>
          <ChatDiv>
            <Img
              src={ChatImg}
              onClick={() => { openDialog(item.uuid, item.stock_id, item.stock_name, item.chat); }}
            />
            <Num>{item.chat}</Num>
          </ChatDiv>
        </Div>
      </PostItem>
    ));
    return output;
  };

  const renderDialog = () => {
    const output = responsePosts.map((item) => (
      <Dialog key={`response-${item.timestamp}`}>
        <AuthorContainer>
          <Author>{item.author}</Author>
          <Time>{getDateDiff(item.timestamp * 1000)}</Time>
        </AuthorContainer>
        <Context>{item.context}</Context>
      </Dialog>
    ));
    return output;
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <Container>
        <Header />
        <MainContainer>
          <TitleContainer>
            {/* <DiscussionImg src={DiscussionIcon} /> */}
            <Title ref={postRef}>討論專區</Title>
          </TitleContainer>
          <ButtonGroup mb100={isLoaded}>
            <Button sm1 onClick={() => { fetchPosts(); }}>全部</Button>
            <SearchGroup focus={isFocus}>
              <Input
                type="text"
                value={stockId}
                placeholder="請輸入股票代號"
                onChange={(e) => { setStockId(e.target.value); }}
                onFocus={() => { setIsFocus(true); }}
                onBlur={() => { setIsFocus(false); }}
              />
              <SearchIcon onClick={() => { searchStockPosts(); }} />
            </SearchGroup>
          </ButtonGroup>
          {!isLoaded
            ? (
              <>
                {message
                  ? <MessageText>{message}</MessageText>
                  : <PostContainer>{posts && renderPost()}</PostContainer>}
                <WriteContainer>
                  <Div pb20>
                    <WriteTitle>討論</WriteTitle>
                    <WriteInput
                      type="text"
                      value={chatId}
                      placeholder="請輸入股票代碼"
                      onChange={(e) => { setChatId(e.target.value); }}
                    />
                  </Div>
                  <WriteTextarea value={chat} onChange={(e) => { setChat(e.target.value); }} />
                  <ButtonDiv>
                    <Button onClick={() => { sendPost(); }}>送出</Button>
                  </ButtonDiv>
                </WriteContainer>
              </>
            )
            : <LoadContainer><Loading /></LoadContainer>}
        </MainContainer>
        <Footer />
      </Container>
      <DialogContainer show={isOpen}>
        <DialogDiv>
          <CloseIcon onClick={() => { closeDialog(); }} />
          <WriteTitle mb20>{resInfo.id} {resInfo.name}</WriteTitle>
          <RenderDialogDiv>
            {responsePosts && renderDialog()}
          </RenderDialogDiv>
          <WriteTitle pb10>留言</WriteTitle>
          <WriteTextarea
            value={resChat}
            onChange={(e) => { setResChat(e.target.value); }}
          />
          <ButtonDiv>
            <Button onClick={() => { sendResponse(); }}>送出</Button>
          </ButtonDiv>
        </DialogDiv>
      </DialogContainer>
      <ScrollTop />
    </>
  );
}

export default Post;

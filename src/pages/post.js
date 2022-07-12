import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { SearchOutline } from '@styled-icons/evaicons-outline';
import { Close } from '@styled-icons/material';
import HeartImg from '../imgs/heart.svg';
import ChatImg from '../imgs/chat.svg';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ScrollTop from '../components/ScrollTop';
import {
  getAllPosts, getStockPosts, addStockPosts, addHeart, getResponsePosts,
  addResponsePost, compareStockId2, getOriPost,
} from '../utils/firebase';
import { getDateDiff } from '../utils/formatDate';

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
const Title = styled.div`
  margin: auto 0 30px;
  padding-bottom: 2px;
  border-bottom: 2px solid #F5C829;
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
  font-size: ${(props) => (props.fz18 ? '18px' : '22px')};
  background-color: ${(props) => (props.bgc ? '#0B0E11' : 'transparent')};
  padding-right: 20px;
  color: #EAECEF;
`;
const WriteTextarea = styled.textarea`
  height: ${(props) => (props.h50 ? '50px' : '100px')}; 
  width: 100%;
  border-radius: 5px;
  padding: 10px 15px;
  margin-bottom: 15px;
  font-size: 14px;
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
  font-size: 14px;
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
  width: 171px;
  height: 40px;
  padding: 10px;
  font-size: 13px;
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
`;
const DialogContainer = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(255,255,255,0.5);
  z-index: 100;
  opacity: 1;
`;
const DialogDiv = styled.div`
  height: 100%;
  padding: 20px 80px;
  background-color: #0B0E11;
  border-radius: 3px;
  @media (min-width: 768px) {
    width: 768px;
    margin: 0 auto;
  }
`;
const Dialog = styled.div`
  margin-bottom: 10px;
  padding: 10px 20px;
  background-color: #2D3137;
  border-radius: 3px;
  border-bottom: 1px solid #474D57;
`;
const Box = styled.div`
  position: relative;
  height: 100%;
`;
const CloseIcon = styled(Close)`
  display: flex;
  width: 35px;
  height: 35px;
  margin-left: auto;
  color: #F0B90B;
  cursor: pointer;
  transition: color 0.1s linear;
  :hover {
    opacity: 0.9;
  }
`;
const RenderDialogDiv = styled.div`
  max-height: 50vh;
  overflow: auto;
`;
const DialogInputDiv = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
`;
const Hr = styled.hr`
  width: 100%;
  margin-top: 0;
  border-bottom: 2px solid #474D57;
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
    setMessage('');
    setIsLoaded(false);
    setPosts(res);
  };

  const addHeartNum = (uuid, heart) => {
    const uuidTrim = uuid.trim();
    addHeart(uuidTrim, heart);
    fetchPosts();
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
      const name = await compareStockId2(chatId);
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

  const openDialog = async (uuid) => {
    const res = await getResponsePosts(uuid);
    const oriPost = await getOriPost(uuid);
    console.log('要回覆的post', oriPost);
    setResInfo(oriPost);
    setResponsePosts(res);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setResInfo({});
    setIsOpen(false);
  };

  const sendResponse = async () => {
    const { uuid, author } = resInfo;
    const chatNum = resInfo.chat;
    const resChatTrim = resChat.trim();
    if (!resChatTrim.length > 0) {
      alert('請輸入討論文字！');
    } else {
      const res = await addResponsePost(author, uuid, resChatTrim, chatNum);
      if (res) {
        setResChat('');
        const data = await getResponsePosts(uuid);
        setResponsePosts(data);
        fetchPosts();
      }
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      searchStockPosts();
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
              onClick={() => { openDialog(item.uuid); }}
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
                onKeyPress={(e) => { handleSearch(e); }}
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
                      placeholder="請輸入股票代碼 預設加權"
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
          <Box>
            <CloseIcon onClick={() => { closeDialog(); }} />
            <AuthorContainer>
              <Author>{resInfo.author}</Author>
              <Time>{getDateDiff(resInfo.timestamp * 1000)}</Time>
            </AuthorContainer>
            <StockId>{resInfo.stock_id} {resInfo.stock_name}</StockId>
            <Context>{resInfo.context}</Context>
            <Hr />
            <RenderDialogDiv>
              {responsePosts && renderDialog()}
            </RenderDialogDiv>
            <DialogInputDiv>
              <WriteTitle pb10 bgc>留言</WriteTitle>
              <WriteTextarea
                h50
                value={resChat}
                onChange={(e) => { setResChat(e.target.value); }}
              />
              <ButtonDiv>
                <Button onClick={() => { sendResponse(); }}>送出</Button>
              </ButtonDiv>
            </DialogInputDiv>
          </Box>
        </DialogDiv>
      </DialogContainer>
      <ScrollTop />
    </>
  );
}

export default Post;

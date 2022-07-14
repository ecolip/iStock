import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Close } from '@styled-icons/material';
import Button from '../Button';
import {
  getResponsePosts, addResponsePost, getOriPost, updateRead,
} from '../../utils/firebase';
import { getDateDiff } from '../../utils/formatDate';

const DialogContainer = styled.div`
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
const Item = styled.div`
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
const AuthorDiv = styled.div`
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
const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
`;
const Message = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px 0;
  font-size: 15px;
  color: #848E9C;
`;

function Dialog() {
  const [post, setPost] = useState(null);
  const [resChat, setResChat] = useState('');
  const [resPost, setResPost] = useState(null);
  const [message, setMessage] = useState('');
  const { postId } = useParams();

  const redirectPost = () => {
    window.location.href = '/post';
  };

  const sendResponse = async () => {
    const id = post.uuid;
    const { author, context } = post;
    const postTitle = context.slice(0, 3);
    const chatNum = post.chat;
    const resChatTrim = resChat.trim();
    if (!resChatTrim.length > 0) {
      alert('請輸入討論文字！');
    } else {
      const res = await addResponsePost(id, author, postTitle, resChatTrim, chatNum);
      if (res) {
        setResChat('');
        const data = await getResponsePosts(id);
        setResPost(data);
      }
    }
  };

  const renderDialog = () => {
    const output = resPost.map((item) => (
      <Item key={`response-${item.timestamp}`}>
        <AuthorDiv>
          <Author>{item.author}</Author>
          <Time>{getDateDiff(item.timestamp * 1000)}</Time>
        </AuthorDiv>
        <Context>{item.context}</Context>
      </Item>
    ));
    return output;
  };

  const fetchOriPost = async () => {
    const data = window.localStorage.getItem('user');
    const { email } = JSON.parse(data);
    const oriPost = await getOriPost(postId);
    if (oriPost !== undefined) {
      const res = await getResponsePosts(postId);
      console.log('要回覆的post', oriPost);
      setPost(oriPost);
      setResPost(res);
      if (oriPost.author === email) {
        updateRead(postId);
      }
      setMessage('');
    } else {
      setMessage('網址錯誤，無此則貼文!');
    }
  };

  useEffect(() => {
    fetchOriPost();
  }, []);

  return (
    <DialogContainer>
      <DialogDiv>
        <Box>
          <CloseIcon onClick={() => { redirectPost(); }} />
          {post && (
            <>
              <AuthorDiv>
                <Author>{post.author}</Author>
                <Time>{getDateDiff(post.timestamp * 1000)}</Time>
              </AuthorDiv>
              <StockId>{post.stock_id} {post.stock_name}</StockId>
              <Context>{post.context}</Context>
              <Hr />
            </>
          ) }
          {message !== '' && <Message>{message}</Message>}
          <RenderDialogDiv>
            {resPost && renderDialog()}
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
  );
}

export default Dialog;

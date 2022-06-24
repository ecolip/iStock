import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Footer from '../components/Footer';
import Button from '../components/Button';
import googleSrc from '../imgs/google.svg';
import AppContext from '../AppContext';
import {
  googleSignIn, register, signIn, getCategoryList, updateCategoryPrices, checkNewPrices,
} from '../utils/firebase';
import api from '../utils/api';
import { today, preDay } from '../utils/formatDate';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 30px;
  background-color: #181A20;
  border-bottom: 1px solid #F5F5F5;
`;
const Logo = styled.div`
  color: #F0B90B;
  font-size: 36px;
  font-weight: bold;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* height: 100vh; */
  margin: 0 auto;
  background-color: #181A20;
`;
const LoginContainer = styled.div`
  width: 100%;
  padding: 50px 30px 0 30px;
 
  @media (min-width: 400px) {
    width: 400px;
    margin: 0 auto;
  }
`;
const Title = styled.div`
  color: white;
  font-size: 24px;
  padding-bottom: 30px;
`;
const MethodGroup = styled.div`
  display: flex;
  margin-bottom: 30px;
`;
const MethodBtn = styled.div`
  color: ${(props) => (props.click ? 'white' : '#848E9C')};
  background-color: ${(props) => (props.click ? '#2B3139' : 'transparent')};

  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;
const InputGroup = styled.div`
  padding-bottom: ${(props) => (props.pb1 ? '20px' : '8px')};
`;
const InputTitle = styled.div`
  padding-bottom: 8px;
  color: white;
  font-size: 15px;
  letter-spacing: 2px;
`;
const InputDiv = styled.input`
  width: 100%;
  height: 50px;
  padding: 0 20px;
  color: white;
  font-size: 20px;
  background-color: #181A20;
  outline: none;
  border: 1px solid #848E9C;
  border-radius: 4px;
  :focus {
    border: 1px solid #F0B90B;
  }
`;
const ErrorDiv = styled.div`
  width: 100%;
  height: 50px;
`;
const ErrorMessage = styled.div`
  color: #F0B90B;
  font-size: 13px;
  font-weight: 600;
`;
const GoogleImg = styled.img`
  width: 30px;
  height: 30px;
`;
const HrContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;
const HrDiv = styled.hr`
  width: 35%;
  color: #848E9C;
`;
const HrText = styled.div`
  color: #848E9C;
  font-size: 16px;
  font-weight: bold;
`;

function Login() {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [state, dispatch] = useContext(AppContext);

  const trimText = () => {
    const triEmail = email.trim();
    const triPassword = password.trim();
    return { triEmail, triPassword };
  };

  const clearInput = () => {
    setEmail('');
    setPassword('');
  };

  const clickLoginItem = () => {
    clearInput();
    setLogin(true);
  };

  const clickRegisterItem = () => {
    clearInput();
    setLogin(false);
  };

  const verifyEmailAndPassword = () => {
    const { triEmail, triPassword } = trimText();
    // eslint-disable-next-line no-useless-escape
    const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!triEmail.match(pattern)) {
      setMessage('請輸入正確 Email');
      return false;
    }
    if (triPassword.length < 6) {
      setMessage('請輸入至少六位數密碼');
      return false;
    }
    return true;
  };

  const firebaseLogin = () => {
    const { triEmail, triPassword } = trimText();
    const isVerify = verifyEmailAndPassword(triEmail, triPassword);
    if (!isVerify) return;

    signIn(triEmail, triPassword).then((res) => {
      const user = JSON.stringify({ email: res.email });
      window.localStorage.setItem('firToken', res.accessToken);
      window.localStorage.setItem('user', user);
      clearInput();
      window.location.href = '/home';
    }).catch((code) => {
      if (code === 'auth/user-not-found') {
        setMessage('此帳號尚未註冊');
      }
      if (code === 'auth/wrong-password') {
        setMessage('密碼錯誤');
      }
    });
  };

  const firebaseRegister = () => {
    const { triEmail, triPassword } = trimText();
    const isVerify = verifyEmailAndPassword(triEmail, triPassword);
    if (!isVerify) return;

    register(triEmail, triPassword).then((res) => {
      const user = JSON.stringify({ email: res.email });
      window.localStorage.setItem('firToken', res.accessToken);
      window.localStorage.setItem('user', user);
      clearInput();
      navigate('./home', { replace: true });
    });
  };

  const firebaseGoogleLogin = () => {
    googleSignIn().then(() => {
      navigate('./home', { replace: true });
    });
  };

  const fetchPrices = async (item, day) => {
    const finToken = window.localStorage.getItem('finToken');
    const res = await api.getTodayPrice(finToken, item.stock_id, day);
    const newItem = {
      ...item, close: res.data[0].close, spread: res.data[0].spread.toFixed(2), date: day,
    };
    return newItem;
  };

  const fetchTaiexOpenDate = async (date) => {
    const finToken = window.localStorage.getItem('finToken');
    const res = await api.getTodayPrice(finToken, 'TAIEX', date);
    if (res.data.length > 0) {
      dispatch({ openDate: date });
      return date;
    }
    return fetchTaiexOpenDate(preDay(date));
  };

  const updatePrice = async () => {
    const openDate = await fetchTaiexOpenDate(today());
    const isNew = await checkNewPrices(openDate);
    if (!isNew) {
      getCategoryList().then((indexList) => {
        indexList.forEach((item) => {
          fetchPrices(item, openDate).then((priceItem) => {
            updateCategoryPrices(priceItem);
          });
        });
      });
    }
  };

  const getApiToken = async () => {
    const res = await api.finMindLogin();
    window.localStorage.setItem('finToken', res.token);
    return res.token;
  };

  useEffect(() => {
    getApiToken().then((token) => {
      if (token) {
        updatePrice();
      }
    });
  }, []);

  return (
    <Container>
      <HeaderContainer>
        <Logo>iStock</Logo>
      </HeaderContainer>
      <LoginContainer>
        <Title>iStock 帳戶登入</Title>
        <MethodGroup>
          <MethodBtn click={login} onClick={() => { clickLoginItem(); }}>登入</MethodBtn>
          <MethodBtn click={!login} onClick={() => { clickRegisterItem(); }}>註冊</MethodBtn>
        </MethodGroup>
        <InputGroup pb1>
          <InputTitle>郵箱</InputTitle>
          <InputDiv
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); }}
          />
        </InputGroup>
        <InputGroup>
          <InputTitle>密碼</InputTitle>
          <InputDiv
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); }}
          />
        </InputGroup>
        <ErrorDiv>
          {message ? <ErrorMessage>{message}</ErrorMessage> : null}
        </ErrorDiv>
        {login ? (
          <>
            <Button sm w100 onClick={() => { firebaseLogin(); }}>登入</Button>
            <HrContainer>
              <HrDiv />
              <HrText>或</HrText>
              <HrDiv />
            </HrContainer>
            <Button google sm w100 onClick={() => { firebaseGoogleLogin(); }}>
              <GoogleImg src={googleSrc} alt="google" />
              使用 google 繼續
            </Button>
          </>
        ) : <Button sm w100 mb1 onClick={() => { firebaseRegister(); }}>註冊</Button>}
      </LoginContainer>
      <Footer />
    </Container>
  );
}

export default Login;

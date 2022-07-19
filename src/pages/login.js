/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useEventListener from '@use-it/event-listener';
import Footer from '../components/Footer';
import Button from '../components/Button';
import googleSrc from '../imgs/google.svg';
import AppContext from '../AppContext';
import {
  googleSignIn, register, signIn, getCategoryList, updateCategoryPrices,
  checkNewPrices, addStockName,
} from '../utils/firebase';
// import { addBrokerages } from '../utils/firebase';
import { today, preDay } from '../utils/formatDate';
// import { list, banksList } from '../utils/locationData';
import api from '../utils/api';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  padding: 0 30px;
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
  min-height: 100vh;
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
    setMessage('');
    setLogin(true);
  };

  const clickRegisterItem = () => {
    clearInput();
    setMessage('');
    setLogin(false);
  };

  const verifyEmailAndPassword = () => {
    const { triEmail, triPassword } = trimText();
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
      navigate('./home', { replace: true });
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
    }).catch((code) => {
      if (code === 'auth/email-already-in-use') {
        setMessage('此帳號已註冊');
      }
    });
  };

  const firebaseGoogleLogin = () => {
    googleSignIn().then(() => {
      navigate('./home', { replace: true });
    });
  };

  const fetchPrices = async (item, day) => {
    const res = await api.getTodayPrice(item.stock_id, day);
    const newItem = {
      ...item, close: res.data[0].close, spread: res.data[0].spread.toFixed(2), date: day,
    };
    return newItem;
  };

  const fetchTaiexOpenDate = async (date) => {
    const res = await api.getTodayPrice('TAIEX', date);
    if (res.status === 402) return 402;
    if (res.data.length > 0) {
      dispatch({ openDate: date });
      return date;
    }
    return fetchTaiexOpenDate(preDay(date));
  };

  const updatePrice = async () => {
    const openDate = await fetchTaiexOpenDate(today());
    console.log('開盤日or402錯誤', openDate);
    if (openDate === 402) return;
    const isNew = await checkNewPrices(openDate);
    if (!isNew) {
      const indexList = await getCategoryList();
      indexList.forEach((item) => {
        fetchPrices(item, openDate).then((priceItem) => {
          updateCategoryPrices(priceItem);
        });
      });
    }
  };

  const fetchStockNames = async () => {
    const res = await api.getStockList();
    const { data } = res;
    addStockName(data);
  };

  const getApiToken = async () => {
    const token = await api.finMindLogin();
    return token;
  };

  // const handleBrokerages = (bankName) => {
  //   const data = [];
  //   list.forEach((item) => {
  //     if (bankName.length === 2) {
  //       const bank = item.name.slice(0, 2);
  //       if (bank === bankName) {
  //         data.push(item);
  //       }
  //     } else if (bankName.length === 3) {
  //       const bank = item.name.slice(0, 3);
  //       if (bank === bankName) {
  //         data.push(item);
  //       }
  //     } else if (bankName.length === 4) {
  //       const bank = item.name.slice(0, 4);
  //       if (bank === bankName) {
  //         data.push(item);
  //       }
  //     }
  //   });
  //   addBrokerages(bankName, data);
  // };

  // const initBrokeragesToDB = () => {
  //   banksList.forEach((item) => {
  //     handleBrokerages(item);
  //   });
  // };

  useEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (login) {
        firebaseLogin();
      } else {
        firebaseRegister();
      }
    }
  });

  useEffect(() => {
    getApiToken().then((token) => {
      if (token) {
        updatePrice();
        fetchStockNames();
      }
    });
    // initBrokeragesToDB();
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

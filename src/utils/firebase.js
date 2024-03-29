import { initializeApp } from 'firebase/app';
import {
  getAuth, signInWithPopup, GoogleAuthProvider,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore, collection, query, setDoc, doc, getDoc, updateDoc, where, getDocs, onSnapshot,
} from 'firebase/firestore';
import * as dayjs from 'dayjs';
import firebaseConfig from '../firebaseConfig';
import api from './api';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const signIn = (email, password) => new Promise((resolve, reject) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const { user } = userCredential;
      resolve(user);
    }).catch((error) => {
      reject(error.code);
    });
});

const googleSignIn = () => new Promise((resolve) => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const { displayName, email, photoURL } = result.user;
      const user = JSON.stringify({
        displayName, email, photoURL, token,
      });
      window.localStorage.setItem('firToken', token);
      window.localStorage.setItem('user', user);
      resolve(token);
      const docRef = doc(db, 'userTrackStocks', email);
      if (!docRef) {
        const ref = doc(db, 'userTrackStocks', email);
        setDoc(ref, {
          track: [],
        });
      }
    });
});

const register = (email, password) => new Promise((resolve, reject) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const { user } = userCredential;
      setDoc(doc(db, 'userTrackStocks', email), { track: [], detail: [], news: [] });
      resolve(user);
    }).catch((error) => {
      reject(error.code);
    });
});

const getCategoryList = async () => {
  const list = [];
  const querySnapshot = await getDocs(collection(db, 'indexList'));
  querySnapshot.forEach((item) => {
    list.push(item.data());
  });
  return list;
};

const getNewCategoryPrice = async () => {
  const list = [];
  const querySnapshot = await getDocs(collection(db, 'categoryPrices'));
  querySnapshot.forEach((item) => {
    list.push(item.data());
  });
  list.sort((a, b) => b.spread - a.spread);
  return list;
};

const checkNewPrices = async (openDate) => {
  const docRef = doc(db, 'categoryPrices', 'TAIEX');
  const docSnap = await getDoc(docRef);
  return docSnap.data().date === openDate;
};

const updateCategoryPrices = (item) => {
  setDoc(doc(db, 'categoryPrices', item.stock_id), item);
};

const getOpenDate = async () => {
  const docRef = doc(db, 'categoryPrices', 'TAIEX');
  const docSnap = await getDoc(docRef);
  const { date } = docSnap.data();
  return date;
};

const addStockName = (data) => {
  setDoc(doc(db, 'stockNames', 'list'), { data });
};

const compareStockId2 = async (id) => {
  const docRef = doc(db, 'stockNames', 'list');
  const docSnap = await getDoc(docRef);
  const { data } = docSnap.data();
  const items = data.filter((item) => item.stock_id === id);
  const item = items[0];
  if (item) {
    return item.stock_name;
  }
  return false;
};

const compareStockId = async (id) => {
  const docRef = doc(db, 'stockNames', 'list');
  const docSnap = await getDoc(docRef);
  const { data } = docSnap.data();
  const items = data.filter((item) => item.stock_id === id);
  const item = items[0];
  if (item) {
    return item.stock_name;
  }
  return false;
};

const getTrack = async (type) => {
  const user = window.localStorage.getItem('user');
  const { email } = JSON.parse(user);
  const docRef = doc(db, 'userTrackStocks', email);
  const docSnap = await getDoc(docRef);
  switch (type) {
    case 'track':
      return docSnap.data().track;
    case 'detail':
      return docSnap.data().detail;
    default:
      return docSnap.data().news;
  }
};

const fetchTrackDetail = async (id) => {
  const openDate = await getOpenDate();
  const name = await compareStockId(id);
  const detail = await getTrack('detail');
  const newDetail = [...detail];
  const res = await api.getTodayPrice(id, openDate);
  const stockItem = res.data[0];
  if (stockItem) {
    const newItem = {
      ...stockItem,
      stock_name: name,
    };
    newDetail.push(newItem);
  }
  return newDetail;
};

const fetchHistoryNews = async (id) => {
  const preWeek = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
  const news = await getTrack('news');
  const newNews = [...news];
  const openDate = await getOpenDate();
  const name = await compareStockId(id);
  const res = await api.getTodayNews(id, openDate, preWeek);
  const stockItem = res.data[0];
  if (stockItem) {
    const newItem = {
      ...stockItem,
      stock_name: name,
    };
    newNews.push(newItem);
  }
  return newNews;
};

const addTrackStock = async (id) => {
  const user = window.localStorage.getItem('user');
  const { email } = JSON.parse(user);
  const docRef = doc(db, 'userTrackStocks', email);
  const initTrack = await getTrack('track');
  const detail = await fetchTrackDetail(id);
  const news = await fetchHistoryNews(id);
  const newTrack = [...initTrack, id];
  await updateDoc(docRef, {
    track: newTrack,
    detail,
    news,
  });
  return true;
};

const removeNewsIndex = async (id) => {
  const originNews = await getTrack('news');
  const newsIndex = [];
  originNews.forEach((item, index) => {
    if (item.stock_id === id) {
      newsIndex.push(index);
    }
  });
  if (newsIndex.length > 0) {
    return newsIndex[0];
  }
  return false;
};

const removeTrackStock = async (id) => {
  const user = window.localStorage.getItem('user');
  const { email } = JSON.parse(user);
  const docRef = doc(db, 'userTrackStocks', email);
  const originTrack = await getTrack('track');
  const originDetail = await getTrack('detail');
  const originNews = await getTrack('news');
  const newsIndex = await removeNewsIndex(id);
  const index = originTrack.indexOf(id);
  const newTrack = [...originTrack];
  const newDetail = [...originDetail];
  const newNews = [...originNews];
  newTrack.splice(index, 1);
  newDetail.splice(index, 1);
  if (newsIndex !== false) {
    newNews.splice(newsIndex, 1);
  }
  await updateDoc(docRef, {
    track: newTrack,
    detail: newDetail,
    news: newNews,
  });
  return true;
};

const getAllPosts = async () => {
  const list = [];
  const querySnapshot = await getDocs(collection(db, 'stockPosts'));
  querySnapshot.forEach((item) => {
    list.push(item.data());
  });
  list.sort((a, b) => b.timestamp - a.timestamp);
  return list;
};

const getStockPosts = async (id) => {
  const list = [];
  const q = query(collection(db, 'stockPosts'), where('stock_id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((item) => {
    list.push(item.data());
  });
  list.sort((a, b) => b.timestamp - a.timestamp);
  return list;
};

const getOriPost = async (uuid) => {
  const docRef = doc(db, 'stockPosts', uuid);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

const addStockPosts = async (id, name, context) => {
  const user = window.localStorage.getItem('user');
  const { email } = JSON.parse(user);
  const postRef = doc(collection(db, 'stockPosts'));
  const docRef = doc(db, 'responsePosts', postRef.id);
  const time = Date.now() / 1000;
  const timestamp = parseInt(time, 10);
  await setDoc(postRef, {
    author: email,
    stock_id: id,
    stock_name: name,
    context,
    chat: 0,
    heart: 0,
    timestamp,
    uuid: postRef.id,
  });
  await setDoc(docRef, {
    data: [],
  });
};

const addHeart = (uuid, heart) => {
  const docRef = doc(db, 'stockPosts', uuid);
  updateDoc(docRef, {
    heart: heart + 1,
  });
};

const addChat = async (uuid, chat) => {
  const docRef = doc(db, 'stockPosts', uuid);
  updateDoc(docRef, {
    chat: chat + 1,
  });
};

const getResponsePosts = async (uuid) => {
  const docRef = doc(db, 'responsePosts', uuid);
  const docSnap = await getDoc(docRef);
  const result = docSnap.data().data;
  return result;
};

const addResponsePost = async (uuid, postAuthor, postTitle, context, chat) => {
  const user = window.localStorage.getItem('user');
  const { email } = JSON.parse(user);
  const time = Date.now() / 1000;
  const timestamp = parseInt(time, 10);
  const docRef = doc(db, 'responsePosts', uuid);
  const docSnap = await getDoc(docRef);
  const { data } = docSnap.data();
  const newItem = {
    uuid,
    author: email,
    context,
    isRead: false,
    postAuthor,
    postTitle,
    timestamp,
  };
  const newData = [...data, newItem];
  await setDoc(docRef, {
    data: newData,
  });
  await addChat(uuid, chat);
  return true;
};

const addBrokerages = (bank, data) => {
  setDoc(doc(db, 'brokerages', bank), { data });
};

const getBanks = async () => {
  const list = [];
  const querySnapshot = await getDocs(collection(db, 'banks'));
  querySnapshot.forEach((item) => {
    list.push(item.data());
  });
  const { data } = list[0];
  return data;
};

const getCities = async () => {
  const list = [];
  const querySnapshot = await getDocs(collection(db, 'cities'));
  querySnapshot.forEach((item) => {
    list.push(item.data());
  });
  const { data } = list[0];
  return data;
};

const getBrokerages = async (bank, city) => {
  const docRef = doc(db, 'brokerages', bank);
  const docSnap = await getDoc(docRef);
  const list = docSnap.data().data;
  const output = list.filter((item) => {
    const dbCity = item.address.slice(0, 3);
    return dbCity === city;
  });
  return output;
};

const getUnReadResponse = async (uuids) => {
  const posts = [];
  await Promise.all(uuids.map(async (uuid) => {
    const docRef = doc(db, 'responsePosts', uuid);
    const docSnap = await getDoc(docRef);
    const { data } = docSnap.data();
    const output = data.find((item) => item.isRead === false);
    if (output) {
      posts.push(output);
    }
  }));
  return posts;
};

const getUserUnReadResponses = (myEmail) => new Promise((resolve) => {
  const q = query(collection(db, 'stockPosts'), where('author', '==', myEmail));
  onSnapshot(q, async (querySnapshot) => {
    const uuids = [];
    querySnapshot.forEach((item) => {
      uuids.push(item.data().uuid);
    });
    const res = await getUnReadResponse(uuids);
    resolve(res);
  });
});

const updateRead = async (uuid) => {
  const docRef = doc(db, 'responsePosts', uuid);
  const docSnap = await getDoc(docRef);
  const newData = docSnap.data().data;
  const output = newData.map((item) => ({ ...item, isRead: true }));
  setDoc(docRef, {
    data: output,
  });
};

export {
  signIn,
  googleSignIn,
  register,
  getCategoryList,
  updateCategoryPrices,
  checkNewPrices,
  getNewCategoryPrice,
  compareStockId2,
  addStockName,
  getTrack,
  addTrackStock,
  removeTrackStock,
  getAllPosts,
  getOriPost,
  getStockPosts,
  addStockPosts,
  addHeart,
  getResponsePosts,
  addResponsePost,
  addBrokerages,
  getBanks,
  getCities,
  getBrokerages,
  getOpenDate,
  getUserUnReadResponses,
  updateRead,
};

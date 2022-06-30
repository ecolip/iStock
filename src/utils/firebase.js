import { initializeApp } from 'firebase/app';
import {
  getAuth, signInWithPopup, GoogleAuthProvider,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore, collection, query, setDoc, doc, getDoc, updateDoc, where, getDocs,
} from 'firebase/firestore';
import firebaseConfig from '../firebaseConfig';

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
      setDoc(doc(db, 'userTrackStocks', email), { track: [] });
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

const getTrackStock = async () => {
  const user = window.localStorage.getItem('user');
  const { email } = JSON.parse(user);
  const docRef = doc(db, 'userTrackStocks', email);
  const docSnap = await getDoc(docRef);
  return docSnap.data().track;
};

const addTrackStock = async (id) => {
  const user = window.localStorage.getItem('user');
  const { email } = JSON.parse(user);
  const docRef = doc(db, 'userTrackStocks', email);
  const initTrack = await getTrackStock();
  const newTrack = [...initTrack, id];
  updateDoc(docRef, {
    track: newTrack,
  });
  return true;
};

const removeTrackStock = async (id) => {
  const user = window.localStorage.getItem('user');
  const { email } = JSON.parse(user);
  const docRef = doc(db, 'userTrackStocks', email);
  const initTrack = await getTrackStock();
  const newTrack = [...initTrack];
  const index = initTrack.indexOf(id);
  newTrack.splice(index, 1);
  updateDoc(docRef, {
    track: newTrack,
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
  result.sort((a, b) => b.timestamp - a.timestamp);
  return result;
};

const addResponsePost = async (uuid, context, chat) => {
  const user = window.localStorage.getItem('user');
  const { email } = JSON.parse(user);
  const time = Date.now() / 1000;
  const timestamp = parseInt(time, 10);
  const docRef = doc(db, 'responsePosts', uuid);
  const docSnap = await getDoc(docRef);
  const { data } = docSnap.data();
  const newItem = {
    author: email,
    context,
    timestamp,
  };
  const newData = [...data, newItem];
  updateDoc(docRef, {
    data: newData,
  });
  addChat(uuid, chat);
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

export {
  signIn,
  googleSignIn,
  register,
  getCategoryList,
  updateCategoryPrices,
  checkNewPrices,
  getNewCategoryPrice,
  getTrackStock,
  addTrackStock,
  removeTrackStock,
  getAllPosts,
  getStockPosts,
  addStockPosts,
  addHeart,
  getResponsePosts,
  addResponsePost,
  addBrokerages,
  getBanks,
  getCities,
  getBrokerages,
};

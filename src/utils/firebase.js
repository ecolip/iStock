import { initializeApp } from 'firebase/app';
import {
  getAuth, signInWithPopup, GoogleAuthProvider,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore, collection, query, onSnapshot, setDoc, doc, getDoc, updateDoc,
} from 'firebase/firestore';
import firebaseConfig from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

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
    });
});

const register = (email, password) => new Promise((resolve) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const { user } = userCredential;
      resolve(user);
    });
});

const signIn = (email, password) => new Promise((resolve, reject) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const { user } = userCredential;
      // console.log(user);
      resolve(user);
    }).catch((error) => {
      // console.log(error);
      reject(error.code);
      // const errorCode = error.code;
      // const errorMessage = error.message;
    });
});

const getCategoryList = () => new Promise((resolve) => {
  const q = query(collection(db, 'indexList'));
  onSnapshot(q, (querySnapshot) => {
    const list = [];
    querySnapshot.forEach((item) => {
      list.push(item.data());
    });
    resolve(list);
  });
});

const getNewCategoryPrice = () => new Promise((resolve) => {
  const q = query(collection(db, 'categoryPrices'));
  onSnapshot(q, (querySnapshot) => {
    const list = [];
    querySnapshot.forEach((item) => {
      list.push(item.data());
    });
    resolve(list);
  });
});

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
};

export {
  googleSignIn,
  register,
  signIn,
  getCategoryList,
  updateCategoryPrices,
  checkNewPrices,
  getNewCategoryPrice,
  getTrackStock,
  addTrackStock,
  removeTrackStock,
};

import { initializeApp } from 'firebase/app';
import {
  getAuth, signInWithPopup, GoogleAuthProvider,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
} from 'firebase/auth';
import firebaseConfig from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
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
      console.log(user);
      resolve(user);
    }).catch((error) => {
      console.log(error);
      reject(error.code);
      // const errorCode = error.code;
      // const errorMessage = error.message;
    });
});

export { googleSignIn, register, signIn };

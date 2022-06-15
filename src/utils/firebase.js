import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const firebaseGoogleSignIn = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      window.localStorage.setItem('firToken', token);
      console.log(token);
      return token;
      // The signed-in user info.
      // const { user } = result;
    // ...
    });
};

export default firebaseGoogleSignIn;

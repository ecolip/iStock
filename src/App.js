import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import Home from './pages/home';
import Post from './pages/post';
import Track from './pages/track';
import Login from './pages/login';
import Profile from './pages/profile';
import Category from './pages/category';
import Location from './pages/location';
import Individual from './pages/individual';
import NotFound from './pages/NotFound';
import Dialog from './components/Dialog';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Navigate to="/login" replace />} />
          <Route exact path="login" element={<Login />} />
          <Route exact path="home" element={<Home />} />
          <Route exact path="profile" element={<Profile />} />
          <Route exact path="individual" element={<Individual />} />
          <Route exact path="category" element={<Category />} />
          <Route exact path="location" element={<Location />} />
          <Route exact path="post" element={<Post />}>
            <Route path="response/:postId" element={<Dialog />} />
          </Route>
          <Route exact path="track" element={<Track />} />
          <Route exact path="*" element={<NotFound />} />
          {/* <Route exact path="*" element={<Navigate to="/login" />} /> */}
          {/* 直接導回首頁做法 */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

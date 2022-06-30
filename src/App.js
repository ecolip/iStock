import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Post from './pages/post';
import Track from './pages/track';
import Login from './pages/login';
import Profile from './pages/profile';
import Category from './pages/category';
import Location from './pages/location';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="home" element={<Home />} />
          <Route exact path="profile" element={<Profile />} />
          <Route exact path="category" element={<Category />} />
          <Route exact path="location" element={<Location />} />
          <Route exact path="post" element={<Post />} />
          <Route exact path="track" element={<Track />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

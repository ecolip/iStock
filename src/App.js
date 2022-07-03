import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Post from './pages/post';
import Track from './pages/track';
import Login from './pages/login';
import Profile from './pages/profile';
import Category from './pages/category';
import Location from './pages/location';
import Individual from './pages/individual';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="home" element={<Home />} />
          <Route exact path="profile" element={<Profile />} />
          <Route exact path="individual" element={<Individual />} />
          <Route exact path="category" element={<Category />} />
          <Route exact path="location" element={<Location />} />
          <Route exact path="post" element={<Post />} />
          <Route exact path="track" element={<Track />} />
          <Route exact path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

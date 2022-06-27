import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import Category from './pages/category';
import Post from './pages/post';
import Track from './pages/track';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="home" element={<Home />} />
          <Route exact path="category" element={<Category />} />
          <Route exact path="post" element={<Post />} />
          <Route exact path="track" element={<Track />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

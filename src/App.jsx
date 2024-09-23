import './App.css';
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {useState, useEffect} from "react"
import {Login} from "./pages/Login/Login"
import {SignUp} from "./pages/SignUp/SignUp"
import {Home} from "./pages/Home/Home"
import ProtectedRoute from './components/ProtectedRoute';
import { PostDetail } from './pages/PostDetail/PostDetail';
import { ResetPassword } from './pages/ResetPassword/ResetPassword';
import { CreatePost } from './pages/Studio/CreatePost';
import { UserProfile } from './pages/User/UserProfile';
import { ViewPost } from './pages/PostDetail/ViewPost';
import { LiveWatch } from './pages/LiveWatch/LiveWatch';

function App() {
  return (
    <div className='app'>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
        <Route path="/studio/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/user/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/posts/:postId" element={<ViewPost />} />
        <Route path="/live/:postId" element={<LiveWatch />} />
        <Route path="/auth/login" element={<Login />}/>
        <Route path="/auth/signup" element={<SignUp />}/>
        <Route path="/auth/password-reset" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
import './App.css';
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import PrivateLayot from './layouts/PrivateLayot';
import PublicLayout from './layouts/PublicLayout'
import AuthLayout from './layouts/AuthLayout'
import Homepage from './pages/Homepage'
import Private from './pages/PrivatePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { Provider } from 'react-redux';
import store from './state/store';
import LogoutPage from './pages/LogoutPage';
import ResetPage from './pages/ResetPage';
import ResetConfirmPage from './pages/ResetConfirmPage';
import ProfilePage from './pages/ProfilePage';
import ConfirmEmail from './pages/ConfirmEmail';
import ChangePasswordPage from './pages/ChangePasswordPage';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicLayout/>}>
              <Route index element={<Homepage/>}/>
              <Route path="/confirm/:id/:token/" element={<ConfirmEmail/>}/>
            </Route>
            <Route path="/private/" element={<PrivateLayot/>}>
              <Route index element={<Private/>}/>
              <Route path="profile/" element={<ProfilePage/>}/>
              <Route path="profile/change_password" element={<ChangePasswordPage/>}/>
            </Route>
            <Route path="/" element={<AuthLayout/>}>
              <Route path="/register/" element={<RegisterPage/>}/>
              <Route path="/login/" element={<LoginPage/>}/>
              <Route path="/reset/" element={<ResetPage/>}/>
              <Route path="/reset/:id/:token/" element={<ResetConfirmPage/>}/>
            </Route>
            <Route path="/logout/" element={<LogoutPage/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;

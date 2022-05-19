import './App.css';
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import PrivateLayot from './layouts/PrivateLayot';
import PublicLayout from './layouts/PublicLayout'
import Homepage from './pages/Homepage'
import Private from './pages/PrivatePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { Provider } from 'react-redux';
import store from './state/store';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicLayout/>}>
              <Route index element={<Homepage/>}/>
              <Route path="/register/" element={<RegisterPage/>}/>
              <Route path="/login/" element={<LoginPage/>}/>
            </Route>
            <Route path="/private/" element={<PrivateLayot/>}>
              <Route index element={<Private/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;

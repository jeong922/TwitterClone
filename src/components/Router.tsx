import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Profile from 'routes/Profile';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Navigation from './Navigation';

function Router({ isLoggendIn }: any) {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      {isLoggendIn && <Navigation />}
      <Routes>
        {isLoggendIn ? (
          <>
            <Route path="/" element={<Home />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
          </>
        ) : (
          <Route path="/" element={<Auth />}></Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default Router;

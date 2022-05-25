import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Profile from 'routes/Profile';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Navigation from './Navigation';

function Router({ refreshUser, isLoggendIn, userObj }: any) {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      {isLoggendIn && <Navigation userObj={userObj} />}
      <Routes>
        {isLoggendIn ? (
          <>
            <Route path="/" element={<Home userObj={userObj} />}></Route>
            <Route
              path="/profile"
              element={<Profile userObj={userObj} refreshUser={refreshUser} />}
            ></Route>
          </>
        ) : (
          <Route path="/" element={<Auth />}></Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default Router;

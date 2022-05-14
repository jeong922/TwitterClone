import React, { useEffect, useState } from 'react';
import Router from 'components/Router';
import { auth } from 'fBase';

// https://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_user
function App() {
  const [init, setInit] = useState(false);
  const [isLoggendIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((user: any) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? (
        <Router isLoggendIn={isLoggendIn} userObj={userObj} />
      ) : (
        'Initializing...'
      )}
      {/* <footer>&copy; {new Date().getFullYear()} Nwitter</footer> */}
    </>
  );
}

export default App;

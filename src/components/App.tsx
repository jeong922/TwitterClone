import React, { useEffect, useState } from 'react';
import Router from 'components/Router';
import { auth } from 'fBase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';

// https://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_user
function App() {
  const [init, setInit] = useState(false);
  const [isLoggendIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState<any | null>(null);
  const [newName, setNewName] = useState('');
  useEffect(() => {
    onAuthStateChanged(auth, (user: any) => {
      if (user) {
        // 소셜 로그인이 아닌 이메일로 가입했을 경우 오류 발생
        // user.displayName === null 이면 updateProfile를 통해 displayName: 'User'로 지정
        if (user.displayName === null) {
          updateProfile(user, {
            displayName: 'User',
          });
        }
        setIsLoggedIn(true);
        // setUserObj({
        //   displayName: user.displayName,
        //   uid: user.uid,
        // updateProfile: (args: any) => {
        //   updateProfile(user, args);
        // },
        //   updateProfile: (args: any) =>
        //     updateProfile(user, { displayName: user.displayName }),
        // });
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
    console.log(userObj);
  }, []);
  const refreshUser = () => {
    const user: any = auth.currentUser;
    // setUserObj({
    //   displayName: user.displayName,
    //   uid: user.uid,
    //   updateProfile: (args: any) =>
    //     updateProfile(user, { displayName: user.displayName }),
    // updateProfile: (args: any) => {
    //   updateProfile(user, args);
    // },
    // });
    // setUserObj(Object.assign({}, user));
    setNewName(userObj.displayName);
    // 뭔가 동작이 이상함..
  };
  return (
    <>
      {init ? (
        <Router
          refreshUser={refreshUser}
          isLoggendIn={isLoggendIn}
          userObj={userObj}
          newName={newName}
        />
      ) : (
        'Initializing...'
      )}
      {/* <footer>&copy; {new Date().getFullYear()} Nwitter</footer> */}
    </>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import Router from 'components/Router';
import { auth } from 'fBase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';

// https://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_user
function App() {
  const [init, setInit] = useState(false);
  const [isLoggendIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState<any | null>(null);
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
        //   updateProfile: (args: any) => {
        //     updateProfile(user, args);
        //   },
        // updateProfile: (args: any) =>
        //   updateProfile(user, { displayName: user.displayName }),
        // });
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user: any = auth.currentUser;
    // setUserObj({
    //   displayName: user.displayName,
    //   uid: user.uid,
    //   updateProfile: (args: any) => {
    //     updateProfile(user, args);
    //   },
    // });
    // setUserObj(Object.assign({}, user));
    setUserObj({ ...user });
    // setNewName(user.displayName);
    // 뭔가 동작이 이상함..
    // 이렇게 하면 한번 이름을 바꾼 후 새로고침을 하지 않는 이상 이름을 다시 변경 할 수 없음
  };
  // 왜 인지 모르겠지만 Uncaught (in promise) TypeError: userInternal.getIdToken is not a function 오류 발생하는 경우가 있어서 코드 수정함
  return (
    <>
      {init ? (
        <Router
          refreshUser={refreshUser}
          isLoggendIn={isLoggendIn}
          userObj={userObj}
          // newName={newName}
        />
      ) : (
        <span>Initializing...</span>
      )}
      {/* <footer>&copy; {new Date().getFullYear()} Nwitter</footer> */}
    </>
  );
}

export default App;

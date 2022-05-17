import { auth, dbService } from 'fBase';
import { updateProfile } from 'firebase/auth';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// https://firebase.google.com/docs/auth/web/manage-users#update_a_users_profile

function Profile({ refreshUser, userObj, newName }: any) {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    auth.signOut();
    navigate('/');
  };
  // const getMyNweets = async () => {
  //   const q = query(
  //     collection(dbService, 'nweets'),
  //     where('creatorId', '==', userObj.uid),
  //     orderBy('createdAt')
  //   );
  //   await getDocs(q);
  // };
  // useEffect(() => {
  //   getMyNweets();
  // }, []);
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user: any = auth.currentUser;
    if (userObj.displayName !== newName) {
      await updateProfile(userObj, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
    // if (newName !== userObj.displayName) {
    //   await updateProfile(userObj, { displayName: newName });
    //   refreshUser();
    // }
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="변경할 이름을 입력하세요."
          value={newDisplayName}
        />
        <input type="submit" value="프로필 업데이트" />
      </form>
      <button onClick={onLogOutClick}>로그아웃</button>
    </>
  );
}

export default Profile;

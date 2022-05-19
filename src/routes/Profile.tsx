import { auth } from 'fBase';
import { updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// https://firebase.google.com/docs/auth/web/manage-users#update_a_users_profile

const Wrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 10px;
`;

const Container = styled.div`
  width: 100%;
`;

const Editing = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const EditingText = styled.input`
  border: 1px solid ${(props) => props.theme.light.borderColor};
  padding: 10px;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const EditingBtn = styled.input`
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.light.fontColor};
  color: ${(props) => props.theme.dark.fontColor};
  border: 1px solid ${(props) => props.theme.light.borderColor};
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    border: 1px solid ${(props) => props.theme.light.borderColor};
    background-color: ${(props) => props.theme.dark.fontColor};
    color: ${(props) => props.theme.light.fontColor};
  }
`;

const LogOut = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 50px;
  button {
    padding: 10px 20px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.light.fontColor};
    color: ${(props) => props.theme.dark.fontColor};
    cursor: pointer;
    &:hover {
      border: 1px solid ${(props) => props.theme.light.borderColor};
      background-color: ${(props) => props.theme.dark.fontColor};
      color: ${(props) => props.theme.light.fontColor};
    }
  }
`;

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
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(user, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  return (
    <Wrapper>
      <Container>
        <Editing onSubmit={onSubmit}>
          <EditingText
            onChange={onChange}
            type="text"
            placeholder="변경할 이름을 입력하세요."
            value={newDisplayName}
          />
          <EditingBtn type="submit" value="프로필 업데이트" />
        </Editing>
        <LogOut>
          <button onClick={onLogOutClick}>로그아웃</button>
        </LogOut>
      </Container>
    </Wrapper>
  );
}

export default Profile;

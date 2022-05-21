import { auth, storageService } from 'fBase';
import { updateProfile } from 'firebase/auth';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from 'firebase/storage';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

// https://firebase.google.com/docs/auth/web/manage-users#update_a_users_profile

const Wrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 10px;
`;

const Container = styled.div`
  width: 100%;
`;

const EditingName = styled.form`
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

const EditingImage = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
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

const FileSelector = styled.div`
  label {
    display: inline-block;
    color: ${(props) => props.theme.light.fontColor};
    border: 1px solid ${(props) => props.theme.dark.borderColor};
    padding: 5px 8px;
    border-radius: 5px;
    margin-bottom: 10px;
    cursor: pointer;
    &:hover {
      border: 1px solid ${(props) => props.theme.light.fontColor};
    }
  }
  input {
    display: none;
  }
`;

const ProfileImage = styled.div`
  margin: 20px auto;
  max-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  svg {
    height: 80px;
    width: 80px;
    transform: translate(5px);
    fill: rgba(0, 0, 0, 0.6);
  }
  div {
    img {
      max-height: 100px;
    }
  }
  button {
    margin-top: 10px;
    padding: 5px 8px;
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

function Profile({ refreshUser, userObj }: any) {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState('');
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
  const onNameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user: any = auth.currentUser;
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(user, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  const onImageSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user: any = auth.currentUser;
    let profileURL = '';
    if (profileImage !== '') {
      const profileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const uploadFile = await uploadString(
        profileRef,
        profileImage,
        'data_url'
      );
      profileURL = await getDownloadURL(uploadFile.ref);
      await updateProfile(user, {
        photoURL: profileURL,
      });
      refreshUser();
    }
    if (user.photoURL !== userObj.photoURL) {
      const delProfileRef = ref(storageService, userObj.photoURL);
      await deleteObject(delProfileRef);
    }
    setProfileImage('');
  };

  const onImageChange = (event: any) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent: any) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setProfileImage(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearFileClick = () => {
    setProfileImage('');
  };
  console.log(userObj);

  return (
    <Wrapper>
      <Container>
        <EditingName onSubmit={onNameSubmit}>
          <EditingText
            onChange={onChange}
            type="text"
            placeholder="변경할 이름을 입력하세요."
            value={newDisplayName}
          />
          <EditingBtn type="submit" value="이름 업데이트" />
        </EditingName>

        <EditingImage onSubmit={onImageSubmit}>
          <FileSelector>
            <label htmlFor="file">이미지 선택</label>
            <input
              type="file"
              id="file"
              accept="image/*"
              onChange={onImageChange}
            />
          </FileSelector>

          {profileImage ? (
            <ProfileImage>
              <div>
                <img src={profileImage} />
              </div>
              <button onClick={onClearFileClick}>이미지 선택 취소</button>
            </ProfileImage>
          ) : userObj.photoURL ? (
            <ProfileImage>
              <div>
                <img src={userObj.photoURL} />
              </div>
            </ProfileImage>
          ) : (
            <ProfileImage>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z" />
              </svg>
            </ProfileImage>
          )}
          <EditingBtn type="submit" value="이미지 업데이트" />
        </EditingImage>
        <LogOut>
          <button onClick={onLogOutClick}>로그아웃</button>
        </LogOut>
      </Container>
    </Wrapper>
  );
}

export default Profile;

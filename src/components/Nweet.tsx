import { auth, dbService, storageService } from 'fBase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  updateDoc,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from 'firebase/storage';
import { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

// https://firebase.google.com/docs/firestore/manage-data/delete-data
// https://firebase.google.com/docs/firestore/manage-data/add-data#update-data

const Wrapper = styled.div``;

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

const EditingBtn = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  input {
    width: 160px;
    padding: 10px 20px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.light.fontColor};
    color: ${(props) => props.theme.dark.fontColor};
    border: 1px solid ${(props) => props.theme.light.borderColor};
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.dark.fontColor};
      color: ${(props) => props.theme.light.fontColor};
    }
  }
  button {
    padding: 10px 20px;
    width: 160px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.light.fontColor};
    color: ${(props) => props.theme.dark.fontColor};
    border: 1px solid ${(props) => props.theme.light.borderColor};
    cursor: pointer;
    &:hover {
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

const NweetContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  border: 1px solid #cacccd;
  border-radius: 5px;
  padding: 10px 5px;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  div {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.3);
    img {
      background-position: cover;
      background-repeat: no-repeat;
      background-size: cover;
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }
  }
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px 0px;
  img {
    max-height: 200px;
    max-width: 200px;
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

const NweetText = styled.span`
  margin-bottom: 10px;
  padding: 5px 10px;
`;

// interface INweet {
//   nweetObj: {
//     text: string;
//     createdAt: number;
//     creatorId: string; // 유저 아이디
//     userName: string;
//     userImage: string;
//     fileURL: string;
//   };
//   userObj: any;
//   isOwner: boolean;
// }

function Nweet({ nweetObj, isOwner, userObj }: any) {
  const [editing, setEditing] = useState(false); // 수정 모드인지 아닌지
  const [newNweet, setNewNweet] = useState(nweetObj.text); // input text 업데이트
  const [file, setFile] = useState('');
  const nweetText = doc(dbService, 'nweets', `${nweetObj.id}`);
  const nweetUser = nweetObj.userName;
  const nweetUserProfile = nweetObj.userImage;

  const onDeleteClick = async () => {
    const ok = window.confirm('정말 삭제하겠습니까?');
    //console.log(ok);
    if (ok) {
      // nweet 삭제
      await deleteDoc(nweetText);
      if (nweetObj.fileURL !== '') {
        await deleteObject(ref(storageService, nweetObj.fileURL));
      }
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const selectNewImage = async () => {
    let fileURL = '';
    if (file !== '') {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const uploadFile = await uploadString(fileRef, file, 'data_url');
      fileURL = await getDownloadURL(uploadFile.ref);
    }
    setFile('');
  };

  const onUpdateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updateDoc(nweetText, {
      text: newNweet,
    });
    // if (file) {
    //   await updateDoc(nweetText, {
    //     fileURL: file,
    //   });
    //   selectNewImage();
    // }
    setEditing(false);
  };

  const onFileChange = (event: any) => {
    const {
      currentTarget: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent: any) => {
      console.log(finishedEvent);
      const {
        currentTarget: { result },
      } = finishedEvent;
      setFile(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setNewNweet(value);
  };

  const onClearFileClick = () => {
    setFile('');
  };

  return (
    <Wrapper>
      {editing ? (
        <>
          <Editing onSubmit={onUpdateSubmit}>
            <EditingText
              type="text"
              placeholder="수정수정"
              value={newNweet}
              required
              onChange={onChange}
            />
            {/* {file ? (
              <ImageWrapper>
                <img src={file} />
                <button onClick={onClearFileClick}>이미지 선택 취소</button>
              </ImageWrapper>
            ) : (
              <ImageWrapper>
                <img src={nweetObj.fileURL} />
              </ImageWrapper>
            )} */}
            {/* <FileSelector>
              <label htmlFor="image">이미지 선택</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={onFileChange}
              />
            </FileSelector> */}
            <EditingBtn>
              <input type="submit" value="업데이트" />
              <button onClick={toggleEditing}>취소</button>
            </EditingBtn>
          </Editing>
        </>
      ) : (
        <NweetContainer>
          {/* <ProfileWrapper>
            <div>
              <img src={nweetUserProfile} />
            </div>
            <span>{nweetUser}</span>
          </ProfileWrapper> */}

          {nweetObj.fileURL && (
            <ImageWrapper>
              <img src={nweetObj.fileURL} />
            </ImageWrapper>
          )}
          <NweetText>{nweetObj.text}</NweetText>

          {isOwner && (
            <EditingBtn>
              <button onClick={onDeleteClick}>삭제</button>
              <button onClick={toggleEditing}>수정</button>
            </EditingBtn>
          )}
        </NweetContainer>
      )}
    </Wrapper>
  );
}

export default Nweet;

import { dbService, storageService } from 'fBase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const NweetMaker = styled.form`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const NweetText = styled.input`
  padding: 10px;
  border: 1px solid ${(props) => props.theme.light.borderColor};
  border-radius: 5px;
  margin-bottom: 20px;
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

const SubmitNweet = styled.input`
  border: 1px solid ${(props) => props.theme.light.borderColor};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  background-color: ${(props) => props.theme.light.fontColor};
  color: ${(props) => props.theme.dark.fontColor};
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.dark.fontColor};
    color: ${(props) => props.theme.light.fontColor};
  }
`;

const FileContainer = styled.div`
  border: 1px solid ${(props) => props.theme.light.borderColor};
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 5px;
  button {
    border: 1px solid ${(props) => props.theme.light.borderColor};
    padding: 5px;
    border-radius: 5px;
    margin-bottom: 5px;
    background-color: ${(props) => props.theme.light.fontColor};
    color: ${(props) => props.theme.dark.fontColor};
    cursor: pointer;
    &:hover {
      border: 1px solid ${(props) => props.theme.light.borderColor};
    }
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  img {
    max-height: 200px;
  }
`;

function NweetFactory({ userObj }: any) {
  const [file, setFile] = useState('');
  const [nweet, setNweet] = useState('');
  const onSubmit = async (event: any) => {
    event.preventDefault();
    let fileURL = '';
    if (file !== '') {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const uploadFile = await uploadString(fileRef, file, 'data_url');
      fileURL = await getDownloadURL(uploadFile.ref);
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid, // 유저 아이디
      fileURL,
    };
    await addDoc(collection(dbService, 'nweets'), nweetObj);
    setNweet('');
    setFile('');
  };
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setNweet(value);
  };

  const onFileChange = (event: any) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent: any) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setFile(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearFileClick = () => {
    setFile('');
  };
  return (
    <NweetMaker onSubmit={onSubmit}>
      <NweetText
        value={nweet}
        onChange={onChange}
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
      />
      <FileSelector>
        <label htmlFor="file">파일 선택</label>
        <input type="file" id="file" accept="image/*" onChange={onFileChange} />
      </FileSelector>

      {file && (
        <FileContainer>
          <ImageWrapper>
            <img src={file} />
          </ImageWrapper>
          <button onClick={onClearFileClick}>이미지 삭제</button>
        </FileContainer>
      )}
      <SubmitNweet type="submit" value="Nweet" />
    </NweetMaker>
  );
}

export default NweetFactory;

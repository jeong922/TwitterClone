import { dbService, storageService } from 'fBase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';
import styled from 'styled-components';

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

const NweetContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  border: 1px solid #cacccd;
  border-radius: 5px;
  padding: 10px 5px;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0px;
  img {
    max-height: 200px;
    max-width: 200px;
  }
`;

const NweetText = styled.span`
  margin-bottom: 10px;
  padding: 5px;
`;

function Nweet({ nweetObj, isOwner }: any) {
  const [editing, setEditing] = useState(false); // 수정 모드인지 아닌지
  const [newNweet, setNewNweet] = useState(nweetObj.text); // input text 업데이트
  const nweetText = doc(dbService, 'nweets', `${nweetObj.id}`);
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
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //console.log(nweetObj, newNweet);
    await updateDoc(nweetText, {
      text: newNweet,
    });
    setEditing(false);
  };
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setNewNweet(value);
  };
  return (
    <Wrapper>
      {editing ? (
        <>
          <Editing onSubmit={onSubmit}>
            <EditingText
              type="text"
              placeholder="수정수정"
              value={newNweet}
              required
              onChange={onChange}
            />
            <EditingBtn>
              <input type="submit" value="업데이트" />
              <button onClick={toggleEditing}>취소</button>
            </EditingBtn>
          </Editing>
        </>
      ) : (
        <NweetContainer>
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

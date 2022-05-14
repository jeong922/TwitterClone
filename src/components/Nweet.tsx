import { dbService, storageService } from 'fBase';
import { deleteDoc, doc, DocumentData, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';

// https://firebase.google.com/docs/firestore/manage-data/delete-data
//https://firebase.google.com/docs/firestore/manage-data/add-data#update-data

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
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="수정수정"
              value={newNweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="업데이트" />
          </form>
          <button onClick={toggleEditing}>취소</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.fileURL && (
            <img src={nweetObj.fileURL} width="50px" height="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>삭제</button>
              <button onClick={toggleEditing}>수정</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Nweet;

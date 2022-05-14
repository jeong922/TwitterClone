import Nweet from 'components/Nweet';
import { dbService, storageService } from 'fBase';
import {
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from 'react';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from 'firebase/storage';

// https://developer.mozilla.org/ko/docs/Web/API/FileReader
// https://firebase.google.com/docs/storage/web/create-reference?hl=ko&authuser=0
// https://firebase.google.com/docs/storage/web/upload-files?hl=ko&authuser=0#upload_from_a_string
interface ISnapshotData {
  data: DocumentData;
  id: string;
  text: string;
  creatorId: string;
}

function Home({ userObj }: any) {
  //console.log(userObj);
  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState<ISnapshotData[]>([]);
  const [file, setFile] = useState(''); // 타입을 이렇게 줘도 되는지 모르겠다..

  useEffect(() => {
    const q = query(
      collection(dbService, 'nweets'),
      orderBy('createdAt', 'desc') // 내림차순 정렬
    );
    onSnapshot(q, (snapshot) => {
      const newArray = snapshot.docs.map((document: any) => ({
        id: document.id,
        ...document.data(),
      }));
      setNweets(newArray);
    });
  }, []);

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
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {file && (
          <div>
            <img src={file} width="50px" height="50px" />
            <button onClick={onClearFileClick}>이미지 삭제</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;

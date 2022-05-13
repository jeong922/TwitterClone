import Nweet from 'components/Nweet';
import { dbService } from 'fBase';
import {
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

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
    await addDoc(collection(dbService, 'nweets'), {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid, // 유저 아이디
    });
    setNweet('');
  };

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setNweet(value);
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
        <input onSubmit={onSubmit} type="submit" value="Nweet" />
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

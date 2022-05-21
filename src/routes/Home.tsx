import Nweet from 'components/Nweet';
import { dbService } from 'fBase';
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import React, { useEffect, useState } from 'react';
import NweetFactory from 'components/NweetFactory';
import styled from 'styled-components';

// https://developer.mozilla.org/ko/docs/Web/API/FileReader
// https://firebase.google.com/docs/storage/web/create-reference?hl=ko&authuser=0
// https://firebase.google.com/docs/storage/web/upload-files?hl=ko&authuser=0#upload_from_a_string
interface ISnapshotData {
  data: DocumentData;
  id: string;
  text: string;
  creatorId: string;
}

const Wrapper = styled.div`
  /* height: 100vh; */
  max-width: 480px;
  margin: 0 auto;
  padding: 10px;
`;

const NweetContainer = styled.div``;

function Home({ userObj }: any) {
  //console.log(userObj);
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

  return (
    <Wrapper>
      <NweetFactory userObj={userObj} />
      <NweetContainer>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            userObj={userObj}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </NweetContainer>
    </Wrapper>
  );
}

export default Home;

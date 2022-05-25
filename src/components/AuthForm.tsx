import { auth } from 'fBase';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useState } from 'react';
import styled from 'styled-components';

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  input {
    border: 1px solid ${(props) => props.theme.light.borderColor};
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 5px;
    width: 300px;

    &:last-child {
      cursor: pointer;
      background-color: ${(props) => props.theme.light.fontColor};
      color: ${(props) => props.theme.dark.fontColor};
      &:hover {
        background-color: ${(props) => props.theme.dark.fontColor};
        color: ${(props) => props.theme.light.fontColor};
      }
    }
  }
`;

const Error = styled.span`
  color: #c03535d1;
`;

const ToggleBtn = styled.span`
  font-size: 14px;
  margin: 20px 0px;
  color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  &:hover {
    color: rgba(0, 0, 0, 0.4);
  }
`;

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { name, value },
    } = event;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        // 계정 생성
        const auth = getAuth();
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // 로그인
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    } catch (error) {
      setError((error as Error).message);
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    <>
      <LoginForm onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="이메일"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? '계정 생성하기' : '로그인'} />
        {error && <Error>{error}</Error>}
      </LoginForm>
      <ToggleBtn onClick={toggleAccount}>
        {newAccount ? '로그인 페이지' : '계정 생성하기'}
      </ToggleBtn>
    </>
  );
}
export default AuthForm;

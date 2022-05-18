import { Link, useMatch } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  /* width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px; */
`;

const Nav = styled.nav`
  max-width: 480px;
  padding: 20px;
  margin: 0 auto;
  /* background-color: aliceblue; */
  ul {
    width: 100%;
    display: flex;
    li {
      position: relative;
      width: 50%;
      list-style: none;
      color: ${(props) => props.theme.light.fontColor};
      font-weight: 600;
      display: flex;
      justify-content: center;
      /* &:hover {
        color: #9bccf7;
      } */
      svg {
        height: 16px;
        /* &:hover {
          fill: #9bccf7;
        } */
      }
    }
  }
`;
const Bar = styled.span`
  position: absolute;
  width: 100%;
  height: 2px;
  border-radius: 2px;
  margin: 0 auto;
  bottom: -20px;
  left: 0;
  background-color: ${(props) => props.theme.light.fontColor};
`;

function Navigation({ userObj }: any) {
  const hoemMatch = useMatch('/');
  const profileMatch = useMatch('/profile');
  return (
    <Wrapper>
      <Nav>
        <ul>
          <li>
            <Link to="/">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path d="M575.8 255.5C575.8 273.5 560.8 287.6 543.8 287.6H511.8L512.5 447.7C512.5 450.5 512.3 453.1 512 455.8V472C512 494.1 494.1 512 472 512H456C454.9 512 453.8 511.1 452.7 511.9C451.3 511.1 449.9 512 448.5 512H392C369.9 512 352 494.1 352 472V384C352 366.3 337.7 352 320 352H256C238.3 352 224 366.3 224 384V472C224 494.1 206.1 512 184 512H128.1C126.6 512 125.1 511.9 123.6 511.8C122.4 511.9 121.2 512 120 512H104C81.91 512 64 494.1 64 472V360C64 359.1 64.03 358.1 64.09 357.2V287.6H32.05C14.02 287.6 0 273.5 0 255.5C0 246.5 3.004 238.5 10.01 231.5L266.4 8.016C273.4 1.002 281.4 0 288.4 0C295.4 0 303.4 2.004 309.5 7.014L564.8 231.5C572.8 238.5 576.9 246.5 575.8 255.5L575.8 255.5z" />
              </svg>
              {hoemMatch && <Bar />}
            </Link>
          </li>
          <li>
            <Link to="/profile">
              {userObj?.displayName ? userObj.displayName : 'User'}의 프로필
              {profileMatch && <Bar />}
            </Link>
          </li>
        </ul>
      </Nav>
    </Wrapper>
  );
}

export default Navigation;

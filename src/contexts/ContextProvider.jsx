import {createContext, useContext, useState} from "react";
import { useCookies } from 'react-cookie';

const StateContext = createContext({
    currentUser: null,
    token: null,
    notification: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {}
})

export const ContextProvider = ({children}) => {
  const [user, setUser] = useState({});
  const [cookies, setCookie, removeCookie] = useCookies(["ACCESS_TOKEN"]);
  // const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
  const [token, _setToken] = useState(cookies.ACCESS_TOKEN);
  // const [token2, _setToken2] = useState(sessionStorage.getItem('ACCESS_TOKEN2'));
  const [notification, _setNotification] = useState('');

  const setToken = (token) => {
    _setToken(token)
    if (token) {
      // localStorage.setItem('ACCESS_TOKEN', token);
      setCookie("ACCESS_TOKEN", token, {maxAge: 60 * 60 * 12 });
    } else {
      // localStorage.removeItem('ACCESS_TOKEN');
      removeCookie("ACCESS_TOKEN", { path: "/" });
    }
  }

  const setNotification = message => {
    _setNotification(message);

    setTimeout(() => {
      _setNotification('')
    }, 5000)
  }

  return (
    <StateContext.Provider value={{
      user,
      setUser,
      token,
      // token2,
      setToken,
      notification,
      setNotification
    }}>
      {children}
    </StateContext.Provider>
  );
}

export const useStateContext = () => useContext(StateContext)
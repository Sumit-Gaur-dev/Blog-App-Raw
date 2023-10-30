import { createContext, useState } from "react";
export const UserContexts = createContext({});

export const UserContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const values = { userInfo, setUserInfo };
  return (
    <UserContexts.Provider value={values}>{children};</UserContexts.Provider>
  );
};

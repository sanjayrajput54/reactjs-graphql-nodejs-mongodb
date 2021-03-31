import {Initialized} from './buildApolooClient';
import { useCookies } from "react-cookie";
const TOKEN_NAME = "authToken";
const USER_ID="userId";

// custom hook to handle authToken - we use compositon to decouple the auth system and it's storage
export const useAuthToken = () => {
  const [cookies, setCookie, removeCookie] = useCookies([TOKEN_NAME]);
  const setAuthToken = (authToken) => setCookie(TOKEN_NAME, authToken);
  const setUserId = (userId) => setCookie(USER_ID, userId);

  const removeAuthToken = () => removeCookie(TOKEN_NAME);
  return [cookies[TOKEN_NAME], setAuthToken, removeAuthToken,cookies[USER_ID],setUserId];
};
export const useLogout = () => {
  const [, , removeAuthToken] = useAuthToken();
  const app= Initialized();

  const logout = async () => {
     await app.clearStore(); // we remove all information in the store
    removeAuthToken();
  };
  return logout
};

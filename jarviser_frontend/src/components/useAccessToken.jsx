import { useState } from "react";

const ACCESS_TOKEN_KEY = "access-token";

function useAccessToken() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem(ACCESS_TOKEN_KEY) || ""
  );

  const saveAccessToken = (token) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    setAccessToken(token);
  };

  const clearAccessToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setAccessToken("");
  };

  return {
    accessToken,
    saveAccessToken,
    clearAccessToken,
  };
}

export default useAccessToken;

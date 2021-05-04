export const TOKEN_KEY = "&app-token";

export const login = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};
export const logout = () => {
  localStorage.clear();
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export function isAuth() {
  if (process.env.REACT_APP_API_TOKEN_KEY === undefined) {
    throw Error("auth env key not set");
  }

  let t = localStorage.getItem(process.env.REACT_APP_API_TOKEN_KEY);
  return t !== null && t.length !== 0;
}

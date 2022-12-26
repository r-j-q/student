// var token = 'Authorization'

export function getToken() {
	return localStorage.getItem("token");
}

export function setToken(token) {
	return localStorage.setItem("token", token);
}

export function removeToken() {
	return localStorage.removeItem("token");
}

/*获取指定名称的cookie值*/ 
export function getCookieValue(name) {
  let result = document.cookie.match(
    "(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)"
  );
  return result ? result.pop() : "";
}
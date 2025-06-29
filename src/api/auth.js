export async function login(email, password) {
  await wait(650); // simulation latency
  // retourne un faux user + un faux JWT
  return {
    token: 'ey.mock.jwt.token',
    user: {"name":"Jean Dupont","email":email,"avatarUrl":"https://i.pravatar.cc/300"},
  };
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

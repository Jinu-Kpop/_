let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = localStorage.getItem('currentUser');

function signup(username, password) {
  if (users[username]) {
    alert("Username exists! Try adding a number or word.");
    return;
  }
  users[username] = { password, achievements: [] };
  localStorage.setItem('users', JSON.stringify(users));
  alert("Account created!");
}

function login(username, password) {
  if (!users[username] || users[username].password !== password) {
    alert("Wrong username or password.");
    return;
  }
  currentUser = username;
  localStorage.setItem('currentUser', username);
  alert(`Welcome back ${username}!`);
}

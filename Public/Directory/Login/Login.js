const createAccount = document.querySelector("#CreateAccount");
const createPassword = document.querySelector("#PasswordCreate");
const createEmail = document.querySelector("#EmailCreate");
const createFullName = document.querySelector("#FullNameCreate");

const loginBtn = document.querySelector("#LoginBtn");
const loginPassword = document.querySelector("#PasswordLogin");
const loginEmail = document.querySelector("#EmailLogin");

createAccount.addEventListener("click", () => {
  let password = createPassword.value;
  let email = createEmail.value;
  let fullName = createFullName.value;

  let user = { fullName, email, password };
});

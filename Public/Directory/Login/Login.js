const createAccount = document.querySelector("#CreateAccount");
const createPassword = document.querySelector("#PasswordCreate");
const createEmail = document.querySelector("#EmailCreate");
const createFullName = document.querySelector("#FullNameCreate");

const loginBtn = document.querySelector("#LoginBtn");
const loginPassword = document.querySelector("#PasswordLogin");
const loginEmail = document.querySelector("#EmailLogin");

createAccount.addEventListener("click", () => {
  createAccount.setAttribute("disabled", true);
  let password = createPassword.value;
  let email = createEmail.value;
  let fullName = createFullName.value;

  let user = { fullName, email, password };
  axios
    .post("/createAccount", user)
    .then((res) => {
      if (res.data.code === 200 || res.data?.user?.id) {
        window.location.href = "/Public/Directory/Login/User.html";
      }
      console.log(res.data.message);
      createAccount.removeAttribute("disabled");
    })
    .catch((err) => {
      console.log("Something went wrong creating your account.");
      console.log(err);
      createAccount.removeAttribute("disabled");
    });
});

loginBtn.addEventListener("click", () => {
  loginBtn.setAttribute("disabled", true);
  email = loginEmail.value;
  password = loginPassword.value;

  user = { email, password };
  axios
    .post("/login", user)
    .then((res) => {
      if (res.data.code === 200 || res.data.id) {
        window.location.href = "/Public/Directory/Login/User.html";
        console.log(res.data.message);
        loginBtn.removeAttribute("disabled");
      } else {
        console.log(res.data.message);
        loginBtn.removeAttribute("disabled");
      }
    })
    .catch((err) => {
      console.log("Something went wrong logging into your account.");
      console.log(err);
      loginBtn.removeAttribute("disabled");
    });
});

axios
  .get("/server/session")
  .then((res) => {
    let fullName = res.data.user.fullName;
    let email = res.data.user.email;

    console.log(res.data);

    const sectionOne = document.getElementById("sectionOne");
    const sectionTwo = document.getElementById("sectionTwo");
    const nameElement = document.getElementById("name");

    nameElement.innerHTML = fullName;
  })
  .catch((err) => {
    console.log(err);
  });

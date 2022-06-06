const ageInputField = document.createElement("input");
const backgroundInputField = document.createElement("span");
const rankInputField = document.createElement("input");
const sectionOne = document.getElementById("sectionOne");
const sectionTwo = document.getElementById("sectionTwo");
const nameElement = document.getElementById("name");
const emailElement = document.getElementById("email");
const ageElement = document.getElementById("age");
const backgroundElement = document.getElementById("personalBackground");
const rankElement = document.getElementById("rank");
const submitBtnElement = document.createElement("button");
const updateBtnElement = document.createElement("button");
const createPostBtnElement = document.getElementById("createPostButton");

let fullname = "";
let rank = "";
let userid = "";

let postInCreation = false;
let commentOut = false;

submitBtnElement.id = "submitBtnElement";
submitBtnElement.innerHTML = "Submit";

backgroundInputField.setAttribute("contenteditable", true);
backgroundInputField.setAttribute("role", "textbox");
let submitBtn = false;

axios
  .get("/server/session")
  .then((res) => {
    if (res.data.hasOwnProperty("user") === false) {
      window.location.href = "/User";
    }
    fullname = res.data.user.fullName;
    rank = res.data.user.rank;
    userid = res.data.user.id;
    let fullName = res.data.user.fullName;
    let email = res.data.user.email;

    axios.put(`/stories/${userid}`).then((getRes) => {
      const storiesList = getRes.data;
      createPosts(storiesList);
    });

    if (res.data?.user.age) {
      if (res.data.user.age.trim().length !== 0) {
        let age = res.data.user.age;
        ageElement.innerHTML = age;
      } else {
        ageElement.remove();
      }
    } else {
      ageInputField.id = "ageInput";
      ageElement.style.visibility = "hidden";
      ageElement.appendChild(ageInputField);
      ageInputField.style.visibility = "visible";

      submitBtn = true;
    }

    if (res.data.user?.background) {
      if (
        res.data.user.background.trim().length !== 0 &&
        res.data.user.background !== "&nbsp;"
      ) {
        let background = res.data.user.background;
        backgroundElement.innerHTML = background;
      } else {
        backgroundElement.remove();
      }
    } else {
      backgroundInputField.id = "backgroundInput";
      backgroundElement.style.visibility = "hidden";
      backgroundElement.appendChild(backgroundInputField);
      backgroundInputField.style.visibility = "visible";
      submitBtn = true;
    }

    if (res.data.user?.rank) {
      if (res.data.user.rank.trim().length !== 0) {
        let rank = res.data.user.rank;
        rankElement.innerHTML = rank;
      } else {
        rankElement.remove();
      }
    } else {
      rankInputField.id = "rankInput";
      rankElement.style.visibility = "hidden";
      rankElement.appendChild(rankInputField);
      rankInputField.style.visibility = "visible";
      submitBtn = true;
    }

    if (submitBtn) {
      sectionTwo.appendChild(submitBtnElement);
    } else {
      sectionTwo.appendChild(updateBtnElement);
      updateBtnElement.innerHTML = "Update";
    }

    emailElement.innerHTML = email;
    nameElement.innerHTML = fullName;
  })
  .catch((err) => {
    console.log(err);
  });

submitBtnElement.addEventListener("click", () => {
  let addingUser = {};
  if (backgroundInputField.innerHTML !== "") {
    backgroundText = backgroundInputField.innerHTML;
    backgroundText = backgroundText.replaceAll("'", "''");
    addingUser.background = backgroundText;
  }
  if (ageInputField.value !== "") {
    addingUser.age = ageInputField.value;
  }
  if (rankInputField.value !== "") {
    addingUser.rank = rankInputField.value;
  }
  axios.post("/server/session/change", addingUser);
  axios.get("/server/session").then((res) => {});

  window.location.reload();
});

updateBtnElement.addEventListener("click", () => {
  const ageDiv = document.getElementById("ageDiv");
  const backgroundDiv = document.getElementById("backgroundDiv");
  const rankDiv = document.getElementById("rankDiv");

  ageDiv.appendChild(ageInputField);
  backgroundDiv.appendChild(backgroundInputField);
  rankDiv.appendChild(rankInputField);

  updateBtnElement.remove();
  sectionTwo.appendChild(submitBtnElement);
});

const createPosts = (posts) => {
  posts.forEach((element) => {
    const article = document.getElementById("posts");
    const post = document.createElement("post");
    const section = document.createElement("section");
    const div = document.createElement("div");
    const p = document.createElement("p");
    const h2 = document.createElement("h2");
    const dateH4 = document.createElement("h4");
    const heartButton = document.createElement("button");
    const heartNumber = document.createElement("h3");
    const commentsNumber = document.createElement("h3");
    const commentsButton = document.createElement("button");
    let { postid, message, userid, datetime, likes } = element;
    datetime = datetime.slice(0, 10);
    axios.put(`/users/${userid}`).then((userRes) => {
      let { fullname, rank } = userRes.data[0];
      axios.put(`/stories/comments/${postid}`).then((commentRes) => {
        heartButton.id = "HeartButton";
        commentsButton.id = "CommentsButton";

        commentsNumber.textContent = commentRes.data.length;
        commentsNumber.id = `Comment ${postid}`;

        heartNumber.textContent = likes;
        heartNumber.id = `Heart ${postid}`;

        heartButton.setAttribute(
          "onclick",
          `              
            axios.get("/server/session/").then((res) =>{
            heartPostAdd(${postid}, res.data.user.id);
            });
          `
        );

        post.id = postid;
        commentsButton.setAttribute(
          "onclick",
          `
          const post = document.getElementById("${postid}")
          const commentSection = document.querySelector("commentSection");
          if(commentOut === false){
                        getComments(${postid})
                    }else if(post.contains(commentSection)){ 
                    postInCreation = false;
                    commentOut = false;
                    commentSection.remove();
                    }
                    else{
                      postInCreation = false;
                    commentOut = false; 
                    commentSection.remove();
                    getComments(${postid})
                    }
          `
        );

        if (rank) {
          h2.textContent = `${rank} ${fullname}`;
        } else {
          h2.textContent = `${fullname}`;
        }
        dateH4.textContent = `${datetime}`;
        p.innerHTML = `${message}`;

        div.classList = "postButtons";

        const deleteBtn = document.createElement("button");
        deleteBtn.classList = "imageButtonPost";
        deleteBtn.id = "DeleteButton";
        deleteBtn.style.backgroundImage =
          "url(/public/images/Cancel-Button.png)";
        deleteBtn.setAttribute(
          "onclick",
          `
          if(confirm("Are you sure you want to delete this Story?")){
            axios.delete("/stories/delete/${postid}").then((res)=>{
            window.location.reload()
          })
          }
          

          `
        );

        post.appendChild(h2);
        post.appendChild(section);
        post.appendChild(div);
        article.appendChild(post);
        section.appendChild(p);
        section.appendChild(dateH4);
        div.appendChild(heartNumber);
        div.appendChild(heartButton);
        div.appendChild(commentsNumber);
        div.appendChild(commentsButton);
        div.appendChild(deleteBtn);
      });
    });
  });
};

const heartPostAdd = (postID, userID) => {
  axios.put(`/stories/hearts/${postID}_${userID}`).then((res) => {
    const heartElem = document.getElementById(`Heart ${postID}`);
    heartElem.textContent = res.data[0].likes;
  });
};

const getComments = (postID) => {
  const commentNum = document.getElementById(`Comment ${postID}`);

  const post = document.getElementById(postID);
  const commentSection = document.createElement("commentSection");

  commentOut = true;
  post.appendChild(commentSection);
  const createCommentButton = document.createElement("button");
  createCommentButton.innerText = "Create Comment";
  createCommentButton.classList = "normalButton";
  createCommentButton.id = "CreateCommentButton";
  createCommentButton.setAttribute(
    "onclick",
    `createCommentUi(fullname, rank, ${postID});`
  );
  commentSection.appendChild(createCommentButton);

  if (commentNum.textContent !== "0") {
    commentOut = true;
    post.appendChild(commentSection);
    axios.put(`/stories/comments/${postID}`).then((getRes) => {
      for (let i = 0; i < getRes.data.length; i++) {
        axios.put(`/users/${getRes.data[i].userid}`).then((res) => {
          createComment(
            res.data[0].fullname,
            res.data[0].rank,
            getRes.data[i].message,
            getRes.data[i].date,
            getRes.data[i].userid,
            getRes.data[i].commentid
          );
        });
      }
    });
  }
};

const createComment = (fullName, rank, message, date, userId, commentid) => {
  const comments = document.createElement("comments");

  const h4 = document.createElement("h4");
  const h6 = document.createElement("h6");
  const p = document.createElement("p");
  const commentSection = document.querySelector("commentSection");
  const deleteBtn = document.createElement("button");
  comments.appendChild(h4);
  comments.appendChild(p);
  if (userId === userid) {
    deleteBtn.classList = "imageButtonPost";
    deleteBtn.id = "DeleteButton";
    deleteBtn.style.backgroundImage = "url(/public/images/Cancel-Button.png)";
    deleteBtn.setAttribute(
      "onclick",
      `
          if(confirm("Are you sure you want to delete this Comment?")){
            axios.delete("/stories/comments/delete/${commentid}").then((res)=>{
            window.location.reload()
          })
          }
          

          `
    );
    comments.appendChild(deleteBtn);
  }
  h6.textContent = date;
  h4.textContent = `${rank} ${fullName}`;
  p.innerHTML = message;

  comments.appendChild(h6);

  commentSection.appendChild(comments);
};

const createCommentUi = (fullName, rank, postId) => {
  if (postInCreation === false) {
    const comments = document.createElement("comments");
    const prevCreateCommentButton = document.getElementById(
      "CreateCommentButton"
    );
    const h4 = document.createElement("h4");
    const span = document.createElement("span");
    const commentSection = document.querySelector("commentSection");
    const createCommentButton = document.createElement("button");

    prevCreateCommentButton.remove();

    h4.textContent = `${rank} ${fullName}`;

    span.setAttribute("contenteditable", true);
    span.setAttribute("role", "textbox");

    createCommentButton.innerText = "Create Comment";
    createCommentButton.classList = "normalButton";
    createCommentButton.id = "CreateCommentButton";

    comments.id = "commentCreation";
    comments.appendChild(h4);
    comments.appendChild(span);
    comments.appendChild(createCommentButton);

    comments.id = "commentsCreation";
    commentSection.prepend(comments);
    createCommentButton.setAttribute(
      "onclick",
      ` const createBtn = document.getElementById("CreateCommentButton");
        const message = document.querySelector("span");
       messageText = message.textContent;
       messageText = messageText.replaceAll("'","''");
      axios.get('/server/session').then((res) => {
      axios
        .post('/Stories/comment/creation', {
          userid: res.data.user.id,
          postid: ${postId},
          message: messageText,
        })
        .then((res) => {
          postInCreation = false;
          getComments(${postId});
        commentSection = document.querySelector("commentSection"); 
        commentSection.remove();
        });
    });`
    );

    postInCreation = true;
  }
};

const creatPostUi = (fullName, rank) => {
  if (postInCreation === false) {
    const article = document.getElementById("posts");
    const post = document.createElement("post");
    const section = document.createElement("section");
    const div = document.createElement("div");
    const span = document.createElement("span");
    const h2 = document.createElement("h2");
    const createBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");
    createBtn.innerText = "Create Post";
    createBtn.classList = "normalButton";
    createBtn.id = "CreateButton";
    createBtn.setAttribute(
      "onclick",
      `
      const createBtn = document.getElementById("CreateButton");
  const message = document.querySelector("span");
      axios.get('/server/session').then((res) => {
      axios
        .post('/Stories/creation', {
          userid: res.data.user.id,
          message: message.textContent,
        })
        .then((res) => {
          window.location.reload();
        });
    });
    `
    );

    deleteBtn.classList = "imageButtonPost";
    deleteBtn.id = "DeleteButton";
    deleteBtn.style.backgroundImage = "url(/public/images/Cancel-Button.png)";
    deleteBtn.setAttribute(
      "onclick",
      `
      const article = document.getElementById("posts");
      postInCreation = false;
      post = document.querySelector("post");
      post.remove(); 
      article.prepend(createPostBtnElement)

    `
    );

    span.setAttribute("contenteditable", true);
    span.setAttribute("role", "textbox");

    if (rank) {
      h2.textContent = `${rank} ${fullName}`;
    } else {
      h2.textContent = `${fullName}`;
    }

    article.prepend(post);
    post.appendChild(h2);
    post.appendChild(section);
    post.appendChild(div);
    section.appendChild(span);

    div.appendChild(createBtn);
    div.appendChild(deleteBtn);
    postInCreation = true;
  }
};

createPostButton.addEventListener("click", () => {
  axios.get("/server/session").then((res) => {
    creatPostUi(res.data.user.fullName, res.data.user.rank);
    createPostButton.remove();
  });
});

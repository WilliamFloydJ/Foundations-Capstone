const createPostButton = document.getElementById("CreatePost");
const filterButton = document.getElementById("FindUser");
const loginButton = document.getElementById("Login");
const menu = document.querySelector("menu");
const menuLogin = document.getElementById("menuLogin");
let postInCreation = false;
let commentOut = false;
let loggedIn = false;

let fullname = "";
let rank = "";
let userId = "";

const creatPostUi = (fullName, rank) => {
  if (postInCreation === false) {
    const article = document.querySelector("article");
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

    deleteBtn.classList = "imageButton";
    deleteBtn.id = "DeleteButton";
    deleteBtn.style.backgroundImage = "url(/public/images/Cancel-Button.png)";
    deleteBtn.setAttribute(
      "onclick",
      `
      postInCreation = false;
      post = document.querySelector("post");
      post.remove(); 
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

const createComment = (fullName, rank, message, date, postId) => {
  const comments = document.createElement("comments");

  const h4 = document.createElement("h4");
  const h6 = document.createElement("h6");
  const p = document.createElement("p");
  const commentSection = document.querySelector("commentSection");

  h6.textContent = date;
  h4.textContent = `${rank} ${fullName}`;
  p.innerHTML = message;

  comments.appendChild(h4);
  comments.appendChild(p);
  comments.appendChild(h6);

  commentSection.appendChild(comments);
};

createCommentUi = (fullName, rank, postId) => {
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

const getComments = (postID) => {
  const commentNum = document.getElementById(`Comment ${postID}`);

  const post = document.getElementById(postID);
  const commentSection = document.createElement("commentSection");

  if (loggedIn) {
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
  }

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
            postID
          );
        });
      }
    });
  }
};

const heartPostAdd = (postID, userID) => {
  axios.put(`/stories/hearts/${postID}_${userID}`).then((res) => {
    const heartElem = document.getElementById(`Heart ${postID}`);
    heartElem.textContent = res.data[0].likes;
  });
};

const createPosts = (posts) => {
  posts.forEach((element) => {
    const article = document.querySelector("article");
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
                    if(loggedIn){
                    axios.get("/server/session/").then((res) =>{
                    heartPostAdd(${postid}, res.data.user.id);
                    });
                    } else {
                    alert("Please Log-In Before Liking a Post")
                    }
                    `
        );

        post.id = postid;
        commentsButton.setAttribute(
          "onclick",
          `if(commentOut === false){
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
                    }`
        );

        if (rank) {
          h2.textContent = `${rank} ${fullname}`;
        } else {
          h2.textContent = `${fulldame}`;
        }
        dateH4.textContent = `${datetime}`;
        p.innerHTML = `${message}`;

        div.classList = "postButtons";

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
      });
    });
  });
};

axios.get("/stories/all").then((getRes) => {
  const storiesList = getRes.data;
  createPosts(storiesList);
});

createPostButton.addEventListener("click", () => {
  axios.get("/server/session").then((res) => {
    creatPostUi(res.data.user.fullName, res.data.user.rank);
  });
});

axios.get("/server/session").then((res) => {
  if (res.data.hasOwnProperty("user")) {
    menuLogin.remove();
    loggedIn = true;
    fullname = res.data.user.fullName;
    userId = res.data.user.id;
    if (res.data.user.rank) {
      rank = res.data.user.rank;
    }
  } else {
    menu.remove();
  }
});

const filterBy = (filter) => {
  const article = document.querySelector("article");
  while (article.firstChild) {
    article.removeChild(article.firstChild);
  }
  axios.put(`/stories/all/${filter}`).then((getRes) => {
    const storiesList = getRes.data;
    createPosts(storiesList);
  });
};

const showDrop = (elementId) => {
  const dropElement = document.getElementById(elementId);
  dropElement.classList.toggle("show");
};

window.onclick = function (event) {
  if (!event.target.matches(".dropButton") && !event.target.closest(".drop")) {
    const dropdowns = document.getElementsByClassName("drop");
    for (let i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

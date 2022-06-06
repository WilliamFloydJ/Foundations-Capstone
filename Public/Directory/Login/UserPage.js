const pageUrl = window.location.href;
const url = new URL(pageUrl);
const userId = url.searchParams.get("userId");
const userid = url.searchParams.get("userId");

const sectionOne = document.getElementById("sectionOne");
const sectionTwo = document.getElementById("sectionTwo");
const nameElement = document.getElementById("name");
const ageElement = document.getElementById("age");
const backgroundElement = document.getElementById("personalBackground");
const rankElement = document.getElementById("rank");

let commentOut = false;

axios.put(`/stories/${userId}`).then((getRes) => {
  const storiesList = getRes.data;
  createPosts(storiesList);
});

axios.get("/server/session").then((res) => {
  if (
    res.data.hasOwnProperty("user") &&
    res.data.user.id === parseInt(userId)
  ) {
    window.location.href = "/User";
  }
});

axios.put(`/users/${userId}`).then((res) => {
  const { fullname, age, rank, background } = res.data[0];
  nameElement.innerHTML = fullname;
  ageElement.innerHTML = age;
  rankElement.innerHTML = rank;
  backgroundElement.innerHTML = background;
  if (rank.trim().length === 0) {
    rankElement.remove();
  }
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
  comments.appendChild(h4);
  comments.appendChild(p);
  h6.textContent = date;
  h4.textContent = `${rank} ${fullName}`;
  p.innerHTML = message;

  comments.appendChild(h6);

  commentSection.appendChild(comments);
};

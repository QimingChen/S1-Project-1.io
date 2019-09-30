document.addEventListener("DOMContentLoaded", function(e) {
  e.preventDefault();

  // check user authorization status
  let tokenAvailable = checkTokenAvailable();
  console.log(`token availability: ${tokenAvailable}`);

  if (tokenAvailable) {
    // hide login form and err msg, match username text in top right button
    document.getElementById("form-to-login").style.display = "none";
    document.getElementById("logined-username").innerText = localStorage.getItem("username");
    document.getElementById("err-row").style.display = "none";
  } else {
    document.getElementById("form-logined").style.display = "none";
    document.getElementById("post-switcher").style.display = "none";
    document.getElementById("post-creation").style.display = "none";
    document.getElementById("posts-list").style.display = "none";
    document.getElementById("post-view").style.display = "none";
    document.getElementById("form-to-login").style.display = "block"; // show the login form
    document.getElementById("err-msg").style.display = "block"; // show the error msg
    return;
  }

  // set to default view
  switchToViewPosts();

  // add listeners
  document.getElementById("post-switcher-view-posts").addEventListener("click", switchToViewPosts);
  document.getElementById("post-switcher-create").addEventListener("click", switchToCreatePost);
  document.getElementById("post-submit").addEventListener("click", createPostOnClick);
  document.getElementById("comment-submit").addEventListener("click", createCommentOnClick);
  document.getElementById("post-delete").addEventListener("click", deletePostButtonOnClick);
  document.getElementById("log-out").addEventListener("click", function() {
    logOut();
    window.location.reload();
  });
});

/**
 * switch to single post view mode
 */
function switchToViewAPost() {
  document.getElementById("post-creation").style.display = "none";
  document.getElementById("posts-list").style.display = "none";
  document.getElementById("post-view").style.display = "block"; // enable only the single post mode
  // display post
  // receive post info from clicked event
  var divOnePostView = this.children;
  var title = divOnePostView[0].innerText; //h3#list-post-title
  var content = divOnePostView[1].innerText; //p#list-post-content
  let meta = divOnePostView[2].innerText; //p#list-post-meta
  // put in html
  document.getElementById("post-view-title").innerText = title;
  document.getElementById("post-view-content").innerText = content;
  document.getElementById("post-view-meta").innerText = meta;
  // display comment
  // clean comments first
  for (let i = 0; i < document.getElementById("post-view-comments").children.length; i++) {
    document.getElementById("post-view-comments").children[i].innerHTML = "";
  }
  // post id -> API get comment by post id
  let id = meta.split(" ")[2]; // post id: {id} ==> {id}
  let commentForId = getCommentByPostId(id).then(response => {
    console.log(response);
    response.sort(function(a, b) {
      if (a.id > b.id) {
        return 1;
      } else {
        return -1;
      }
    });
    // put comment into html
    let divComment = document.createElement("div");
    for (let i = 0; i < response.length; i++) {
      // withdraw data
      let dataI = response[i];
      let commentId = dataI.id;
      let comment = dataI.text;
      let author = dataI.user.username;
      console.log(comment);
      // put in html
      let newDiv = document.createElement("div");
      newDiv.setAttribute("id", "one-comment");
      let newComment = document.createElement("p");
      newComment.innerText = comment;
      newComment.setAttribute("id", "one-comment-content");
      let newMeta = document.createElement("p");
      newMeta.innerText = "comment id: " + commentId + " " + "by " + author;
      newMeta.setAttribute("id", "one-comment-meta");
      let newDeleteButton = document.createElement("button");
      newDeleteButton.setAttribute("id", "delete-comment");
      newDeleteButton.innerText = "DELETE";
      newDeleteButton.style.display = "none";
      newDeleteButton.addEventListener("click", deleteCommentButtonOnClick);
      newDiv.appendChild(newComment);
      newDiv.appendChild(newMeta);
      newDiv.appendChild(newDeleteButton);
      // add listener
      newDiv.addEventListener("mouseenter", function() {
        if (author === localStorage.getItem("username")) {
          newDiv.querySelector('button[id="delete-comment"]').style.display = "block";
        }
      });
      newDiv.addEventListener("mouseleave", function() {
        newDiv.querySelector('button[id="delete-comment"]').style.display = "none";
      });
      // append to DOM tree
      document.getElementById("post-view-comments").appendChild(newDiv);
    }
  });
}

/**
 * switch to view all posts mode
 */
async function switchToViewPosts() {
  document.getElementById("post-creation").style.display = "none";
  document.getElementById("post-view").style.display = "none";
  document.getElementById("posts-list").style.display = "block"; // enable display view all posts mode

  let userPosts = await listPostsQC().then(response => {
    response.sort(function(a, b) {
      if (a.id > b.id) {
        return 1;
      } else {
        return -1;
      }
    });
    displayUserPosts(response); // display posts from API
  });
}

/**
 * place user post data to html
 * @param {array} data [array of objs containing from all posts]
 */
function displayUserPosts(data) {
  let username = localStorage.getItem("username");
  let filteredData = data.filter(data => data.user.username === username); // filter by username

  // manipulate DOM
  let targetElement = document.getElementById("posts-list");
  targetElement.innerHTML = ""; // clean all existing posts
  for (let i = 0; i < filteredData.length; i++) {
    // withdraw target content
    let newItem = filteredData[i];
    let title = newItem.title;
    let content = newItem.description;
    let meta = newItem.id;
    // construct to html
    let newDiv = document.createElement("div");
    newDiv.setAttribute("id", "list-post");
    let newTitle = document.createElement("h3");
    newTitle.setAttribute("id", "list-post-title");
    newTitle.innerText = title;
    let newContent = document.createElement("p");
    newContent.setAttribute("id", "list-post-content");
    newContent.innerText = content;
    let newMeta = document.createElement("p");
    newMeta.setAttribute("id", "list-post-meta");
    newMeta.innerText = "post id: " + meta;
    newDiv.appendChild(newTitle);
    newDiv.appendChild(newContent);
    newDiv.appendChild(newMeta);
    // add to listener
    newDiv.addEventListener("click", switchToViewAPost);
    targetElement.appendChild(newDiv);
  }
}

/**
 * switch the page to be creation editor mode
 */
function switchToCreatePost() {
  // display creation editor
  document.getElementById("post-creation").style.display = "block";
  document.getElementById("posts-list").style.display = "none";
  document.getElementById("post-view").style.display = "none";
  // clean the textarea area if any
  document.getElementById("post-title").value = "";
  document.getElementById("post-content").value = "";
}

/**
 * reaction for create post button is clicked
 */
async function createPostOnClick() {
  try {
    // withdraw text from textarea box
    let title = document.querySelector("#post-title").value;
    let dscrpt = document.querySelector("#post-content").value;
    // create post to server
    let newPost = await createPost(title, dscrpt);
    var newTitle = newPost.title; //h3#list-post-title
    var newContent = newPost.description; //p#list-post-content
    let newMeta = newPost.id; //p#list-post-meta
    // switch mode to single post mode
    document.getElementById("post-creation").style.display = "none";
    document.getElementById("posts-list").style.display = "none";
    document.getElementById("post-view").style.display = "block";
    // display that post just created on single post mode
    document.getElementById("post-view-title").innerText = newTitle;
    document.getElementById("post-view-content").innerText = newContent;
    document.getElementById("post-view-meta").innerText = "post id: " + newMeta;
    // clean comments
    for (let i = 0; i < document.getElementById("post-view-comments").children.length; i++) {
      document.getElementById("post-view-comments").children[i].innerHTML = "";
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * reaction for clicking create comment button
 */
async function createCommentOnClick() {
  try {
    let meta = document.getElementById("post-view-meta").innerText;
    let postid = meta.split(" ")[2]; // post id: id ==> id
    let comment = document.querySelector("#comment-content").value;
    console.log(postid, comment);
    document.getElementById("comment-content").value = "";

    let commentId = 0;
    let author = "";
    await createComment(postid, comment).then(response => {
      console.log(response);
      commentId = response.id;
      author = response.user.username;
    });
    // put in html
    let newDiv = document.createElement("div");
    newDiv.setAttribute("id", "one-comment");
    let newComment = document.createElement("p");
    newComment.setAttribute("id", "one-comment-content");
    newComment.innerText = comment;
    let newMeta = document.createElement("p");
    newMeta.setAttribute("id", "one-comment-meta");
    newMeta.innerText = "comment id: " + commentId + " by " + author;
    let newBtn = document.createElement("button");
    newBtn.setAttribute("id", "delete-comment");
    newBtn.style.display = "block";
    newBtn.innerText = "DELETE";
    newBtn.addEventListener("click", deleteCommentButtonOnClick);
    newDiv.appendChild(newComment);
    newDiv.appendChild(newMeta);
    newDiv.appendChild(newBtn);
    document.getElementById("post-view-comments").appendChild(newDiv);
  } catch (err) {
    console.log(err);
  }
}

/**
 * reaction for clicking delete comment button
 * @param {event} e [mouse event for clicking delete comment button]
 */
async function deleteCommentButtonOnClick(e) {
  // console.log(e.target.parentNode);
  let parentDiv = e.target.parentNode; // the one-comment div
  let commentid = parentDiv.children[1].innerText.split(" ")[2];
  let status = await deleteCommentByCommentId(commentid);
  if (status.ok === true) {
    // api response confirmed the comment was deleted
    parentDiv.parentNode.removeChild(parentDiv);
  } else {
    alert("fail to delete comment");
  }
}

/**
 * delete post button interface (server doesn't support this function right now)
 */
function deletePostButtonOnClick() {
  alert("delete comment is not available for this moment");
}

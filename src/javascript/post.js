document.addEventListener("DOMContentLoaded", function(e) {
  e.preventDefault();
  let tokenAvailable = checkTokenAvailable();
  console.log(`token availability: ${tokenAvailable}`);
  if (tokenAvailable) {
    document.getElementById("form-to-login").style.display = "none";
    document.getElementById("logined-username").innerText = localStorage.getItem("username");
    document.getElementById("err-msg").style.display = "none";
  } else {
    document.getElementById("form-logined").style.display = "none";
    document.getElementById("post-switcher").style.display = "none";
    document.getElementById("post-creation").style.display = "none";
    document.getElementById("posts-list").style.display = "none";
    document.getElementById("post-view").style.display = "none";
    document.getElementById("err-msg").style.display = "block";
    return;
  }

  // set up default view
  switchToViewPosts();
  document.getElementById("post-creation").style.display = "none";
  document.getElementById("posts-list").style.display = "block";
  document.getElementById("post-view").style.display = "none";

  // add listeners
  document.getElementById("post-switcher-view-posts").addEventListener("click", switchToViewPosts);
  document.getElementById("post-switcher-create").addEventListener("click", switchToCreatePost);
  document.getElementById("post-submit").addEventListener("click", createPostOnClick);
  document.getElementById("comment-submit").addEventListener("click", createCommentOnClick);
  document.getElementById("post-delete").addEventListener("click", deletePostButtonOnClick);
  // add to every post
  // document.getElementById("list-post").addEventListener("click", switchToViewAPost);
});

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
function switchToViewAPost(data) {
  //stopPropogation
  // display post

  var divOnePostView = this.children;
  var title = divOnePostView[0].innerText; //h3#list-post-title
  var content = divOnePostView[1].innerText; //p#list-post-content
  let meta = divOnePostView[2].innerText; //p#list-post-meta

  document.getElementById("post-view-title").innerText = title;
  document.getElementById("post-view-content").innerText = content;
  document.getElementById("post-view-meta").innerText = meta;
  // display comment
  let id = meta.split(" ")[2]; // post id: {id} ==> {id}
  document.getElementById("post-view-comments").innerHTML = "";
  let divComment = document.createElement("div");
  let commentForId = getCommentByPostId(id).then(response => {
    console.log(response);
    response.sort(function(a, b) {
      if (a.id > b.id){
        return 1;
      }else{
        return -1;
      }
    })
    console.log(divComment);
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
      newDiv.addEventListener("mouseenter", function() {
        newDiv.querySelector('button[id="delete-comment"]').style.display = "block";
      });
      newDiv.addEventListener("mouseleave", function() {
        newDiv.querySelector('button[id="delete-comment"]').style.display = "none";
      });
      document.getElementById("post-view-comments").appendChild(newDiv);
    }
  });

  document.getElementById("post-creation").style.display = "none";
  document.getElementById("posts-list").style.display = "none";
  document.getElementById("post-view").style.display = "block";
}

async function switchToViewPosts() {
  let userPosts = await listPostsQC().then(response => {
    response.sort(function(a, b) {
      if (a.id > b.id){
        return 1;
      }else{
        return -1;
      }
    })
    displayUserPosts(response);
  });
  document.getElementById("post-creation").style.display = "none";
  document.getElementById("posts-list").style.display = "block";
  document.getElementById("post-view").style.display = "none";
}
function displayUserPosts(data) {
  let username = localStorage.getItem("username");
  console.log(username);
  console.log(data);
  let filteredData = data.filter(data => data.user.username === username);

  let targetElement = document.getElementById("posts-list");
  targetElement.innerHTML = "";
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

function switchToCreatePost() {
  document.getElementById("post-creation").style.display = "block";
  document.getElementById("posts-list").style.display = "none";
  document.getElementById("post-view").style.display = "none";
}

async function createPostOnClick() {
  try {
    let title = document.querySelector("#post-title").value;
    let dscrpt = document.querySelector("#post-content").value;
    console.log(title);
    console.log(dscrpt);
    let newPost = await createPost(title, dscrpt);
    console.log(newPost);
    // display post
    document.getElementById("post-creation").style.display = "none";
    document.getElementById("posts-list").style.display = "none";
    document.getElementById("post-view").style.display = "block";

    var newTitle = newPost.title; //h3#list-post-title
    var newContent = newPost.description; //p#list-post-content
    let newMeta = newPost.id; //p#list-post-meta

    document.getElementById("post-view-title").innerText = newTitle;
    document.getElementById("post-view-content").innerText = newContent;
    document.getElementById("post-view-meta").innerText = "post id: " + newMeta;
    console.log(document.getElementById("post-view-comments"));
    document.getElementById("post-view-comments").children[0].innerHTML = "";
  } catch (err) {
    console.log(err);
  }
}

async function deleteCommentButtonOnClick(e) {
  // console.log(e.target.parentNode);
  let parentDiv = e.target.parentNode;
  let commentid = parentDiv.children[1].innerText.split(" ")[2];
  console.log(commentid);
  let status = await deleteCommentByCommentId(commentid);
  if (status.ok === true) {
    parentDiv.parentNode.removeChild(parentDiv);
  } else {
    alert("fail to delete comment");
  }
}

function deletePostButtonOnClick() {
  alert("delete comment is not available for this moment");
}

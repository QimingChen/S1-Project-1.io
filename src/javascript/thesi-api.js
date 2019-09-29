/**
 * post request to server end to send data
 * @param  {string} url [address for request destination]
 * @param  {object} data [data body]
 * @param  {string} token [token for user auth]
 * @return {object} response.json() [object resolved from response]
 */
async function postData(url, data, token = "") {
  var myHeaders = {};
  myHeaders["Content-Type"] = "application/json";
  if (token !== "") {
    console.log("post Data: token is " + token);
    myHeaders["Authorization"] = token;
  }
  let response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: myHeaders,
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * get request to server end to retrieve data
 * @param  {string} url [address for request destination]
 * @param  {string} token [token for user auth]
 * @return {object} response.json() [object resolved from response]
 */
async function getData(url, token = "") {
  var myHeaders = {};
  myHeaders["Content-Type"] = "application/json";
  if (token !== "") {
    console.log("post Data: token is " + token);
    myHeaders["Authorization"] = token;
  }
  let response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: myHeaders,
  });
  return await response.json();
}

/**
 * delete request to server end to retrieve data
 * @param  {string} url [address for request destination]
 * @param  {string} token [token for user auth]
 * @return {object} response [object resolved from response]
 */
async function deleteData(url, token = "") {
  var myHeaders = {};
  // myHeaders["Content-Type"] = "application/json";
  myHeaders["Content-Type"] = "text/plain";
  if (token !== "") {
    console.log("delete Data: token is " + token);
    myHeaders["Authorization"] = token;
  }
  let response = await fetch(url, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    headers: myHeaders,
  }).then(response => {
    console.log("delete data response");
    console.log(response);
    return response;
  });
  return response;
}

/**
 * sign up functionality to post request with email, password, username, and receive token if succeeded
 * @param  {string} email [email for account]
 * @param  {string} pwd [password for account]
 * @param  {string} username [username for account]
 * @return {object} object [dictionary having token if signup succeeds]
 */
async function signUp(email, pwd, username) {
  if (email === undefined || typeof email !== "string" || email === "") {
    throw "Exception from signUp(): argument 'email' incorrect";
  }
  if (pwd === undefined || typeof pwd !== "string" || pwd === "") {
    throw "Exception from signUp(): argument 'pwd' incorrect";
  }
  if (username === undefined || typeof username !== "string" || username === "") {
    throw "Exception from signUp(): argument 'username' incorrect";
  }
  try {
    let url = "http://thesi.generalassemb.ly:8080/signup";
    let data = {
      email: email,
      password: pwd,
      username: username,
    };
    console.log(`signup request: url(${url}) data body (${JSON.stringify(data)})`);
    let response = await postData(url, data);
    console.log("signup response:" + JSON.stringify(response));
    if (response.token !== undefined) {
      // withdraw data
      let username = response.username;
      let token = response.token;
      console.log(username);
      console.log(token);
      // save into temp storage
      localStorage.setItem("username", username);
      localStorage.setItem("sessionToken", token);
      console.log("username and token saved in local storage");
      return { token: token };
    } else {
      console.log("signup failed");
      console.log(response.message);
      return {};
    }
  } catch (error) {
    console.log(error);
  } finally {
    console.log("signup finished");
  }
}

/**
 * log in functionality to post request with email, password and receive token if succeeded
 * @param  {string} email [email for account]
 * @param  {string} pwd [password for account]
 * @return {object} object [dictionary having token if login succeeds]
 */
// async function logIn(email, pwd) {
//   if (email === undefined || typeof email !== "string" || email === "") {
//     throw "Exception from signUp(): argument 'email' incorrect";
//   }
//   if (pwd === undefined || typeof pwd !== "string" || pwd === "") {
//     throw "Exception from signUp(): argument 'pwd' incorrect";
//   }
//   try {
//     let url = "http://thesi.generalassemb.ly:8080/login";
//     let data = {
//       email: email,
//       password: pwd,
//     };
//     console.log(`login request: url(${url}) data body (${JSON.stringify(data)})`);
//     let response = await postData(url, data);
//     console.log("logIn response:" + JSON.stringify(response));
//     if (response.token !== undefined) {
//       let username = response.username;
//       let token = response.token;
//       console.log(username);
//       console.log(token);
//       localStorage.setItem("username", username);
//       localStorage.setItem("sessionToken", token);
//       console.log("username and token saved in local storage");
//       return { token: token };
//     } else {
//       console.log("login failed");
//       console.log(response.message);
//       return {};
//     }
//   } catch (error) {
//     console.log(error);
//   } finally {
//     console.log("login finished");
//   }
// }

/**
 * get request to withdraw all posts from API
 * @returns {promise object} value [contains array of object for list posts]
 */
async function listPostsQC() {
  let url = "http://thesi.generalassemb.ly:8080/post/list";
  try {
    console.log(`list post request: url(${url})`);
    var response = await getData(url).then(value => {
      console.log(value);
      console.log(typeof value);
      return value;
    });
    console.log("list post response:" + JSON.stringify(response));
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    console.log("list posts finished");
  }
}

/**
 * post request to create a post
 * @param {string} title [post title]
 * @param {string} dscrpt [post description -- content]
 * @returns {promise object} value [contains info for the newly created post]
 */
async function createPost(title, dscrpt) {
  if (title === "" || dscrpt === "") {
    alert("create post failed: title/content empty");
  }
  // check user token data validation
  let token = localStorage.getItem("sessionToken");
  console.log(token);
  if (token === null) {
    throw "Exception in createPost(): token not available";
  }
  let url = "http://thesi.generalassemb.ly:8080/post";
  let data = {
    title: title,
    description: dscrpt,
  };
  try {
    console.log(`create post request: url(${url})`);
    var response = await postData(url, data, "Bearer " + token).then(value => {
      console.log(value);
      console.log(typeof value);
      return value;
    });
    console.log("create post response:" + JSON.stringify(response));
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    console.log("create post finished");
  }
}

/**
 * post request to create comment
 * @param {string} postId [post id]
 * @param {string} commentContent [comment content]
 * @returns {promise object} value [contains info for the newly created comment]
 */
async function createComment(postId, commentContent) {
  if (commentContent === "") {
    alert("create comment failed: content empty");
  }
  // check user token data validation
  let token = localStorage.getItem("sessionToken");
  console.log(token);
  if (token === null) {
    throw "Exception in createPost(): token not available";
  }
  let url = "http://thesi.generalassemb.ly:8080/comment/" + postId;
  let data = {
    text: commentContent,
  };
  try {
    console.log(`create comment request: url(${url})`);
    var response = await postData(url, data, "Bearer " + token).then(value => {
      console.log(value);
      console.log(typeof value);
      return value;
    });
    console.log("create comment response:" + JSON.stringify(response));
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    console.log("create comment finished");
  }
}

/**
 * get request to withdraw comments for a post
 * @param {string} postId [the id for the target post]
 * @param {promise object} value [contains array of objects of comments for the target post]
 */
async function getCommentByPostId(postId) {
  let url = "http://thesi.generalassemb.ly:8080/post/" + postId + "/comment";
  try {
    console.log(`get comment by post id request: url(${url})`);
    var response = await getData(url).then(value => {
      console.log(value);
      return value;
    });
    console.log("get comment by post id response:" + JSON.stringify(response));
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    console.log("get comment by post id finished");
  }
}

/**
 * get request to withdraw content for a user (according to token[user auth key])
 * @returns {promise object} value [contains array of objects of comments by the user]
 */
async function getCommentByUser() {
  let token = localStorage.getItem("sessionToken");
  console.log(token);
  if (token === null) {
    throw "Exception in createPost(): token not available";
  }
  let url = "http://thesi.generalassemb.ly:8080/user/comment";
  try {
    console.log(`get comment by user request: url(${url})`);
    var response = await getData(url, "Bearer " + token).then(value => {
      console.log(value);
      console.log(typeof value);
      return value;
    });
    console.log("get comment by user response:" + JSON.stringify(response));
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    console.log("get comment by user finished");
  }
}

/**
 * delete request to delete a post by id [server not available yet]
 * @param {string} postid [id for the target post]
 * @returns {promise object} value [respone]
 */
async function deletePostByPostId(postid) {
  let token = localStorage.getItem("sessionToken");
  console.log(token);
  if (token === null) {
    throw "Exception in createPost(): token not available";
  }
  let url = "http://thesi.generalassemb.ly:8080/post/" + postid;
  try {
    console.log(`delete post by post id request: url(${url})`);
    var response = await deleteData(url, "Bearer " + token).then(value => {
      console.log(value);
      console.log(typeof value);
      return value;
    });
    console.log("delete post by post id response:" + JSON.stringify(response));
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    console.log("delete post by post id finished");
  }
}

/**
 * delete request to delete a comment
 * @param {string} commentid [id for the target comment]
 * @param {promise object} response [object for response info -> check 'ok' attribute for execution]
 */
async function deleteCommentByCommentId(commentid) {
  let token = localStorage.getItem("sessionToken");
  console.log(token);
  if (token === null) {
    throw "Exception in createPost(): token not available";
  }
  let url = "http://thesi.generalassemb.ly:8080/comment/" + commentid;
  try {
    console.log(`delete comment by comment id request: url(${url})`);
    var response = await deleteData(url, "Bearer " + token);
    console.log(response);
    console.log("delete comment by comment id response:" + response);
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    console.log("delete comment by comment id finished");
  }
}

/**
 * post request to create profile
 * @param {string} alterEmail [additional email]
 * @param {string} mobile [mobile number]
 * @param {string} address [address]
 * @returns {promise object} value [object having the newly created profile]
 */
async function createProfile(alterEmail, mobile, address) {
  let token = localStorage.getItem("sessionToken");
  console.log(token);
  if (token === null) {
    throw "Exception in createPost(): token not available";
  }
  let url = "http://thesi.generalassemb.ly:8080/profile";
  let data = {
    additionalEmail: alterEmail,
    mobile: mobile,
    address: address,
  };
  try {
    console.log(`create profile request: url(${url}) -- data (${JSON.stringify(data)})`);
    var response = await postData(url, data, "Bearer " + token).then(value => {
      console.log(value);
      console.log(typeof value);
      return value;
    });
    console.log("create profile response:" + JSON.stringify(response));
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    console.log("create profile finished");
  }
}

/**
 * get request to withdraw profile according to token (user auth key)
 * @param {promise object} value [contains the profile info]
 */
async function getProfile() {
  let token = localStorage.getItem("sessionToken");
  console.log(token);
  if (token === null) {
    throw "Exception in createPost(): token not available";
  }
  let url = "http://thesi.generalassemb.ly:8080/profile";
  try {
    console.log(`get profile request: url(${url})`);
    var response = await getData(url, "Bearer " + token).then(value => {
      console.log(value);
      console.log(typeof value);
      return value;
    });
    console.log("get profile response:" + JSON.stringify(response));
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    console.log("get profile finished");
  }
}

/**
 * post request to profile according to token (user auth key)
 * @param {string} mobile [new mobile number]
 * @param {promise object} value [contains the newly update profile]
 */
async function updateProfile(mobile) {
  let token = localStorage.getItem("sessionToken");
  console.log(token);
  if (token === null) {
    throw "Exception in createPost(): token not available";
  }
  let url = "http://thesi.generalassemb.ly:8080/profile";
  let data = {
    mobile: mobile,
  };
  try {
    console.log(`update profile request: url(${url}) -- data (${JSON.stringify(data)})`);
    var response = await postData(url, data, "Bearer " + token).then(value => {
      console.log(value);
      console.log(typeof value);
      return value;
    });
    console.log("update profile response:" + JSON.stringify(response));
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    console.log("update profile finished");
  }
}

/**
 * check if token is in local storage
 * @param {boolean} [true if token exists, otherwise false]
 */
function checkTokenAvailable() {
  if (localStorage.getItem("sessionToken") === null) {
    return false;
  }
  return true;
}

/**
 * get request to withdraw one user's post, according to token (user auth key)
 * @returns {promise object} value [array of objects having posts]
 */
async function getPostByUser() {
  let token = localStorage.getItem("sessionToken");
  console.log(token);
  if (token === null) {
    throw "Exception in createPost(): token not available";
  }
  let url = "http://thesi.generalassemb.ly:8080/user/post";
  try {
    console.log(`get post by user request: url(${url})`);
    var response = await getData(url, "Bearer " + token).then(value => {
      console.log(value);
      console.log(typeof value);
      return value;
    });
    console.log("get post by user response:" + JSON.stringify(response));
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    console.log("get post by user finished");
  }
}

/**
 * log out function: clear local storage for token and username
 */
function logOut() {
  localStorage.clear();
}


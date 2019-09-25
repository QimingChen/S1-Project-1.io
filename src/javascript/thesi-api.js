/**
 * post request to server end to send data
 * @param  {string} url [address for request destination]
 * @param  {object} data [data body]
 * @return {object} response.json() [object resolved from response]
 */
async function postData(url, data) {
  let response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return await response.json();
}

/**
 * get request to server end to retrieve data
 * @param  {string} url [address for request destination]
 * @return {object} response.json() [object resolved from response]
 */
async function getData(url) {
  let response = await fetch(url);
  return await response.json();
}

/**
 * sign up functionality to post request with email, password, username, and receive token if succeeded
 * @param  {string} email [email for account]
 * @param  {string} pwd [password for account]
 * @param  {string} username [username for account]
 * @return {object} object [dictionary having token if signup succeeds]
 */
async function signUp(email, pwd, username) {
  if (  email === undefined || typeof email !== "string" || email === "") {
    throw "Exception from signUp(): argument 'email' incorrect";
  }
  if (pwd === undefined || typeof pwd !== "string" || pwd === "") {
    throw "Exception from signUp(): argument 'pwd' incorrect";
  }
  if ( username === undefined || typeof username !== "string" || username === "") {
    throw "Exception from signUp(): argument 'username' incorrect";
  }
  try {
    let data = {
      email: email,
      password: pwd,
      username: username
    };
    let response = await postData("http://thesi.generalassemb.ly:8080/signup", data);
    console.log("signup response:" + JSON.stringify(response));
    if (response.token !== undefined) {
      let token = response.token;
      console.log(token);
      return { token: token };
    } else {
      console.log("signup failed");
      console.log(response.message)
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
 * @param  {string} username [username for account]
 * @return {object} object [dictionary having token if login succeeds]
 */
async function logIn(email, pwd) {
  if (email === undefined || typeof email !== "string"  || email === "") {
    throw "Exception from signUp(): argument 'email' incorrect";
  }
  if ( pwd === undefined || typeof pwd !== "string" ||  || pwd === "") {
    throw "Exception from signUp(): argument 'pwd' incorrect";
  }
  try {
    let data = {
      email: email,
      password: pwd
    };
    let response = await postData("http://thesi.generalassemb.ly:8080/login", data);
    console.log("logIn response:" + JSON.stringify(response));
    if (response.token !== undefined) {
      let token = response.token;
      console.log(token);
      return { token: token };
    } else {
      console.log("login failed");
      console.log(response.message)
      return {};
    }
  } catch (error) {
    console.log(error);
  } finally {
    console.log("login finished");
  }
}

//test
let test = true;
if (test) {
  let loging_token = logIn("venom@superhero.com", "venom");
  console.log(loging_token);
  let wrong_login = logIn("venom@superhero.com", "veno")
}

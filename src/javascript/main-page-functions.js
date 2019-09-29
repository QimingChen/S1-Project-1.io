/**
 * FUNCTION: Called on button click
 * Performs POST api call to back end server
 * Sends html input values as body of fetch request
 * Fetch call returns a token
 * Token validation occurs in then clause of fetch call
 * Sending token and email to local storage if token is in database
 * Else returns an error message to the screen
 */
function loadUser(){

    let emailInput = document.querySelector("#username").value
    let passwordInput = document.querySelector("#password").value

    fetch("http://thesi.generalassemb.ly:8080/login", {
        method : "post",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
    },
    body: JSON.stringify({
        email: emailInput,
        password : passwordInput
    })

    })
    .then(response => {
        return response.json()
    })
    .then((json) => {
        
        let token = json.token
        let username = json.username
        console.log('IM HERE')
       
        if(token!==undefined){
           
            console.log(token)
            localStorage.setItem("email", emailInput)
            localStorage.setItem("sessionToken", token)
            localStorage.setItem("username", username)
            location.reload();
        }
        else{
            
            document.querySelector("#incorrect").style.display = "inline"
        }
    }) 

}
/**
 * FUNCTION: Called on DOM load if user IS NOT signed in
 * creates a sign up button and an event listener
 * loads log in button
 */

function loadLogin(logInButton){
    let signupButton = document.createElement("button")
        signupButton.textContent = "Sign up"

        //takes user to sign up page
        signupButton.addEventListener("click", ()=>{
            document.querySelector("#login").innerHTML = `<input id = "new-email" placeholder="Your email">
            <input id = "new-password" type= "password" placeholder="password" >`
        })

        logInButton.textContent = "log in"
        document.querySelector("#login").innerHTML = `<input id = "username" placeholder="email">
            <input id = "password" type= "password" placeholder="password" >`
        logInButton.type = "submit"
        logInButton.value = "Log in"
        document.querySelector("#login").appendChild(logInButton)
        document.querySelector("#login").appendChild(signupButton)

}


/**
 * FUNCTION: Called on DOM load if user IS signed in
 * Creates DOM elements and appends them to #login html tag
 * Sets some styling
 */
function loggedinPage(){
    let userName = localStorage.getItem("email").split("@")[0]
    let helloUsername = `Welcome back, ${userName}`
    let welcomeBack = document.createElement("p")
    welcomeBack.textContent = helloUsername
    welcomeBack.style.marginRight = "10px"
    welcomeBack.style.fontSize = "29px"
    document.querySelector("#login").appendChild(welcomeBack)
    
    let createNewPost = document.createElement("a")
    createNewPost.setAttribute("class", "create-new-post")
    createNewPost.textContent = "Manage my posts"
    createNewPost.href = "../html/post.html"
    document.querySelector("#login").appendChild(createNewPost)
    
    let logOutButton = document.createElement("button")
    logOutButton.innerText = "Log Out?"
    logOutButton.style.marginTop = "14px"
    logOutButton.style.display = "block"
    document.querySelector("#login").appendChild(logOutButton)
    
    //if log out button is clicked clear localStorage and refresh the screen
    logOutButton.addEventListener("click", () =>{
        localStorage.clear()
        location.reload()
    })
}



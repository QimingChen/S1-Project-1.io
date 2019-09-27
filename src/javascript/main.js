/*
TO DO: 
1. Create request to add a comment
2. Create button with request to view all comments per post
3. create delete post button
4. add some search functionality

*/



/**
 * FUNCTION: 
 * Loads virtual DOM which includes a log in button
 * calls loadPosts() and loadUser()
 * 
 */
document.addEventListener("DOMContentLoaded", function(e) {
    loadPosts()
    let logInButton = document.createElement('button')
    loadLogin(logInButton)
    
    logInButton.addEventListener('click', function(e){
      
      loadUser()
        
    })
   
})

/**
 * FUNCTION: Called on button click
 * Performs POST api call to back end server
 * Sends html input values as body of fetch request
 * Fetch call returns a token
 * Token validation occurs in then clause of fetch call
 * Sending token and email to local storage if token is in database
 * Else returns an error message to the screen
 * 
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
            let loginError = document.createElement('p')
            loginError.textContent = "Your email or password is incorrect"
            loginError.style.color  = "red"
            document.querySelector("#login").appendChild(loginError)
            loginError.style.display = ''
        }
        
        
    }) //Doesn't do anything here
    .catch( () =>{
        alert(error)
    })

}
/**
 * 
 */
function loadCreatePostButton(){

}
/**
 * FUNCTION: called on DOM load
 * Performs GET api call to back end server
 * If fetch successful, loop through array of json (posts) and create virtual DOM elements matched to api call return
 * Dom is manipulated based on if user is logged in or not (by checking if localStorage has the token)
 * If they are logged in, display add a comment button
 */
function loadPosts(){

    fetch("http://thesi.generalassemb.ly:8080/post/list", {
        method: "GET"
    })
    .then((response) => {
        return response.json();
    })
    .then(posts =>{
       
            posts.forEach((post)=>{
                let postID = post.id
                localStorage.setItem("id", postID)
                // console.log(post.id)
                let commentButton = document.createElement('button')
                let div = document.createElement('div')
                div.setAttribute("class", "posts-div") 
                document.querySelector('#main').appendChild(div)
                
            
                let title = `Title: ${post.title}`
                let postTitle = document.createElement('h1')
                postTitle.textContent = title

                let desc = post.description
                let postDesc = document.createElement('p')
                postDesc.textContent = desc

                let username = ` by: ${post.user.username}`
                let postUsername = document.createElement('p')
                postUsername.textContent = username


                div.appendChild(postTitle)
                div.appendChild(postDesc)
                div.appendChild(postUsername)
                
                if(localStorage.getItem("sessionToken") !==null){
                    
                    commentButton.innerHTML = "Add a comment"
                    div.appendChild(commentButton)
                }
                let commentDiv = document.createElement("div")
                let commentInput = document.createElement("input")
                let newCommentAdd = document.createElement("button")
                
                
                commentButton.addEventListener('click', ()=>{
                    
                    newCommentAdd.innerHTML = "Post Comment"
                    commentInput.setAttribute("type", "text")
                    postUsername.appendChild(commentDiv)
                    commentDiv.appendChild(commentInput)
                    commentDiv.appendChild(newCommentAdd)
                    commentButton.style.display = "none"
                })
                newCommentAdd.addEventListener('click', () =>{
                    console.log(postID)
                    let newComment = commentInput.value
                    fetch(`http://thesi.generalassemb.ly:8080/comment/${postID}`, {
                        method : "post",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem("sessionToken")}`,
                            'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        text: newComment
                    })

                    })
                    .then(response => {
                        return response.json()
                    })
                    .then((json) => {
                        commentDiv.innerHTML= " "
                        commentDiv.style.marginTop = "3px"
                        commentDiv.innerText = "Comment added"

                    })
                    
                })
            
            })
    })
}
   
/**
 * 
 */
function loadLogin(logInButton){
    if(!localStorage.getItem("sessionToken") ) { 
       
        logInButton.textContent = "log in"
        document.querySelector("#login").innerHTML = `<input id = "username" placeholder="email">
            <input id = "password" type= "password" placeholder="password" >`
        logInButton.type = "submit"
        logInButton.value = "Log in"
        document.querySelector("#login").appendChild(logInButton)
        
    }
    else {
        let userName = localStorage.getItem("email").split("@")[0]
        let helloUsername = `Welcome back, ${userName}`
        let welcomeBack = document.createElement("p")
        welcomeBack.textContent = helloUsername
        document.querySelector("#login").appendChild(welcomeBack)
        
        let createNewPost = document.createElement("a")
        createNewPost.textContent = "Create a new Post"
        createNewPost.href = "../html/post.html"
        document.querySelector("#login").appendChild(createNewPost)
    }

}


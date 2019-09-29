
/**
 * FUNCTION: 
 * Loads virtual DOM which includes a log in button
 * calls loadPosts(), loadUser(), and loadLogin(), and loggedinPage()
 */
document.addEventListener("DOMContentLoaded", function(e) {
    loadPosts()

    let logInButton = document.createElement("button")
   
    if(!localStorage.getItem("sessionToken") ){
        loadLogin(logInButton)
    }
    else {
        loggedinPage()
    }  
    
    logInButton.addEventListener('click',loadUser)  
})

/**
 * FUNCTION: called on DOM load
 * Performs GET api call to back end server
 * If fetch successful, loop through array of json (posts) and create virtual DOM elements matched to api call return
 * Dom is manipulated based on if user is logged in or not (by checking if localStorage has the token)
 * If they are logged in, display add a comment button & list of comments button
 */
function loadPosts(){

    fetch("http://thesi.generalassemb.ly:8080/post/list", {
        method: "get"
    })
    .then((response) => {
        return response.json();
    })
    //AJAX call to return array of posts
    .then(posts =>{
        posts.forEach((post)=>{
            
            //get post id from AJAX call and send it to localStorage
            let postID = post.id
            localStorage.setItem("id", postID)

            //Create some DOM elements for each post formatting  
            let addCommentButton = document.createElement('button')
            let seeAllCommentsButton = document.createElement('button')
            let div = document.createElement('div')
            div.setAttribute("class", "posts-div")
            document.querySelector("#main").appendChild(div)
        
            //For each post create DOM elements for post title, post description, post creator
            //Append each one to the DOM
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
            
            //If user is logged in, display buttons for creating/viewing all comments 
            if(localStorage.getItem("sessionToken") !==null){
                
                addCommentButton.innerHTML = "Add a comment"
                seeAllCommentsButton.innerHTML = "See all comments for this post"
                div.appendChild(addCommentButton)
                div.appendChild(seeAllCommentsButton)

            }
            //DOM elements for comment section

            //div for adding a comment -- includes input field and button under it
            let commentDiv = document.createElement("div")
            let commentInput = document.createElement("input")
            let postCommentButton = document.createElement("button")


            //div for loading all comments
            let loadedCommentsDiv = document.createElement("div")
            div.appendChild(loadedCommentsDiv)

            //flag used to check if comments are hidden or not
            //it's global --grrr
            let showHide = true
            
            //each "see all comments" button has an event listener to display all comments per post
            seeAllCommentsButton.addEventListener('click', ()=>{
                
                if(showHide === true){
                    seeAllCommentsButton.innerHTML = "Hide All Comments for this post"
                    showHide = false
                
                    
                    // AJAX call per post to display comments using postID in localStorage
                    fetch(`http://thesi.generalassemb.ly:8080/post/${postID}/comment`,{
                        method: "get" 
                    })
                    .then((response) =>{
                        return response.json()
                    })
                    .then((comments)=>{
                        
                        //for each comment for each post do this:
                        comments.forEach(comment =>{

                           //create DOM elements for comment content--text & user who posted it 
                            let postComment = document.createElement('p')
                            let whoCommented = document.createElement('h3')
                            postComment.textContent = comment.text
                            let name = comment.user.username 
                            whoCommented.textContent = `${name} commented: `
                            loadedCommentsDiv.appendChild(whoCommented)
                            loadedCommentsDiv.appendChild(postComment)

                            //if a comment was written by the signed in user, add delete functionality with AJAX call
                            //checks GET request return user name value and compares it to username in localStorage
                            //if there's a match, create delete DOM elements and perform DELETE method on that ID with click event
                            if(comment.user.username === localStorage.getItem("username")){    
                                let deleteComment = document.createElement("button")
                                deleteComment.setAttribute("id", "delete-comment" )
                               
                                deleteComment.innerText = "Delete comment"
                                loadedCommentsDiv.appendChild(deleteComment)
                                

                                deleteComment.addEventListener("click", () => {
                                 
                                    fetch(`http://thesi.generalassemb.ly:8080/comment/${comment.id}`,{
                                        method: "delete",
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${localStorage.getItem("sessionToken")}`,
                                            'Accept': 'application/json'
                                        }   
                                    })
                                    //if request succeeds, remove desired child DOM elements
                                    .then((response) => {
                                        if(response.status==200){
                                            loadedCommentsDiv.removeChild(whoCommented)
                                            loadedCommentsDiv.removeChild(postComment)
                                            loadedCommentsDiv.removeChild(deleteComment)

                                        }
                                        else{
                                            console.log('error in deleting comment');
                                        }
                                    })
                                })
                            }
                        })
    
                    })
                }
                //if flag is false, and button is click, hide comments and change see all comments button text
                else{
                    showHide=true;
                    loadedCommentsDiv.innerHTML = " "
                    seeAllCommentsButton.innerHTML = "See All Comments for this post"
                }
            })

            //on click for adding a comment
            //loads button and input field
            //appends them to their own div so they're visible
            addCommentButton.addEventListener('click', ()=>{
                
                postCommentButton.innerHTML = "Post Comment"
                commentInput.setAttribute("type", "text")
                postUsername.appendChild(commentDiv)
                commentDiv.appendChild(commentInput)
                commentDiv.appendChild(postCommentButton)
                addCommentButton.style.display = "none"
            })

            //DOM element for a new comment
            let commentAddedText = document.createElement('p')

            //event listener when clicking "post comment" button
            postCommentButton.addEventListener('click', () =>{
                
                let newComment = commentInput.value
                
                //AJAX call if string in input field is not blank
                if(newComment.length !==0){
                    commentAddedText.textContent = `Comment added`
                
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
                    //if call is successful, add new comment to backend and onto DOM
                    //clears input field as well
                    .then( () => {
                        
                        commentDiv.style.marginTop = "3px"
                        commentDiv.appendChild(commentAddedText)
                        commentInput.value =""

                    })                
                }
                //If input is null, display error message and don't add comment to backend DB
                else{
                    commentAddedText.textContent = `Please enter a valid comment`
                    commentAddedText.style.color = "red"
                    commentDiv.appendChild(commentAddedText)
                }
            })
        })
    })
}
/**
 * 
 */



document.addEventListener('DOMContentLoaded', function(){
    let loginButton = document.querySelector('#login')
    let usernameInput = document.querySelector('#username')
    let passwordInput = document.querySelector('#password')
    
    loginButton.addEventListener('click', function(){
        let username = usernameInput.value
        let password = passwordInput.value
        console.log(username)
        console.log(password)
        //document.querySelector("#form").innerHTML = " "
    })
    
    
})
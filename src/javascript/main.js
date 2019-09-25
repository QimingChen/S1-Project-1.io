document.addEventListener('DOMContentLoaded', function(){
    let loginButton = document.querySelector('#login')
    let emailInput = document.querySelector('#username')
    let passwordInput = document.querySelector('#password')

    fetch("http://thesi.generalassemb.ly:8080/post/list", {
        method: 'GET'
    })
    .then((response )=> {
        return response.json();
    })
    .then((json) =>{
        console.log(json)
    })
    
    loginButton.addEventListener('click', function(){
        let email = emailInput.value
        let password = passwordInput.value
        console.log(email)
        console.log(password)
        

        fetch("http://thesi.generalassemb.ly:8080/login", {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                email: email,
                password: password,
            })
        })
            .then((response )=> {
                return response.json();
            })
            .then((json) =>{
                
                 document.querySelector("#form").innerHTML = " "
                let index = email.indexOf('@')
                let profileName = email.slice(0, index)
                let linkToProfile = document.createElement('a')
                linkToProfile.innerHTML = profileName
                linkToProfile.href = "#"
                document.querySelector("#header").appendChild(linkToProfile)
                console.log(linkToProfile)

                //console.log(json)
            })
            .catch(function(error){
                alert(error)
            })
    })
      
})
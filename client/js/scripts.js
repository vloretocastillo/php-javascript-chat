$(document).ready(function(){

    // setting the string URL where the server file is located, for future ajax requests
    const stringUrl = "http://localhost:8000/server.php"

    // Function definition: setting the user name in the browsers' local storage
    const setLocalStorageUser = (token, name, id) => { 
        localStorage.setItem('token', token) 
        localStorage.setItem('name', name) 
        localStorage.setItem('id', id)
    }

    // Function definition: making ajax call to the back end to get the current state of the chat
    const getCurrentStateOfChat = (stringUrl) => {
        $.ajax({
            type: "POST",
            url: stringUrl,
            data : { 'getChat' : true },
            success: (response) => {
                let jsonData = JSON.parse(response);
                updateChatWindow(jsonData)
            }, 
            error : (err) => { console.log('error: ', err) }
        });
    }


    // Function definition : update the chat window with the new data
    const updateChatWindow = (chatData) => {
        let chatbox = document.getElementById('chatbox')
        chatbox.innerHTML = ''
        let messages = chatData.map(el => {
            let messageDivNode = document.createElement('div')
            let name  = localStorage.id == el.userid ? `<span class='bold'>${el.username}</span>` : el.username
            messageDivNode.innerHTML = name + ': ' + el.message
            return messageDivNode
        })
        for (let i=0; i < messages.length; i++) chatbox.appendChild(messages[i]) 
    }

    

    // Function definition: making ajax call to the server in order to send the user's message
    const handleFormSubmit = (e, stringUrl) => {
        e.preventDefault()
        if(localStorage.token) {
            const message = document.getElementById('message').value || false
            if (!message) {
                alert("Your message can't be blank")
            } else {       
                $.ajax({
                    type: "POST",
                    url: stringUrl,
                    data: { 'message' : JSON.stringify( { 'message': message, 'name' : localStorage.name, 'token' : localStorage.token, 'userID' : localStorage.id } )},
                    success: (response) => {
                        // getCurrentStateOfChat(stringUrl)    
                    }, 
                    error : (err) => { console.log('error: ', err) }
                });
            }
        } else {
            alert('You have to join the chat first')
        } 
        document.getElementById('message').value = ''  
    }


    // Function definition: emptying the browsers' local storage and reloading the page
    const handleclearSession = () => {
        localStorage.removeItem('name')
        localStorage.removeItem('token')
        localStorage.removeItem('id')
        location.reload();
    }

    // 
    const handleJoinSession = () => {
        let username = prompt("What is your name?") || 'Guest'
        $.ajax({
            type: "POST",
            url: stringUrl,
            data: { 'newUser' : JSON.stringify( { 'name' : username } )},
            success: (res) => {
                let jsonData = JSON.parse(res)
                setLocalStorageUser(jsonData.token, jsonData.name, jsonData.id)
                location.reload();
            }, 
            error : (err) => { console.log('error: ', err) }
        });
        
    }

    


    // Getting the form element where the user types the message and adding a callback on submit 
    const form = document.getElementById('form-chat')
    form.addEventListener('submit', (e) => handleFormSubmit(e, stringUrl))

    // Getting the button that clears the session and adding a callback that clears the local storage
    let clearSessionButton = document.getElementById('clearSessionButton')
    clearSessionButton.addEventListener('click', () => handleclearSession() )

    let joinSessionButton = document.getElementById('joinSessionButton')
    joinSessionButton.addEventListener('click', () => handleJoinSession() )
        
    if (localStorage.token) {
        let welcomeUserNameNode = document.getElementById('welcomeUserName')
        welcomeUserNameNode.innerHTML = localStorage.name
        clearSessionButton.classList.remove('hide-me')
        joinSessionButton.classList.add('hide-me')
    } else {
        joinSessionButton.classList.remove('hide-me')
        clearSessionButton.classList.add('hide-me')
    }
    
    setInterval(()=> { if (localStorage.token) getCurrentStateOfChat(stringUrl) }, 1000)
});
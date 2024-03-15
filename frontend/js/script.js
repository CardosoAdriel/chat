// login elements 
const login = document.querySelector('.login')
const loginForm = document.querySelector('.login__form')
const loginInput = document.querySelector('.login__input')

// chat elements 
const chat = document.querySelector('.chat')
const chatForm = document.querySelector('.chat__form')
const chatInput = document.querySelector('.chat__input')
const chatMessages = document.querySelector('.chat__messages')

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = { id: "", name: "", color: "" }

let ws

createMessageElementSelf = (content) => {
    const div = document.createElement('div')
    div.classList.add('message--self')
    div.innerHTML = content
    return div
}
createMessageElementOther = (content, sender, senderColor) => {
    const div = document.createElement('div')
    const span = document.createElement('span')

    div.classList.add('message--other')
    span.classList.add('message--sender')
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scroolScreen = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data)

    const message =
        userId === user.id
            ? createMessageElementSelf(content)
            : createMessageElementOther(content, userName, userColor)


    chatMessages.appendChild(message)
    scroolScreen()
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = 'none'
    chat.style.display = 'flex'

    ws = new WebSocket('wss://chat-realtime-puo5.onrender.com')
    ws.onmessage = processMessage
}

loginForm.addEventListener("submit", handleLogin)

const sendMessage = (event) => {
    event.preventDefault()
    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }
    ws.send(JSON.stringify(message))
    chatInput.value = ''
}
chatForm.addEventListener("submit", sendMessage)
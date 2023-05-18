const socket = io();

let user;
const chatBox = document.getElementById("chatBox");


Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresa el usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && "Necesitas escribir un nombre de usuario para comenzar";
    },
    allowOutsideClick: false

})
.then((result) => {
    user = result.value;
    socket.emit("auth", user);
});

// Chat client Input
chatBox.addEventListener("keyup", (evt) => {
    if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
        socket.emit("message", { user, message: chatBox.value });
        chatBox.value = "";
    }
    }
});

socket.on("messageLogs", (data) => {
    let log = document.getElementById("messageLogs");
    let messages = "";
    data.forEach((message) => {
    messages += `${message.user} dice: ${message.message} <br/>`;
    });
    log.innerHTML = messages;
});

socket.on("newUser", (data) => {
    Swal.fire({
    title: `¡${data} se ha conectado!`,
    toast: "true",
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    icon: "success",
    });
});
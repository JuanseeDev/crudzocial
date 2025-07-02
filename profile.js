
// Obtener referencias a los elementos del formulario por su ID o nombre
const form = document.getElementById("form-information");
const emailForm = document.querySelector("[name=email]");
const firstNameForm = document.querySelector("[name=first_name]");
const lastNameForm = document.querySelector("[name=last_name]");
const phoneForm = document.querySelector("[name=phone]");
const countryForm = document.querySelector("[name=country]");
const cityForm = document.querySelector("[name=city]");
const addressForm = document.querySelector("[name=address]");
const postal = document.querySelector("[name=postal]");

// Nombre de la clave donde se guardan los usuarios en localStorage
const DATOS = "crudzocial_users";

// Obtener los usuarios almacenados en localStorage y parsearlos a objeto
const users = JSON.parse(localStorage.getItem(DATOS));

// Buscar el usuario actualmente logueado usando su id
const usuarioActual = users.find((user) => user.id == crudzocial.getCurrentUser().id);

// Función autoejecutable para rellenar el formulario con los datos del usuario actual
(() => {
    if (usuarioActual.first_name) firstNameForm.value = usuarioActual.first_name;
    if (usuarioActual.last_name) lastNameForm.value = usuarioActual.last_name;
    if (usuarioActual.email) emailForm.value = usuarioActual.email;
    if (usuarioActual.phone) phoneForm.value = usuarioActual.phone;
    if (usuarioActual.country) countryForm.value = usuarioActual.country;
    if (usuarioActual.city) cityForm.value = usuarioActual.city;
    if (usuarioActual.address) addressForm.value = usuarioActual.address;
    if (usuarioActual.postal) postal.value = usuarioActual.postal;
})();

// Evento que se ejecuta al enviar el formulario
form.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita que el formulario se envíe y recargue la página

    // Obtener los datos del formulario como objeto
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Eliminar los campos vacíos del objeto data
    for (const key in data) {
        if (data[key] == "") delete data[key];
    }

    // Buscar el índice del usuario actual en el array de usuarios
    const usuarioActualIndex = users.findIndex((user) => user.id == crudzocial.getCurrentUser().id);

    // Actualizar los datos del usuario actual con los nuevos datos del formulario
    users[usuarioActualIndex] = {
        ...usuarioActual,
        ...data,
    };

    // Guardar el array de usuarios actualizado en localStorage
    localStorage.setItem(DATOS, JSON.stringify(users));

    // Registrar la actividad de actualización de información
    crudzocial.logActivity("ACTUALIZAR INFORMACION", `Se actualizo la informacion personal del usuario ${usuarioActual.email}`)

    // Mostrar mensaje de éxito
    alert("Se actualizaron los datos correctamente")
});


function renderUserLogs() {
    const logsContainer = document.getElementById("logs-container");
    if (!logsContainer) return;

    const user = crudzocial.getCurrentUser();
    const logs = JSON.parse(localStorage.getItem("crudzocial_logs")) || [];
    const userLogs = logs.filter(log => log.userId === user.id);

    let html = "<h3>Tu Registro de Actividad</h3>";

    if (userLogs.length === 0) {
        html += "<p>No hay actividad registrada</p>";
    } else {
        const sortedLogs = userLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        sortedLogs.forEach((log) => {
            html += `
                <div class="log-entry">
                    <div class="log-action">${log.action}</div>
                    <div class="log-details">${log.details}</div>
                    <div class="log-meta">
                        <span>${new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                </div>
            `;
        });
    }

    logsContainer.innerHTML = html;
}

renderUserLogs();
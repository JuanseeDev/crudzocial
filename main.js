// Función autoejecutable para inicializar el sistema
(function() {
    // Configuración inicial
    const STORAGE_KEYS = {
        USERS: 'crudzocial_users',
        NOTES: 'crudzocial_notes', 
        IMAGES: 'crudzocial_images',
        LOGS: 'crudzocial_logs',
        CURRENT_USER: 'crudzocial_current_user'
    };

    // Inicializa datos por defecto
    function initializeDefaultData() {
        // Creamos un usuario admin por defecto si no existe
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
        if (users.length === 0) {
            const adminUser = {
                id: generateId(),
                email: 'admin@crudzocial.com',
                role: 'admin',
                createdAt: new Date().toISOString()
            };
            users.push(adminUser);
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        }

        // Inicializamos los arrays vacíos (si no existen)
        if (!localStorage.getItem(STORAGE_KEYS.NOTES)) {
            localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify([]));
        }
        if (!localStorage.getItem(STORAGE_KEYS.IMAGES)) {
            localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify([]));
        }
        if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
            localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([]));
        }
    }

    // Genera id's únicos
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Registrar logs
    function logActivity(action, details) {
        const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS)) || [];
        const logEntry = {
            id: generateId(),
            userId: getCurrentUser()?.id || 'anonymous',
            userEmail: getCurrentUser()?.email || 'anonymous',
            action: action,
            details: details,
            timestamp: new Date().toISOString()
        };
        logs.push(logEntry);
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    }

    // Obtiene el usuario actual
    function getCurrentUser() {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    }

    // Función creada para verificar autenticación
    function isAuthenticated() {
        return getCurrentUser() !== null;
    }

    // Función declarada para verificar si es admin
    function isAdmin() {
        const user = getCurrentUser();
        return user && user.role === 'admin';
    }

    // Middleware
    function checkAuth() {
        const currentPage = window.location.pathname.split('/').pop();
        const protectedPages = ['index.html', 'users.html', ''];
        
        if (protectedPages.includes(currentPage)) {
            if (!isAuthenticated()) {
                window.location.href = 'login.html';
                return false;
            }
            
            // Verificar acceso a panel de administración
            if (currentPage === 'users.html' && !isAdmin()) {
                alert('Acceso denegado. Solo administradores pueden acceder a esta página.');
                window.location.href = 'index.html';
                return false;
            }
        }
        return true;
    }

    // Función creada para manejar el login
    function handleLogin(email) {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
        const user = users.find(u => u.email === email);
        
        if (user) {
            sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
            logActivity('LOGIN', `Usuario ${email} inició sesión`);
            window.location.href = 'index.html';
            return true;
        } else {
            // Crea nuevo usuario
            const newUser = {
                id: generateId(),
                email: email,
                role: 'user',
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
            logActivity('REGISTER', `Nuevo usuario registrado: ${email}`);
            window.location.href = 'index.html';
            return true;
        }
    }

    // Función creada para el logout
    function logout() {
        const user = getCurrentUser();
        if (user) {
            logActivity('LOGOUT', `Usuario ${user.email} cerró sesión`);
        }
        sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        window.location.href = 'login.html';
    }

    // Función para crear nota
    function createNote(title, content) {
        const notes = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES)) || [];
        const user = getCurrentUser();
        
        const note = {
            id: generateId(),
            userId: user.id,
            userEmail: user.email,
            title: title,
            content: content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        notes.push(note);
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
        logActivity('CREATE_NOTE', `Nota creada: ${title}`);
        return note;
    }

    // Función para editar nota
    function updateNote(noteId, title, content) {
        const notes = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES)) || [];
        const noteIndex = notes.findIndex(n => n.id === noteId);
        
        if (noteIndex !== -1) {
            const user = getCurrentUser();
            // Verifica permisos (solo el creador o admin puede editar)
            if (notes[noteIndex].userId === user.id || user.role === 'admin') {
                notes[noteIndex].title = title;
                notes[noteIndex].content = content;
                notes[noteIndex].updatedAt = new Date().toISOString();
                localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
                logActivity('UPDATE_NOTE', `Nota actualizada: ${title}`);
                return true;
            }
        }
        return false;
    }

    // Función para eliminar nota
    function deleteNote(noteId) {
        const notes = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES)) || [];
        const noteIndex = notes.findIndex(n => n.id === noteId);
        
        if (noteIndex !== -1) {
            const user = getCurrentUser();
            // Verificar permisos: solo el creador o admin puede eliminar
            if (notes[noteIndex].userId === user.id || user.role === 'admin') {
                const deletedNote = notes.splice(noteIndex, 1)[0];
                localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
                logActivity('DELETE_NOTE', `Nota eliminada: ${deletedNote.title}`);
                return true;
            }
        }
        return false;
    }

    // Función para subir imagen
    function uploadImage(file, description) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const images = JSON.parse(localStorage.getItem(STORAGE_KEYS.IMAGES)) || [];
                const user = getCurrentUser();
                
                const image = {
                    id: generateId(),
                    userId: user.id,
                    userEmail: user.email,
                    filename: file.name,
                    description: description,
                    data: e.target.result,
                    size: file.size,
                    type: file.type,
                    createdAt: new Date().toISOString()
                };
                
                images.push(image);
                localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images));
                logActivity('UPLOAD_IMAGE', `Imagen subida: ${file.name}`);
                resolve(image);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Función para eliminar imagen
    function deleteImage(imageId) {
        const images = JSON.parse(localStorage.getItem(STORAGE_KEYS.IMAGES)) || [];
        const imageIndex = images.findIndex(i => i.id === imageId);
        
        if (imageIndex !== -1) {
            const user = getCurrentUser();
            // Verifica permisos (solo el creador o admin puede eliminar)
            if (images[imageIndex].userId === user.id || user.role === 'admin') {
                const deletedImage = images.splice(imageIndex, 1)[0];
                localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images));
                logActivity('DELETE_IMAGE', `Imagen eliminada: ${deletedImage.filename}`);
                return true;
            }
        }
        return false;
    }

    // Función para obtener datos según los permisos
    function getUserData() {
        const user = getCurrentUser();
        const allNotes = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES)) || [];
        const allImages = JSON.parse(localStorage.getItem(STORAGE_KEYS.IMAGES)) || [];
        
        if (user.role === 'admin') {
            return {
                notes: allNotes,
                images: allImages
            };
        } else {
            return {
                notes: allNotes.filter(n => n.userId === user.id),
                images: allImages.filter(i => i.userId === user.id)
            };
        }
    }

    // Función para renderizar notas
    function renderNotes() {
        const notesContainer = document.getElementById('notes-container');
        if (!notesContainer) return;
        
        const data = getUserData();
        let html = '';
        
        if (data.notes.length === 0) {
            html = '<p class="no-data">No hay notas disponibles.</p>';
        } else {
            data.notes.forEach(note => {
                const isOwner = note.userId === getCurrentUser().id;
                const canEdit = isOwner || isAdmin();
                
                html += `
                    <div class="note-card" data-note-id="${note.id}">
                        <div class="note-header">
                            <h3>${note.title}</h3>
                            ${!isOwner ? `<span class="note-author">Por: ${note.userEmail}</span>` : ''}
                        </div>
                        <div class="note-content">${note.content}</div>
                        <div class="note-footer">
                            <small>Creado: ${new Date(note.createdAt).toLocaleDateString()}</small>
                            ${canEdit ? `
                                <div class="note-actions">
                                    <button class="btn-edit" data-note-id="${note.id}">Editar</button>
                                    <button class="btn-delete" data-note-id="${note.id}">Eliminar</button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
        }
        
        notesContainer.innerHTML = html;
    }

    // Función para renderizar las imágenes
    function renderImages() {
        const imagesContainer = document.getElementById('images-container');
        if (!imagesContainer) return;
        
        const data = getUserData();
        let html = '';
        
        if (data.images.length === 0) {
            html = '<p class="no-data">No hay imágenes disponibles.</p>';
        } else {
            data.images.forEach(image => {
                const isOwner = image.userId === getCurrentUser().id;
                const canDelete = isOwner || isAdmin();
                
                html += `
                    <div class="image-card" data-image-id="${image.id}">
                        <img src="${image.data}" alt="${image.description}" class="image-preview">
                        <div class="image-info">
                            <h4>${image.filename}</h4>
                            <p>${image.description}</p>
                            ${!isOwner ? `<small>Por: ${image.userEmail}</small>` : ''}
                            <small>Subido: ${new Date(image.createdAt).toLocaleDateString()}</small>
                            ${canDelete ? `
                                <button class="btn-delete" data-image-id="${image.id}">Eliminar</button>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
        }
        
        imagesContainer.innerHTML = html;
    }

    // Función anónima para inicializar la página de login
    const initLoginPage = function() {
        const loginForm = document.getElementById('login-form');
        if (!loginForm) return;
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            
            if (!email) {
                alert('Por favor ingresa un email válido');
                return;
            }
            
            if (!email.includes('@')) {
                alert('Por favor ingresa un email válido');
                return;
            }
            
            handleLogin(email);
        });
    };

    // Función anónima para inicializar página principal
    const initMainPage = function() {
        const userInfo = document.getElementById('user-info');
        const logoutBtn = document.getElementById('logout-btn');
        const noteForm = document.getElementById('note-form');
        const imageForm = document.getElementById('image-form');
        const adminPanel = document.getElementById('admin-panel');
        
        if (userInfo) {
            const user = getCurrentUser();
            userInfo.innerHTML = `
                <span>Bienvenido, ${user.email}</span>
                ${user.role === 'admin' ? '<span class="admin-badge">ADMIN</span>' : ''}
            `;
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
        
        if (adminPanel && isAdmin()) {
            adminPanel.style.display = 'block';
            const adminLink = document.getElementById('admin-link');
            if (adminLink) {
                adminLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = 'users.html';
                });
            }
        }
        
        if (noteForm) {
            noteForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const title = document.getElementById('note-title').value.trim();
                const content = document.getElementById('note-content').value.trim();
                
                if (!title || !content) {
                    alert('Por favor completa todos los campos');
                    return;
                }
                
                createNote(title, content);
                noteForm.reset();
                renderNotes();
            });
        }
        
        if (imageForm) {
            imageForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const fileInput = document.getElementById('image-file');
                const description = document.getElementById('image-description').value.trim();
                const file = fileInput.files[0];
                
                if (!file) {
                    alert('Por favor selecciona una imagen');
                    return;
                }
                
                if (!file.type.startsWith('image/')) {
                    alert('Por favor selecciona un archivo de imagen válido');
                    return;
                }
                
                if (file.size > 5 * 1024 * 1024) { // 5MB
                    alert('La imagen es demasiado grande. Máximo 5MB');
                    return;
                }
                
                uploadImage(file, description).then(() => {
                    imageForm.reset();
                    renderImages();
                }).catch(() => {
                    alert('Error al subir la imagen');
                });
            });
        }
        
        // Event listeners para acciones en notas e imágenes
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-edit')) {
                const noteId = e.target.dataset.noteId;
                editNoteModal(noteId);
            }
            
            if (e.target.classList.contains('btn-delete')) {
                if (e.target.dataset.noteId) {
                    const noteId = e.target.dataset.noteId;
                    if (confirm('¿Estás seguro de eliminar esta nota?')) {
                        if (deleteNote(noteId)) {
                            renderNotes();
                        }
                    }
                }
                
                if (e.target.dataset.imageId) {
                    const imageId = e.target.dataset.imageId;
                    if (confirm('¿Estás seguro de eliminar esta imagen?')) {
                        if (deleteImage(imageId)) {
                            renderImages();
                        }
                    }
                }
            }
        });
        
        renderNotes();
        renderImages();
    };

    // Función para el modal de edición de notas
    function editNoteModal(noteId) {
        const notes = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES)) || [];
        const note = notes.find(n => n.id === noteId);
        
        if (!note) return;
        
        const newTitle = prompt('Nuevo título:', note.title);
        if (newTitle === null) return;
        
        const newContent = prompt('Nuevo contenido:', note.content);
        if (newContent === null) return;
        
        if (updateNote(noteId, newTitle, newContent)) {
            renderNotes();
        }
    }

    // Función anónima para inicializar la página de administración
    const initAdminPage = function() {
        if (!isAdmin()) {
            alert('Acceso denegado');
            window.location.href = 'index.html';
            return;
        }
        
        const userInfo = document.getElementById('user-info');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (userInfo) {
            const user = getCurrentUser();
            userInfo.innerHTML = `
                <span>Panel Admin - ${user.email}</span>
                <span class="admin-badge">ADMIN</span>
            `;
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
        
        renderAdminUsers();
        renderAdminData();
        renderAdminLogs();
    };

    // Función para renderizar usuarios en admin
    function renderAdminUsers() {
        const usersContainer = document.getElementById('users-container');
        if (!usersContainer) return;
        
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
        let html = '<h3>Usuarios del Sistema</h3>';
        
        users.forEach(user => {
            html += `
                <div class="user-card">
                    <div class="user-info">
                        <strong>${user.email}</strong>
                        <span class="role-badge ${user.role}">${user.role.toUpperCase()}</span>
                    </div>
                    <small>Registrado: ${new Date(user.createdAt).toLocaleDateString()}</small>
                </div>
            `;
        });
        
        usersContainer.innerHTML = html;
    }

    // Función para renderizar datos en admin
    function renderAdminData() {
        const dataContainer = document.getElementById('admin-data-container');
        if (!dataContainer) return;
        
        const allNotes = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES)) || [];
        const allImages = JSON.parse(localStorage.getItem(STORAGE_KEYS.IMAGES)) || [];
        
        let html = '<h3>Todas las Notas</h3>';
        
        if (allNotes.length === 0) {
            html += '<p>No hay notas en el sistema</p>';
        } else {
            allNotes.forEach(note => {
                html += `
                    <div class="admin-note-card">
                        <h4>${note.title}</h4>
                        <p>${note.content}</p>
                        <small>Por: ${note.userEmail} - ${new Date(note.createdAt).toLocaleDateString()}</small>
                        <button class="btn-delete" data-note-id="${note.id}">Eliminar</button>
                    </div>
                `;
            });
        }
        
        html += '<h3>Todas las Imágenes</h3>';
        
        if (allImages.length === 0) {
            html += '<p>No hay imágenes en el sistema</p>';
        } else {
            allImages.forEach(image => {
                html += `
                    <div class="admin-image-card">
                        <img src="${image.data}" alt="${image.description}" class="admin-image-preview">
                        <div>
                            <h4>${image.filename}</h4>
                            <p>${image.description}</p>
                            <small>Por: ${image.userEmail} - ${new Date(image.createdAt).toLocaleDateString()}</small>
                            <button class="btn-delete" data-image-id="${image.id}">Eliminar</button>
                        </div>
                    </div>
                `;
            });
        }
        
        dataContainer.innerHTML = html;
    }

    // Función para renderizar logs en admin
    function renderAdminLogs() {
        const logsContainer = document.getElementById('logs-container');
        if (!logsContainer) return;
        
        const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS)) || [];
        let html = '<h3>Registro de Actividad</h3>';
        
        if (logs.length === 0) {
            html += '<p>No hay actividad registrada</p>';
        } else {
            // Esto muestra los logs más recientes primero
            const sortedLogs = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            sortedLogs.forEach(log => {
                html += `
                    <div class="log-entry">
                        <div class="log-action">${log.action}</div>
                        <div class="log-details">${log.details}</div>
                        <div class="log-meta">
                            <span>Usuario: ${log.userEmail}</span>
                            <span>${new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                    </div>
                `;
            });
        }
        
        logsContainer.innerHTML = html;
    }

    // Función autoejecutable para inicializar la aplicación
    (function() {
        initializeDefaultData();
        
        // Verifica la autenticación al cargar la página
        if (!checkAuth()) return;
        
        // Determina qué página estamos cargando e inicializa
        const currentPage = window.location.pathname.split('/').pop();
        
        switch (currentPage) {
            case 'login.html':
                initLoginPage();
                break;
            case 'users.html':
                initAdminPage();
                break;
            case 'index.html':
            case '':
                initMainPage();
                break;
        }
    })();

    // Exponemos las funciones globales necesarias
    window.crudzocial = {
        getCurrentUser,
        isAuthenticated,
        isAdmin,
        logout,
        renderNotes,
        renderImages,
        renderAdminData,
        renderAdminLogs
    };
})();
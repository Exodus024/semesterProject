// Функция для авторазиции пользователя
function login() {
    var username = document.getElementById('username').value;
    console.log('Username:', username);

    if (username) {
        localStorage.setItem('username', username);
        console.log('Имя пользователя сохранено в хранилище');
        window.location.href = 'main.html';
    } else {
        alert('Пожалуйста, введите ваше имя');
    }
}


//Функция для проверки статуса авторизации пользователя
function checkLogin() {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('user-name').textContent = username;
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
    } else {
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('main-container').style.display = 'none';
    }
}

// Запуск проверки авторизации при загрузке страницы
document.addEventListener('DOMContentLoaded', checkLogin);

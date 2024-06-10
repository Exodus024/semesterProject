// Инициализация переменных для хранения меток
let map;
let userPlacemark;
let markers = [];

// Инициализация карты
function initMap() {
    map = new ymaps.Map("map", {
        center: [55.355198, 86.086847],
        zoom: 10
    });

    // Загружаем маркер пользователя, если он есть
    const userMarker = JSON.parse(localStorage.getItem('userMarker'));
    if (userMarker) {
        addUserMarker(userMarker.latitude, userMarker.longitude);
    } else {
        alert('Для отображения себя на карте, воспользуйтесь функцией "Поставить метку себя" ');
    }

    window.map = map;
}

ymaps.ready(initMap);

// Функция для отображения формы ввода адреса пользователя
function showUserMarkerInput() {
    document.getElementById('user-marker-container').style.display = 'block';
    document.getElementById('multiple-markers-container').style.display = 'none';
}

// Функция для установки метки пользователя
function setUserMarker() {
    const address = document.getElementById('user-address').value;
    const apiKey = 'a4c6ae90-68fd-4076-b8fe-425ad064d21e';

    if (address) {
        fetch(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${apiKey}&geocode=${address}`)
            .then(response => response.json())
            .then(data => {
                const geoObject = data.response.GeoObjectCollection.featureMember[0]?.GeoObject; // получаем координаты
                if (geoObject) {
                    const coordinates = geoObject.Point.pos.split(' ');

                    const longitude = parseFloat(coordinates[0]);
                    const latitude = parseFloat(coordinates[1]);

                    localStorage.setItem('userMarker', JSON.stringify({ latitude, longitude })); // сохраняем в хранилище

                    addUserMarker(latitude, longitude);
                } else {
                    alert('Не удалось найти координаты для указанного адреса.');
                }
            })
            .catch(error => {
                console.error('Ошибка при получении координат:', error);
                alert('Не удалось получить координаты. Проверьте адрес и попробуйте снова.');
            });
    } else {
        alert('Пожалуйста, введите адрес');
    }
}

// Функция для добавления метки пользователя
function addUserMarker(latitude, longitude) {
    if (userPlacemark) {
        map.geoObjects.remove(userPlacemark);
    }

    userPlacemark = new ymaps.Placemark([latitude, longitude], {
        balloonContent: 'Ваш адрес'
    }, {
        preset: 'islands#greenDotIcon'
    });
    map.geoObjects.add(userPlacemark);
    map.setCenter([latitude, longitude]);
}

// Функция для удаления метки пользователя
function removeUserMarker() {
    localStorage.removeItem('userMarker');
    if (userPlacemark) {
        map.geoObjects.remove(userPlacemark);
    }
    alert('Ваш адрес удален');
}

// функция отображает форму ввода нескольких адресов и скрывает форму для ввода адреса пользователя.
function showMultipleMarkersInput() {
    document.getElementById('user-marker-container').style.display = 'none';
    document.getElementById('multiple-markers-container').style.display = 'block';
}

// Функция для генерации полей ввода адресов
function generateAddressInputs() {
    const count = document.getElementById('markers-count').value;
    const addressesContainer = document.getElementById('addresses-container');
    // создаем контейнеры для ввода адресов
    addressesContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Введите адрес ${i + 1}`;
        input.className = 'address-input';
        addressesContainer.appendChild(input);
    }

    document.getElementById('set-multiple-markers-button').style.display = 'block';
}

// Функция для установки нескольких меток
function setMultipleMarkers() {
    const addressInputs = document.querySelectorAll('.address-input');
    const apiKey = 'a4c6ae90-68fd-4076-b8fe-425ad064d21e';
    // создаем массив промисов для каждого поля ввода адреса
    const promises = Array.from(addressInputs).map(input => {
        const address = input.value;
        return fetch(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${apiKey}&geocode=${address}`)
            .then(response => response.json())
            .then(data => {
                const geoObject = data.response.GeoObjectCollection.featureMember[0]?.GeoObject;
                if (geoObject) {
                    const coordinates = geoObject.Point.pos.split(' ');
                    return { longitude: parseFloat(coordinates[0]), latitude: parseFloat(coordinates[1]) };
                } else {
                    console.error('Не удалось найти координаты для адреса:', address);
                    alert(`Не удалось найти координаты для адреса: ${address}`);
                    return null;
                }
            });
    });
    // ждем пока все промисы будут выполнены
    Promise.all(promises)
        .then(coordinatesArray => {
            const validCoordinates = coordinatesArray.filter(coords => coords !== null);
            // для каждой не null координаты создаем метку на карте
            validCoordinates.forEach(coords => {
                const placemark = new ymaps.Placemark([coords.latitude, coords.longitude], {
                    balloonContent: 'Метка'
                }, {
                    preset: 'islands#redDotIcon'
                });
                map.geoObjects.add(placemark);
                // добавляем метку в массив
                markers.push(placemark);
            });
        })
        .catch(error => {
            console.error('Ошибка при получении координат:', error);
            alert('Не удалось получить координаты. Проверьте адреса и попробуйте снова.');
        });
}

// Функция для удаления всех меток, кроме метки пользователя
function removeAllMarkers() {
    markers.forEach(marker => {
        if (marker !== userPlacemark) {
            map.geoObjects.remove(marker);
        }
    });
    markers = [];
    alert('Все метки, кроме вашей, удалены');
}

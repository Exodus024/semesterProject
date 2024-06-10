let multiRoute;

// Функция для построения маршрута между метками
function buildRoute() {
    if (markers.length < 1) {
        alert('Для построения маршрута необходимо добавить как минимум одну дополнительную метку');
        return;
    }
    // массив из пользовательской координаты и всех остальных
    const points = userPlacemark ? [userPlacemark.geometry.getCoordinates(), ...markers.map(marker => marker.geometry.getCoordinates())] : markers.map(marker => marker.geometry.getCoordinates());

    multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: points,
        params: {
            routingMode: 'pedestrian'
        }
    }, {
        boundsAutoApply: true
    });
    // добавляем маршрут на карту
    map.geoObjects.add(multiRoute);
}

// Функция для сброса маршрута
function resetRoute() {
    if (multiRoute) {
        map.geoObjects.remove(multiRoute);
        multiRoute = null;
        alert('Маршрут сброшен');
    } else {
        alert('Маршрут не построен');
    }
}

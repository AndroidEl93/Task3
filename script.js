var allTasks = null; //Полный список задач

$(function() {
    //Установка календаря
    $("#menu_datepicker").datepicker({});

    //У меня не получилось напрямую из JS получить данные с сервера api, пытался долго и безрезультатно.
    //Единственный выход который я нашел, посылать запрос через php, там все оказалось без проблем.
    //Для справки, ошибка: Access to XMLHttpRequest at 'https://todo.doczilla.pro/api/todos?limit=3' from origin 'http://localhost'
    //has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

    //На скрипт server.php передаю параметром url сервера с которого хочу получить данные
    //Я решил что удобнее будет получить список всех задач разом и работать с ними здесь на стороне клиента
    var apiUrl = "https://todo.doczilla.pro/api/todos";
    $.ajax({
        url: "server.php?url=" + encodeURIComponent(apiUrl),
        type: 'GET',
        success: function(res) {
            //Все полученные задачи будут храниться в переменной allTasks
            allTasks = res;
        },
        error: function(res) { alert("Ошибка подключения к серверу!"); }
    });
});
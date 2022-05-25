var allTasks = []; //Полный список задач
var currentTasks = []; //Список отображаемых задач

//Функция вычисляет и присваивает timestamp каждой задаче списка tasks
function setTasksTimestamp(tasks) {
    for (let i = 0; i < tasks.length; i++) {
        tasks[i]['timestamp'] = new Date(tasks[i]['date'].slice(0, 23)).getTime();
    }
}

//Функция возвращает отфильтрованный список задач на указаный день
//date - Объект Date, хранящий дату по которой осуществляется отбор задач
//source - Исходный массив задач
//return - Отфильтрованый по дате список задач
function filterTasksByDay(dateFrom, dateTo, source) {
    let tasks = [];
    dateFrom.setHours(0, 0, 0, 0);
    let todayFrom = dateFrom.getTime();

    let todayTo;
    if (dateTo == null) {
        dateFrom.setHours(23, 59, 59, 999);
        todayTo = dateFrom.getTime();
    } else {
        dateTo.setHours(23, 59, 59, 999);
        todayTo = dateTo.getTime();
    }

    for (let i = 0; i < source.length; i++) {
        if ((source[i]['timestamp'] >= todayFrom) && (source[i]['timestamp'] <= todayTo)) {
            tasks.push(source[i]);
        }
    }
    return tasks;
}

//Функция возвращает отфильтрованный список задач по совпадению в названии
//text - Строка, по нахождению которой в названии задач, осуществляется отбор
//source - Исходный массив задач
//return - Отфильтрованый по дате список задач
function filterTasksByName(text, source) {
    let tasks = [];
    for (let i = 0; i < source.length; i++) {
        if (( (source[i]['name'].toLowerCase()).indexOf(text.toLowerCase()) ) != -1) {
            tasks.push(source[i]);
        }
    }
    return tasks;
}

//Функция отображает информацию для выбранного дня
//date - объект Date.
function showByDate(date) {
    //Сменить текст текущей даты
    $("#list_date").text(new Intl.DateTimeFormat('ru-RU', {month:'long', day:'numeric', year: 'numeric'}).format(date));
    //Отфильтровываем список задач на сегодня
    currentTasks = filterTasksByDay(date, null, allTasks);
    //И отображаем их
    showTasks(currentTasks);
}

//Функция отображает информацию для диапазона дат
//dateFrom, dateTo - объекты Date
function showByDatesRange(dateFrom, dateTo) {
    $("#list_date").text("Диапазон дат: " +
        new Intl.DateTimeFormat('ru-RU', {month:'long', day:'numeric', year: 'numeric'}).format(dateFrom) +
        " - " +
        new Intl.DateTimeFormat('ru-RU', {month:'long', day:'numeric', year: 'numeric'}).format(dateTo));
    currentTasks = filterTasksByDay(dateFrom, dateTo, allTasks);
    showTasks(currentTasks);
}

//Функция отображает информацию по поиску
function showBySearch(request) {
    $("#list_date").text("Поиск по запросу: \""+request+"\"");
    //Отфильтровываем список задач на сегодня
    currentTasks = filterTasksByName(request, allTasks);
    //И отображаем их
    showTasks(currentTasks);
}

//Отображение на странице задач из списка tasks
function showTasks(tasks) {
    //Включен ли режим "Только невыполненные"
    let onlyUnfulfilledTasks = $("#menu_cb_unfulfilled").is(':checked');

    $('#list_container').html("");
    for (let i = 0; i < tasks.length; i++) {
        //Показывать задачи либо если они не выполнены, либо если не включен режим "Только невыполненные"
        if (!tasks[i]['status'] || !onlyUnfulfilledTasks) {
            let task = $('<div></div>')
                .attr("class","task")
                .attr("id", "task_" + i)
                .attr("onclick","openTask(" + i + ");");
            task.append($('<div></div>').attr("class","task_name").text(tasks[i]['name']));
            task.append($('<div></div>')
                .attr("id","task_description_" + i)
                .attr("class","task_description")
                .text(tasks[i]['shortDesc']));
            task.append($('<div></div>').attr("class","task_date").text(
                new Intl.DateTimeFormat('ru-RU', {month:'numeric', day:'numeric', year: 'numeric', hour: 'numeric',
                    minute: 'numeric', second: 'numeric'}).format(new Date(tasks[i]['date']))
            ));
            task.append($('<input>').attr("type","checkbox").attr("class","task_check").attr("checked",tasks[i]['status']));
            $('#list_container').append(task);
        }
    }
}

//Сортировка списка задач source
function sortTasks(source) {
    source.sort((a, b) => (a['timestamp'] > b['timestamp']) ? 1 : -1);
    showTasks(source);
}

//Раскрытие / сворачивания задачи
function openTask(i) {
    if ($("#task_"+i).hasClass("opentask")) {
        $("#task_"+i).removeClass("opentask");
    } else {
        $("#task_"+i).addClass("opentask");
    }
}

$(function() {
    //Установка календаря
    $("#menu_datepicker").datepicker({
        range: "",
        range_multiple_max: 3,
        //При смете даты в календаре
        onSelect: function(dateText, inst, extensionRange) {
            //Отображаем задачи на выбранный в календаре день/дни
            if (extensionRange != undefined) {//Множественный выбор
                showByDatesRange(new Date(extensionRange.startDateText), new Date(extensionRange.endDateText));
            } else {//Одиночный выбор
                showByDate(new Date(dateText));
            }
        }
    });

    $("#search").keypress(function(e) {
        //При нажатии клавиши enter на строке поиска, отображаем задачи названия которых содержат текст запроса
        if (e.which == '13') {
            showBySearch($("#search").val());
        }
    });

    //Отображаем задачи на сегодня
    $("#menu_btn_today").click(function(e) {
        $("#menu_datepicker").datepicker("setDate", new Date());
        showByDate(new Date());
    });

    //Отображаем задачи на неделю
    $("#menu_btn_week").click(function(e) {
        let today = new Date();
        let day = today.getDay();
        let firstDay = today.getDate() - day + (day == 0 ? -6 : 1);
        $("#menu_datepicker").datepicker("setDate", new Date());
        showByDatesRange(new Date(today.setDate(firstDay)), new Date(today.setDate(firstDay+6)));
    });

    //Сортировка задач по времени
    $("#list_sort").click(function(e) {
       sortTasks(currentTasks);
    });

    //При смене флажка "Только не выполненные" обновляем список задач
    $("#menu_cb_unfulfilled").change(function(e) {
        showTasks(currentTasks);
    });

    //При смене флажка "Выбор диапазона дат" меняем режим datepicker-а
    $("#menu_cb_period").change(function(e) {
        if ($("#menu_cb_period").is(':checked')) {
            $("#menu_datepicker").datepicker("option","range","period");
        } else {
            $("#menu_datepicker").datepicker("option","range","");
        }
    });

    //У меня не получилось напрямую из JS получить данные с сервера api, пытался долго и безрезультатно.
    //Единственный выход который я нашел, посылать запрос через php, там все оказалось без проблем.
    //Для справки, ошибка: Access to XMLHttpRequest at 'https://todo.doczilla.pro/api/todos?limit=3' from origin 'http://localhost'
    //has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

    //На скрипт server.php передаю параметром url сервера с которого хочу получить данные
    //Я решил что удобнее будет получить список всех задач разом и работать с ними на здесь стороне клиента
    var apiUrl = "https://todo.doczilla.pro/api/todos";
    $.ajax({
        url: "server.php?url=" + encodeURIComponent(apiUrl),
        type: 'GET',
        success: function(res) {
            //Все полученные задачи будут храниться в переменной allTasks
            allTasks = res;
            //Для всех задач вычисляю timestamp, мне кажется с ним удобнее и быстрее работать
            setTasksTimestamp(allTasks);
            //Отображаем задачи на сегодня
            showByDate(new Date());
        },
        error: function(res) { alert("Ошибка подключения к серверу!"); }
    });
});
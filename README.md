# Задание #3 (Task3)

### Инструкция по запуску
Для удобства, я залил проект на свой сервер: https://androidel.org/task3/

### Краткое описание
Использовал библиотеку jQuery, а так же jQuery UI, из которой был взят календарь - виджет jQuery UI Datepicker.
Для возможности выбора диапазона дат, добавил к виджету расширеение.
Данные с сервера идут через php скрипт (напрямую из js не получилось получить данные, из за ошибки, которую не получилось решить (CORS policy)).
Программа в самом начале запрашивает полный список задач и вся последующая работа с данными происходит на стороне клиента.
Полный список задач хранится в переменной allTasks, из которого, в зависимости от потребностей пользователя, необходимые для отображения задачи 
добавляются в переменную currentTasks и отображаются на странице.
Для каждой задачи добавил поле 'timestamp', которое вычисленно из поля 'date'. Посредством 'timestamp' происходят все 
временые сравнения и сортировка.
Возможность открывать полное описание задачи я реализовал через модальное окно.

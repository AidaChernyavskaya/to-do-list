let tasks = []

function ready() {
    // получить текущую дату
    let date = new Date();

    // добавить "объекты" начиная с текущей даты до ...
    // получить calendar
    let calendar = document.getElementById('calendar');

    for (let i = 0; i < 5; i++) {
        // создать объект
        let item = document.createElement('div');

        // добавить в calendar
        calendar.appendChild(item);

    }

}


document.addEventListener("DOMContentLoaded", ready);

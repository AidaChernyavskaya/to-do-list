let tasks = []

function ready() {
    // получить текущую дату
    let date = new Date();
    let weekdays = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];


    //первый день = сегодняшняя дата
    let day = document.getElementById('day');
    day.innerHTML = String(date.getDate());

    let weekday = document.getElementById('weekday');
    weekday.innerHTML = weekdays[date.getDay()];


    // добавить "объекты" начиная с текущей даты до ...
    // получить calendar
    let days = document.getElementById('days');

    for (let i = 0; i < 13; i++) {
        date.setDate(date.getDate() + 1);

        let item = document.createElement('div');
        item.classList.add('date');
        if (i > 5){
            item.classList.add('last');
        }
        days.appendChild(item);

        let item_day = document.createElement('div');
        item_day.classList.add('number');
        item.appendChild(item_day);
        item_day.innerHTML = String(date.getDate());

        let item_weekday = document.createElement('div');
        item_weekday.classList.add('weekday');
        item.appendChild(item_weekday);
        item_weekday.innerHTML = weekdays[date.getDay()];
    }

}


document.addEventListener("DOMContentLoaded", ready);

function html_ready() {
    let date = new Date();
    let weekdays = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
    let days = document.getElementById('days');

    let items_count = calculate_elements_amount(days);
    create_days(items_count, days, weekdays, date);
}


// определим количество добавляемых элементов в зависимости от ширины экрана
function calculate_elements_amount(days){
    let width_container = days.offsetWidth;
    let width_item = 60;
    let items_count = Math.trunc(width_container / width_item);

    return(items_count);
}


// создадим и добавим "объекты" с текущей даты до...
function create_days(items_count, days, weekdays, date){
    for (let i = 0; i < items_count; i++) {

        let item = document.createElement('div');
        item.classList.add('date');
        days.appendChild(item);

        let item_day = document.createElement('div');
        item_day.classList.add('number');
        item.appendChild(item_day);
        item_day.innerHTML = String(date.getDate());

        let item_weekday = document.createElement('div');
        item_weekday.classList.add('weekday');
        item.appendChild(item_weekday);
        item_weekday.innerHTML = weekdays[date.getDay()];

        date.setDate(date.getDate() + 1);

    }
}


// очищаем элемент days
function clear_days(){
    let days = document.getElementById('days');
    days.innerHTML = '';
}

document.addEventListener("DOMContentLoaded", html_ready);

window.addEventListener('resize',function(){
    clear_days();
    html_ready();
});

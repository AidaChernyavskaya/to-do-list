const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
let k = 1; //offset

function html_ready() {
    create_calendar(new Date());

    slide_next();
    slide_previous();
}

// создадим календарь
function create_calendar(start_date) {
    let days = document.getElementById('days');

    // заполним дни в календаре
    let items_count = calculate_elements_amount(days);
    for (let i = 0; i < items_count; i++) {
        create_day(days, start_date);
        start_date.setDate(start_date.getDate() + 1);
    }
}

// определим количество добавляемых элементов в зависимости от ширины экрана
function calculate_elements_amount(days){
    let width_container = days.offsetWidth;
    let width_item = 60;
    let items_count = Math.trunc(width_container / width_item);

    return(items_count);
}

// создадим и добавим "объекты" с текущей даты до...
function create_day(days, date){
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
    item_weekday.innerHTML = WEEKDAYS[date.getDay()];
}

// очищаем элемент days
function clear_calendar(){
    document.getElementById('days').innerHTML = '';
}

function slide_next(){
    document.getElementById('next').onclick = create_next_calendar;
}

function slide_previous(){
    let previous = document.getElementById('previous');
    previous.onclick = create_previous_calendar;
}

function create_next_calendar(){
    let current_date = new Date();
    current_date.setDate(current_date.getDate() + k);
    console.log(current_date);

    clear_calendar();
    create_calendar(current_date);

    k++;
}

function create_previous_calendar(){
    let current_date = new Date();
    current_date.setDate(current_date.getDate() + k - 1);
    current_date.setDate(current_date.getDate() - 1);
    console.log(current_date);

    clear_calendar();
    create_calendar(current_date);

    k--;
}

document.addEventListener("DOMContentLoaded", html_ready);

document.addEventListener('keydown', function(event) {
    if (event.key == 'ArrowRight') {
        create_next_calendar();
    }
    if (event.key == 'ArrowLeft') {
        create_previous_calendar();
    }
});

window.addEventListener('resize',function(){
    clear_calendar();
    html_ready();
});

const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
let k = 1; //offset

let tasks = {
    "23-08-2022": [
        {"title": "Помыть посуду", "done": false},
        {"title": "Помыть посуду2", "done": true}
    ]
}

function html_ready() {
    create_calendar(new Date());

    init_events_handlers();
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

// "перелистывание" календаря на 1 день вперед
function create_next_calendar(){
    let current_date = new Date();
    current_date.setDate(current_date.getDate() + k);
    console.log(current_date);

    clear_calendar();
    create_calendar(current_date);

    k++;
}

// "перелистывание" календаря на 1 день назад
function create_previous_calendar(){
    let current_date = new Date();
    current_date.setDate(current_date.getDate() + k - 1);
    current_date.setDate(current_date.getDate() - 1);
    console.log(current_date);

    clear_calendar();
    create_calendar(current_date);

    k--;
}

function add_task(){
    let task_obj = {
        title: document.getElementById('add_field').value,
        done: false
    }
    tasks["23-08-2022"].push(task_obj);

    let tasks_elements = document.getElementById('tasks_elements');
    let task = document.createElement('div');
    task.classList.add('task');
    tasks_elements.appendChild(task);

    let name = document.createElement('div');
    name.classList.add('name');
    name.innerHTML = task_obj.title;
    task.appendChild(name);

    let icon = document.createElement('div');
    icon.classList.add('icon');
    task.appendChild(icon);
    let image=document.createElement('img');
    image.classList.add('trash');
    image.src = './images/delete.png';
    image.alt = 'Удалить';
    icon.appendChild(image);

    let tick = document.createElement('div');
    tick.classList.add('tick');
    task.appendChild(tick);

}

function init_events_handlers(){
    document.getElementById('next').onclick = create_next_calendar;
    document.getElementById('previous').onclick = create_previous_calendar;
    document.getElementById('add_button').onclick = add_task;
}

document.addEventListener("DOMContentLoaded", html_ready);

// обработка нажатий клавиатуры
document.addEventListener('keydown', function(event) {
    if (event.key == 'ArrowRight') {
        create_next_calendar();
    }
    if (event.key == 'ArrowLeft') {
        create_previous_calendar();
    }
    if (event.key == 'Enter') {
        add_task();
    }
});

// изменение элементов при динамически изменяемой ширине экрана
window.addEventListener('resize',function(){
    clear_calendar();
    html_ready();
});




//
// let current_day = Date();
//
// const show_current_day_tasks = () => {
//     let current_day_tasks = tasks[current_day];
//     for task in current_day_tasks:
//         show_task(task);
// }
//
// const add_task = () => {
//     tasks[current_day].push({})
//     update_current_day_tasks()
// }
//
// const update_current_day_tasks = () => {
//     clear_tasks();
//     show_current_day_tasks();
// }


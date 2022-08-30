const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
let k = 1; //offset
let current_date = new Date();

function html_ready() {
    create_calendar(new Date());

    init_events_handlers();

    show_current_date_tasks();
}

// создадим календарь
function create_calendar(start_date) {
    let days = document.getElementById('days');
    console.log(current_date, "inside create_calendar");

    // заполним дни в календаре
    let items_count = calculate_elements_amount(days);
    for (let i = 0; i < items_count; i++) {
        create_day(days, start_date);
        start_date.setDate(start_date.getDate() + 1);
    }
    console.log(current_date, "inside create_calendar after for");
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
    // if date < date: add class зачеркнутый
    // if localStorage[generate_key_by_date()].lenght == 0: тускло
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

function clear_tasks(){
    document.getElementById('tasks_elements').innerHTML = '';
}

// "перелистывание" календаря на 1 день вперед
function create_next_calendar(){
    let current_day = new Date(); //A

    current_day.setDate(current_day.getDate() + k);
    let year = current_day.getFullYear();
    let month = current_day.getMonth();
    let date = current_day.getDate();
    console.log(current_day);
    current_date.setFullYear(year, month, date);
    console.log(current_date, "what i need - current_date after pressing next button");

    clear_calendar();
    create_calendar(current_day);

    k++;
}

// "перелистывание" календаря на 1 день назад
function create_previous_calendar(){
    let current_day = new Date();
    current_day.setDate(current_day.getDate() + k - 1);
    current_day.setDate(current_day.getDate() - 1);
    let year = current_day.getFullYear();
    let month = current_day.getMonth();
    let date = current_day.getDate();
    console.log(current_day);
    current_date.setFullYear(year, month, date);
    console.log(current_date, "current_date after pressing previous button");


    clear_calendar();
    create_calendar(current_day);

    k--;
}

function add_task(){
    let current_id = get_value_from_storage('current_id');
    if (current_id == null) {
        current_id = 1;
    } else {
        current_id++;
    }
    set_value_from_storage('current_id', current_id);

    let task_obj = {
        title: document.getElementById('add_field').value,
        done: false,
        id: current_id
    }


    let key = generate_key_by_date(new Date());
    // console.log(current_date);
    console.log(key);
    let tasks = get_json_from_storage(key);
    tasks.push(task_obj);
    update_json_in_storage(key, tasks);
    update_current_day_tasks();
    document.getElementById('add_field').value = '';
}

function update_current_day_tasks(){
    clear_tasks();
    show_current_date_tasks();
}

function show_current_date_tasks(){
    let key = generate_key_by_date(new Date());
    let tasks = get_json_from_storage(key);
    for (let i = 0; i < tasks.length; i++){
        show_task(tasks[i]);
    }
}

function show_task(current_day_task){
    let tasks_elements = document.getElementById('tasks_elements');
    let task = document.createElement('div');
    task.classList.add('task');
    if (current_day_task.done){
        task.classList.add('done');
    }
    tasks_elements.appendChild(task);

    let name = document.createElement('div');
    name.classList.add('name');
    name.innerHTML = current_day_task.title;
    task.appendChild(name);

    let icon = document.createElement('div');
    icon.classList.add('icon');
    // icon.id = ('id_' + current_day_task.id);
    icon.onclick = () => {
        delete_task(current_day_task.id);
    }

    task.appendChild(icon);
    let image=document.createElement('img');
    image.classList.add('trash');
    image.src = './images/delete.png';
    image.alt = 'Удалить';
    icon.appendChild(image);

    let tick = document.createElement('div');
    tick.classList.add('tick');
    task.appendChild(tick);
    tick.onclick = () => {
        mark_as_done(tick.parentNode);
        change_done_parameter(current_day_task.id);
    }

}

function mark_as_done(task){
    task.classList.toggle('done');

}

function change_done_parameter(task_id){
    let key = generate_key_by_date(new Date());
    let tasks = get_json_from_storage(key);

    for(let i = 0; i < tasks.length; i++){
        if (tasks[i]['id'] === task_id){
            tasks[i]['done'] = !(tasks[i]['done']);
        }
    }

    update_json_in_storage(key, tasks);
    update_current_day_tasks();
}

function generate_key_by_date(date) {
    return `tasks_${date.getDate()}-${(date.getMonth() + 1)}-${date.getFullYear()}`;
}

function init_events_handlers(){
    document.getElementById('next').onclick = create_next_calendar;
    document.getElementById('previous').onclick = create_previous_calendar;
    document.getElementById('add_button').onclick = add_task;
}

const update_json_in_storage = (key, obj) => {
    let serialized = JSON.stringify(obj);
    localStorage.setItem(key, serialized);
}

const get_json_from_storage = (key) => {
    let serialized = localStorage.getItem(key);
    if (serialized == null){
        return [];
    }
    return JSON.parse(serialized);
}

const get_value_from_storage = (key) => {
    return localStorage.getItem(key);
}

const set_value_from_storage = (key, value) => {
    return localStorage.setItem(key, value);
}

function delete_task(task_id){
    // получим ключ
    let key = generate_key_by_date(new Date());

    // получим массив тасков по ключу из локал стореджа
    let tasks = get_json_from_storage(key);
    console.log(tasks);
    //удалим элемент task_id из массива
    for(let i = 0; i < tasks.length; i++){
        if (tasks[i]['id'] === task_id){
            tasks.splice(i, 1);
        }
    }

    // обновляем данные в локал сторедже
    update_json_in_storage(key, tasks);

    // обновлем отображение
    update_current_day_tasks();
}

document.addEventListener("DOMContentLoaded", html_ready);

// обработка нажатий клавиатуры
document.addEventListener('keydown', function(event) {
    if (event.key == 'ArrowRight') {
        create_next_calendar();
        console.log(current_date, "after press button next");
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
    create_calendar(new Date());
});
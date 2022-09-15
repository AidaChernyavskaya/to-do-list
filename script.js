const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
// let k = 1; //offset
let current_date = new Date();

function html_ready() {
    create_calendar(new Date());

    init_events_handlers();

    show_current_date_tasks();

    drag_n_drop_element();
}

// создадим календарь
function create_calendar(start_date) {
    let days = document.getElementById('days');
    let tmp = new Date(start_date);

    clear_calendar();
    // заполним дни в календаре
    let items_count = calculate_elements_amount(days);
    for (let i = 0; i < items_count; i++) {
        create_day(days, tmp);
        tmp.setDate(tmp.getDate() + 1);
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
    let copies_date = new Date(date.getTime());
    item.onclick = () =>{
        change_current_date(copies_date);
        clear_calendar();
        create_calendar(copies_date);
    }

    let item_day = document.createElement('div');
    item_day.classList.add('number');
    item.appendChild(item_day);
    item_day.innerHTML = String(date.getDate());

    let item_weekday = document.createElement('div');
    item_weekday.classList.add('weekday');
    item.appendChild(item_weekday);
    item_weekday.innerHTML = WEEKDAYS[date.getDay()];

    let key = generate_key_by_date(date);
    let arr = get_json_from_storage(key);
    if (arr.length != 0){
        let mark_if_exist_tasks = document.createElement('div');
        mark_if_exist_tasks.classList.add('mark_if_exist_tasks');
        item.appendChild(mark_if_exist_tasks);
    }

    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
    if (date.valueOf() < today){
        item.classList.add('past');
    }
}

// очищаем элемент days
function clear_calendar(){
    document.getElementById('days').innerHTML = '';
}

function clear_tasks(){
    document.getElementById('tasks_elements').innerHTML = '';
}

function change_current_date(day){
    let year = day.getFullYear();
    let month = day.getMonth();
    let date = day.getDate();
    current_date.setFullYear(year, month, date);
}

// "перелистывание" календаря на 1 день вперед
function create_next_calendar(){
    let current_day = current_date;
    current_day.setDate(current_day.getDate() + 1);
    change_current_date(current_day);

    clear_calendar();
    create_calendar(current_day);
    update_current_day_tasks();

}

// "перелистывание" календаря на 1 день назад
function create_previous_calendar(){
    let current_day = current_date;
    current_day.setDate(current_day.getDate() - 1);
    change_current_date(current_day);

    clear_calendar();
    create_calendar(current_day);
    update_current_day_tasks();

}

function add_task(){
    let task_obj = {};
    let current_id = get_value_from_storage('current_id');
    if (current_id == null) {
        current_id = 1;
    } else {
        current_id++;
    }
    set_value_from_storage('current_id', current_id);

    let title_value = document.getElementById('add_field').value;
    if (title_value != "" && title_value != " "){
        task_obj = {
            title: title_value,
            done: false,
            id: current_id
        }
    } else{
        return;
    }

    let key = generate_key_by_date(current_date);
    // console.log(current_date);
    // console.log(key, "key while add task");
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
    let key = generate_key_by_date(current_date);
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
    task.draggable = true;
    task.id = current_day_task.id;
    tasks_elements.appendChild(task);



    let icon_for_drag_drop = document.createElement('div');
    icon_for_drag_drop.classList.add('icon');
    icon_for_drag_drop.classList.add('margin_for_drag_n_drop');
    task.appendChild(icon_for_drag_drop);
    let image_arrows=document.createElement('img');
    image_arrows.classList.add('arrows_for_drag_n_drop');
    image_arrows.src = './images/descendant.png';
    image_arrows.alt = 'Передвинуть';
    icon_for_drag_drop.appendChild(image_arrows);

    // let name = document.createElement('div');
    // name.classList.add('name');
    // name.innerHTML = current_day_task.title;
    // task.appendChild(name);

    let name = document.createElement('input');
    name.classList.add('name');
    name.setAttribute('type', 'text');
    name.value = current_day_task.title;
    name.readOnly = 'readonly';
    task.appendChild(name);

    let icon_for_edit = document.createElement('div');
    icon_for_edit.classList.add('icon');
    icon_for_edit.classList.add('margin_for_edit');
    task.appendChild(icon_for_edit);
    icon_for_edit.onclick = function (){
        name.removeAttribute('readOnly');
        name.focus();
        image_edit.src = './images/close.png';
        current_day_task.title = name.value;
        console.log(current_day_task.title);

    }
    let image_edit = document.createElement('img');
    image_edit.classList.add('trash');
    image_edit.src = './images/edit.png';
    image_edit.alt = 'Редактировать';
    icon_for_edit.appendChild(image_edit);

    let icon = document.createElement('div');
    icon.classList.add('icon');
    icon.classList.add('margin_for_delete');
    // icon.id = ('id_' + current_day_task.id);
    icon.onclick = function() {
        let ended = false;

        task.addEventListener('transitionend', function (){
            if (!ended) {
                ended = true;
                delete_task(current_day_task.id);
            }
        });
        task.classList.add('task_disappeared');
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

function sort_elements_in_localStorage(){
    let tasks_elements = document.querySelectorAll(".task");
    // console.log(tasks_elements[1].id);

    let key = generate_key_by_date(current_date);
    let tasks = get_json_from_storage(key);
    // console.log(tasks);
    let tasks_obj = [];

    for (let i = 0; i < tasks_elements.length; i++){
        for (let j = 0; j < tasks.length; j++){
            console.log(tasks_elements[i].id, 'on page');
            console.log(tasks[j].id);
            if (tasks_elements[i].id == tasks[j].id){
                tasks_obj[i] = tasks[j];
            }
        }
    }
    // console.log(tasks);
    // console.log(tasks_obj);

    update_json_in_storage(key, tasks_obj);
}

function drag_n_drop_element(){
    // let key = generate_key_by_date(current_date);
    // let tasks = get_json_from_storage(key);
    //
    // console.log(tasks);

    let task_list_elements = document.querySelector('.tasks_elements');


    task_list_elements.addEventListener('dragstart', (evt) =>{
        evt.target.classList.add('selected');
    });
    task_list_elements.addEventListener('dragend', (evt) =>{
        evt.target.classList.remove('selected');
    });

    task_list_elements.addEventListener('dragover', (evt) =>{
        evt.preventDefault();

        const active_element = task_list_elements.querySelector(".selected");
        const current_element = evt.target;
        const is_moveable = active_element !== current_element && current_element.classList.contains('task');
        if (!is_moveable){
            return;
        }

        const next_element = get_next_element(evt.clientY, current_element);

        if (next_element && active_element === next_element.previousElementSibling || active_element === next_element) {
            return;
        }

        task_list_elements.insertBefore(active_element, next_element);
        sort_elements_in_localStorage();
    })
}

const get_next_element = (cursor_position, current_element) => {
    const current_element_coord = current_element.getBoundingClientRect();
    const current_element_center = current_element_coord.y + current_element_coord.height / 2;
    const next_element = (cursor_position < current_element_center) ?
        current_element :
        current_element.nextElementSibling;

    return next_element;
}

function mark_as_done(task){
    task.classList.toggle('done');
}

function change_done_parameter(task_id){
    let key = generate_key_by_date(current_date);
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


/* local storage */

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

/**/

function delete_task(task_id){
    // получим ключ
    let key = generate_key_by_date(current_date);

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



/*
* 1. UI-layer
* 2. Data-layer
* 3. Service-layer
* 4. Utils-layer (a, b): return a + b;
*
* */
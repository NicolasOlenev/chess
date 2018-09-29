'use strict'
window.onload = function() {    // Загружать скрипт только после полной загрузки DOM  
var wrapper = document.querySelector('.wrapper'),
    table = document.createElement('table'),
    ltrs = ['0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', '0'],
    nmbrs = ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0'];
wrapper.appendChild(table);
{   // создаем шахматную доску; раскрашиваем клетки; отмечаем боковые поля для цифр и букв (начало)
for (var i = 0; i < 10; i++) {
    var row = document.createElement('tr');
    for (var j = 0; j < 10; j++) {
        var cell = document.createElement('td');
        cell.className = ltrs[j] + nmbrs[i];
        if (((i == 0 && j != 0) || (i == 9 && j != 9)) || ((j == 0 && i !== 9) || (j == 9 && i !== 0)))
            cell.classList.add('border'); 
        if ((i != 0 && i != 9 && j != 0 && j != 9 && i % 2 !== 0 && j % 2 == 0) || (i != 0 && i != 9 && j != 0 && j != 9 && i % 2 == 0 && j % 2 !== 0))
            cell.classList.add('black');
        if ((i != 0 && i != 9 && j != 0 && j != 9 && i % 2 !== 0 && j % 2 !== 0) || (i != 0 && i != 9 && j != 0 && j != 9 && i % 2 == 0 && j % 2 == 0))
            cell.classList.add('white');
        row.appendChild(cell);
    }
    table.appendChild(row); 
}
}   // создаем шахматную доску; раскрашиваем клетки; отмечаем боковые поля для цифр и букв (конец)
{   // Расставляем буквы и цифры на боковых полях (начало)
    var border = document.querySelectorAll('.border'),
        letters = ltrs.splice(1, 8);
    for (i = 1, j = 0; i < 9; i++, j++) {
        border[i].innerText = letters[j];
        border[i].classList.add('textDown');
        border[26+ i].innerText = letters[j];
    }
    for (i = 10, j = 8; i < 26; i++, j--) {
        border[i++].innerText = border[i].innerText = j;
        border[i].classList.add('textDown');
    }
}   // Расставляем буквы и цифры на боковых полях (конец)
{   // расставляем фигуры (начало)
var playground = document.querySelectorAll('td'), 
    color;
for (i = 11; i < 89; i++) {
    var img = document.createElement('img');
    img.height = '45';
    if (i > 50)
        color = 'White';
    if (i < 50)
        color = 'Black';
    if (i == 11 || i == 18 || i == 81 || i == 88)
        img.src = ('img/figures/rook' + color + '.png'); // ладья
    if (i == 12 || i == 17 || i == 82 || i == 87)
        img.src = ('img/figures/kNight' + color + '.png'); // конь
    if (i == 13 || i == 16 || i == 83 || i == 86)
        img.src = ('img/figures/bishop' + color + '.png'); // слон
    if (i == 14 || i == 84)
        img.src = ('img/figures/queen' + color + '.png'); // ферзь
    if (i == 15 || i == 85)
        img.src = ('img/figures/king' + color + '.png'); // король
    if (i > 20 && i < 29 || i > 70 && i < 79) {
        img.src = ('img/figures/pawn' + color + '.png'); // пешка
        img.height = ('35');
    }
    if (playground[i].classList[1] != 'border' && (i < 29 || i > 70))
        playground[i].appendChild(img);
}
}   // расставляем фигуры (конец)
{   // Учим фигуры двигаться (начало)
var selectedTd, // Используется для подсветки клетки под фигурой в функции "highlight"
    inHand = null; // Используется для хранения выбранной для хода фигуры
    
function gamerIs(src) {     // Функция определяет, какого цвета фигура в руке игрока
    for (i = 0; i <= src.length; i++) {
        if (src.charAt(i) == 'W' && src.charAt(++i) == 'h')
            return 'белых';  
        else if (src.charAt(i) == 'B' && src.charAt(++i) == 'l')
            return 'черных';
    }
}   // Функция определяет, какого цвета фигура в руке игрока
    
function highlight(node) {      // Функция для подсветки клетки под выбранной фигурой и клетки, на которую фигуру переместили
    if (selectedTd)
        selectedTd.classList.remove('highlight');  
    selectedTd = node;
    selectedTd.classList.add('highlight');
}   // Функция для подсветки клетки под выбранной фигурой и клетки, на которую фигуру переместили
       
function entry(str) { // Функция записи хода в таблицу ходов
    if (str == 'черных')
        space = ': ';   // Это нужно, чтобы выровнять по длине строчки ходов, т.к. "черных" длинее "белых",
    else space = ':  '; // к "белых" нужно прибавлять дополнительный пробел
        document.querySelector('textarea').innerHTML += 'Ход ' + str + space + strokeWay + '\u000A'; // Сделать запись
}    // Функция записи хода в таблицу ходов 
    
var stroke = 1, // Счетчик, определяющий ход игрока (нечетный - белые; четный - черные)
    player = ['белых', 'черных'],
    playerReverse = ['черных', 'белых'],
    strokePlayerReverse,
    strokePlayer,
    strokeWay,
    space;

table.onclick = function(event) {   // Функция обработчика событий "onclick", передвигает фигурки
    var target = event.target;
    while (target != table) {
        if (target.classList.contains('white') || target.classList.contains('black')) {
            if (stroke % 2 != 0) {  // Ход белых
                strokePlayer = player[0];
                strokePlayerReverse = playerReverse[0];
            } else {                // Ход черных
                strokePlayer = player[1];
                strokePlayerReverse = playerReverse[1];
            }
                /* Если в руке нет фигуры, и в клетке есть фигура, и цвет фигуры соответствует цвету,
                   который сейчас ходит, то взять в руку эту фигуру, клетку подсветить, записать
                   номер этой клетки в переменную "strokeWay", инкрементировать счетчик определия следующего хода соперника */
            if (inHand == null && target.firstChild && gamerIs(target.firstChild.getAttribute('src')) == strokePlayer) {
                inHand = target.firstChild;
                highlight(target);
                strokeWay = target.classList[0];
                stroke++;   
            }
                /* Если в руке есть фигура и клетка, в которую хотят переместить фигуру ялвяется пустой,
                   то подсветить эту клетку (предыдущая подсвеченная потухнет), поместить в клетку фигуру
                   и удалить ее из руки, дописать в переменную "strokeWay" номер соответствующей клетки,
                   вписать ход игрока в таблицу ходов */
            if (inHand != null && !target.firstChild) {
                highlight(target);
                target.appendChild(inHand);
                inHand = null;
                strokeWay += ('-' + target.classList[0]);
                entry(strokePlayerReverse);
            }
                /* Если в руке есть фигура и ее цвет противоположен цвету фигуры в клетке, на которую хотят переместить
                   фигуру из руки, то удалить фигуру из этой клетки и поместить в клетку фигуру из руки, дописать в
                   переменную "stokeWay" номер соотвутствующей клетки, вписать ход игрока в таблицу ходов */
            if (inHand != null && gamerIs(target.firstChild.getAttribute('src')) != gamerIs(inHand.getAttribute('src'))) {
                target.innerHTML = '';
                target.appendChild(inHand);
                strokeWay += ('-' + target.classList[0]);
                entry(strokePlayerReverse);
                highlight(target);
                inHand = null;
            }
            return;
        }
        target = target.parentNode;
    }
}   // Функция обработчика событий "onclick", передвигает фигурки
}   // Учим фигуры двигаться (конец) 
}   // Загружать скрипт только после полной загрузки DOM
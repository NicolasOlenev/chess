'use strict'
window.onload = function() {    // Загружать скрипт только после полной загрузки DOM
  
    
var wrapper = document.querySelector('.wrapper');
var table = document.createElement('table');
var ltrs = ['0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', '0'];
var nmbrs = ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0'];
wrapper.appendChild(table);

/* создаем шахматную доску; раскрашиваем клетки; отмечаем боковые поля для цифр и букв */
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

/* Расставляем буквы и цифры на боковых полях */
{
    var border = document.querySelectorAll('.border');
    var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for (i = 1, j = 0; i < 9; i++, j++) {
        border[i].innerText = letters[j];
        border[i].classList.add('textDown');
        border[26+ i].innerText = letters[j];
    }
    for (i = 10, j = 8; i < 26; i++, j--) {
        border[i++].innerText = border[i].innerText = j;
        border[i].classList.add('textDown');
    }
}

/* попытка подключить SVG */
/* 
var mySVG = document.getElementById("object");
var svgDocument = mySVG.addEventListener('load',function() {
var svgDoc = this.contentDocument;
var svgElement = svgDoc.getElementById("text1061");
secondRow[35].inputMode = svgElement;  
}, false);
*/

var playground = document.querySelectorAll('td');
var color;
    
/* расставляем фигуры */
for (i = 11; i < 89; i++) {
    var img = document.createElement('img');
    img.height = '45';
    if (i > 50)
        color = 'White';
    if (i < 50)
        color = 'Black';
    if (i == 11 || i == 18 || i == 81 || i == 88)
        img.src = ('../img/rook' + color + '.png'); // ладья
    if (i == 12 || i == 17 || i == 82 || i == 87)
        img.src = ('../img/kNight' + color + '.png'); // конь
    if (i == 13 || i == 16 || i == 83 || i == 86)
        img.src = ('../img/bishop' + color + '.png'); // слон
    if (i == 14 || i == 84)
        img.src = ('../img/queen' + color + '.png'); // ферзь
    if (i == 15 || i == 85)
        img.src = ('../img/king' + color + '.png'); // король
    if (i > 20 && i < 29 || i > 70 && i < 79) {
        img.src = ('../img/pawn' + color + '.png'); // пешка
        img.height = ('35');
    }
    if (playground[i].classList[1] != 'border' && (i < 29 || i > 70))
        playground[i].appendChild(img);
}

/* учим фигуры двигаться */
{
var selectedTd; // Используется для подсветки клетки под фигурой в функции "highlight"
var inHand = null; // Используется для хранения выбранной для хода фигуры
function gamerIs(src) {     // Функция определяет, какого цвета фигура в руке игрока
    for (var i = 0; i <= src.length; i++) {
        if (src.charAt(i) == 'W' && src.charAt(++i) == 'h')
            return 'белых';  
        else if (src.charAt(i) == 'B' && src.charAt(++i) == 'l')
            return 'черных';
    }
}   // Функция определяет, какого цвета фигура в руке игрока
function highlight(node) {      // Функция для подсветки клетки под выбранной фигурой и клетки, на которую фигуру переместили
    if (selectedTd) {
        selectedTd.classList.remove('highlight');  
    }
    selectedTd = node;
    selectedTd.classList.add('highlight');
}   // Функция для подсветки клетки под выбранной фигурой и клетки, на которую фигуру переместили
var stroke = 1; // Счетчик, определяющий ход игрока (нечетный - белые; четный - черные)
var player = ['белых', 'черных'];
var playerReverse = ['черных', 'белых'];
var strokePlayerReverse;
var strokePlayer
var strokeWay;
//console.log('Ход белых:');
table.onclick = function(event) {   // Функция обработчика событий "onclick", передвигает фигурки
    var target = event.target;
    while (target != table) {
        if (target.classList.contains('white') || target.classList.contains('black')) {
            if (stroke % 2 != 0) {
                strokePlayer = player[0];
                strokePlayerReverse = playerReverse[0];
                //console.log('Ход белых:');
            } else {
                strokePlayer = player[1];
                strokePlayerReverse = playerReverse[1];
                //console.log('Ход черных:');
            }
                
            if (inHand == null && target.firstChild && gamerIs(target.firstChild.getAttribute('src')) == strokePlayer) {
                inHand = target.firstChild;
                highlight(target);
                //console.log('В руке фигура', gamerIs(inHand.getAttribute('src')));
                strokeWay = target.classList[0];
                //console.log(strokeWay);
                stroke++;   
            }
            if (inHand != null && !target.firstChild) {
                highlight(target);
                target.appendChild(inHand);
                inHand = null;
                //console.log('В руке фигурры нет');
                strokeWay += ('-' + target.classList[0]);
                //console.log('Ход ' + strokePlayerReverse + ': ' + strokeWay);
                document.querySelector('textarea').innerHTML += 'Ход ' + strokePlayerReverse + ': ' + strokeWay + '\u000A';
            }
            if (inHand != null && gamerIs(target.firstChild.getAttribute('src')) != gamerIs(inHand.getAttribute('src'))) {
                target.innerHTML = '';
                target.appendChild(inHand);
                strokeWay += ('-' + target.classList[0]);
                //console.log('Ход ' + strokePlayerReverse + ': ' + strokeWay);
                document.querySelector('textarea').innerHTML += 'Ход ' + strokePlayerReverse + ': ' + strokeWay + '\u000A';
                //console.log('фигура съела фигуру соперника');
                highlight(target);
                inHand = null;
            }
            
            return;
        }
        target = target.parentNode;
    }
}   // Функция обработчика событий "onclick", передвигает фигурки
}
  
    
}   // Загружать скрипт только после полной загрузки DOM
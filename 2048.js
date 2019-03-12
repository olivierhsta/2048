var size = 4;
var odds2 = 0.9;
var gameIsStarted = false;

$(function(){
    initBoard();
});

function initBoard() {
    $('#board').empty();

    for(let i = 0; i < size; i++){

        var row = document.createElement('div');
        row.classList.add('game-row');
        row.id = 'row-' + i;

        for(let j = 0; j < size; j++){
            var cell = document.createElement('div');
            cell.classList.add('game-cell');
            if (i != size - 1) {
                cell.classList.add('border-bottom-0');
            }
            if (j % size != 0) {
                cell.classList.add('border-left-0');
            }
            cell.id = 'cell-' + i + '' + j;

            var num = document.createElement('span');
            num.id = 'num-' + i + '' + j;

            cell.appendChild(num);
            row.appendChild(cell);
        }

        document.getElementById('board').appendChild(row);
        initEvents();
    }
}

function initEvents() {
    $('#btn-size').click( (e) => {
        e.preventDefault();
        size = prompt('Taille désirée?');
        initBoard();
    });

    // unbind to prevent the function to be triggered multiple times off one click
    // source : https://stackoverflow.com/a/14856235/7507867
    $('#btn-start').unbind('click').click( (e) => {
        e.preventDefault();
        startGame();
    });

    $(document).unbind('keydown').keydown(function(e) {
        if (!gameIsStarted) {
            return;
        }
        switch(e.which) {
            case 37: // left
                left();
            break;

            case 38: // up
                up();
            break;

            case 39: // right
                right();
            break;

            case 40: // down
                down();
            break;

            default: return; // exit this handler for other keys
        }
        spanNum();
    e.preventDefault(); // prevent the default action (scroll / move caret)
});
}

function startGame() {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            $('#num-'+i+''+j).empty();
            $('#num-'+i+''+j).removeClass('bg-nums');
        }
    }
    spanNum();
    spanNum();
    gameIsStarted = true;
}

function spanNum() {
    var found = false;
    while(!found){
        var col = Math.floor(Math.random() * Math.floor(size));
        var row = Math.floor(Math.random() * Math.floor(size));

        if ($('#num-'+col+''+row).html() == "")  {
            fillCell(col, row, (Math.random() * Math.floor(1)) < odds2 ? "2" : "4");
            found = true;
        }
    }
}

function getSize() {
    return size;
}

function fillCell(col, row, value) {
    $('#num-'+col+''+row).html(value);
    $('#num-'+col+''+row).addClass('bg-nums');
}

function emptyCell(col, row) {
    $('#num-'+col+''+row).html("");
    $('#num-'+col+''+row).removeClass('bg-nums');
}

function left() {
    var toCheck = 0, old;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if ($('#num-'+i+''+j).html() != "")  {
                var moved = true;
                old = j;
                toCheck = 1;
                while(moved) {
                    if ($('#num-'+i+''+(j-toCheck)).html() == "") {
                        fillCell(i, (j-toCheck), $('#num-'+i+''+old).html());
                        emptyCell(i, old);
                        old = j-toCheck;
                        toCheck++;
                    } else {
                        moved = false;
                    }
                }
            }
        }
    }
}

function up() {
    var toCheck = 0, old;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if ($('#num-'+j+''+i).html() != "")  {
                var moved = true;
                old = j;
                toCheck = 1;
                while(moved) {
                    if ($('#num-'+(j-toCheck)+''+i).html() == "") {
                        fillCell((j-toCheck), i, $('#num-'+old+''+i).html());
                        emptyCell(old, i);
                        old = j-toCheck;
                        toCheck++;
                    } else {
                        moved = false;
                    }
                }
            }
        }
    }
}

function down() {
    var toCheck = 0, old;
    for (var i = size-1; i >= 0; i--) {
        for (var j = size-1; j >= 0; j--) {
            if ($('#num-'+j+''+i).html() != "")  {
                var moved = true;
                old = j;
                toCheck = 1;
                while(moved) {
                    if ($('#num-'+(j+toCheck)+''+i).html() == "") {
                        fillCell((j+toCheck), i, $('#num-'+old+''+i).html());
                        emptyCell(old, i);
                        old = j+toCheck;
                        toCheck++;
                    } else {
                        moved = false;
                    }
                }
            }
        }
    }
}

function right() {
    var toCheck = 0, old;
    for (var i = size-1; i >= 0; i--) {
        for (var j = size-1; j >= 0; j--) {
            if ($('#num-'+i+''+j).html() != "")  {
                var moved = true;
                old = j;
                toCheck = 1;
                while(moved) {
                    if ($('#num-'+i+''+(j+toCheck)).html() == "") {
                        fillCell(i, (j+toCheck), $('#num-'+i+''+old).html());
                        emptyCell(i, old);
                        old = j+toCheck;
                        toCheck++;
                    } else {
                        moved = false;
                    }
                }
            }
        }
    }
}

var size = 4;
var maxValue = 2048;
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
        row.id = 'row-' + norm(i);

        for(let j = 0; j < size; j++){
            var cell = document.createElement('div');
            cell.classList.add('game-cell');
            if (i != size - 1) {
                cell.classList.add('border-bottom-0');
            }
            if (j % size != 0) {
                cell.classList.add('border-left-0');
            }
            cell.id = 'cell-' + norm(i) + '' + norm(j);

            var num = document.createElement('span');
            num.id = 'num-' + norm(i) + '' + norm(j);

            cell.appendChild(num);
            row.appendChild(cell);
        }

        document.getElementById('board').appendChild(row);
        adjustFontSize();
        initEvents();
    }
}

function initEvents() {
    $('#btn-size').off('click').click(e => {
        e.preventDefault();
        oldSize = size;
        size = prompt('Entez la taille désirée (min : 2, max : 99)\nAttention! Toute progression sera perdue');
        if (size === null) {
            // button 'cancel' was clicked
            size = oldSize;
            return;
        }
        if (size <= 1 || isNaN(size)) {
            // invalid value, fall back to default
            size = 4;
        }
        initBoard();
    });

    // unbind to prevent the function to be triggered multiple times off one click
    // source : https://stackoverflow.com/a/14856235/7507867
    $('#btn-start').off('click').click((e) => {
        e.preventDefault();
        startGame();
    });

    $(document).off('keydown').keydown((e) => {
        e.preventDefault();
        if (!gameIsStarted || gameOver()) {
            return;
        }
        var move; // boolean to know if something moved
        switch(e.which) {
            case 37: // left
                move = movement("left");
            break;

            case 38: // up
                move = movement("up");
            break;

            case 39: // right
                move = movement("right");
            break;

            case 40: // down
                move = movement("down");
            break;

            default: return;
        }
        if (move) {
            spanNum();
        }
    });

    $(window).on('resize', function(e){
        window.resizeEvt;
        $(window).resize(function(){
            clearTimeout(window.resizeEvt);
            window.resizeEvt = setTimeout(function(){
                adjustFontSize();
            }, 250);
    });
});
}

function adjustFontSize() {
    var fontSize = 16 / size;
    if (document.body.clientWidth < 1000) {
        fontSize -= 3 * fontSize / 8;
    }
    $(".game-cell").css("font-size", fontSize + "em");
    if (size > 20) {
        $(".game-cell").css("border-width", "1px");
    }
}

function startGame() {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            emptyCell(i,j);
        }
    }
    spanNum();
    spanNum();
    gameIsStarted = true;
}

function spanNum() {
    var found = false;
    while(!found){
        var col = norm(Math.floor(Math.random() * Math.floor(size)));
        var row = norm(Math.floor(Math.random() * Math.floor(size)));
        if ($('#num-'+col+''+row).html() == "")  {
            fillCell(col, row, (Math.random() * Math.floor(1)) < odds2 ? "2" : "4");
            found = true;
        }
    }
}

function getSize() {
    return size;
}

function fillCell(row, col, value) {
    row = norm(row);
    col = norm(col);
    $('#num-'+row+''+col).html(value);
    $('#num-'+row+''+col).addClass('bg-'+value);
    if (value == maxValue) {
        gameIsStarted = false;
    }
}

function emptyCell(row, col) {
    row = norm(row);
    col = norm(col);
    $('#num-'+row+''+col).html("");
    for (var i = 2; i <= 32768; i=i*2) {
        $('#num-'+row+''+col).removeClass('bg-'+i);
    }

}

function gameOver() {
    var counter = 0;
    var cell, left, right, up, down;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            cell = $('#num-'+norm(i)+''+norm(j)).html();
            left =  $('#num-'+norm(i)+''+norm(j-1)).html();
            right =  $('#num-'+norm(i)+''+norm(j+1)).html();
            up =  $('#num-'+norm(i-1)+''+norm(j)).html();
            down =  $('#num-'+norm(i+1)+''+norm(j)).html();
            if (cell == left || cell == right || cell == up || cell == down) {
                // board is full and there is no possible move
                return 0;
            }
            if (cell == maxValue) {
                // game is won
                return -1;
            }
            if (cell != "")  {
                counter++;
            }
        }
    }
    if (size*size == counter) {
        // all cells are filled
        return 1;
    }
    return 0;
}

/**
 * Normalize the given int to return a two digits numerical string
 * 0 are appended to single-digits and 3+ digits number only retain the first two elements
 * @param  int n int to normalize
 * @return int   normalized int
 */
function norm(n){
    n = Number(n);
    if (n < 0) {
        return n;
    }
    return (n <= 9 ? ("0"+n).substring(0,2) : (n+"").substring(0,2));

}

function movement(move) {
    var toCheck = 0, oldRow, oldCol, nbMove=0, merged, newValue;
    for (var i = 0; i < size; i++) {
        merged = [];
        for (var j = 0; j < size; j++) {
            switch(move) {
                case "up":
                        row = norm(j);
                        col = norm(i);
                        rowToCheck = norm(Number(row)-1);
                        colToCheck = norm(col);
                    break;
                case "down":
                        row = norm(size-1-j);
                        col = norm(size-1-i);
                        rowToCheck = norm(Number(row)+1);
                        colToCheck = norm(col);
                    break;
                case "right":
                        row = norm(size-1-i);
                        col = norm(size-1-j);
                        rowToCheck = norm(row);
                        colToCheck = norm(Number(col)+1);
                    break;
                case "left":
                        row = norm(i);
                        col = norm(j);
                        rowToCheck = norm(row);
                        colToCheck = norm(Number(col)-1);
                    break;
            }
            if ($('#num-'+row+''+col).html() != "")  {
                console.log("Moving : " + row + "" + col);
                console.log("To : " + rowToCheck + "" + colToCheck);
                oldRow = row;
                oldCol = col;
                while(true) {
                    if ($('#num-'+rowToCheck+''+colToCheck).html() == "") {
                        newValue = $('#num-'+oldRow+''+oldCol).html();
                    } else if ($('#num-'+rowToCheck+''+colToCheck).html() == $('#num-'+oldRow+''+oldCol).html() &&
                                $.inArray(rowToCheck + '' + colToCheck, merged) == -1) {
                        newValue = Number($('#num-'+rowToCheck+''+colToCheck).html()) + Number($('#num-'+oldRow+''+oldCol).html());
                        merged.push(rowToCheck + '' + colToCheck);
                    } else {
                        merged.push(rowToCheck + '' + colToCheck);
                        console.log('wut');
                        break;
                    }
                    fillCell(rowToCheck, colToCheck, newValue);
                    emptyCell(oldRow, oldCol);
                    oldRow = rowToCheck;
                    oldCol = colToCheck;
                    nbMove++;
                    switch(move) {
                        case "up": rowToCheck = norm(Number(rowToCheck)-1);
                            break;
                        case "down":
                            console.log(Number(rowToCheck));
                            rowToCheck = norm(Number(rowToCheck)+1);
                            break;
                        case "right": colToCheck = norm(Number(colToCheck)+1);
                            break;
                        case "left": colToCheck = norm(Number(colToCheck)-1);
                            break;
                    }
                }
            }
        }
    }
    return nbMove;
}

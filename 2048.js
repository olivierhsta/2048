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
        row.id = 'row-' + twoDigitsInt(i);

        for(let j = 0; j < size; j++){
            var cell = document.createElement('div');
            cell.classList.add('game-cell');
            if (i != size - 1) {
                cell.classList.add('border-bottom-0');
            }
            if (j % size != 0) {
                cell.classList.add('border-left-0');
            }
            cell.id = 'cell-' + twoDigitsInt(i) + '' + twoDigitsInt(j);

            var num = document.createElement('span');
            num.id = 'num-' + twoDigitsInt(i) + '' + twoDigitsInt(j);

            cell.appendChild(num);
            row.appendChild(cell);
        }

        document.getElementById('board').appendChild(row);
        var fontSize = 16 / size;
        $(".game-cell").css("font-size", fontSize + "em");
        initEvents();
    }
}

function initEvents() {
    $('#btn-size').off('click').click(e => {
        e.preventDefault();
        oldSize = size;
        size = prompt('Entez la taille désirée (min : 2)\nAttention! Toute progression sera perdue');
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
        if (!gameIsStarted || boardIsFull()) {
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
        var col = twoDigitsInt(Math.floor(Math.random() * Math.floor(size)));
        var row = twoDigitsInt(Math.floor(Math.random() * Math.floor(size)));
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
    row = twoDigitsInt(row);
    col = twoDigitsInt(col);
    $('#num-'+row+''+col).html(value);
    $('#num-'+row+''+col).addClass('bg-'+value);
    if (value == maxValue) {
        gameIsStarted = false;
    }
}

function emptyCell(row, col) {
    row = twoDigitsInt(row);
    col = twoDigitsInt(col);
    $('#num-'+row+''+col).html("");
    for (var i = 2; i <= 32768; i=i*2) {
        $('#num-'+row+''+col).removeClass('bg-'+i);
    }

}

function boardIsFull() {
    var counter = 0;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if ($('#num-'+twoDigitsInt(i)+''+twoDigitsInt(j)).html() != "")  {
                counter++;
            }
        }
    }
    if (size*size == counter) {
        return true;
    }
    return false;
}

/**
 * Normalize the given int to return a two digits numerical string
 * 0 are appended to single-digits and 3+ digits number only retain the first two elements
 * @param  int n int to normalize
 * @return int   normalized int
 */
function twoDigitsInt(n){
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
                        row = twoDigitsInt(j);
                        col = twoDigitsInt(i);
                        rowToCheck = twoDigitsInt(Number(row)-1);
                        colToCheck = twoDigitsInt(col);
                    break;
                case "down":
                        row = twoDigitsInt(size-1-j);
                        col = twoDigitsInt(size-1-i);
                        rowToCheck = twoDigitsInt(Number(row)+1);
                        colToCheck = twoDigitsInt(col);
                    break;
                case "right":
                        row = twoDigitsInt(size-1-i);
                        col = twoDigitsInt(size-1-j);
                        rowToCheck = twoDigitsInt(row);
                        colToCheck = twoDigitsInt(Number(col)+1);
                    break;
                case "left":
                        row = twoDigitsInt(i);
                        col = twoDigitsInt(j);
                        rowToCheck = twoDigitsInt(row);
                        colToCheck = twoDigitsInt(Number(col)-1);
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
                        case "up": rowToCheck = twoDigitsInt(Number(rowToCheck)-1);
                            break;
                        case "down":
                            console.log(Number(rowToCheck));
                            rowToCheck = twoDigitsInt(Number(rowToCheck)+1);
                            break;
                        case "right": colToCheck = twoDigitsInt(Number(colToCheck)+1);
                            break;
                        case "left": colToCheck = twoDigitsInt(Number(colToCheck)-1);
                            break;
                    }
                }
            }
        }
    }
    return nbMove;
}

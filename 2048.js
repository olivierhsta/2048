var size = 4;
var minValue = 2;
var maxValue = 65536;
var winValue = minValue * 1024;
var odds2 = 0.9;
var gameIsStarted = false;
var emptyCells = []
var score = 0;

$(function(){
    initBoard();
});

function initBoard() {
    $('#board').empty();
    resetScore();
    for(let i = 0; i < size; i++){

        var row = document.createElement('div');
        row.classList.add('game-row');
        row.id = 'row-' + norm(i);

        for(let j = 0; j < size; j++){

            if ($.inArray(norm(i) + norm(j), emptyCells) < 0) {
                emptyCells.push(norm(i) + norm(j));
            }

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
    }
    adjustFontSize();
    adjustBoardBorders();
    initEvents();
}

function initEvents() {
    $('#btn-resize').off('click').click(e => {
        e.preventDefault();
        oldSize = size;
        size = prompt('Entez la taille désirée (min : 2, max : 99)\nAttention! Toute progression sera perdue');
        if (size === null) {
            // button 'cancel' was clicked
            size = oldSize;
            return;
        }
        if (size <= 1 || size > 99 || isNaN(size)) {
            // invalid value, fall back to default
            size = 4;
        }
        initBoard();
    });

    // unbind to prevent the function to be triggered multiple times of one click
    // source : https://stackoverflow.com/a/14856235/7507867
    $('#btn-start').off('click').click((e) => {
        e.preventDefault();
        startGame();
    });

    $(document).off('keydown').keydown((e) => {
        e.preventDefault();
        if (!gameIsStarted) {
            return;
        }

        var move; // boolean to know if something has been moved
        move = movement(e.which);
        if (move > 0) {
            spanNum();
        }
        var gameIsOver = gameOver();
        if (gameIsOver == -1) {
            // win
            gameIsStarted = false;
            $('#success-message').animate({
                height: 'toggle'
            }, 1000, function() {});
        } else if (gameIsOver == 1) {
            // lose
            $('#failure-message').animate({
                height: 'toggle'
            }, 1000, function() {});
            gameIsStarted = false;
        }
    });

    // to make the function to be trigger only after the resize
    // source : https://stackoverflow.com/a/22479394/7507867
    $(window).on('resize', function(e){
        window.resizeEvt;
        $(window).resize(function(){
            clearTimeout(window.resizeEvt);
            window.resizeEvt = setTimeout(function(){
                adjustFontSize();
                adjustBoardBorders();
            }, 250);
        });
    });

    $('#success-message').click(function(){
        $(this).fadeOut();
    });

    $('#failure-message').click(function(){
        $(this).fadeOut();
    });
}

function startGame() {
    resetScore();
    emptyCells = []
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            emptyCell(i,j);
        }
    }
    spanNum();
    spanNum();
    gameIsStarted = true;
}

/**
 * Randomly span a number on the board
 */
function spanNum() {
    var cell = emptyCells[Math.floor(Math.random()*emptyCells.length)];
    var row = cell.substring(0,2);
    var col = cell.substring(2,4);
    if ($('#num-'+row+''+col).html() == "")  {
        fillCell(row, col, (Math.random() * Math.floor(1)) < odds2 ? minValue : minValue*2);
        found = true;
    }
}

function fillCell(row, col, value) {
    emptyCell(row,col);
    row = norm(row);
    col = norm(col);
    $('#num-'+row+''+col).html(value)
    var toRemove = emptyCells.indexOf(row+''+col);
    if (toRemove >= 0) {
        emptyCells.splice(toRemove, 1);
    }
    adjustIndivFontSize(row,col);
    value = 2*Number(value) / minValue;
    if (Number.isInteger(Math.log2(value)) && value <= maxValue) {
        $('#num-'+row+''+col).addClass('bg-'+value);
    } else {
        $('#num-'+row+''+col).addClass('bg-other');
    }
}

function emptyCell(row, col) {
    row = norm(row);
    col = norm(col);
    $('#num-'+row+''+col).html("");
    if ($.inArray(row+''+col, emptyCells) < 0) {
        emptyCells.push(row+''+col);
    }
    for (var i = 2; i <= maxValue; i=i*2) {
        $('#num-'+row+''+col).removeClass('bg-'+i);
    }
    $('#num-'+row+''+col).removeClass('bg-other');
    adjustIndivFontSize(row,col);
    $('#num-'+row+''+col).css("padding-top", "17%");
}

function addScore() {
    score += 1;
    $("#score").html(score);
}

function resetScore() {
    $("#score").html("0");
}

/**
 * [gameOver description]
 * @return int -1 when game is won, 0 when game is lost, 1 otherwise
 */
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
            if (cell == winValue) {
                // game is won
                return -1;
            }
            if (cell != "" &&
                (cell != left && cell != right && cell != up && cell != down))  {
                counter++;
            }
        }
    }
    if (size*size == counter) {
        // no possible move
        return 1;
    }
    return 0;
}

/**
 * Adjust the font-size of all cells
 */
function adjustFontSize() {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            adjustIndivFontSize(i,j);
        }
    }
}

/**
 * Adjut the font size of the given cell.  It also adjust the padding so the number stays centered
 * Takes into account the window's size and the length of the number
 * @param  int row Row of the cell (normalized or not)
 * @param  int col Column of the cell (normalized or not)
 */
function adjustIndivFontSize(row, col) {
    var fontSize = 16 / size;
    if (document.body.clientWidth < 1000) {
        fontSize -= 3 * fontSize / 8;
    }
    var numLength = $("#num-"+norm(row)+''+norm(col)).html().length;
    if (numLength == 4) {
        fontSize = 3 * fontSize / 4; // 75%
        $("#num-"+norm(row)+norm(col)).css("padding-top","25%");
    } else if (numLength == 5) {
        fontSize = 27 * fontSize / 40; // 90% of 75%
        $("#num-"+norm(row)+norm(col)).css("padding-top","28%");
    }
    $("#cell-"+norm(row)+norm(col)).css("font-size", fontSize + "em");
}

/**
 * Make the borders smaller if the size is large (greater than 20)
 */
function adjustBoardBorders() {
    if (size > 20) {
        $(".game-cell").css("border-width", "1px");
    }
}

function getSize() {
    return size;
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
    if (move !== 37 && move !== 38 && move !== 39 && move !== 40) return;

    var toCheck = 0, oldRow, oldCol, nbMove=0, merged, newValue;
    for (var i = 0; i < size; i++) {
        merged = [];
        for (var j = 0; j < size; j++) {
            switch(move) {
                case 38: // up
                        row = norm(j);
                        col = norm(i);
                        rowToCheck = norm(Number(row)-1);
                        colToCheck = norm(col);
                    break;
                case 40: // down
                        row = norm(size-1-j);
                        col = norm(size-1-i);
                        rowToCheck = norm(Number(row)+1);
                        colToCheck = norm(col);
                    break;
                case 39: // right
                        row = norm(size-1-i);
                        col = norm(size-1-j);
                        rowToCheck = norm(row);
                        colToCheck = norm(Number(col)+1);
                    break;
                case 37: // left
                        row = norm(i);
                        col = norm(j);
                        rowToCheck = norm(row);
                        colToCheck = norm(Number(col)-1);
                    break;
            }
            if ($('#num-'+row+''+col).html() != "")  {
                oldRow = row;
                oldCol = col;
                while(true) {
                    if ($('#num-'+rowToCheck+''+colToCheck).html() == "") {
                        newValue = $('#num-'+oldRow+''+oldCol).html();
                    } else if ($('#num-'+rowToCheck+''+colToCheck).html() == $('#num-'+oldRow+''+oldCol).html() &&
                                $.inArray(rowToCheck + '' + colToCheck, merged) == -1) {
                        newValue = Number($('#num-'+rowToCheck+''+colToCheck).html()) + Number($('#num-'+oldRow+''+oldCol).html());
                        addScore();
                        merged.push(rowToCheck + '' + colToCheck);
                    } else {
                        merged.push(rowToCheck + '' + colToCheck);
                        break;
                    }
                    fillCell(rowToCheck, colToCheck, newValue);
                    emptyCell(oldRow, oldCol);
                    oldRow = rowToCheck;
                    oldCol = colToCheck;
                    nbMove++;
                    switch(move) {
                        case 38: rowToCheck = norm(Number(rowToCheck)-1);
                            break;
                        case 40:
                            rowToCheck = norm(Number(rowToCheck)+1);
                            break;
                        case 39: colToCheck = norm(Number(colToCheck)+1);
                            break;
                        case 37: colToCheck = norm(Number(colToCheck)-1);
                            break;
                    }
                }
            }
        }
    }
    return nbMove;
}

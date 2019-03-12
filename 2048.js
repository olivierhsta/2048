$(function(){

    var size = 4;
    initBoard();

    $('#btn-size').click(function(e){
        e.preventDefault();
        size = prompt('Taille désirée?');
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
                row.appendChild(cell);
            }

            document.getElementById('board').appendChild(row);
        }
    }
});

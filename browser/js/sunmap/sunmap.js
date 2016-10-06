var gameUtilities = {
    selectCellWithCoordinates: function (x, y) {
        return document.getElementById(x + '-' + y);
    },
    getStatus: function (cell) {
        return cell.getAttribute('data-status');
    },
    setStatus: function (cell, status) {
        cell.className = status;
        cell.setAttribute('data-status', status);
    },
    toggleStatus: function (cell) {
        // switch (this.gameUtilites.getStatus(cell)) {
        //     case 'sun':
        //         this.gameUtilities.setStatus(cell, 'partial_shade');
        //         break;
        //     case 'partial_shade':
        //         this.gameUtilities.setStatus(cell, 'full_shade');
        //         break;
        //     case 'full_shade':
        //         this.gameUtilities.setStatus(cell, 'sun');
        //         break;
        // }
        if (gameUtilities.getStatus(cell) === 'sun') {
            gameUtilities.setStatus(cell, 'partial_shade');
        } else if (gameUtilities.getStatus(cell) === 'partial_shade') {
            gameUtilities.setStatus(cell, 'full_shade');
        } else {
            gameUtilities.setStatus(cell, 'sun');
        }
    },
    getCellCoords: function (cell) {
        var idSplit = cell.id.split('-');
        return {
            x: parseInt(idSplit[0], 10),
            y: parseInt(idSplit[1], 10)
        };
    },
    getAmountOfAliveCells: function (cells) {

        return cells.filter(function (cell) {
            return gameUtilities.getStatus(cell) === 'alive';
        }).length;

    },
};

var gameOfLife = {
    width: 10,
    height: 10,
    stepInterval: null,

    createAndShowBoard: function () {
        // create <table> element
        var goltable = document.createElement("tbody");

        // build Table HTML
        var tablehtml = '';
        for (var h = 0; h < this.height; h++) {
            tablehtml += "<tr id='row+" + h + "'>";
            for (var w = 0; w < this.width; w++) {
                tablehtml += "<td data-status='full_shade' class='full_shade' id='" + w + "-" + h + "'></td>";
            }
            tablehtml += "</tr>";
        }
        goltable.innerHTML = tablehtml;

        // add table to the #board element
        var board = document.getElementById('board');
        board.appendChild(goltable);

        // once html elements are added to the page, attach events to them
        this.setupBoardEvents();
    },

    forEachCell: function (iteratorFunc) {
        /*
         Write forEachCell here. You will have to visit
         each cell on the board, call the "iteratorFunc" function,
         and pass into func, the cell and the cell's x & y
         coordinates. For example: iteratorFunc(cell, x, y)
         */
        var cellElements = document.getElementsByTagName('td');

        [].slice.call(cellElements).forEach(function (cellElement) {
            var idHalves = cellElement.id.split('-');
            iteratorFunc(cellElement, parseInt(idHalves[0], 10), parseInt(idHalves[1], 10));
        });
    },

    setupBoardEvents: function () {
        // each board cell has an CSS id in the format of: "x-y"
        // where x is the x-coordinate and y the y-coordinate
        // use this fact to loop through all the ids and assign
        // them "on-click" events that allow a user to click on
        // cells to setup the initial state of the game
        // before clicking "Step" or "Auto-Play"

        // clicking on a cell should toggle the cell between "alive" & "dead"
        // for ex: an "alive" cell be colored "blue", a dead cell could stay white

        // EXAMPLE FOR ONE CELL
        // Here is how we would catch a click event on just the 0-0 cell
        // You need to add the click event on EVERY cell on the board

        var onCellClick = function (e) {
            // QUESTION TO ASK YOURSELF: What is "this" equal to here?

            // how to set the style of the cell when it's clicked
            gameUtilities.toggleStatus(this);
        };

        this.forEachCell(function (cellElement) {
            cellElement.addEventListener('click', onCellClick);
        });

        document.getElementById('clear_btn').addEventListener('click', this.clearBoard.bind(this));

    },

    clearBoard: function () {

        this.forEachCell(function (cell) {
            gameUtilities.setStatus(cell, 'full_shade');
        });

    }
};

gameOfLife.createAndShowBoard();
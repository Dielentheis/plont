app.config(function ($stateProvider) {
    $stateProvider.state('sunmap', {
        url: '/sunmap',
        templateUrl: 'js/sunmap/sunmap.html'
    });
});


const plotWidthInches = 12,
      plotHeightInches = 12,
      plotWidthHalfFeet = Math.ceil(plotWidthInches / 6),
      plotHeightHalfFeet = Math.ceil(plotHeightInches / 6),
      shadeDict = {
          sun: 2,
          partial_shade: 1,
          full_shade: 0
      };


// CREATES A PLOTARR OF SHADY OBJECTS
let plotArr = new Array(plotHeightHalfFeet).fill(new Array(plotWidthHalfFeet).fill('hi')); // On submit don't forget to slice the array to length!!

plotArr = plotArr.map(function(row) {
    return row = row.map(function(plant) {
        return new Plant();
    });
});

// PLANT CONSTRUCTOR
function Plant(sunVal) {
    this.sun = sunVal || 0;
    this.taken = false;
}


// CHANGES CLICKED CELL'S SUN STATUS IN THE ARRAY
function plontIt(cellData) {
    const cellSunStatus = cellData.dataset.status,
          Xcoord = parseInt(cellData.id.slice(cellData.id.indexOf('-') + 1), 10),
          Ycoord = parseInt(cellData.id.slice(0, cellData.id.indexOf('-')), 10);

    // const sunniness = cellSunStatus === 'sun'
    //         ? 2
    //         : cellSunStatus === 'partial_shade'
    //             ? 1
    //             : 0;

    const sunniness = shadeDict[cellSunStatus];
    // console.log(Ycoord, Xcoord);
    // console.log(sunniness);

    // plotArr[Ycoord][Xcoord].sun = sunniness;
    // console.log(plotArr);
    // console.log(plotArr[Ycoord][Xcoord]);
    // console.log(plotArr[0][0]);
    // console.log(plotArr[0][1]);
    // console.log(plotArr[1][0]);
    // console.log(plotArr[1][1]);
}



var sunPlotUtils = {
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
    toggleStatus: function (cell) {                 // THE LOGIC FOR CHANGING THE COLOR
        switch (sunPlotUtils.getStatus(cell)) {
            case 'sun':
                sunPlotUtils.setStatus(cell, 'partial_shade');
                break;
            case 'partial_shade':
                sunPlotUtils.setStatus(cell, 'full_shade');
                break;
            case 'full_shade':
                sunPlotUtils.setStatus(cell, 'sun');
                break;
        }
    },
    getCellCoords: function (cell) {
        var idSplit = cell.id.split('-');
        return {
            x: parseInt(idSplit[0], 10),
            y: parseInt(idSplit[1], 10)
        };
    },
    getAmountOfSunnyCells: function (cells) {
        return cells.filter(function (cell) {
            return sunPlotUtils.getStatus(cell) === 'sun';
        }).length;
    },
};


// CREATES A SHADY PLOT
const plontPlot = {
    width: plotWidthHalfFeet,
    height: plotHeightHalfFeet,
    stepInterval: null,

    createAndShowBoard: function () {
        // create <table> element
        const plontTable = document.createElement("tbody");

        // build Table HTML
        let tablehtml = '';
        for (var h = 0; h < this.height; h++) {
            tablehtml += "<tr id='row+" + h + "'>";
            for (var w = 0; w < this.width; w++) {
                tablehtml += "<td data-status='full_shade' class='full_shade' id='" + w + "-" + h + "'></td>";
            }
            tablehtml += "</tr>";
        }
        plontTable.innerHTML = tablehtml;

        // add table to the #board element
        const board = document.getElementById('board');
        board.appendChild(plontTable);

        // once html elements are added to the page, attach events to them
        this.setupBoardEvents();
    },

    // CREATES ID COMPRISING COORDINATES FOR EACH CELL
    forEachCell: function (iteratorFunc) {
        const cellElements = document.getElementsByTagName('td');

        [].slice.call(cellElements).forEach(function (cellElement) {
            const idHalves = cellElement.id.split('-');
            iteratorFunc(cellElement, parseInt(idHalves[0], 10), parseInt(idHalves[1], 10));
        });
    },

    setupBoardEvents: function () {

        // CHANGES THE CELL COLOR
        const onCellClick = function (e) {
            sunPlotUtils.toggleStatus(this);
            plontIt(this);
        };

        this.forEachCell(function (cellElement) {
            cellElement.addEventListener('click', onCellClick);
        });

        document.getElementById('clear_btn').addEventListener('click', this.clearBoard.bind(this));

    },

    // RESETS ALL CELLS TO SHADY
    clearBoard: function () {
        this.forEachCell(function (cell) {
            sunPlotUtils.setStatus(cell, 'full_shade');
        });
    }
};


// ACTUALLY RENDERS THE SHADY PLOT
plontPlot.createAndShowBoard();
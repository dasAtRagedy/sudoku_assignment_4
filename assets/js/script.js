// Styles
const togglableElements = document.getElementsByClassName("menu-hide");

function displayMenu(button) {
    // display is not animatable
    Object.keys(togglableElements).forEach(function(key) {
        if (togglableElements[key].style.display === "none") {
            togglableElements[key].style.display = "inline";
        }
        else {
            togglableElements[key].style.display = "none";
        }
    });
}

// Functionality
const table = document.getElementById('play-area');
const cells = [];
let previousId = 0;
let currentCell = -1;


document.addEventListener("keydown", (e) => {
    if (currentCell === -1 || cells[currentCell].children[0].classList.contains("predefined")) return;
    else if (e.key === "0") {
        cells[currentCell].innerHTML = `<span class=\"fixed-cell\"> </span>`;
    }
    else if (!isNaN(e.key)) {
        cells[currentCell].innerHTML = `<span class=\"fixed-cell\">${e.key}</span>`;
    }
});

function startup(){   
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, element; element = row.cells[j]; j++) {
                cells.push(element);
                element.setAttribute('onmousedown', `workOnCell(${i*9+j})`);
        }
    }
    fetchBoard("https://6550e0cc7d203ab6626e476a.mockapi.io/api/v1/SudokuBoard/1");
    squareBorder(3, "2px solid #888");
};

function workOnCell(cellId) {
    currentCell = cellId;
    cells[previousId].style.backgroundColor = "white";
    previousId = cellId;
    cells[cellId].style.backgroundColor = "#EEE";
    const cell = cells[cellId];
    console.log(`clicked ${cellId}`);
    
    // $.getJSON("https://6550e0cc7d203ab6626e476a.mockapi.io/api/v1/SudokuSolutions/1", function(data) {
    //     console.log(isBoardCorrect(data.solution));
    // })
    
};

function squareBorder(boxSize, style) {
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, element; element = row.cells[j]; j++) {
                if (i % boxSize == 0)
                    element.style.borderTop = style;
                if (i % boxSize == boxSize-1)
                    element.style.borderBottom = style;
                if (j % boxSize == 0)
                    element.style.borderLeft = style;
                if (j % boxSize == boxSize-1)
                    element.style.borderRight = style;
        }
    }
}

function fillBoard(board) {
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, element; element = row.cells[j]; j++) {
            if(board[i*9+j] == 'x') {
                continue;
            }
            element.innerHTML = `<span class=\"fixed-cell predefined\" style=\"color:black\">${board[i*9+j]}</span>`;
        }
    }
}

function isBoardCorrect(answer) {
    possibleAnswer = ""
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, element; element = row.cells[j]; j++) {
            if (i === 0) console.log(element.children);
            possibleAnswer += element.children[0].textContent;
        }
    }
    console.log(answer);
    console.log(possibleAnswer);
    return possibleAnswer === answer;
}

function fetchBoard(url) {
    $.getJSON(url, function(data) {
        fillBoard(data.board);
        // fillBoard("534678912672195348198342567859761423426853791713924856961537284287419635345286179");
    })
}

startup();


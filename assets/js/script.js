// Styles
const togglableElements = document.getElementsByClassName("menu-hide");

function displayMenu() {
    $.each(togglableElements, function(key, element) {
        $(element).css('display') === 'none' ? $(element).css('display', 'inline') : $(element).css('display', 'none');
    });
}

$(document).ready(function() {
    $('#funButton').click(function() {
        let text = $('#rotatingText').text();
        let rotatedText = text.substring(1) + text.charAt(0);
        $('#rotatingText').text(rotatedText);
    });
    $('body').css({
        // 'background-color': "#040D12",
        'background-color': 'white',
    });
});

// Functionality
const table = document.getElementById('play-area');
const cells = [];
let previousId = 0;
let currentCell = -1;
let isHighlighted = true;


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
    if (isHighlighted) {
        clearHighlights();
        isHighlighted = false;
    }
    currentCell = cellId;
    cells[previousId].style.backgroundColor = "white";
    previousId = cellId;
    cells[cellId].style.backgroundColor = "#EEE";
    const cell = cells[cellId];
    console.log(`clicked ${cellId}`);
};

function squareBorder(boxSize, style) {
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, element; element = row.cells[j]; j++) {
                if (i % boxSize === 0)
                    element.style.borderTop = style;
                if (i % boxSize === boxSize-1)
                    element.style.borderBottom = style;
                if (j % boxSize === 0)
                    element.style.borderLeft = style;
                if (j % boxSize === boxSize-1)
                    element.style.borderRight = style;
        }
    }
}

function fillBoard(board) {
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, element; element = row.cells[j]; j++) {
            if(board[i*9+j] === 'x') {
                continue;
            }
            element.innerHTML = `<span class=\"fixed-cell predefined\" style=\"color:black\">${board[i*9+j]}</span>`;
        }
    }
}

function areCellsValid() {
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, element; element = row.cells[j]; j++) {
            if (element.children[0].textContent.length !== 1 || 
                element.children[0].textContent !== ' ' && isNaN(element.children[0].textContent))
            {
                return false;
            }
        }
    }
    
    return true;
}

function areCellsFilled(possibleAnswer) {
    return !possibleAnswer.includes(' ');
}

function isBoardSolved(possibleAnswer) {
    let n = 9;
    const v = Array(n);

    for (let i = 0; i < n; i++) {
        v.fill(false);
        for (let j = 0; j < n; j++) {
            if (v[parseInt(possibleAnswer.charAt(i*9 + j))]) return false;
            v[parseInt(possibleAnswer.charAt(i*9 + j))] = true;
        }

        v.fill(false);
        for (let j = 0; j < n; j++) {
            if (v[parseInt(possibleAnswer.charAt(j*9 + i))]) return false;
            v[parseInt(possibleAnswer.charAt(j*9 + i))] = true;
        }

        v.fill(false);
        for (let j = 0; j < n; j++) {
            if (v[parseInt(possibleAnswer.charAt(Math.floor(j/3)*9 + j%3 + i%3*3 + 27*(Math.floor(i/3))))]) return false;
            v[parseInt(possibleAnswer.charAt(Math.floor(j/3)*9 + j%3 + i%3*3 + 27*(Math.floor(i/3))))] = true;
        }
        console.log("wtf");
    }

    return true;
}

//  0  1  2  3  4  5  6  7  8
//  9 10 11 12 13 14 15 16 17
// 18 19 20 21 22 23 24 25 26
// 27 28 29 30 31 32 33 34 35
// 36 37 38 39 40 41 42 43 44
// 45 46 47 48 49 50 51 52 53
// 54 55 56 57 58 59 60 61 62
// 63 64 65 66 67 68 69 70 71
// 72 73 74 75 76 77 78 79 80

function isBoardCorrect() {
    let isCorrect = true;
    let possibleAnswer = "";
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, element; element = row.cells[j]; j++) {
            if (i === 0) console.log(element.children);
            possibleAnswer += element.children[0].textContent;
        }
    }

    console.log("a");
    if (!areCellsValid()) isCorrect = false;
    console.log("b");
    if (!areCellsFilled(possibleAnswer)) isCorrect = false;
    console.log("c");
    if (!isBoardSolved(possibleAnswer)) isCorrect = false;
    console.log("d");

    fetchSolution("https://6550e0cc7d203ab6626e476a.mockapi.io/api/v1/SudokuSolutions/1")
        .then(answer => {
            console.log("e");
            console.log(answer);
            console.log(possibleAnswer);
            console.log(possibleAnswer === answer);
            alert(possibleAnswer === answer ? "Board is correct!" : "Board is INCORRECT!");
            return possibleAnswer === answer;
        });
}

async function fetchSolution(url) {
    let answer;
    await $.getJSON(url, function(data) {
        answer = data.solution;
        console.log(data.solution);
    })
    return answer
}

function fetchBoard(url) {
    $.getJSON(url, function(data) {
        fillBoard(data.board);
    })
}

function clearBoard() {
    clearHighlights();
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, element; element = row.cells[j]; j++) {
            if (!element.children[0].classList.contains("predefined")) {
                element.innerHTML = `<span class="fixed-cell"> </span>`;
            }
        }
    }
}

function clearHighlights() {
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, element; element = row.cells[j]; j++) {
            element.style.backgroundColor = "white";
        }
    }
}

function highlightNumber(number) {
    clearHighlights();
    isHighlighted = true;
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, element; element = row.cells[j]; j++) {
            if (element.children[0].textContent === number.toString()) {
                element.style.backgroundColor = "#cd919e";
            }
        }
    }
}

function showErrors() {
    clearHighlights();
    isHighlighted = true;
    fetchSolution("https://6550e0cc7d203ab6626e476a.mockapi.io/api/v1/SudokuSolutions/1")
        .then(answer => {
            for (let i = 0, row; row = table.rows[i]; i++) {
                for (let j = 0, element; element = row.cells[j]; j++) {
                    if (element.children[0].textContent !== ' ' && element.children[0].textContent !== answer.charAt(i*9+j)) {
                        element.style.backgroundColor = "#cd919e";
                        console.log("" + element.children[0].textContent + " != " + answer[i*9+j]);
                    }
                }
            }
        });
}

function fillAnswers() {
    clearHighlights();
    fetchSolution("https://6550e0cc7d203ab6626e476a.mockapi.io/api/v1/SudokuSolutions/1")
        .then(answer => {
            for (let i = 0, row; row = table.rows[i]; i++) {
                for (let j = 0, element; element = row.cells[j]; j++) {
                    element.children[0].textContent = answer.charAt(i*9+j);
                }
            }
        });
}

startup();

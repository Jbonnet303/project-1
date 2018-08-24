//console.log('hello');
$(()  => {
    //Draw a grid
    const connect5 = new Connect5('#connect5')

    connect5.onPlayerMove = function() {
      $('#player').text(connect5.player);
    }

    $('#restart').click(function() {
      connect5.restart();
  })
});

    //Make class for game
    class Connect5 {

    //Build grid
    //Create constructor
    constructor (selector) {
    this.ROWS = 8;
    this.COLS = 9;
    this.player = 'green';
    this.selector = selector;
    this.gameOver = false;
    this.onPlayerMove = function() {};
    this.createBoard();
    this.setupEventListeners();
  }
    //Pass selector
    //Create Method
    //Create rows and cols

    createBoard() {


    //Create div rows
    //create new dom element
    //Add class signaling

    const $board = $(this.selector);
    $board.empty();
    this.gameOver = false;
    this.player = 'green';
    for (let row = 0; row < this.ROWS; row++) {
    const $row = $('<div>')
    .addClass('row');


    //Create cols/create div
    //Create new dom element
    //Add class signalinng empty
    for (let col = 0; col < this.COLS; col++) {
    const $col = $('<div>')
    .addClass('col empty')

    //Create attribute
    //Able to see col and row index
    .attr('data-col', col)
    .attr('data-row', row);

    //Append col to row
    //Append all to board
    $row.append($col);
    $board.append($row);
    }
  }
}


  setupEventListeners() {

  //Grab DOM element
  const $board = $(this.selector);

  //Gain access to original selector
  const that = this;


  //Create function for finding empty spot in board
  //Create loop to find empty cell from bottom to top
  function findLastEmptyCell(col) {
  const cells = $(`.col[data-col='${col}']`);
  for (let i = cells.length - 1; i >= 0; i--) {
  const $cell = $(cells[i]);
  if ($cell.hasClass('empty')) {
    return $cell;
    }
  }

    return null;
}

  //Add event listener
  //Highlight where game piece is dropped
  $board.on('mouseenter', '.col.empty', function() {
  if (that.gameOver) return;
  const col = $(this).data('col');
  const $lastEmptyCell =findLastEmptyCell(col);
  $lastEmptyCell.addClass(`next-${that.player}`);
});

  //Add event listener
  //Removes highlight from potential move spot
  $board.on('mouseleave', '.col', function()  {
  $('.col').removeClass(`next-${that.player}`);

});


  //Add event listener
  //What row and col is clicked
  //Add ability to switch players
  $board.on('click', '.col.empty', function() {
  if (that.gameOver) return;
  const col = $(this).data('col');
  const row = $(this).data('row');
  const $lastEmptyCell = findLastEmptyCell(col);
  $lastEmptyCell.removeClass(`empty next-${that.player}`);
  $lastEmptyCell.addClass(that.player);
  $lastEmptyCell.data('player', that.player);


  const winner = that.checkForWinner(
  $lastEmptyCell.data('row'),
  $lastEmptyCell.data('col')
  )

  if  (winner) {
  that.gameOver = true;
  alert(`Game over! Player ${that.player} has won!`);
  $('.col.empty').removeClass('empty');
    return;
}


  that.player = (that.player === 'green') ? 'black' : 'green';
  that.onPlayerMove();
  $(this).trigger('mouseenter');


  });
}


  checkForWinner(row, col) {

  //Gain access to original selector
  const that = this;


  function $slot(i, j) {
    return $(`.col[data-row='${i}'][data-col='${j}']`);
}


  function checkDirection(direction)  {
  let total = 0;
  let i = row + direction.i;
  let j = col + direction.j;
  let $next = $slot(i, j);
  while (i >= 0 &&
    i < that.ROWS &&
    j >= 0 &&
    j < that.COLS &&
    $next.data('player') === that.player
    ) {
    total++;
    i += direction.i;
    j += direction.j;
    $next = $slot(i , j);
    }
    return total;
}

  //Create check for win function
  //Check if four in specific direction
  //Keeps track of total along with direction
  //When total is equal to five winner is alerted
  function checkConnection(directionOne, directionTwo) {
  const total = 1 +
  checkDirection(directionOne) +
  checkDirection(directionTwo);
  if (total >= 5) {
    return that.player;
    } else {
    return null;
  }
}

  //Check diagonal wins (bottom left to top right)
  function diagonalBLTR() {
    return checkConnection({i: 1, j: -1}, {i: 1, j: 1})
  }


  //Check diagonal wins (bottom left to top right)
  function diagonalTLBR() {
    return checkConnection({i: 1, j: 1}, {i: -1, j: -1})
  }


  //Check for vertical wins (up and down)
  function verticals() {
    return checkConnection({i: -1, j: 0}, {i: 1, j: 0})
  }


  //Check for horizontal wins (left and right)
  function horizontals() {
    return checkConnection({i: 0, j: -1}, {i: 0, j: 1})
  }


  return verticals() || horizontals() || diagonalBLTR() || diagonalTLBR();
  }

//Allows game to be restarted
  restart () {
    this.createBoard();
    this.onPlayerMove();
  }
}

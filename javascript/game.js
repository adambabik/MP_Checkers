function MP_Checkers_run() {
  GAME.elements.board.draw();
  GAME.elements.board.click();
  GAME.elements.checkers.populate();
  GAME.elements.checkers.attachEvents();
  GAME.network.connect();
}

window.onload = MP_Checkers_run;
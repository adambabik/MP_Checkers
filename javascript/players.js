(function() {
  var players = GAME.namespace('players');
  
  players.id = Math.floor(Math.random() * 1000000).toString(32);
  players.all = [];
  players.allowMove = false;
  players.orientation = null;
})();
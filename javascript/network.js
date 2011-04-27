(function() {
  var network = GAME.namespace('network');
  
  var socket;
  
  network.connect = function() {
    if (!GAME.config.multiplayer) return;
    
    socket = new EasyWebSocket("dd://ckeckers");
    
    socket.onopen = function(){
      socket.send({
        'type' : 'player_register',
        'player_id' : GAME.players.id
      });
    }
    
    socket.onmessage = function(event){
      switch(event.data.type) {
        case 'player_register':
          if (GAME.players.all.length !== 2) {
            GAME.players.all.push(event.data.player_id);
            
            socket.send({
              'type' : 'set_orientation'
            });
          }
          break;
        case 'set_orientation': 
          if (GAME.players.all.length === 1) {
            GAME.players.orientation = -1; // blue
          } else if(GAME.players.all.length === 2){
            GAME.players.orientation = 1; // red
            GAME.players.allowMove = true;
            
            socket.send({
              'type' : 'sync',
              'player_id' : GAME.players.id
            })
          }
          break;
        case 'sync' : 
          if (event.data.player_id !== GAME.players.id && GAME.players.all.length !== 2) {
            GAME.players.all.push(event.data.player_id);
          };
          break;
          
        case 'player_moved':
          /*
          {
            'type' : 'player_moved',
            'player_id' : GAME.players.id,
            'player_orientation' : GAME.players.orientation,
            'from_cell' : clickedTemp.parentNode.id.split('_')[1],
            'to_cell' : this.id.split('_')[1]
          }
          */
          if (event.data.player_id !== GAME.players.id) {
            GAME.elements.checkers.moveToTd(event.data.to_cell, event.data.from_cell);
          };
          break;
      }
    }
  }
  
  network.message = function(msg) {
    if (!GAME.config.multiplayer) return;

    socket.send(msg);  
  }
})();
(function() {
  var board = GAME.namespace('elements.board'),
      body;
  
  board.draw = function() {
    var tbody = document.createElement('tbody'),
        table = document.createElement('table'),
        tr, td,
        klasa,
        fragment,
        i, k;
        
    body = document.getElementsByTagName('body')[0];

    fragment = document.createDocumentFragment();
    for (i = 0; i < GAME.config.rows; i++) {
      tr = document.createElement('tr');

      for (k = 0; k < GAME.config.rows; k++) {
        td = document.createElement('td');
        klasa = ((k+i+1) % 2) ? 'black' : 'white';
        td.setAttribute('class', klasa);
        td.setAttribute('id', 'nr_'+(i*8+k));
        tr.appendChild(td);
      };
      fragment.appendChild(tr);
    };

    table.appendChild(fragment);
    body.appendChild(table);
  }
  
  board.getTable = function() {
    return body.getElementsByTagName('table')[0];
  }
  
  // stany
  // 0 - nic nie stoi na planszy
  // 1 - pionek czerwony
  // 2 - pionek niebieski
  // 3 - dama czerwona
  // 4 - dama niebieska
  
  board.grid = (function() {
    var arr1 = [];
    
    for (var i = 0; i < 8; i++) {
      var arr2 = [];
      for (var j = 0; j < 8; j++) {
        arr2[j] = 0;
      };
      arr1[i] = arr2;
    };
    
    return arr1;
  })();
  
  board.countTd = function(row, col) {
    return row*8 + col;
  }
  
  board.clear = function() {
    var tds = board.getTable().getElementsByTagName('td');
    
    for (var i = 0; i < tds.length; i++) {
      if(tds[i].getAttribute('class') == 'black highlight') {
        tds[i].setAttribute('class', 'black');
      }
    };
  }
  
  board.click = function() {
    var tds = board.getTable().getElementsByTagName('td');
    
    var click = function(e) {
      e.stopPropagation();
      var no = this.id.split('_')[1];
      GAME.elements.checkers.moveToTd(no);
    }
    
    for (var i = 0; i < tds.length; i++) {
      tds[i].addEventListener('click', click, false);
    };
  }
})();
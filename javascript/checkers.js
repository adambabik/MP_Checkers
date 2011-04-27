(function() {
  var checkers = GAME.namespace('elements.checkers');
      
  var Factory = (function() {
    var counter = 0;
    
    var _draw = function(color) {
      var c = document.createElement('canvas'),
          ctx = c.getContext('2d');

      c.width = 40;
      c.height = 40;

      ctx.beginPath();
      ctx.fillStyle = '#fff';
      ctx.arc(20, 20, 20, 2*Math.PI, 0, 0);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(20, 20, 17, 2*Math.PI, 0, 0);
      ctx.closePath();
      ctx.fill();

      return c.toDataURL();
    }
    
    var _create = function(color, pos) {
      return {
        id : counter++,
        img : function() {
          var img = document.createElement('img');
          img.setAttribute('id', 'checker_' + this.id);
          img.src = _draw(color);

          return img;
        },
        position : {
          x : (typeof pos !== 'undefined') ? pos[0] : null,
          y : (typeof pos !== 'undefined') ? pos[1] : null
        },
        orientation : (color == GAME.config.color1) ? 1 : -1
      }
    }
    
    return {    
      create : function(color, pos) {
        return _create(color, pos);
      }
    }
  })();
  
  checkers.populate = function() {
    var table = GAME.elements.board.getTable(),
        grid = GAME.elements.board.grid,
        tds,
        rowNo = 0,
        colNo = 0,
        all = checkers.all = [],
        i, k = 0;
        
    for (i = 0; i < 12; i++) {
      checkers.all[i] = Factory.create(GAME.config.color1);
    };
    
    for (i = 12; i < 24; i++) {
      checkers.all[i] = Factory.create(GAME.config.color2);
    };
    
    // populate board with reds
    tds = table.getElementsByTagName('td');
    for (i = 0; i < 12; i++) {
      all[i].position.x = colNo;
      all[i].position.y = rowNo;
      
      grid[rowNo][colNo] = 1;
      
      tds[k].appendChild(all[i].img());
      
      if (i == 3) { k += 1; rowNo++; colNo = -1; };
      if (i == 7) { k -= 1; rowNo++; colNo = -2; };
      
      k += 2;
      colNo += 2;
    };
    
    // populate board with blues
    k = 41;
    rowNo = 5;
    colNo = 1;
    for (i = 12; i < 24; i++) {
      all[i].position.x = colNo;
      all[i].position.y = rowNo;
      
      grid[rowNo][colNo] = 2;
      
      tds[k].appendChild(all[i].img());
      
      if (i == 15) { k -= 1; rowNo++; colNo = -2; };
      if (i == 19) { k += 1; rowNo++; colNo = -1; };

      k += 2;
      colNo += 2;
    };
    
  }

  checkers.getId = function(elem) {
    return parseInt(elem.id.split("_")[1], 10);
  }
  
  checkers.position = function(el) {
    return el.position.y*8 + el.position.x;
  }

  checkers.click = function(e) {
    e.stopPropagation();
    
    var table = GAME.elements.board.getTable(),
        imgs = table.getElementsByTagName('img'),
        tds = table.getElementsByTagName('td');
        
    var id = checkers.getId(this),
        checker = checkers.all[id],
        tdNo = GAME.elements.board.countTd(checker.position.y, checker.position.x),
        prev,
        next,
        shift;
      
    if (GAME.config.multiplayer) {
      if (checker.orientation !== GAME.players.orientation) {
        return false;
      };
        
      if (!GAME.players.allowMove) {
        alert('Not your turn');
        return false;
      };
    }
        
    GAME.elements.board.clear();
    this.parentNode.setAttribute('class', 'black highlight');
    checkers.clicked = this;
    
    /*
    if (checker.orientation == 1) {
      shift = 0;
      prev = tds[tdNo+7];
      next = tds[tdNo+9];
    } else {
      shift = -16;
      prev = tds[tdNo-9];
      next = tds[tdNo-7];
    }
    
    if (prev && prev.getAttribute('class') != 'white' && !prev.childNodes[0]) {
      prev.setAttribute('class', 'black highlight');
    }
    
    // check if prev can be taken
    if ( prev.childNodes[0] && GAME.elements.checkers.all[prev.childNodes[0].id.split('_')[1]].orientation !== checker.orientation ) {
      prev = tds[parseInt(prev.id.split('_')[1], 10) + 7 + shift];
      if ( prev && prev.getAttribute('class') != 'white' && !prev.childNodes[0] ) {
        prev.setAttribute('class', 'black highlight');
      };
    };
    
    if (next && next.getAttribute('class') != 'white' && !next.childNodes[0]) {
      next.setAttribute('class', 'black highlight');
    }
    
    // check if next can be taken
    if ( next.childNodes[0] && GAME.elements.checkers.all[next.childNodes[0].id.split('_')[1]].orientation !== checker.orientation ) {
      next = tds[parseInt(next.id.split('_')[1], 10) + 9 + shift];
      if ( next && next.getAttribute('class') != 'white' && !next.childNodes[0] ) {
        next.setAttribute('class', 'black highlight');
      };
    };
    */
  }
  
  checkers.attachEvents = function() {
    var table = GAME.elements.board.getTable(),
        imgs = table.getElementsByTagName('img'),
        tds = table.getElementsByTagName('td');
        
    for (var i = 0, len = imgs.length; i < len; i++) {
      imgs[i].addEventListener('click', checkers.click, false);
    };
  }

  checkers.moveToTd = function(index, objToMove) {
    var table = GAME.elements.board.getTable(),
        tds = table.getElementsByTagName('td'),
        el,
        child,
        parentTempNo,
        diff,
        index = parseInt(index, 10);
       
    checkers.clicked = (typeof objToMove === 'undefined') ? checkers.clicked : document.getElementById('nr_'+objToMove).childNodes[0];
    
    parentTempNo = checkers.clicked.parentNode.id.split('_')[1];
    el = GAME.elements.checkers.all[checkers.clicked.id.split('_')[1]];
    
    diff = index - parentTempNo;
    
    // for reds
    if (el.orientation == 1) {
      switch(diff) {
        case 7: // red on the left
          el.position.x -= 1;
          el.position.y += 1;
          break;
        case 9: // red on the right
          el.position.x += 1;
          el.position.y += 1;
          break;
        case 14: // red takes blue on the left
          child = tds[index-7].childNodes[0];
          if (GAME.elements.checkers.all[child.id.split('_')[1]].orientation != -1) return false;
          el.position.x -= 2;
          el.position.y += 2;  
          GAME.elements.checkers.all[child.id.split('_')[1]] = null;
          tds[index-7].removeChild(child);
          break;
        case 18: // red takes blue on the right
          child = tds[index-9].childNodes[0];
          if (GAME.elements.checkers.all[child.id.split('_')[1]].orientation != -1) return false;
          el.position.x += 2;
          el.position.y += 2;
          GAME.elements.checkers.all[child.id.split('_')[1]] = null;
          tds[index-9].removeChild(child);
          break;
        case -14: // takes blue from back right
          child = tds[index+7].childNodes[0];
          if (GAME.elements.checkers.all[child.id.split('_')[1]].orientation != -1) return false;
          tds[index+7].removeChild(child);
          el.position.x += 2;
          el.position.y -= 2;
          break;
        case -18: // takes blue from back right
          child = tds[index+9].childNodes[0];
          if (GAME.elements.checkers.all[child.id.split('_')[1]].orientation != -1) return false;
          tds[index+9].removeChild(child);
          el.position.x -= 2;
          el.position.y -= 2;
          break;
        default:
          return false;
          break;
      }
    } else { // FOR BLUES
      switch(diff) {
        case -9: // blue on the left
          el.position.x -= 1;
          el.position.y -= 1;
          break;
        case -7: // blue on the right
          el.position.x += 1;
          el.position.y -= 1;
          break;
        case -14: // blue takes red on the left
          child = tds[index+7].childNodes[0];
          if (GAME.elements.checkers.all[child.id.split('_')[1]].orientation != 1) return false;
          
          el.position.x += 2;
          el.position.y -= 2;
          GAME.elements.checkers.all[child.id.split('_')[1]] = null;
          tds[index+7].removeChild(child);
          break;
        case -18: 
          child = tds[index+9].childNodes[0];
          if (GAME.elements.checkers.all[child.id.split('_')[1]].orientation != 1) return false;
          
          el.position.x -= 2;
          el.position.y -= 2;
          GAME.elements.checkers.all[child.id.split('_')[1]] = null;
          tds[index+9].removeChild(child);
          break;
        case 18: // blues takes red on the right back
          child = tds[index-9].childNodes[0];
          if (GAME.elements.checkers.all[child.id.split('_')[1]].orientation != 1) return false;
          
          el.position.x += 2;
          el.position.y += 2;
          GAME.elements.checkers.all[child.id.split('_')[1]] = null;
          tds[index-9].removeChild(child);
          break;
        case 14: // blues takes red on the left back
          child = tds[index-7].childNodes[0];
          if (GAME.elements.checkers.all[child.id.split('_')[1]].orientation != 1) return false;
          
          el.position.x -= 2;
          el.position.y += 2;
          GAME.elements.checkers.all[child.id.split('_')[1]] = null;
          tds[index-7].removeChild(child);
          break;
        case 4: // blues passes 4 to the right == takes 2 reds, one line above
          
          break;
        default:
          return false;
          break;
      }
    }
    
    GAME.network.message({
      'type' : 'player_moved',
      'player_id' : GAME.players.id,
      'player_orientation' : GAME.players.orientation,
      'from_cell' : parentTempNo,
      'to_cell' : index
    });
    
    if (typeof objToMove === 'undefined') {
      GAME.players.allowMove = false;
    } else {
      GAME.players.allowMove = true;
    }
        
    tds[index].appendChild(checkers.clicked);
    
    GAME.elements.board.clear();
  }
})();
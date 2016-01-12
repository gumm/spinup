var getShape = require('./shapes');

/**
 * @param str
 * @return {Array}
 */
var toLines = function(str) {
  var result = [];
  str.replace(/^.*$/gm, function(match) {
    var stringArr = match.split('');
    if (stringArr.length > 1) {
      result.push(stringArr);
    }
  });
  return result;
};

/**
 * @param {Array} lines
 * @return {Array}
 */
var findMarkers = function(lines) {
  var markers = [];
  lines.forEach(function(line, lineNumber) {
    line.forEach(function(char, charNumber) {
      if(char === '+') {
        markers.push([charNumber, lineNumber])
      }
    })
  });
  return markers;
};

/**
 * @param {Array} markers
 * @param {Array} lines
 * @returns {Array}
 */
var gradeMarkers = function(markers, lines) {
  // Marker scores is binary value
  //
  //              1
  //              |
  //           8 -+- 2
  //              |
  //              4
  //
  // These are the only valid positions:
  //
  //             14
  //   6:  +-    -+-     -+ : 12
  //       |      |       |
  //
  //       |              |
  //   7:  +-            -+ : 13
  //       |              |
  //
  //   3:  |      |       |
  //       +-    -+-     -+ : 9
  //             11

  var maxY = lines.length - 1;
  var maxX = lines[0].length - 1;

  var getScore = function(coord) {

    var score_1 = function(coord) {
      var check = [coord[0], coord[1] - 1];
      var result = 0;
      var isValid = check[1] >= 0;
      if (isValid) {
        if (lines[check[1]][check[0]] === '|') {
          result = 1
        }
      }
      return result;
    };

    var score_2 = function(coord) {
      var check = [coord[0] + 1, coord[1]];
      var result = 0;
      var isValid = check[0] < maxX;
      if (isValid) {
        if (lines[check[1]][check[0]] === '-') {
          result = 2
        }
      }
      return result;
    };

    var score_4 = function(coord) {
      var check = [coord[0], coord[1] + 1];
      var result = 0;
      var isValid = check[1] <= maxY;
      if (isValid) {
        if (lines[check[1]][check[0]] === '|') {
          result = 4
        }
      }
      return result;
    };

    var score_8 = function(coord) {
      var check = [coord[0] - 1, coord[1]];
      var result = 0;
      var isValid = check[0] >= 0;
      if (isValid) {
        if (lines[check[1]][check[0]] === '-') {
          result = 8
        }
      }
      return result;
    };
    return score_1(coord) + score_2(coord) + score_4(coord) + score_8(coord);
  };

  return markers.map(function(coord) {
     return [getScore(coord), coord];
  });
};


/**
 * @param {Array} gMarkers
 * @param {Object} gMark
 * @param {string} orient
 * @return {{ORIENT: String, TL: Object, TR: Object, BL: Object, BR: Object, CELLS: Array}}
 */
var parseLayoutShapes = function(gMarkers, gMark, orient) {

  var h = 'horizontal';

  var findTR = function(x, y, targetShape) {
    return gMarkers.find(function(poten) {
      var shape = poten[0];
      var tx = poten[1][0];
      var ty = poten[1][1];
      return (shape === targetShape && ty === y && tx > x)
    });
  };

  var findBL = function(x, y, targetShape) {
    return gMarkers.find(function(poten) {
      var shape = poten[0];
      var tx = poten[1][0];
      var ty = poten[1][1];
      return (shape === targetShape && tx === x && ty > y)
    });
  };

  var findBR = function(x, y, tr, bl, targetShape) {
    return gMarkers.find(function(poten) {
      var shape = poten[0];
      var tx = poten[1][0];
      var ty = poten[1][1];
      return (shape === targetShape && ty === bl[1][1] && tx === tr[1][0])
    });
  };

  var coord = gMark[1];
  var x = coord[0];
  var y = coord[1];
  var TL = gMark;
  var TR = findTR(x, y, 12);
  var BL = findBL(x, y, 3);
  var BR = findBR(x, y, TR, BL, 9);
  var layout = {
    ORIENT: orient,
    TL: gMark,
    TR: TR,
    BL: BL,
    BR: BR,
    CELLS: []
  };

  var cellA = function(tl) {
    var ATL = tl;
    var x = ATL[1][0];
    var y = ATL[1][1];
    var ATR = findTR(x, y, orient == h ? 14 : 12);
    var ABL = findBL(x, y, orient == h ? 3 : 7);
    var ABR = findBR(x, y, ATR, ABL, orient == h ? 11 : 13);
    return {
      TL: ATL,
      TR: ATR,
      BL: ABL,
      BR: ABR
    }
  };

  var cellB = function(tl) {
    var ATL = tl;
    var x = ATL[1][0];
    var y = ATL[1][1];
    var ATR = findTR(x, y, orient == h ? 14 : 13);
    var ABL = findBL(x, y, orient == h ? 11 : 7);
    var ABR = findBR(x, y, ATR, ABL, orient == h ? 11 : 13);
    return {
      TL: ATL,
      TR: ATR,
      BL: ABL,
      BR: ABR
    }
  };

  var cellC = function(tl) {
    var ATL = tl;
    var x = ATL[1][0];
    var y = ATL[1][1];
    var ATR = findTR(x, y, orient == h ? 12 : 13);
    var ABL = findBL(x, y, orient == h ? 11 : 3);
    var ABR = findBR(x, y, ATR, ABL, orient == h ? 9 : 9);
    return {
      TL: ATL,
      TR: ATR,
      BL: ABL,
      BR: ABR
    }
  };

  var A = cellA(TL);
  var B = cellB(orient == h ? A.TR : A.BL);
  var C = cellC(orient == h ? B.TR : B.BL);
  layout.CELLS = [A, B, C];
  return layout;
};


/**
 * @param {Array} markers
 * @return {Array}
 */
var parseStartMarkers = function(markers) {
  var v = 'vertical';
  var h = 'horizontal';
  var e = null;
  var layouts = [];
  markers.forEach(function(m, i) {
    var shape = m[0];
    if (shape === 6) {
      var orient = e;
      if(markers[i + 1][0] === 12) {
        orient = v;
      } else if(markers[i + 1][0] === 14) {
        orient = h;
      }
      var lOut = parseLayoutShapes(markers, m, orient);
      layouts.push(lOut);
    }
  });
  return layouts;
};

/**
 * @param {Array} layouts
 * @param {Array} lines
 * @return {Array}
 */
var parseNames = function(layouts, lines) {
  return layouts.map(function(layout) {
    layout.CELLS = layout.CELLS.map(function(cell) {
      var nStart = cell.TL[1][0] + 1;
      var nEnd = cell.TR[1][0] - 1;
      var y = cell.TL[1][1] + 1;
      var tName = lines[y].slice(nStart, nEnd).join('').replace(/ */g, '');
      var size = null;
      var name = tName.replace(/^(\D+)\((\d+)\)/ig, function(match, p1, p2) {
        if (match) {
          size = parseInt(p2, 10);
        }
        return p1;
      });
      cell.NAME = name;
      cell.SIZE = size;
      return cell;
    });
    return layout;
  });
};

/**
 * @param {Object} a
 * @param {Object} b
 * @returns {boolean}
 */
var aFitsInB = function(a, b) {
  return (
      a.TL[1][0] > b.TL[1][0] &&
      a.TL[1][1] > b.TL[1][1] &&
      a.BR[1][0] < b.BR[1][0] &&
      a.BR[1][1] < b.BR[1][1]);
};

/**
 * @param {Array} layouts
 * @return {Array}
 */
var nestLayouts = function(layouts) {
  var nested =  layouts.map(function(l) {
    l.CELLS = l.CELLS.map(function(cell) {
      var lInC = layouts.filter(function(tl) {
          return aFitsInB(tl, cell);
      });
      if (lInC.length == 0) {
        cell.INNERLAYOUT = null;
      } else if (lInC.length == 1) {
        cell.INNERLAYOUT = lInC[0];
      } else {
        cell.INNERLAYOUT = lInC.reduce((pv, cv) => aFitsInB(pv, cv) ? cv: pv);
      }
      return cell;
    });
    return l;
  });
  return nested[0];
};

var parseOuterLayout = function(id, layout) {

  var parseLayout = function(l) {
    return [
        parseCells(l.CELLS[0]),
        parseCells(l.CELLS[1]),
        parseCells(l.CELLS[2])
    ];
  };

  var parseCells = function(c) {
    var reply = [c.NAME, null, []];
    if (c.INNERLAYOUT) {
      reply[1] = c.INNERLAYOUT.ORIENT;
      reply[2] = parseLayout(c.INNERLAYOUT);
    }
    if (c.SIZE) {
      reply[3] = c.SIZE
    }
    return reply;
  };
  return [id, layout.ORIENT, parseLayout(layout)];
};

module.exports = function(id, str) {
  var shape = getShape(str);
  var lines = toLines(shape);
  var markers = findMarkers(lines);
  var gradedMarkers = gradeMarkers(markers, lines);
  var layouts = parseStartMarkers(gradedMarkers);
  var namedLayouts = parseNames(layouts, lines);
  var nested = nestLayouts(namedLayouts);
  return parseOuterLayout(id, nested);
};

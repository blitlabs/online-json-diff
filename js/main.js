(function() {

  function JsonInputView(el) {
    this.el = el;
    var codemirror = this.codemirror = CodeMirror.fromTextArea(this.el, {
      lineNumbers: true,
      mode: {name: "javascript", json: true}
    });
    var self = this;

    codemirror.on('inputRead', function (cm, e) {
      if (e.origin === 'paste') {
        autoFormat();
      }
      triggerChange();
    });
    codemirror.on('keyup', triggerChange);
    codemirror.on('change', triggerChange);
    codemirror.on('clear', function () {
      console.log(arguments);
    });

    var oldValue = '';
    function triggerChange() {
      var text = codemirror.getValue();
        if (text !== oldValue) {
          self.trigger('change');
        }
      oldValue = text;
    }

    function autoFormat() {
      var totalLines = codemirror.lineCount();
      codemirror.autoFormatRange({line:0, ch:0}, {line:totalLines});
      codemirror.setSelection({line:0, ch:0});
    }
  }

  JsonInputView.prototype.getText = function () {
    return this.codemirror.getValue();
  };

  JsonInputView.prototype.highlightRemoval = function (diff) {
    var beginPos = findPositionOfKey(this.getText(), diff);
    var endPos = findEndPositionOfValue(this.getText(), diff);
    this.codemirror.markText(beginPos, endPos, {
      css: 'background-color: red'
    });
  };

  JsonInputView.prototype.highlightAddition = function (diff) {
    var beginPos = findPositionOfKey(this.getText(), diff);
    var endPos = findEndPositionOfValue(this.getText(), diff);
    this.codemirror.markText(beginPos, endPos, {
      css: 'background-color: blue'
    });
  };

  JsonInputView.prototype.highlightChange = function (diff) {
    var beginPos = findPositionOfKey(this.getText(), diff);
    var endPos = findEndPositionOfValue(this.getText(), diff);
    this.codemirror.markText(beginPos, endPos, {
      css: 'background-color: yellow'
    });
  };

  JsonInputView.prototype.clearMarkers = function () {
    this.codemirror.getAllMarks().forEach(function (marker) {
      marker.clear();
    });
  }

  function findPositionOfKey(textValue, diff) {
    var path = diff.path.replace('/', '').split('/');
    var lines = textValue.split('\n');
    var lineNumber = 0, charNumber = 0;
    for (var i = 0; i < lines.length; i++) {
      lineNumber = i;
      var line = lines[i];
      var nextPathRegex = function () {
        var firstKey = path[0];
        return new RegExp('"' + firstKey + '"[^:]*:', 'g');
      }

      var indexOfNextPath = function () {
        return line.search(nextPathRegex());
      };

      while (indexOfNextPath() > -1 && path.length > 0) {
        charNumber = indexOfNextPath();
        path.shift();
      }
      if (path.length === 0) {
        break;
      }
    }
    return {
      line: lineNumber,
      ch: charNumber
    };
  }

  function findEndPositionOfValue(textValue, diff) {
    var keyPos = findPositionOfKey(textValue, diff);
    var QUOTE = '"';
    var OBJ_OPEN = '{';
    var OBJ_CLOSE = '}';
    var ARR_OPEN = '[';
    var ARR_CLOSE = ']';

    var lines = textValue.split('\n');
    var endIndex = 0;
    var i = textValue.match(new RegExp('(.*\n){' + (keyPos.line) + '}', 'g'))[0].length + (keyPos.ch);
    i += textValue.substr(i).match(/"[^"]*":\s*/g)[0].length;
    var valueStartingChar = textValue[i];
    var isPrimitiveValue = valueStartingChar !== OBJ_OPEN && valueStartingChar !== ARR_OPEN;
    if (isPrimitiveValue) {
      if (valueStartingChar === QUOTE) {
        i += 1;
        endIndex = i + textValue.substr(i).match(/[^\\"]*"/g)[0].length;
      } else {
        endIndex = i + textValue.substr(i).match(/(\w|\d)+/g)[0].length;
      }
    } else {
      var closingStr = valueStartingChar === OBJ_OPEN ? OBJ_CLOSE : ARR_CLOSE;
      var stack = [];
      stack.push(valueStartingChar);
      i += 1;
      while (stack.length > 0) {
        var o = '\\' + valueStartingChar, c = '\\' + closingStr;
        var str = textValue.substr(i).match(new RegExp('[^'+o+c+']*('+o+'|'+c+')', 'g'))[0];
        i += str.length;
        if (str[str.length - 1] === closingStr) {
          stack.pop();
        } else {
          stack.push(valueStartingChar);
        }
      }
      endIndex = i;
    }

    return indexToPos(textValue, endIndex);
  }

  function indexToPos(textValue, i) {
    var beginStr = textValue.substr(0, i);
    var lines = beginStr.split('\n');
    return {
      line: lines.length - 1,
      ch: lines[lines.length - 1].length
    };
  }

  BackboneEvents.mixin(JsonInputView.prototype);


  var leftInputView = new JsonInputView(document.getElementById('json-diff-left'));
  var rightInputView = new JsonInputView(document.getElementById('json-diff-right'));
  leftInputView.on('change', compareJson);
  rightInputView.on('change', compareJson);

  function compareJson() {
    leftInputView.clearMarkers();
    rightInputView.clearMarkers();
    var leftJson, rightJson;
    try {
      leftJson = JSON.parse(leftInputView.getText());
      rightJson = JSON.parse(rightInputView.getText());
    } catch (e) {}
    if (!leftJson || !rightJson) return;
    var diffs = jsonpatch.compare(leftJson, rightJson);
    diffs.forEach(function (diff) {
      if (diff.op === 'remove') {
        leftInputView.highlightRemoval(diff);
      } else if (diff.op === 'add') {
        rightInputView.highlightAddition(diff);
      } else if (diff.op === 'replace') {
        rightInputView.highlightChange(diff);
        leftInputView.highlightChange(diff);
      }
    });
  }

  // function


})();

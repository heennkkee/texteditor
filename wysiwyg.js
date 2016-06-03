var toggles = {
        'bold': {state: false, cmd: 'bold', obj: null, className: 'format_bold icon inactive', tooltip: 'Bold'},
        'italic': {state: false, cmd: 'italic', obj: null, className: 'format_italic icon inactive', tooltip: 'Italic'},
        'underline': {state: false, cmd: 'underline', obj: null, className: 'format_underline bold icon inactive', tooltip: 'Underline'},
        'justifyLeft': {state: true, cmd: 'justifyLeft', obj: null, className: 'format_align_left icon active', tooltip: 'Justify left'},
        'justifyCenter': {state: false, cmd: 'justifyCenter', obj: null, className: 'format_align_center icon inactive', tooltip: 'Justify center'},
        'justifyRight': {state: false, cmd: 'justifyRight', obj: null, className: 'format_align_right icon inactive', tooltip: 'Justify right'}
    },
    toggleKeys = Object.keys(toggles),
    fonts = ['Arial', 'Times New Roman', 'Lucida Console', 'Comic Sans MS', 'Verdana'],
    sizes = {1: 'Smallest', 2: 'Small', 3: 'Normal', 4: 'Big', 5: 'Bigger', 6: 'Huge', 7: 'Gigantic'},
    parent,
    statusBar,
    statusBarAttached = true,
    timeout,
    fadeOutTimer,
    fontFamily,
    fontSize,
    contentEditor,
    colorPicker;

    class TextEditor {
        constructor(el, state) {
            this.parent = el;
            this.parent.className = 'textEditor minimized';

            //this.createStatusbar();

            this.contentEditor = document.createElement('div');
            this.contentEditor.contentEditable = "true";
            this.contentEditor.id = "henrik-text";
            this.contentEditor.className = "my-textarea";

            this.contentEditor.onkeydown = function (event) {
                this.checkHotkeys(event);
            };

            this.contentEditor.onmouseup = function () {
                this.check();
            };
            this.contentEditor.onkeyup = function () {
                this.check();
                this.autosave();
            };
            this.contentEditor.oncontextmenu = function (event) {
                if (!statusBarAttached) {
                    this.clearMyTimeout();
                    this.moveStatusBar(event.pageX, event.pageY);
                    event.preventDefault();
                }
            };

            document.getElementById('myArea').appendChild(this.contentEditor);
            this.load(this.contentEditor);
        }

        load(target) {
            "use strict";
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "autosave.php", true);
            xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xmlhttp.send("do=load");
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    var text = JSON.parse(xmlhttp.responseText).output;
                    target.innerHTML = text;
                }
            };
        }
    }

function toggleLooks(e) {
    "use strict";

    //Toggle the class of the button
    if (e.state) {
        e.obj.className = e.obj.className.replace('active', 'inactive');
    } else {
        e.obj.className = e.obj.className.replace('inactive', 'active');
    }

    //Toggle the state
    e.state = !e.state;
}

function fadeOut(element, callback) {
    "use strict";
    var op = 1;  // initial opacity
    fadeOutTimer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(fadeOutTimer);
            element.style.display = 'none';
            if (typeof callback === 'function') {
                callback();
            }
        }
        element.style.opacity = op;
        op -= 0.15;
    }, 20);
}

function fadeIn(element) {
    "use strict";
    var op = 0;  // initial opacity
    fadeOutTimer = setInterval(function () {
        if (op >= 1) {
            clearInterval(fadeOutTimer);
            element.style.display = null;
        }
        element.style.opacity = op;
        op += 0.15;
    }, 20);
}

function toggleActive(e) {
    "use strict";
    document.execCommand(e.cmd);
    toggleLooks(e);
}


function setButton(obj, targetState) {
    "use strict";
    if (targetState === "on") {
        if (!obj.state) {
            toggleLooks(obj);
        }
    } else if (targetState === "off") {
        if (obj.state) {
            toggleLooks(obj);
        }
    }
}

function addToggleFunction(e) {
    "use strict";
    e.obj.onmousedown = function (event) {
        toggleActive(e);
        checkStates();
        event.preventDefault();
    };
}

function hideMenu() {
    "use strict";
    timeout = setTimeout(function () {
        fadeOut(statusBar);
    }, 1500);
}

function showMenu() {
    "use strict";
    statusBar.style.opacity = 1;
}

function moveStatusBar(left, top) {
    "use strict";
    statusBar.style.left = (left + 10) + 'px';
    statusBar.style.top = (top + 10) + 'px';
    statusBar.style.display = 'block';
    showMenu();
    hideMenu();
}

function clearMyTimeout() {
    "use strict";
    clearTimeout(timeout);
    clearInterval(fadeOutTimer);
}

function toggleAttach(me) {
    "use strict";
    clearMyTimeout();

    if (me.className.indexOf('attach') > -1) {
        fadeOut(statusBar, function () {
            statusBar.className = statusBar.className.replace('detached', 'attached');
            statusBar.style.top = 0;
            statusBar.style.left = 0;
            me.className = me.className.replace('attach', 'detach');
            me.title = 'Detach from editor';
            fadeIn(statusBar);

            statusBarAttached = true;
        });
    } else {
        fadeOut(statusBar, function () {
            statusBar.className = statusBar.className.replace('attached', 'detached');
            me.className = me.className.replace('detach', 'attach');
            me.title = 'Attach to editor';
            statusBarAttached = false;
        });
    }
}

function toggleMaximize(me) {
    "use strict";
    fadeOut(parent, function () {
        if (parent.className.indexOf('maximized') > -1) {
            parent.className = parent.className.replace('maximized', 'minimized');
            me.className = me.className.replace('minimize', 'maximize');
            me.title = 'Maximize the editor.';
        } else {
            parent.className = parent.className.replace('minimized', 'maximized');
            me.className = me.className.replace('maximize', 'minimize');
            me.title = 'Minimize the editor.';
        }
        fadeIn(parent);
    });
}
function createStatusbar() {
    "use strict";
    var x = 0,
        temp;

    statusBar = document.createElement('div');
    statusBar.id = 'henrik-statusBar';
    statusBar.className = "statusBar attached minimized";

    statusBar.onmouseenter = function () {
        if (!statusBarAttached) {
            showMenu();
            clearMyTimeout();
        }
    };

    statusBar.onmouseleave = function () {
        if (!statusBarAttached) {
            hideMenu();
        }
    };

    for (x; x < toggleKeys.length; x += 1) {
        toggles[toggleKeys[x]].obj = document.createElement('i');
        toggles[toggleKeys[x]].obj.className = toggles[toggleKeys[x]].className;
        toggles[toggleKeys[x]].obj.title = toggles[toggleKeys[x]].tooltip;
        addToggleFunction(toggles[toggleKeys[x]]);
        statusBar.appendChild(toggles[toggleKeys[x]].obj);
    }

    temp = document.createElement('i');
    temp.className = 'detach icon';
    temp.title = 'Detach from editor';

    temp.onmousedown = function (event) {
        toggleAttach(this);
        event.preventDefault();
    };
    statusBar.appendChild(temp);

    temp = document.createElement('i');
    temp.className = 'maximize icon';
    temp.title = 'Maximize editor';
    temp.onmousedown = function (event) {
        toggleMaximize(this);
        event.preventDefault();
    };

    statusBar.appendChild(temp);

    fontSize = document.createElement('select');
    fontSize.className = "fontSize mySelect";
    fontSize.title = 'Fontsize';
    var keys = Object.keys(sizes);
    for (x = 0; x < keys.length; x += 1) {
        temp = document.createElement('option');
        temp.value = keys[x];
        temp.innerHTML = sizes[keys[x]];
        fontSize.appendChild(temp);
    }

    fontSize.value = 3;
    fontSize.onclick = function (event) {
        event.preventDefault();
    };
    fontSize.onchange = function () {
        document.execCommand('fontSize', null, this.value);
    };

    statusBar.appendChild(fontSize);

    fontFamily = document.createElement('select');
    fontFamily.className = 'fontFamily mySelect';
    for (x = 0; x < fonts.length; x += 1) {
        temp = document.createElement('option');
        temp.value = fonts[x];
        temp.appendChild(document.createTextNode(fonts[x]));
        fontFamily.appendChild(temp);
    }

    fontFamily.onclick = function (event) {
        event.preventDefault();
    };

    fontFamily.onchange = function () {
        document.execCommand('fontName', null, this.value);
    };

    statusBar.appendChild(fontFamily);

    statusBar.onkeydown = function (event) {
        event.preventDefault();
    };

    parent.appendChild(statusBar);
}

function dropMe(me) {
    "use strict";
    $(me).children().each(function () {
        $(this).toggleClass("dropped");
    });
}

function selectMe(event, me) {
    "use strict";
    $('.selected').removeClass('selected');
    $(me).addClass('selected');

    event.preventDefault();
}

function checkFont() {
    "use strict";
    var font = document.queryCommandValue('fontName');
    font = font.replace(/'/g, '');

    fontFamily.value = font;

    var size = document.queryCommandValue('fontSize');
    size = (size === "") ? 3 : size;
    fontSize.value = size;
}

function checkStates() {
    "use strict";
    var x = 0;
    for (x; x < toggleKeys.length; x += 1) {
        if (document.queryCommandState(toggleKeys[x])) {
            setButton(toggles[toggleKeys[x]], 'on');
        } else {
            setButton(toggles[toggleKeys[x]], 'off');
        }
    }
}

function check() {
    "use strict";
    checkStates();
    checkFont();
}

function autosave() {
    "use strict";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "autosave.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send("do=save&text=" + contentEditor.innerHTML);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            console.log(xmlhttp.responseText);
        }
    };
}

function checkHotkeys(e) {
    "use strict";
    if (e.which === 66 && e.ctrlKey) {
        toggleActive(toggles.bold);
        e.preventDefault();
    } else if (e.which === 73 && e.ctrlKey) {
        toggleActive(toggles.italic);
        e.preventDefault();
    } else if (e.which === 85 && e.ctrlKey) {
        toggleActive(toggles.underline);
        e.preventDefault();
    }
}

function initWYSIWYG(el) {
    "use strict";

    parent = el;
    parent.className = 'textEditor minimized';

    createStatusbar();

    contentEditor = document.createElement('div');
    contentEditor.contentEditable = "true";
    contentEditor.id = "henrik-text";
    contentEditor.className = "my-textarea";

    contentEditor.onkeydown = function (event) {
        checkHotkeys(event);
    };

    contentEditor.onmouseup = function () {
        check();
    };
    contentEditor.onkeyup = function () {
        check();
        autosave();
    };
    contentEditor.oncontextmenu = function (event) {
        if (!statusBarAttached) {
            clearMyTimeout();
            moveStatusBar(event.pageX, event.pageY);
            event.preventDefault();
        }
    };

    document.getElementById('myArea').appendChild(contentEditor);
    load();
}

/*global Event, XMLHttpRequest */

window.myEditor = (function () {
    "use strict";
    var toggles = {
            'bold': {state: false, cmd: 'bold', obj: null, className: 'format_bold icon inactive', tooltip: 'Bold'},
            'italic': {state: false, cmd: 'italic', obj: null, className: 'format_italic icon inactive', tooltip: 'Italic'},
            'underline': {state: false, cmd: 'underline', obj: null, className: 'format_underline bold icon inactive', tooltip: 'Underline'},
            'justifyLeft': {state: true, cmd: 'justifyLeft', obj: null, className: 'format_align_left icon active', tooltip: 'Justify left'},
            'justifyCenter': {state: false, cmd: 'justifyCenter', obj: null, className: 'format_align_center icon inactive', tooltip: 'Justify center'},
            'justifyRight': {state: false, cmd: 'justifyRight', obj: null, className: 'format_align_right icon inactive', tooltip: 'Justify right'}
        },
        toggleKeys = Object.keys(toggles),
        fonts = ['Arial', 'Times New Roman', 'Lucida Console', 'Courier New', 'Calibri', 'Comic Sans MS', 'Verdana'],
        sizes = {1: 'Smallest', 2: 'Small', 3: 'Normal', 4: 'Big', 5: 'Bigger', 6: 'Huge', 7: 'Gigantic'},
        parent,
        statusBar,
        statusBarAttached,
        timeout,
        fadeOutTimer,
        fontFamily,
        fontSize,
        createStatusbar,
        contentEditor,
        init,
        load,
        fadeIn,
        fadeOut,
        checkStates,
        checkHotkeys,
        autosave,
        clearMyTimeout,
        moveStatusBar,
        check,
        checkFont,
        hideMenu,
        showMenu,
        addToggleFunction,
        toggleAttach,
        toggleMaximize,
        setButton,
        toggleLooks,
        toggleActive,
        textEditor,
        save,
        saveEvent = new Event('save'),
        saveCount = 0,
        clearSession,
        autosavePath,
        toggleLock,
        clearUpEditor,
        myOptions = {parent: {}, editor: {}, toolbar: {}};

    textEditor = function (reference) {
        autosavePath = myOptions.autosave;

        contentEditor = reference;
        contentEditor.contentEditable = myOptions.editable;
        contentEditor.className += " minimized";
        contentEditor.style.border = myOptions.editor.border;

        var bar = createStatusbar();

        parent = document.createElement('div');

        parent.style.display = myOptions.parent.display;
        parent.style.width = myOptions.parent.width;
        parent.style.border = myOptions.parent.border;
        parent.style.margin = myOptions.parent.margin;

        contentEditor.parentNode.insertBefore(parent, contentEditor);
        contentEditor.remove();

        parent.className = 'textEditor minimized';
        parent.appendChild(bar);
        parent.appendChild(contentEditor);


        contentEditor.onmousedown = function (event) {
            if (event.target.tagName === 'A') {
                window.open(event.target.href, '_blank');
            }
        };

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
    };

    load = function () {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", autosavePath, true);
        xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp.send("do=load&id=" + contentEditor.id);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var text = JSON.parse(xmlhttp.responseText).output;
                if (text !== '') {
                    contentEditor.innerHTML = text;
                }
            }
        };
    };

    init = function (el, options) {

        if (options === undefined) {
            options = {};
        }


        myOptions.saveLimit = (options.saveLimit === undefined) ? 10 : options.saveLimit;
        myOptions.autosave = (options.autosave === undefined) ? 'autosave.php' : options.autosave;
        myOptions.editable = (options.editable === undefined) ? "true" : options.editable;

        if (options.parent === undefined) {
            options.parent = {};
        }

        myOptions.parent.display = (options.parent.display === undefined) ? 'inline-block' : options.parent.display;
        myOptions.parent.width = (options.parent.width === undefined) ? '' : options.parent.width;
        myOptions.parent.border = (options.parent.border === undefined) ? '' : options.parent.border;
        myOptions.parent.margin = (options.parent.margin === undefined) ? '' : options.parent.margin;

        if (options.toolbar === undefined) {
            options.toolbar = {};
        }

        myOptions.toolbar.state = (options.toolbar.state === undefined) ? '' : options.toolbar.state;
        myOptions.toolbar.background = (options.toolbar.background === undefined) ? 'white' : options.toolbar.background;

        if (options.editor === undefined) {
            options.editor = {};
        }

        myOptions.editor.border = (options.editor.border === undefined) ? '1px black solid' : options.editor.border;



        fonts.sort();

        textEditor(el);
        load();
    };

    fadeOut = function (element, callback) {
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
    };

    fadeIn = function (element, display) {
        var op = 0;  // initial opacity
        element.style.display = (display === undefined) ? '' : display;
        fadeOutTimer = setInterval(function () {
            if (op >= 1) {
                clearInterval(fadeOutTimer);
            }
            element.style.opacity = op;
            op += 0.1;
        }, 15);
    };


    createStatusbar = function () {
        var x = 0,
            temp;

        statusBar = document.createElement('div');
        statusBar.id = 'henrik-statusBar';
        statusBar.className = "statusBar minimized " + ((myOptions.toolbar.state === 'detached') ? 'detached' : 'attached');
        statusBar.style.background = myOptions.toolbar.background;

        statusBarAttached = ((myOptions.toolbar.state === 'detached') ? false : true);
        if (!statusBarAttached) {
            statusBar.style.display = 'none';
        }

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
        if (contentEditor.contentEditable === true) {
            temp.className = 'lock icon';
            temp.title = 'Lock the text for editing.';
        } else {
            temp.className = 'unlock icon';
            temp.title = 'Unlock the text.';
        }

        temp.onmousedown = function (event) {
            toggleLock(this);
            if (!statusBarAttached) {
                fadeOut(statusBar);
            }
            event.preventDefault();
        };

        statusBar.appendChild(temp);


        temp = document.createElement('i');
        temp.className = 'link icon';
        temp.onmousedown = function (event) {
            var link = prompt("Where are you linking?", "http://");

            document.execCommand('createLink', null, link);
            event.preventDefault();
        };
        statusBar.appendChild(temp);

        temp = document.createElement('i');
        if (!statusBarAttached) {
            temp.className = 'attach icon';
            temp.title = 'Attach to editor';
        } else {
            temp.className = 'detach icon';
            temp.title = 'Detach from editor';
        }

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

        temp = document.createElement('i');
        temp.className = 'save icon';
        temp.title = 'Save text';
        temp.onmousedown = function (event) {
            save();
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
            autosave();
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
            autosave();
        };

        statusBar.appendChild(fontFamily);

        statusBar.onkeydown = function (event) {
            event.preventDefault();
        };

        return statusBar;
    };

    clearUpEditor = function (doms) {
        var x = 0;
        for (x; x < doms.length; x += 1) {
            if (doms[x].hasChildNodes()) {
                clearUpEditor(doms[x].childNodes);
            } else {
                if (doms[x].data !== undefined) {
                    if (doms[x].data.replace(/\n/g, '').replace(/ /g, '') === '') {
                        doms[x].remove();
                    }
                }
            }
        }
    };

    save = function () {
        clearSession();
        if (contentEditor.hasChildNodes()) {
            clearUpEditor(contentEditor.childNodes);
        }
        saveEvent.text = contentEditor.innerHTML.replace(/&nbsp;/g, ' ');
        contentEditor.dispatchEvent(saveEvent);
    };

    checkStates = function () {
        var x = 0;
        for (x; x < toggleKeys.length; x += 1) {
            if (document.queryCommandState(toggleKeys[x])) {
                setButton(toggles[toggleKeys[x]], 'on');
            } else {
                setButton(toggles[toggleKeys[x]], 'off');
            }
        }
    };

    check = function () {
        checkStates();
        checkFont();
    };

    checkFont = function () {
        var font = document.queryCommandValue('fontName');
        font = font.replace(/'/g, '');
        fontFamily.value = font;

        var size = document.queryCommandValue('fontSize');
        size = (size === "") ? 3 : size;
        fontSize.value = size;
    };

    toggleLooks = function (e) {
        //Toggle the class of the button
        if (e.state) {
            e.obj.className = e.obj.className.replace('active', 'inactive');
        } else {
            e.obj.className = e.obj.className.replace('inactive', 'active');
        }

        //Toggle the state
        e.state = !e.state;
    };

    toggleActive = function (e) {
        document.execCommand(e.cmd);
        autosave();
        toggleLooks(e);
    };


    setButton = function (obj, targetState) {
        if (targetState === "on") {
            if (!obj.state) {
                toggleLooks(obj);
            }
        } else if (targetState === "off") {
            if (obj.state) {
                toggleLooks(obj);
            }
        }
    };

    addToggleFunction = function (e) {
        e.obj.onmousedown = function (event) {
            toggleActive(e);
            checkStates();
            event.preventDefault();
        };
    };

    hideMenu = function () {
        timeout = setTimeout(function () {
            fadeOut(statusBar);
        }, 1500);
    };

    showMenu = function () {
        statusBar.style.opacity = 1;
    };

    moveStatusBar = function (left, top) {
        statusBar.style.left = (left + 10) + 'px';
        statusBar.style.top = (top + 10) + 'px';
        statusBar.style.display = 'block';
        showMenu();
        hideMenu();
    };

    clearMyTimeout = function () {
        clearTimeout(timeout);
        clearInterval(fadeOutTimer);
    };

    toggleLock = function (me) {
        if (contentEditor.contentEditable === "true") {
            me.className = me.className.replace('lock', 'unlock');
            me.title = 'Unlock the text.';
            contentEditor.contentEditable = false;
        } else {
            me.className = me.className.replace('unlock', 'lock');
            me.title = 'Lock the text for editing.';
            contentEditor.contentEditable = true;
        }
    };

    toggleAttach = function (me) {
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
    };

    toggleMaximize = function (me) {

        fadeOut(parent, function () {
            if (parent.className.indexOf('maximized') > -1) {
                parent.className = parent.className.replace('maximized', 'minimized');
                contentEditor.className = contentEditor.className.replace('maximized', 'minimized');
                me.className = me.className.replace('minimize', 'maximize');
                me.title = 'Maximize the editor.';
            } else {
                parent.className = parent.className.replace('minimized', 'maximized');
                contentEditor.className = contentEditor.className.replace('minimized', 'maximized');
                me.className = me.className.replace('maximize', 'minimize');
                me.title = 'Minimize the editor.';
            }
            fadeIn(parent, myOptions.parent.display);
        });
    };

    autosave = function () {
        if (myOptions.autosave === false) {
            return;
        }

        if (saveCount > myOptions.parent.width && myOptions.parent.width !== false) {
            save();
            saveCount = 0;
            clearSession();
        } else {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", autosavePath, true);
            xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xmlhttp.send("id=" + contentEditor.id + "&do=save&text=" + contentEditor.innerHTML.replace(/&nbsp;/g, ' '));
            saveCount += 1;

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    var output = JSON.parse(xmlhttp.responseText).output;
                    if (output !== '') {
                        console.log(output);
                    }
                }
            };
        }
    };

    clearSession = function () {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", autosavePath, true);
        xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp.send("do=clear&id=" + contentEditor.id);

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var output = JSON.parse(xmlhttp.responseText).output;
                if (output !== '') {
                    console.log(output);
                }
            }
        };
    };

    checkHotkeys = function (e) {

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
    };

    return {
        'init': init
    };

}());

function initWYSIWYG(el, options) {
    "use strict";
    window.myEditor.init(el, options);
}

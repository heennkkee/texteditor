# WYSIWYG Henrik

This project is the final part of the javascript course at BTH in Sweden (spring 2016). Please don't hesitate to use and do whatever you wish with the code.

**Bare in mind this project is developed using a Chrome browser and judged with a Firefox browser**, usability with any other browser isn't guaranteed.

## Initiation

Include the files `wysiwyg.js` and `wysiwyg.css` and make sure you have the `autosave.php` (may be renamed/replace with a parameter) in the correct places.

To initiate the editor call `initWYSIWYG()` with a standard javascript DOM selector as first parameter and an optional object of settings (listed **below**) as second parameter.

`initWYSIWYG(document.getElementById('myContentDiv'), {toolbar: {state: 'detached'}});`

To save to an external database, add an eventListener to the selected `div` (the one passed to the `init()` function) and listen for the event `save`. To get the text contained in the element which sent the `save` event look for the property `text` in the event, `event.text`, and you'll find the text ready for you.

    document.getElementById('myContentDiv').addEventListener('save', function (event) {
        mySaveToDbFunction(event.text);
    });


See a live example [here](http://www.student.bth.se/~hear15/dbwebb-kurser/javascript/me/kmom10/texteditor/presentation.php).

### Options

The are structured as the following:

    var options = {
        parent: {

        },
        editor: {

        },
        toolbar: {

        }
        autosave
        saveLimit,
        editable,
    }

Options available are the following:

**Global settings**
*  `autosave: 'string with relative filepath'` - sets the filepath (and name) to the autosave document.
  To use the autosave you're good to just write your own autosave if prefered. The one shipped with the editor is saving the text after every keypress in a session. Parameters send to the autosave document is `do` and `text`.
*  `saveLimit: number || false` - determines how many "autosaves" (saves to the sessions) that should be done before you dispatch a `save`event. Set to false to disable the automatic `save`events.
*  `editable: "true" || "false"` - will the content be editable by default, or does user have to unlock it before it's editable?

**Parent settings**
*  `parent.display: 'valid css display syntax'` - sets the dispaly of the **parent** (the container of the editing area and the toolbar in attached mode).
*  `parent.width: number or 'valid width string'` - sets the width of the **parent**.
*  `parent.border: 'valid css border syntax'` - sets the border of the **parent**.
*  `parent.margin: 'valid css margin syntax'` - sets the margin of the **parent**.

**Editor setitngs**
*  `editor.border: 'valid css border syntax'` - sets the border of the **editor** part to whatever you specify it as.

**Toolbar settings**
*  `toolbar.state:'detached'` - results in the menu starting in the detached mode, any other options results as attached.
*  `toolbar.background: 'valid css color'` - sets the backgrund color of the toolbar.

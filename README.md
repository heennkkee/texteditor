# Texteditor

This project is the final part of the javascript course at BTH in Sweden (spring 2016). Please don't hesitate to use and do whatever you wish with the code.

**Bare in mind this project is developed using a Chrome browser and judged with a Firefox browser**, usability with any other browser isn't guaranteed.

## Initiation

Include the files `wysiwyg.js` and `wysiwyg.css` and make sure you have the `autosave.php` (may be renamed/replace with a parameter) in the correct places.

To initiate the editor call `initWYSIWYG()` with a standard javascript DOM selector as first parameter and an optional object of settings (listed **below**) as second parameter.

To save to an external database, add an eventListener to the selected `div` (the one passed to the `init()` function) and listen for the event `save`. To get the text contained in the element which sent the `save` event look for the property `text` in the event, `event.text`, and you'll find the text ready for you.

### Options

Options to pass as second parameter in `init` call:
*  `state:'detached'` - results in the menu starting in the detached mode.
*  `border: 'valid css border syntax'` - sets the border to whatever you specify it as.
*  `display: 'valid css display syntax'` - sets the dispaly of the **whole** area (the container of the editing area and the toolbar in attached mode).
*  `width: number or 'valid width string'` - sets the width of the same area as above.
*  `parentBorder: 'valid css border syntax'` - sets the border of the **whole** area div.
*  `autosave: 'string with relative filepath'` - sets the filepath (and name) to the autosave document.

  To use the autosave you're good to just write your own autosave if prefered. The one shipped with the editor is saving the text after every keypress in a session. Parameters send to the autosave document is `do` and `text`.
*  `saveLimit: number || false` - determines how many "autosaves" (saves to the sessions) that should be done before you dispatch a `save`event. Set to false to disable the automatic `save`events.
*  `editable: "true" || "false"` - will the content be editable by default, or does user have to unlock it before it's editable?
*  `parentMargin: 'valid css margin syntax'` - sets the margin of the **whole** area div.
*  `toolbarBackground: 'valid css color'` - sets the backgrund color of the toolbar.

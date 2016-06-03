# Texteditor

This project is the final part of the javascript course at BTH in Sweden (spring 2016). Please don't hesitate to use and do whatever you wish with the code.

**Bare in mind this project is developed using a Chrome browser and judged with a Firefox browser**, usability with any other browser isn't guaranteed.

## Initiation

Include the wysiwyg.js, include the wysiwyg.css and make sure you have the autosave.php (may be renamed/replace with a parameter) in the correct places.

To initiate the editor call `initWYSIWYG()` with a standard javascript DOM selector as first parameter and an optional object of settings (listed **below**) as second parameter.

Options to pass as second parameter in `init` call:
*  `state:'detached'` - results in the menu starting in the detached mode.
*  `border: 'valid css border syntax'` - sets the border to whatever you specify it as.
*  `display: 'valid css display syntax'` - sets the dispaly of the **whole** area (the container of the editing area and the toolbar in attached mode).
*  `width: number or 'valid width string'` - sets the width of the same area as above.
*  `parentBorder: 'valid css border syntax'` - sets the border of the **whole** area div.
*  `autosave: 'string with relative filepath'` - sets the filepath (and name) to the autosave document.

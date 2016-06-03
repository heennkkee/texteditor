# texteditor

## Usage

Include the wysiwyg.js, include the wysiwyg.css and make sure you have the autosave.php (may be renamed/replace with a parameter) in the correct places.

To initiate the editor call `initWYSIWYG()` with a standard javascript DOM selector as first parameter and an optional object of settings (listed **below**) as second parameter.

Options to pass as second parameter in `init` call:
*  `state:'detached'` - results in the menu starting in the detached mode.
*  `border: 'valid css border syntax'` - sets the border to whatever you specify it as.
*  `display: 'valid css display syntax'` - sets the dispaly of the **whole** area (the container of the editing area and the toolbar in attached mode).
*  `width: number or 'valid width string'` - sets the width of the same area as above.

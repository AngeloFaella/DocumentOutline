[![GitHub license](https://img.shields.io/github/license/AngeloFaella/DocumentOutline)](https://github.com/AngeloFaella/CircularProgressBar/blob/master/LICENSE)
[![GitHub release](https://img.shields.io/github/release/AngeloFaella/DocumentOutline)](https://GitHub.com/AngeloFaella/CircularProgressBar/releases/)
![Language](https://img.shields.io/badge/Javascript-darkgreen.svg)

# DocumentOutline.js

DocumentOutline is a vanilla JavaScript library that automatically generates the "Table of Contents" of an HTML document.

**The table of contents you see on this page is generated with DocumentOutline.js.** The page instead was generated with [Typora](https://typora.io/).

<br/></br>

## How To Use

Import needed files:

```html
<html>
  <head>
    <!-- Import CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AngeloFaella/DocumentOutline@1.0/outline.css">
  </head>
  <body>
    <div>
        <!-- Wrap your main content in a div -->
    </div>  
    <!-- Import the library -->    
    <script src="https://cdn.jsdelivr.net/gh/AngeloFaella/DocumentOutline@1.0/DocumentOutline.js"></script>
  </body>
</html>
```

Then initialize the outline:
```js
let outline = new DocumentOutline();
```

Or initialize with custom options:
```js
let outline = new DocumentOutline({
	 backgroundColor: '#02181d',
	 textColor: 'white',
	 textColorLight: 'lightgrey',
	 accentColor: 'rgb(221 201 0)',
	 defaultOpen: false
});
```

<br/></br>

## Documentation

<br/>

### **Classes**

#### DocumentOutline
**Kind**: global class  

<br/>

### **Functions**


#### new DocumentOutline(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| [options.backgroundColor] | <code>String</code> | background color of the outline |
| [options.textColor] | <code>String</code> | text color of the first-level sections |
| [options.accentColor] | <code>String</code> | accent color of the outline |
| [options.textColorLight] | <code>String</code> | text color of the sub sections |
| [options.defaultOpen] | <code>String</code> | indicate the initial mode of the outline. Outline is open by default on desktop and closed on mobile. |

<br/>

#### onSearchInput(text)

Called when a search is submitted

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> | text to search |

<br/>

#### showOutline()

Show document outline.

On **desktop** the outline is placed to the left of the main content takes 20% of the width.

On **mobile** the outline is placed above the main content and takes 100% of the width.

**Kind**: global function  

<br/>

#### hideOutline()

Hide document outline.

On **desktop** the outline reduces its width to 3%.

On **mobile** the outline disappears completely and a floating button appears in the bottom-left corner.

**Kind**: global function  

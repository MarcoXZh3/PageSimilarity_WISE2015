/**
 * CSS supported color names
 */
var colorNames = [
  "aliceblue",      "antiquewhite",         "aqua",              "aquamarine",      "azure",
  "beige",          "bisque",               /*"black",*/         "blanchedalmond",  "blue",
  "blueviolet",     "brown",                "burlywood",         "cadetblue",       "chartreuse",
  "chocolate",      "coral",                "cornflowerblue",    "cornsilk",        "crimson",
  "cyan",           "darkblue",             "darkcyan",          "darkgoldenrod",   "darkgray",
  "darkgreen",      "darkkhaki",            "darkmagenta",       "darkolivegreen",  "darkorange",
  "darkorchid",     "darkred",              "darksalmon",        "darkseagreen",    "darkslateblue",
  "darkslategray",  "darkturquoise",        "darkviolet",        "deeppink",        "deepskyblue",
  "dimgray",        "dodgerblue",           "firebrick",         "floralwhite",     "forestgreen",
  "fuchsia",        "gainsboro",            "ghostwhite",        "gold",            "goldenrod",
  "gray",           "green",                "greenyellow",       "honeydew",        "hotpink",
  "indianred",      "indigo",               "ivory",             "khaki",           "lavender",
  "lavenderblush",  "lawngreen",            "lemonchiffon",      "lightblue",       "lightcoral",
  "lightcyan",      "lightgoldenrodyellow", "lightgray",         "lightgreen",      "lightpink",
  "lightsalmon",    "lightseagreen",        "lightskyblue",      "lightslategray",  "lightsteelblue",
  "lightyellow",    "lime",                 "limegreen",         "linen",           "magenta",
  "maroon",         "mediumaquamarine",     "mediumblue",        "mediumorchid",    "mediumpurple",
  "mediumseagreen", "mediumslateblue",      "mediumspringgreen", "mediumturquoise", "mediumvioletred",
  "midnightblue",   "mintcream",            "mistyrose",         "moccasin",        "navajowhite",
  "navy",           "oldlace",              "olive",             "olivedrab",       "orange",
  "orangered",      "orchid",               "palegoldenrod",     "palegreen",       "paleturquoise",
  "palevioletred",  "papayawhip",           "peachpuff",         "peru",            "pink",
  "plum",           "powderblue",           "purple",            "red",             "rosybrown",
  "royalblue",      "saddlebrown",          "salmon",            "sandybrown",      "seagreen",
  "seashell",       "sienna",               "silver",            "skyblue",         "slateblue",
  "slategray",      "snow",                 "springgreen",       "steelblue",       "tan",
  "teal",           "thistle",              "tomato",            "turquoise",       "violet",
  "wheat",          /*"white",*/            "whitesmoke",        "yellow",          "yellowgreen"
]; // var colorNames = [ ... ];

/**
 * Find out if a DOM element is visible or not
 * @param domElement     The DOM element to be checked
 * @returns {Boolean}    True for visible while false for invisible
 */
function isNodeVisible(domElement) {
  if (!domElement)
    return false;
  if (domElement.offsetWidth <= 0 || domElement.offsetHeight <= 0)
    return false;
  var tags = ["applet",  "base",    "basefont",  "head",      "html",
              "link",    "meta",    "noframes",  "noscript",  "param",
              "script",  "source",  "style",     "title",     "track"
             ]; // var tags = [ ... ];
  for (i in tags)
    if (domElement.tagName.toLowerCase() === tags[i])
      return false;
  var style = document.defaultView.getComputedStyle(domElement);
  if (style.getPropertyValue("display") === "none" || style.getPropertyValue("visibility") === "hidden")
    return false;

  var child = domElement.firstChild;
  while (child) {
    if (child.nodeType === 3 && child.nodeValue.trim().length !== 0)        // has non-empty text node
      return true;
    if (child.nodeType === 1 && isNodeVisible(child))                       // has non-empty child element
      return true;
    child = child.nextSibling;
  } // while (child)
  return false;
} // function isNodeVisible(domElement)

/**
 * Find out if a DOM element is empty
 * @param domElement     The DOM element to be checked
 * @returns {Boolean}    True for empty while false for not empty
 */
function isNodeEmpty(domElement) {
  // Verify texts
  var child = domElement.firstChild;
  while (child) {
    if (child.nodeType === 3 && child.nodeValue.trim() !== "")
      return false;
    child = child.nextSibling;
  } // while (child)

  var style = document.defaultView.getComputedStyle(domElement);
  // Verify background
  if (style.getPropertyValue("background-color") !== "transparent" ||
      style.getPropertyValue("background-image") !== "none")
      return false;

  // Verify borders: left
  if (style.getPropertyValue("border-left-style") !== "none" &&
      style.getPropertyValue("border-left-width")[0] !== "0" &&
      style.getPropertyValue("border-left-color") !== "transparent")
    return false;
  // Verify borders: top
  if (style.getPropertyValue("border-top-style") !== "none" &&
      style.getPropertyValue("border-top-width")[0] !== "0" &&
      style.getPropertyValue("border-top-color") !== "transparent")
    return false;
  // Verify borders: right
  if (style.getPropertyValue("border-right-style") !== "none" &&
      style.getPropertyValue("border-right-width")[0] !== "0" &&
      style.getPropertyValue("border-right-color") !== "transparent")
    return false;
  // Verify borders: bottom
  if (style.getPropertyValue("border-bottom-style") !== "none" &&
      style.getPropertyValue("border-bottom-width")[0] !== "0" &&
      style.getPropertyValue("border-bottom-color") !== "transparent")
    return false;

  // Verify border image
  if (style.getPropertyValue("border-image") !== "none")
    return false;

  // Verify border outline
  if (style.getPropertyValue("outline-style") !== "none" &&
      style.getPropertyValue("outline-width")[0] !== "0" &&
      style.getPropertyValue("outline-color") !== "transparent")
    return false;

  // Verify border shadow
  if (style.getPropertyValue("box-shadow") !== "none")
    return false;

  return true;
} // function isNodeEmpty(domElement)

/**
 * Get the XPath of a node
 * @param node           The node to be checked
 * @returns {String}     The XPath string of the node
 */
function getXPath(node) {
  if (!node.parentElement)
    return "/" + node.tagName;
  var index = 0, child = node.parentElement.firstElementChild;
  while (child !== node) {
    child = child.nextElementSibling;
    index ++;
  } // while (child !== node)
  return getXPath(node.parentElement) + "/" + node.tagName + "[" + index + "]";
} // function getXPath(node)


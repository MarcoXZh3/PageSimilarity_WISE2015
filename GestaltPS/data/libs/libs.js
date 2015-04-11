/**
 * Useful CSS properties
 */
var properties = [
  // Behavior
  "position",
  // Background
  "background-color",           "background-image",
  // Border
  "border-bottom-color",        "border-bottom-style",         "border-bottom-width",
  "border-left-color",          "border-left-style",           "border-left-width",
  "border-right-color",         "border-right-style",          "border-right-width",
  "border-top-color",           "border-top-style",            "border-top-width",
  "outline-color",              "outline-style",               "outline-width",
  "border-bottom-left-radius",  "border-bottom-right-radius",
  "border-top-left-radius",     "border-top-right-radius",     "box-shadow",
  // Text - paragraph
  "direction",                  "letter-spacing",              "line-height",
  "text-align",                 "text-decoration",             "text-indent",
  "text-transform",             "vertical-align",              "white-space",
  "word-spacing",               "text-overflow",               "text-shadow",
  "word-break",                 "word-wrap",
  // Text - column
  /*"column-count",             "-webkit-column-count",*/      "-moz-column-count",
  /*"column-gap",               "-webkit-column-gap",*/        "-moz-column-gap",
  /*"column-rule-color",        "-webkit-column-rule-color",*/ "-moz-column-rule-color",
  /*"column-rule-style",        "-webkit-column-rule-style",*/ "-moz-column-rule-style",
  /*"column-rule-width",        "-webkit-column-rule-width",*/ "-moz-column-rule-width",
  /*"column-width",             "-webkit-column-width",*/      "-moz-column-width",
  // Text - list
  "list-style-image",           "list-style-position",         "list-style-type",
  // Text - font
  "font-family",                "font-size",                   "font-weight",
  "font-size-adjust",// Only Firefox supports this property
  "font-style",                 "font-variant",                "color"
]; // var properties = [ ... ];

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
  if (document.defaultView.getComputedStyle(domElement).getPropertyValue("display") === "none" ||
      document.defaultView.getComputedStyle(domElement).getPropertyValue("visibility") === "hidden")
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

function isNodeEmpty(domElement) {
  // Verify texts
  var child = domElement.firstChild;
  while (child) {
    if (child.nodeType === 3 && child.nodeValue.trim() !== "")
      return false;
    child = child.nextSibling;
  } // while (child)

  // Verify background
  if (document.defaultView.getComputedStyle(domElement).getPropertyValue("background-color") !== "transparent" ||
      document.defaultView.getComputedStyle(domElement).getPropertyValue("background-image") !== "none")
      return false;

  // Verify borders: left
  if (document.defaultView.getComputedStyle(domElement).getPropertyValue("border-left-style") !== "none" &&
      document.defaultView.getComputedStyle(domElement).getPropertyValue("border-left-width")[0] !== "0" &&
      document.defaultView.getComputedStyle(domElement).getPropertyValue("border-left-color") !== "transparent")
    return false;
  // Verify borders: top
  if (document.defaultView.getComputedStyle(domElement).getPropertyValue("border-top-style") !== "none" &&
      document.defaultView.getComputedStyle(domElement).getPropertyValue("border-top-width")[0] !== "0" &&
      document.defaultView.getComputedStyle(domElement).getPropertyValue("border-top-color") !== "transparent")
    return false;
  // Verify borders: right
  if (document.defaultView.getComputedStyle(domElement).getPropertyValue("border-right-style") !== "none" &&
      document.defaultView.getComputedStyle(domElement).getPropertyValue("border-right-width")[0] !== "0" &&
      document.defaultView.getComputedStyle(domElement).getPropertyValue("border-right-color") !== "transparent")
    return false;
  // Verify borders: bottom
  if (document.defaultView.getComputedStyle(domElement).getPropertyValue("border-bottom-style") !== "none" &&
      document.defaultView.getComputedStyle(domElement).getPropertyValue("border-bottom-width")[0] !== "0" &&
      document.defaultView.getComputedStyle(domElement).getPropertyValue("border-bottom-color") !== "transparent")
    return false;

  // Verify border image
  if (document.defaultView.getComputedStyle(domElement).getPropertyValue("border-image") !== "none")
    return false;

  // Verify border outline
  if (document.defaultView.getComputedStyle(domElement).getPropertyValue("outline-style") !== "none" &&
      document.defaultView.getComputedStyle(domElement).getPropertyValue("outline-width")[0] !== "0" &&
      document.defaultView.getComputedStyle(domElement).getPropertyValue("outline-color") !== "transparent")
    return false;

  // Verify border shadow
  if (document.defaultView.getComputedStyle(domElement).getPropertyValue("box-shadow") !== "none")
    return false;

  return true;
} // function isNodeEmpty(domElement)

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

/**
 * Assume all inputs are valid
 * http://www.brucelindbloom.com/index.html?Math.html
 * RGB is sRGB
 * Illuminant D65: xr = 0.95047, yr = 1.00000, zr = 1.08883
 */
function RGBtoLAB(rgb) {
  for (c in rgb) {
    rgb[c] /= 255.0;
    rgb[c] = (rgb[c] > 0.04045) ? Math.pow((rgb[c] + 0.055)/1.055, 2.4) : rgb[c]/12.92;
  } // for (c in rgb)
  var xyz = [(0.4124564 * rgb[0] + 0.3575761 * rgb[1] + 0.1804375 * rgb[2]) / 0.95047,
             (0.2126729 * rgb[0] + 0.7151522 * rgb[1] + 0.0721750 * rgb[2]) / 1.00000,
             (0.0193339 * rgb[0] + 0.1191920 * rgb[1] + 0.9503041 * rgb[2]) / 1.08883];
  for (c in xyz)
    xyz[c] = (xyz[c] > 0.008856) ? Math.pow(xyz[c], 1.0/3.0) : (903.3 * xyz[c] + 16.0) / 116.0;
  return [116.0 * xyz[1] - 16.0, 500.0 * (xyz[0] - xyz[1]), 200.0 * (xyz[1] - xyz[2])];
} // function RGBtoLAB(rgb)

/**
 * Assume all inputs are valid
 * http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
 */
function deltaE_CIE2000(lab1, lab2) {
  var l_avg = (lab1[0] + lab2[0]) / 2.0, l_delta_p = lab2[0] - lab1[0];
  var s_l = Math.pow(l_avg - 50.0, 2.0);
  s_l = 1.0 + (0.015 * s_l) / (Math.sqrt(20.0 + s_l));
  var c1 = Math.sqrt(lab1[1] * lab1[1] + lab1[2] * lab1[2]), c2 = Math.sqrt(lab2[1] * lab2[1] + lab2[2] * lab2[2]);
  var c_avg = Math.pow((c1 + c2) / 2.0, 7.0), g = (1.0 - Math.sqrt(c_avg / (c_avg + Math.pow(25.0, 7.0)))) / 2.0;
  lab1[1] *= (1.0 + g);
  lab2[1] *= (1.0 + g);
  c1 = Math.sqrt(lab1[1] * lab1[1] + lab1[2] * lab1[2]);
  c2 = Math.sqrt(lab2[1] * lab2[1] + lab2[2] * lab2[2]);
  c_avg = (c1 + c2) / 2.0;
  var c_delta_p = c2 - c1, s_c = 1.0 + 0.045 * c_avg;
  var h1 = Math.atan2(lab1[2], lab1[1]) / Math.PI * 180.0;
  if (h1 < 0.0)
    h1 += 360.0;
  var h2 = Math.atan2(lab2[2], lab2[1]) / Math.PI * 180.0;
  if (h2 < 0.0)
    h2 += 360.0;
  var h_delta = h2 - h1, h_avg = (h1 + h2) / 2.0;
  if (Math.abs(h_delta) > 180.0) {
    h_delta = (h2 > h1) ? h_delta - 360.0 : h_delta + 360.0;
    h_avg += 180.0;
  } // if (Math.abs(h_delta) > 180.0)
  var t = 1.0 - 0.17 * Math.cos((h_avg - 30.0) / 180.0 * Math.PI)
              + 0.24 * Math.cos((2.0 * h_avg) / 180.0 * Math.PI)
              + 0.32 * Math.cos((3.0 * h_avg + 6.0) / 180.0 * Math.PI)
              - 0.20 * Math.cos((4.0 * h_avg - 63.0) / 180.0 * Math.PI);
  var h_delta_p = 2.0 * Math.sqrt(c1 * c2) * Math.sin(h_delta / 360.0 * Math.PI);
  var s_h = 1.0 + 0.0015 * c_avg * t;
  var theta_delta = 30.0 * Math.exp(-1.0 * Math.pow((h_avg - 275) / 25.0, 2.0));
  c_avg = Math.pow(c_avg, 7.0);
  var r_c = 2.0 * Math.sqrt(c_avg / (c_avg + Math.pow(25.0, 7.0)));
  var r_t = -1.0 * r_c * Math.sin(2.0 * theta_delta / 180.0 * Math.PI);
  var deltaE = Math.sqrt(Math.pow(l_delta_p / s_l, 2.0) +
                         Math.pow(c_delta_p / s_c, 2.0) +
                         Math.pow(h_delta_p / s_h, 2.0) +
                         r_t * (c_delta_p / s_c) * (h_delta_p / s_h));
  return deltaE;
} // function deltaE_CIE2000(lab1, lab2)

/**
 * Get the BASE64 data of an image from the URL
 * @param url       {String} URL of the image
 * @param callback  {function} Call back function that handle the BASE64 data
 */
function getBase64FromImageUrl(url, callback) {
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = url;
  img.onload = function () {
    var canvas = document.createElement("canvas");
    // Deal with the size as follows
    canvas.width = this.width;
    canvas.height = this.height;
    var ctx = canvas.getContext("2d");
    // Deal with the position as follows
    ctx.drawImage(this, 0, 0);
    var dataURL = canvas.toDataURL();
    callback(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
  } // img.onload = function () {...}
} // function getBase64FromImageUrl(url, callback)


/**
 * Node of block tree
 * @param nodes         {DOM Element List} the corresponding DOM elements
 * @param name          {String} name of the node
 */
function BlockTreeNode(nodes, name) {
  JsTreeNode.call(this, name);

  this.domNodes = (!nodes) ? [] : nodes;

  this.top = 0;
  this.left = 0;
  this.css = {};

  var str = "";
  var bottom = 0, right = 0;
  for (i in this.domNodes) {
  } // for (i in this.domNodes)

  for (i in this.domNodes) {
    var node = this.domNodes[i];
    // Update layer size and position
    var top = 0, left = 0;
    var parent = node.offsetParent;
    while (parent) {
      top += parent.offsetTop;
      left += parent.offsetLeft;
      parent = parent.offsetParent;
    } // while (parent)
    if (this.top > top)
      this.top = top;
    if (this.left > left)
      this.left = left;
    if (bottom < top + node.offsetHeight)
      bottom = top + node.offsetHeight;
    if (right < left + node.offsetWidth)
      right = left + node.offsetWidth;

    // Update layer text
    var child = node.firstChild;
    while (child) {
      if (child.nodeType === 3)
        str += child.nodeValue.trim() + "\n";
      child = child.nextSibling;
    } // while (child)

    // Update layer CSSs
    for (j in properties) {
      var prop = properties[j];
      var style = document.defaultView.getComputedStyle(node).getPropertyValue(prop);
      style = (!style) ? "" : style.trim();
      if (style === "inherit" && this.parent)
        style = this.parent.css[prop];
      if ((prop === "background-color" || prop === "color") && style === "transparent")
        style = (!this.parent) ? "rgb(255, 255, 255)" : this.parent.css[prop];
      if (this.css[prop]) {
        var k = 0;
        for (; k < this.css[prop].length; k++)
          if (this.css[prop][k] == style)
            break ;
        if (k >= this.css[prop].length)
          this.css[prop].push(style);
      } else
        this.css[prop] = [style];
    } // for (j in properties)
  } // for (i in this.domNodes)

  this.width = right - this.left;
  this.height = bottom - this.top;
  this.text = str.trim().replace(/\n/g, " ");

  /**
   * Cast the block node into a string
   * @return            {String} string representation of the layer node
   */
  this.toString = function() {
    var str = "top=" + this.top + ",left=" + this.left + ",width=" + this.width + ",height=" + this.height + "; {";
    for (i in this.domNodes)
      str += this.domNodes[i].tagName + ",";
    if (str.length > 0)
      str = str.substring(0, str.length - 1);
    return str + "}~" + this.nodeName;
  }; // this.toString = function()

} // function BlockTreeNode(node)


/**
 * Block tree implementation
 * @param root          {BlockTreeNode} root node of the tree
 * @param name          {String} name of the tree
 */
function BlockTree(root, name) {
  JsTree.apply(this, [root, name]);

  /**
   * Find the block     layer that contains a DOM element from a subtree
   * @param root        {BlockTreeNode} root of the subtree
   * @param domNode     {DOM Element} the specific DOM element to find
   * @return            {BlockTreeNode} the target block layer
   */
  var findLayer = function(root, domNode) {
    for (i in root.domNodes)
      if (root.domNodes[i] == domNode)
        return root;
    var child = root.firstChild;
    while (child) {
      var layer = findLayer(child, domNode);
      if (layer)
        return layer;
      child = child.nextSibling;
    } // while (child)
    return null;
  }; // var findLayer = function(root, domNode)

  /**
   * Find the block layer that contains a DOM element
   * @param domNode     {DOM Element} the specific DOM element to find
   * @return            {BlockTreeNode} the target block layer
   */
  this.findBTLayer = function(domNode) {
    return findLayer(root, domNode) ? (!domNode || this.isEmpty()) : null;
  }; // this.findBTLayer = function(domNode)

  /**
   * Build up the block tree from a layer tree
   * @param layerTree   {LayerTree} the prototype layer tree
   */
  this.buildUpTree = function(layerTree) {
  }; // this.buildUpTree = function(layerTree)

} // function BlockTree(root, name)


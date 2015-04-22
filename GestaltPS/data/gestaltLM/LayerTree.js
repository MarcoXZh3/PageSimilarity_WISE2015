/**
 * Node of layer tree
 * @param node      {DOM Element} the corresponding DOM element
 * @param name      {String} name of the node. In this case the tag name
 */
function LayerTreeNode(node, name) {
  JsTreeNode.call(this, (!node) ? "" : node.tagName);

  this.domNode = (!node) ? null : node;
  this.domXPath = (!node) ? null : getXPath(node);

  var child = this.domNode.firstChild;
  var str = "";
  while (child) {
    if (child.nodeType === 3)
      str += child.nodeValue.trim() + "\n";
    child = child.nextSibling;
  } // while (child)
  this.text = str.trim().replace(/\n/g, " ");

  var rect = (!node) ? null : node.getBoundingClientRect();
  this.top = (!rect) ? 0 : Math.round(rect.top);
  this.left = (!rect) ? 0 : Math.round(rect.left);
  this.width = (!rect) ? 0 : Math.round(rect.width);
  this.height = (!rect) ? 0 : Math.round(rect.height);
  this.css = {};
  if (node) {
    for (i in properties) {
      var style = document.defaultView.getComputedStyle(node).getPropertyValue(properties[i]);
      style = (!style) ? "" : style.trim();
      if (style === "inherit" && this.parent)
        style = this.parent.css[properties[i]];
      if ((properties[i] === "background-color" || properties[i] === "color") && style === "transparent")
        style = (!this.parent) ? "rgb(255, 255, 255)" : this.parent.css[properties[i]];
      this.css[properties[i]] = style;
    } // for (i in properties)
  } // if (node)

  /**
   * Cast the layer node into a string
   * @return        {String} string representation of the layer node
   */
  this.toString = function() {
    return this.nodeName +
           ": top=" + this.top + ";left=" + this.left + ";width=" + this.width + ";height=" + this.height +
           "; XPath=\"" + this.domXPath + "\"";
  }; // this.toString = function()

} // function LayerTreeNode(node)


/**
 * Layer tree implementation
 * @param root    {LayerTreeNode} root node of the tree
 * @param name    {String} name of the tree
 */
function LayerTree(root, name) {
  JsTree.apply(this, [root, name]);

  /**
   * Recursively add layer nodes to the tree
   * @param domNode      DOM node to be appended
   * @param layerNode    Layer node of the corresponding DOM node
   */
  var makeNodes = function(domNode, layerNode) {
    var child = domNode.firstElementChild;
    while (child) {
      if (isNodeVisible(child) && !isNodeEmpty(child)) {
        var childLayer = new LayerTreeNode(child, child.tagName);
        layerNode.appendChild(childLayer);
        makeNodes(child, childLayer);
      } else
        makeNodes(child, layerNode);
      child = child.nextElementSibling;
    } // while (child)
  }; // var makeNodes = function(domNode, layerNode)

  makeNodes(this.root.domNode, root);
} // function LayerTree(root, name)


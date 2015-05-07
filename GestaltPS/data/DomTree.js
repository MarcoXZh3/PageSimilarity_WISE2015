/**
 * Node of DOM tree
 * @param node          {DOM element} the corresponding layer nodes
 * @param name          {String} name of the node
 */
function DomTreeNode(node) {
  JsTreeNode.call(this, node.tagName);

  this.domNode = (!node) ? null : node;

  var rect = (!node) ? null : node.getBoundingClientRect();
  this.top = (!rect) ? 0 : Math.round(rect.top);
  this.left = (!rect) ? 0 : Math.round(rect.left);
  this.right = this.left + ((!rect) ? 0 : Math.round(rect.width));
  this.bottom = this.top + ((!rect) ? 0 : Math.round(rect.height));

  /**
   * Cast the DOM node into a string
   * @return            {String} string representation of the layer node
   */
  this.toString = function() {
    return this.nodeName + 
           ": top=" + this.top + ",left=" + this.left + ",right=" + this.right + ",bottom=" + this.bottom;
  }; // this.toString = function()

} // function DomTreeNode(node)


/**
 * DOM tree implementation
 * @param root          {DomTreeNode} root node of the tree
 * @param name          {String} name of the tree
 */
function DomTree(root, name) {
  JsTree.apply(this, [root, name]);

  /**
   * Build up the block tree from a layer tree
   * @param layerTree   {LayerTree} the prototype layer tree
   */
  var buildUpTree = function(domNode, domTreeNode) {
    var child = domNode.firstElementChild;
    while (child) {
      var childDomTreeNode = new DomTreeNode(child);
      domTreeNode.appendChild(childDomTreeNode);
      buildUpTree(child, childDomTreeNode);
      child = child.nextElementSibling;
    } // while (child)
  }; // var buildUpTree = function(domNode, domTreeNode)

  buildUpTree(this.root.domNode, root);
} // function DomTree(root, name)


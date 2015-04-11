var staticNumber = 0;
/**
 * Node of block tree
 * @param nodes         {layer node List} the corresponding layer nodes
 * @param name          {String} name of the node
 */
function BlockTreeNode(nodes, name) {
  JsTreeNode.call(this, name);

  this.layerNodes = (!nodes) ? [] : nodes;
  this.domNodes = [];
  for (i in this.layerNodes)
    this.domNodes.push(this.layerNodes[i].domNode);

  this.top = 0;
  this.left = 0;
  this.css = {};

  var str = "";
  var bottom = 0, right = 0;
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
   * Find if a layer node is part of the block tree node
   * @param layerNode   {LayerTreeNode} the layer node to be searched
   * @return            {Boolean} True if found or false if not
   */
  this.hasLayerNode = function(layerNode) {
    if (!layerNode)
      return false;
    for (i in this.layerNodes)
      if (layerNode === this.layerNodes[i])
        return true;
    return false;
  }; // this.hasLayerNode = function(layerNode)

  /**
   * Cast the block node into a string
   * @return            {String} string representation of the layer node
   */
  this.toString = function() {
    return "top=" + this.top + ",left=" + this.left + ",width=" + this.width + ",height=" + this.height +
           "; " + this.nodeName;
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
   * Build up a sub block tree
   * @param blockNode   {BlockTreeNode} root of the sub block tree
   * @param layerNode   {LayerTreeNode} root of the sub layer tree
   */
  var buildUp = function(blockNode, layerNode) {
    if (layerNode.childCount == 0)
      return ;

    // Merge layer nodes by all Gestalt Laws
    var distances = [], sames = [];
    for (var i = 0; i < layerNode.childCount; i++) {
      if (i === layerNode.childCount - 1)
        continue ;
      var child1 = layerNode.children[i], child2 = layerNode.children[i + 1];
      var same = (child1.height === child2.height && child1.width === child2.width);            // Similarity - Sz
      if (!same)
        same = (child1.left === child2.left || child1.top === child2.top ||                     // Continuity
                child1.right === child2.right || child1.bottom === child2.bottom);
      if (!same)
        same = (child1.css["position"] == child2.css["position"]);                              // Common Fate
      if (!same) {
        var bgColor1 = child1.css["background-color"], bgImage1 = child1.css["background-image"];
        var bgColor2 = child2.css["background-color"], bgImage2 = child2.css["background-image"];
        same = (bgImage1 != "none" && bgImage2 != "none" && sameImage(bgImage1, bgImage2));     // Similarity - Bg
        if (!same)
          same = (bgImage1 == "none" && bgImage2 == "none" && sameColorByCIE2000(bgColor1, bgColor2));
      } // if (!same)
      if (!same) {
        var index = 0;
        for (; index < 29; index++)
          if (child1.css[properties[23 + index]] != child2.css[properties[23 + index]])
            break ;
        same = (index >= 29 && sameColorByCIE2000(child1.css["color"], child2.css["color"]));   // Similarity - Txt
      } // if (!same)
      sames.push(same);
      distances.push(normalizedHausdorffDistance(child1, child2));
    } // for (var i = 0; i < layerNode.childCount; i++)

    // Create new block tree nodes based on the merged layer nodes
    var avg = 0.0;
    if (distances.length > 0) {
      for (var i = 0; i < distances.length; i++)
        avg += distances[i];
      avg /= distances.length;
    } // if (distances.length > 0)
    var group = [layerNode.firstChild];
    for (var i = 0; i < distances.length; i++)
      if (sames[i] || distances[i] <= avg)
        group.push(layerNode.children[i+1]);
      else {
        var str = "";
        for (j in group)
          str += group[j].nodeName + ",";
        if (group.length > 0)
          str = str.substring(0, str.length - 1);
        blockNode.appendChild(new BlockTreeNode(group, blockNode.nodeName + "/{" + str + "}"));
        group = [layerNode.children[i+1]];
      } // else - if (sames[i] || distances[i] <= avg)
    if (group.length > 0) {
      var str = "";
      for (j in group)
        str += group[j].nodeName + ",";
      str = str.substring(0, str.length - 1);
      blockNode.appendChild(new BlockTreeNode(group, blockNode.nodeName + "/{" + str + "}"));
    } // if (group.length > 0)

    // Loop down the sub tree
    for (var i = 0; i < layerNode.childCount; i++) {
      var btNode = null;
      for (var j = 0; j < blockNode.childCount; j++)
        if (blockNode.children[j].hasLayerNode(layerNode.children[i])) {
          btNode = blockNode.children[j];
          break ;
        } // for - if
      if (btNode)
        buildUp(btNode, layerNode.children[i]);
    } // for (var i = 0; i < layerNode.childCount; i++)
  }; // var buildUp = function(blockNode, layerNode)

  /**
   * Build up the block tree from a layer tree
   * @param layerTree   {LayerTree} the prototype layer tree
   */
  this.buildUpTree = function(layerTree) {
    buildUp(this.root, layerTree.root);
  }; // this.buildUpTree = function(layerTree)

  /**
   * Display the blocks in the sub block tree
   * @param node        {BlockTreeNode} root of the sub block tree
   */
  var showTreeInPage = function(node) {
    for (i in node.domNodes) {
      node.domNodes[i].style.boxShadow = "0px 0px 3px 5px #666";
      node.domNodes[i].style.backgroundColor = colorNames[staticNumber % colorNames.length];
    } // for (i in node.domNodes)
    for (var i = 0; i < node.childCount; i++)
      showTreeInPage(node.children[i], staticNumber++);
  }; // var showTreeInPage = function(node)

  /**
   * Display the blocks in the block tree
   */
  this.treeInPage = function() {
    staticNumber = 0;
    showTreeInPage(this.root);
  }; // this.treeInPage = function()
} // function BlockTree(root, name)


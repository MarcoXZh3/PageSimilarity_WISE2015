/**
 * Check if two RGB colors are the same after transformed into CIE2000 lAB colors
 * @param color1    {String} The first color (string like "RGB(1, 2, 3)")
 * @param color2    {String} The second color (string like "RGB(1, 2, 3)")
 * @returns         {Boolean} True if they are same or false if not same
 */
function sameColorByCIE2000(color1, color2) {
  var rgb1 = color1.toLowerCase().match(/\d+/g), rgb2 = color2.toLowerCase().match(/\d+/g);
  if (rgb1.length < 3 && rgb2.length < 3) {
    alert('Error: Gestalt.Helper.sameColor\n  color1: ' + color1 + '\n  color2: ' + color2);
    return false;
  } // if (rgb1.length < 3 && rgb2.length < 3)
  return deltaE_CIE2000(RGBtoLAB(rgb1), RGBtoLAB(rgb2)) < 3.3;
} // function sameColorByCIE2000(rgb1, rgb2)

/**
 * Get the BASE64 data of an image from the URL
 * @param url       {String} URL of the image
 * @param callback  {function} Call back function that handle the BASE64 data
 */
function getBase64FromImageUrl(url, callback) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = url;
  img.onload = function () {
    var canvas = content.document.createElement('canvas');
    // Deal with the size as follows
    canvas.width = this.width;
    canvas.height = this.height;
    var ctx = canvas.getContext('2d');
    // Deal with the position as follows
    ctx.drawImage(this, 0, 0);
    var dataURL = canvas.toDataURL();
    callback(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
  } // img.onload = function () {...}
} // function getBase64FromImageUrl(url, callback)

/**
 * Check if two images are the same
 * @param image1    {String} The first image's URL
 * @param image2    {String} The second image's URL
 */
function sameImage(image1, image2, callback) {
  getBase64FromImageUrl(image1, function(data) {
    var data1 = data;
    getBase64FromImageUrl(image2, function(data) {
      var data2 = data;
      var len1 = data1.length, len2 = data2.length, max_len = (len1 > len2) ? len1 : len2;
      var data12 = '';
      for (var i = 0; i < max_len; i++) {
        if (i >= len1)
          data12 += String.fromCharCode(0xFF & data2[i].charCodeAt(0));
        else if (i >= len2)
          data12 += String.fromCharCode(data1[i].charCodeAt(0) & 0xFF);
        else
          data12 += String.fromCharCode(data1[i].charCodeAt(0) & data2[i].charCodeAt(0));
      } // for (var i = 0; i < max_len; i++)
      LZMA.compress(data1, 1, function(result1) {
        len1 = result1.length;
        LZMA.compress(data2, 1, function(result2) {
          len2 = result2.length;
          LZMA.compress(data12, 1, function(result12) {
            var len12 = result12.length;
            var ncd = (len1 > len2) ? (1.0 * len12 - len2) / len1 : (1.0 * len12 - len1) / len2;
            callback(ncd.toPrecision(10) === 0.0);
          }, function(percent) {});
        }, function(percent) {});
      }, function(percent) {});
    }); // getBase64FromImageUrl(image2, function(data) {...};
  }); // getBase64FromImageUrl(image1, function(data) {...};
} // function sameImage(image1, image2, callback)

/**
 * Calculate the Hausdorff distance of 2 layer tree nodes
 * @param node1    The first layer tree node
 * @param node2    The second layer tree node
 * @returns        Hausdorff distance of the 2 nodes, or null if any node is null
 */
function normalizedHausdorffDistance(node1, node2) {
  if (!node1 || !node2)
    return null;
  var hd1 = normailizedDistance_AtoB(node1, node2);
  var hd2 = normailizedDistance_AtoB(node2, node1);
  return (hd1 > hd2) ? hd1 : hd2;
} // function normalizedHausdorffDistance(node1, node2)

/**
 * Calculate the distance from node A to node B (Both layer tree nodes)
 * @param nodeA    The first layer tree node
 * @param nodeB    The second layer tree node
 * @returns        Distance from node 1 to node 2, or null if any node is null
 */
function normailizedDistance_AtoB(nodeA, nodeB) {
  var topA = nodeA.top, topB = nodeB.top;
  var leftA = nodeA.left, leftB = nodeB.left;
  var bottomA = topA + nodeA.height, bottomB = topB + nodeB.height;
  var rightA = leftA + nodeA.width, rightB = leftB + nodeB.width;

  var centerXA = nodeA.width / 2 + leftA, centerYA = nodeA.height / 2 + topA;
  var centerXB = nodeB.width / 2 + leftB, centerYB = nodeB.height / 2 + topB;

  if (leftA >= leftB && rightA <= rightB && topA >= topB && bottomA <= bottomB)
    return 0.0;                                                    // A is inside of B

  if (leftA >= leftB && rightA <= rightB)
    if (centerYA  < centerYB)
      return Math.abs(topB - topA) / nodeA.height;
    else
      return Math.abs(bottomA - bottomB) / nodeA.height;
  if (topA >= topB && bottomA <= bottomB)
    if (centerXA < centerXB)
      return Math.abs(leftB - leftA) / nodeA.width;
    else
      return Math.abs(rightA - rightB) / nodeA.width;

  var deltaX, deltaY;
  if (centerXA < centerXB)                                        // B is to the east of A
    deltaX = leftB - leftA;
  else                                                            // B is to the west of A
    deltaX = rightA - rightB;
  if (centerYA < centerYB)                                        // B is to the south of A
    deltaY = topB - topA;
  else                                                            // B is to the north of A
    deltaY = bottomA - bottomB;
  var diagonal = Math.sqrt(nodeA.width * nodeA.width + nodeA.height * nodeA.height);
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY) / diagonal;
} // function normailizedDistance_AtoB(nodeA, nodeB)

/**
 * Merge the two nodes into the merging result list
 * @param node1           the first node to be merged
 * @param node2           the second node to be merged
 * @param mergingResults  merging result list to be updated
 */
function mergeLayerNodes(node1, node2, mergingResults) {
  for (mr in mergingResults) {
    var list = mergingResults[mr];
    if (list.length > 0 && node1 === list[list.length - 1]) {
      list.push(node2);
      return ;
    } // for - if
  } // for (mr in mergingResults)
  mergingResults.push([node1, node2]);
} // function mergeLayerNodes(node1, node2, mergingResults)

/**
 * Display the merging result: <br />
 *  -- Using CSS: background-color and box-shadow
 */
function updatePage(mergingResults) {
  // If any node's all child nodes are in a list,
  // then the list should be this specific node rather than its child nodes
  for (mr in mergingResults) {
    var list = mergingResults[mr];
    var parent = list[0].parent;
    if (parent && parent.childCount === list.length)
      list = [parent];
  } // for (mr in mergingResults)

  for (index in mergingResults)
    for (mr in mergingResults[index]) {
      var domNode = mergingResults[index][mr].domNode;
      domNode.style.boxShadow = "0px 0px 3px 5px #666";
      domNode.style.backgroundColor = colorNames[index % colorNames.length];
    } // for - for
} // function updatePage(mergingResults)


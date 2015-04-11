/**
 * Apply Gestalt Law of All and save result
 */
function getAllLaws(root, size, node, number, mergingResults) {
  var sibling = node.nextSibling;
  if (sibling) {
    var i = 0;
    var same = (node.height === sibling.height && node.width === sibling.width) ||          // Similarity (Size)
               (node.left === sibling.left || node.top === sibling.top ||                   // Continuity
                node.right === sibling.right || node.bottom === sibling.bottom) ||
               (node.css["position"] === sibling.css["position"]);                          // Common Fate
    if (same) {
      for (; i < 29; i++)
        if (node.css[properties[23 + i]] !== sibling.css[properties[23 + i]])
          break ;
      same = (i >= 29 && sameColorByCIE2000(node.css["color"], sibling.css["color"])) ||    // Similarity (Text)
             (normalizedHausdorffDistance(node, sibling) < 1.5);                            // Proximity
      if (same) {
        var bgColor1 = node.css["background-color"], bgImage1 = node.css["background-image"];
        var bgColor2 = sibling.css["background-color"], bgImage2 = sibling.css["background-image"];
        if (bgImage1 === "none" && bgImage2 === "none" && sameColorByCIE2000(bgColor1, bgColor2))
          mergeLayerNodes(node, sibling, mergingResults);
        else if (bgImage1 !== "none" && bgImage2 !== "none")                                // Similarity (Bg)
          sameImage(bgImage1, bgImage2, function(sameImg) {
            if (sameImg)
              mergeLayerNodes(node, sibling, mergingResults);
            // After current procedure
            if (node.childCount > 0)                              // first go to its children
              getAllLaws(root, size, node.firstChild, number + 1, mergingResults);
            else if (node.nextSibling)                            // then go to its next sibling
              getAllLaws(root, size, node.nextSibling, number + 1, mergingResults);
            else {                                                // then go to its uncle (parent's next sibling)
              var parent = node.parent;
              if (parent) {
                var uncle = parent.nextSibling;
                while (!uncle) {
                  if (parent === root)                            // if all ancestors have no next sibling,
                    return ;                                      // then it means traversing has finished
                  parent = parent.parent;
                  uncle = parent.nextSibling;
                } // while (!uncle)
                getAllLaws(root, size, uncle, number + 1, mergingResults);
              } // if (parent)
            } // if - else if - else
            return ;
          }); // sameImage(bgImage1, bgImage2, function(same) {...});
      } // if (same)
    } // if (same)
  } // if (sibling)
  if (number === size)
    updatePage(mergingResults);

  // After current procedure
  if (node.childCount > 0)                                    // first go to its children
    getAllLaws(root, size, node.firstChild, number + 1, mergingResults);
  else if (node.nextSibling)                                  // then go to its next sibling
    getAllLaws(root, size, node.nextSibling, number + 1, mergingResults);
  else {                                                      // then go to its uncle (parent's next sibling)
    var parent = node.parent;
    if (parent) {
      var uncle = parent.nextSibling;
      while (!uncle) {
        if (parent === root)                                  // if all ancestors have no next sibling,
          return ;                                            // then it means traversing has finished
        parent = parent.parent;
        uncle = parent.nextSibling;
      } // while (!uncle)
      getAllLaws(root, size, uncle, number + 1, mergingResults);
    } // if (parent)
  } // if - else if - else
} // function getAllLaws(root, size, node, number, mergingResults)

/**
 * Apply Gestalt Law of Proximity and save result
 */
function getProximity(root, size, node, number, mergingResults) {
  var sibling = node.nextSibling;
  if (sibling && normalizedHausdorffDistance(node, sibling) < 1.5)
      mergeLayerNodes(node, sibling, mergingResults);
  if (number === size)
    updatePage(mergingResults);

  // After current procedure
  if (node.childCount > 0)                                    // first go to its children
    getProximity(root, size, node.firstChild, number + 1, mergingResults);
  else if (node.nextSibling)                                  // then go to its next sibling
    getProximity(root, size, node.nextSibling, number + 1,  mergingResults);
  else {                                                      // then go to its uncle (parent's next sibling)
    var parent = node.parent;
    if (parent) {
      var uncle = parent.nextSibling;
      while (!uncle) {
        if (parent === root)                                  // if all ancestors have no next sibling,
          return ;                                            // then it means traversing has finished
        parent = parent.parent;
        uncle = parent.nextSibling;
      } // while (!uncle)
      getProximity(root, size, uncle, number + 1, mergingResults);
    } // if (parent)
  } // if - else if - else
} // function getProximity(root, size, node, number, mergingResults)

/**
 * Apply Gestalt Law of Similarity (Bg) and save result
 */
function getSimBg(root, size, node, number, mergingResults) {
  var sibling = node.nextSibling;
  if (sibling) {
    var bgColor1 = node.css["background-color"], bgImage1 = node.css["background-image"];
    var bgColor2 = sibling.css["background-color"], bgImage2 = sibling.css["background-image"];
    if (bgImage1 === "none" && bgImage2 === "none" && sameColorByCIE2000(bgColor1, bgColor2))
      mergeLayerNodes(node, sibling, mergingResults);
    else if (bgImage1 !== "none" && bgImage2 !== "none")
      sameImage(bgImage1, bgImage2, function(same) {
        if (same)
          mergeLayerNodes(node, sibling, mergingResults);
        // After current procedure
        if (node.childCount > 0)                              // first go to its children
          getSimBg(root, size, node.firstChild, number + 1, mergingResults);
        else if (node.nextSibling)                            // then go to its next sibling
          getSimBg(root, size, node.nextSibling, number + 1, mergingResults);
        else {                                                // then go to its uncle (parent's next sibling)
          var parent = node.parent;
          if (parent) {
            var uncle = parent.nextSibling;
            while (!uncle) {
              if (parent === root)                            // if all ancestors have no next sibling,
                return ;                                      // then it means traversing has finished
              parent = parent.parent;
              uncle = parent.nextSibling;
            } // while (!uncle)
            getSimBg(root, size, uncle, number + 1, mergingResults);
          } // if (parent)
        } // if - else if - else
        return ;
      }); // sameImage(bgImage1, bgImage2, function(same) {...});
  } // if (sibling)
  if (number === size)
    updatePage(mergingResults);

  // After current procedure
  if (node.childCount > 0)                                    // first go to its children
    getSimBg(root, size, node.firstChild, number + 1, mergingResults);
  else if (node.nextSibling)                                  // then go to its next sibling
    getSimBg(root, size, node.nextSibling, number + 1, mergingResults);
  else {                                                      // then go to its uncle (parent's next sibling)
    var parent = node.parent;
    if (parent) {
      var uncle = parent.nextSibling;
      while (!uncle) {
        if (parent === root)                                  // if all ancestors have no next sibling,
          return ;                                            // then it means traversing has finished
        parent = parent.parent;
        uncle = parent.nextSibling;
      } // while (!uncle)
      getSimBg(root, size, uncle, number + 1, mergingResults);
    } // if (parent)
  } // if - else if - else
} // function getSimBg(root, size, node, number, mergingResults)

/**
 * Apply Gestalt Law of Similarity (text) and save result
 */
function getSimTxt(root, size, node, number, mergingResults) {
  var sibling = node.nextSibling;
  if (sibling) {
    var i = 0;
    for (; i < 29; i++)
      if (node.css[properties[23 + i]] !== sibling.css[properties[23 + i]])
        break ;
    if (i >= 29 && sameColorByCIE2000(node.css["color"], sibling.css["color"]))
      mergeLayerNodes(node, sibling, mergingResults);
  } // if (sibling)
  if (number === size)
    updatePage(mergingResults);

  // After current procedure
  if (node.childCount > 0)                                    // first go to its children
    getSimTxt(root, size, node.firstChild, number + 1, mergingResults);
  else if (node.nextSibling)                                  // then go to its next sibling
    getSimTxt(root, size, node.nextSibling, number + 1, mergingResults);
  else {                                                      // then go to its uncle (parent's next sibling)
    var parent = node.parent;
    if (parent) {
      var uncle = parent.nextSibling;
      while (!uncle) {
        if (parent === root)                                  // if all ancestors have no next sibling,
          return ;                                            // then it means traversing has finished
        parent = parent.parent;
        uncle = parent.nextSibling;
      } // while (!uncle)
      getSimTxt(root, size, uncle, number + 1, mergingResults);
    } // if (parent)
  } // if - else if - else
} // function getSimTxt(root, size, node, number, mergingResults)

/**
 * Apply Gestalt Law of Similarity (size) and save result
 */
function getSimSz(root, size, node, number, mergingResults) {
  var sibling = node.nextSibling;
  if (sibling && (node.height === sibling.height && node.width === sibling.width))
    mergeLayerNodes(node, sibling, mergingResults);
  if (number === size)
    updatePage(mergingResults);

  // After current procedure
  if (node.childCount > 0)                                    // first go to its children
    getSimSz(root, size, node.firstChild, number + 1, mergingResults);
  else if (node.nextSibling)                                  // then go to its next sibling
    getSimSz(root, size, node.nextSibling, number + 1, mergingResults);
  else {                                                      // then go to its uncle (parent's next sibling)
    var parent = node.parent;
    if (parent) {
      var uncle = parent.nextSibling;
      while (!uncle) {
        if (parent === root)                                  // if all ancestors have no next sibling,
          return ;                                            // then it means traversing has finished
        parent = parent.parent;
        uncle = parent.nextSibling;
      } // while (!uncle)
      getSimSz(root, size, uncle, number + 1, mergingResults);
    } // if (parent)
  } // if - else if - else
} // function getSimSz(root, size, node, number, mergingResults)

/**
 * Apply Gestalt Law of Common Fate and save result
 */
function getCommonFate(root, size, node, number, mergingResults) {
  var sibling = node.nextSibling;
  if (sibling && node.css["position"] === sibling.css["position"])
    mergeLayerNodes(node, sibling, mergingResults);
  if (number === size)
    updatePage(mergingResults);

  // After current procedure
  if (node.childCount > 0)                                    // first go to its children
    getCommonFate(root, size, node.firstChild, number + 1, mergingResults);
  else if (node.nextSibling)                                  // then go to its next sibling
    getCommonFate(root, size, node.nextSibling, number + 1, mergingResults);
  else {                                                      // then go to its uncle (parent's next sibling)
    var parent = node.parent;
    if (parent) {
      var uncle = parent.nextSibling;
      while (!uncle) {
        if (parent === root)                                  // if all ancestors have no next sibling,
          return ;                                            // then it means traversing has finished
        parent = parent.parent;
        uncle = parent.nextSibling;
      } // while (!uncle)
      getCommonFate(root, size, uncle, number + 1, mergingResults);
    } // if (parent)
  } // if - else if - else
} // function getCommonFate(root, size, node, number, mergingResults)

/**
 * Apply Gestalt Law of Continuity and save result
 */
function getContinuity(root, size, node, number, mergingResults) {
  var sibling = node.nextSibling;
  if (sibling && (node.left === sibling.left || node.top === sibling.top ||
                  node.right === sibling.right || node.bottom === sibling.bottom))
    mergeLayerNodes(node, sibling, mergingResults);
  if (number === size)
    updatePage(mergingResults);

  // After current procedure
  if (node.childCount > 0)                                    // first go to its children
    getContinuity(root, size, node.firstChild, number + 1, mergingResults);
  else if (node.nextSibling)                                  // then go to its next sibling
    getContinuity(root, size, node.nextSibling, number + 1, mergingResults);
  else {                                                      // then go to its uncle (parent's next sibling)
    var parent = node.parent;
    if (parent) {
      var uncle = parent.nextSibling;
      while (!uncle) {
        if (parent === root)                                  // if all ancestors have no next sibling,
          return ;                                            // then it means traversing has finished
        parent = parent.parent;
        uncle = parent.nextSibling;
      } // while (!uncle)
      getContinuity(root, size, uncle, number + 1, mergingResults);
    } // if (parent)
  } // if - else if - else
} // function getContinuity(root, size, node, number, mergingResults)


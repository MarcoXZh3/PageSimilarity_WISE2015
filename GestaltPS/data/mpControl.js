/**
 * Register event handlers to the menu items of the extension
 */
self.port.on("load", function onShow(imgs) {
  document.getElementById("gps-img-similarity").src = imgs[0];
  document.getElementById("gps-img-layertree").src = imgs[1];
  document.getElementById("gps-img-blocktree").src = imgs[2];
  document.getElementById("gps-img-glmall").src = imgs[3];
  document.getElementById("gps-img-glmprox").src = imgs[4];
  document.getElementById("gps-img-glmsimbg").src = imgs[5];
  document.getElementById("gps-img-glmsimtxt").src = imgs[6];
  document.getElementById("gps-img-glmsimsz").src = imgs[7];
  document.getElementById("gps-img-glmcomf").src = imgs[8];
  document.getElementById("gps-img-glmcon").src = imgs[9];
  document.getElementById("gps-img-screenshot").src = imgs[10];

  document.getElementById("gps-li-similarity").onclick = function() { self.port.emit("click-LI-similarity"); };
  document.getElementById("gps-li-layertree").onclick = function() { self.port.emit("click-LI-layertree"); };
  document.getElementById("gps-li-blocktree").onclick = function() { self.port.emit("click-LI-blocktree"); };
  document.getElementById("gps-li-glmall").onclick = function() { self.port.emit("click-LI-glmall"); };
  document.getElementById("gps-li-glmprox").onclick = function() { self.port.emit("click-LI-glmprox"); };
  document.getElementById("gps-li-glmsimbg").onclick = function() { self.port.emit("click-LI-glmsimbg"); };
  document.getElementById("gps-li-glmsimtxt").onclick = function() { self.port.emit("click-LI-glmsimtxt"); };
  document.getElementById("gps-li-glmsimsz").onclick = function() { self.port.emit("click-LI-glmsimsz"); };
  document.getElementById("gps-li-glmcomf").onclick = function() { self.port.emit("click-LI-glmcomf"); };
  document.getElementById("gps-li-glmcon").onclick = function() { self.port.emit("click-LI-glmcon"); };
  document.getElementById("gps-li-screenshot").onclick = function() { self.port.emit("click-LI-screenshot"); };
}); // self.port.on("load", function onShow(imgs) {...});

/**
 * Register event handlers of the menu item - "Page Similarity"
 */
self.port.on("handler-LI-similarity", function(startTime) {
  self.port.emit("resp-LI-similarity", new Date().getTime() - startTime, "Page Similarity");
}); // self.port.on("handler-LI-similarity", function(startTime) {...});

/**
 * Register event handlers of the menu item - "Layer Tree"
 */
self.port.on("handler-LI-layertree", function(startTime) {
  self.port.emit("resp-LI-layertree", new Date().getTime() - startTime,
                 new LayerTree(new LayerTreeNode(document.body, document.body.tagName), document.URL).toString());
}); // self.port.on("handler-LI-layertree", function(startTime) {...});

/**
 * Register event handlers of the menu item - "Block Tree"
 */
self.port.on("handler-LI-blocktree", function(startTime) {
  var layerTree = new LayerTree(new LayerTreeNode(document.body, document.body.tagName), document.URL);
  var blockTree = new BlockTree(new BlockTreeNode([layerTree.root], "/0"), document.URL);
  blockTree.buildUpTree(layerTree);
  //blockTree.treeInPage();
  self.port.emit("resp-LI-blocktree", new Date().getTime() - startTime, blockTree.toString());
}); // self.port.on("handler-LI-blocktree", function(startTime) {...});

/**
 * Register event handlers of the menu item - "GLM - All Laws"
 */
self.port.on("handler-LI-glmall", function(startTime) {
  var mergingResults = [];
  getAllLaws(new LayerTree(new LayerTreeNode(document.body, document.body.tagName), document.URL).root,
             mergingResults);
  updatePage(mergingResults);
}); // self.port.on("handler-LI-glmall", function(startTime) {...});

/**
 * Register event handlers of the menu item - "GLM - Proximity"
 */
self.port.on("handler-LI-glmprox", function(startTime) {
  var mergingResults = [];
  getProximity(new LayerTree(new LayerTreeNode(document.body, document.body.tagName), document.URL).root,
               mergingResults);
  updatePage(mergingResults);
}); // self.port.on("handler-LI-glmprox", function(startTime) {...});

/**
 * Register event handlers of the menu item - "GLM - Similarity (Bg)"
 */
self.port.on("handler-LI-glmsimbg", function(startTime) {
  var mergingResults = [];
  getSimBg(new LayerTree(new LayerTreeNode(document.body, document.body.tagName), document.URL).root,
           mergingResults);
  updatePage(mergingResults);
}); // self.port.on("handler-LI-glmsimbg", function(startTime) {...});

/**
 * Register event handlers of the menu item - "GLM - Similarity (Text)"
 */
self.port.on("handler-LI-glmsimtxt", function(startTime) {
  var mergingResults = [];
  getSimTxt(new LayerTree(new LayerTreeNode(document.body, document.body.tagName), document.URL).root,
            mergingResults);
  updatePage(mergingResults);
}); // self.port.on("handler-LI-glmsimtxt", function(startTime) {...});

/**
 * Register event handlers of the menu item - "GLM - Similarity (Size)"
 */
self.port.on("handler-LI-glmsimsz", function(startTime) {
  var mergingResults = [];
  getSimSz(new LayerTree(new LayerTreeNode(document.body, document.body.tagName), document.URL).root,
           mergingResults);
  updatePage(mergingResults);
}); // self.port.on("handler-LI-glmsimsz", function(startTime) {...});

/**
 * Register event handlers of the menu item - "GLM - Common Fate"
 */
self.port.on("handler-LI-glmcomf", function(startTime) {
  var mergingResults = [];
  getCommonFate(new LayerTree(new LayerTreeNode(document.body, document.body.tagName), document.URL).root,
                mergingResults);
  updatePage(mergingResults);
}); // self.port.on("handler-LI-glmcomf", function(startTime) {...});

/**
 * Register event handlers of the menu item - "GLM - Continuity"
 */
self.port.on("handler-LI-glmcon", function(startTime) {
  var mergingResults = [];
  getContinuity(new LayerTree(new LayerTreeNode(document.body, document.body.tagName), document.URL).root,
                mergingResults);
  updatePage(mergingResults);
}); // self.port.on("handler-LI-glmcon", function(startTime) {...});

/**
 * Register event handlers of the menu item - "Batch Screenshot"
 * http://html2canvas.hertzen.com/
 */
self.port.on("handler-LI-screenshot", function(startTime) {
  html2canvas(document.body, {onrendered: function(canvas) {
    self.port.emit("resp-LI-screenshot", new Date().getTime() - startTime, canvas.toDataURL("image/png"));
  }}); // html2canvas(document.body, {onrendered: function(canvas) { ... }});
}); // self.port.on("handler-LI-screenshot", function(startTime) {...});


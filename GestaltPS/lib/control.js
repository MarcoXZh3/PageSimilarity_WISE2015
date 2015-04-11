const {Cc, Ci} = require("chrome");
const data = require("sdk/self").data;

const register = (panel) => {
  panel.port.on("click-LI-similarity", function() { GestaltPS_Handler(panel, "handler-LI-similarity"); });
  panel.port.on("click-LI-layertree", function() { GestaltPS_Handler(panel, "handler-LI-layertree"); });
  panel.port.on("click-LI-blocktree", function() { GestaltPS_Handler(panel, "handler-LI-blocktree"); });
  panel.port.on("click-LI-glmall", function() { GestaltPS_Handler(panel, "handler-LI-glmall"); });
  panel.port.on("click-LI-glmprox", function() { GestaltPS_Handler(panel, "handler-LI-glmprox"); });
  panel.port.on("click-LI-glmsimbg", function() { GestaltPS_Handler(panel, "handler-LI-glmsimbg"); });
  panel.port.on("click-LI-glmsimtxt", function() { GestaltPS_Handler(panel, "handler-LI-glmsimtxt"); });
  panel.port.on("click-LI-glmsimsz", function() { GestaltPS_Handler(panel, "handler-LI-glmsimsz"); });
  panel.port.on("click-LI-glmcomf", function() { GestaltPS_Handler(panel, "handler-LI-glmcomf"); });
  panel.port.on("click-LI-glmcon", function() { GestaltPS_Handler(panel, "handler-LI-glmcon"); });
}; // const register = (panel) => { ... };

/*const prefs = Cc["@mozilla.org/preferences-service;1"].
                getService(Ci.nsIPrefService).
                getBranch("extensions.GestaltPS.");
prefs.setCharPref("TopSites", require("./preferences.js").prefGestaltPS);
const topSites = prefs.getCharPref("TopSites").split("/");*/

const GestaltPS_Handler = (panel, event) => {
  panel.hide();
  const worker = require("sdk/tabs").activeTab.attach({
    contentScriptFile: [data.url("libs/JsTree.js"),
                        data.url("libs/libs.js"),
                        data.url("libs/lzma.js"),
                        data.url("libs/lzma_worker.js"),
                        data.url("gestaltLM/LayerTree.js"),
                        data.url("gestaltLM/GLM_Helper.js"),
                        data.url("gestaltLM/GestaltLaws.js"),
                        data.url("BlockTree.js"),
                        data.url("mpControl.js")
    ] // contentScriptFile: [ ... ]
  }); // const worker = require("sdk/tabs").activeTab.attach({...});

  // Send the corresponding event to the active tab
  worker.port.emit(event, new Date().getTime());

  // Receive the respond message of the "Page Similarity"
  worker.port.on("resp-LI-similarity", function(time, msg) {
    const { open } = require("sdk/window/utils");
    open("data:text/html, <code style='overflow:auto;white-space:nowrap;'>"+msg.replace(/\n/g, "<br />")+"</code>",
         { features: {width: 800, height: 450, centerscreen: true} }
    ); // open(uri, options)
  }); // worker.port.on("resp-LI-similarity", function(time, msg) { ... });

  // Receive the respond message of the "Layer Tree"
  worker.port.on("resp-LI-layertree", function(time, msg) {
    const { open } = require("sdk/window/utils");
    open("data:text/html, <code style='overflow:auto;white-space:nowrap;'>"+msg.replace(/\n/g, "<br />")+"</code>",
         { features: {width: 800, height: 450, centerscreen: true} }
    ); // open(uri, options)
  }); // worker.port.on("resp-LI-layertree", function(time, msg) { ... });

  // Receive the respond message of the "Block Tree"
  worker.port.on("resp-LI-blocktree", function(time, msg) {
    const { open } = require("sdk/window/utils");
    open("data:text/html, <code style='overflow:auto;white-space:nowrap;'>"+msg.replace(/\n/g, "<br />")+"</code>",
         { features: {width: 800, height: 450, centerscreen: true} }
    ); // open(uri, options)
  }); // worker.port.on("resp-LI-blocktree", function(time, msg) { ... });

}; // const GestaltPS_Handler = (panel, event) => { ... };

exports.register = register;


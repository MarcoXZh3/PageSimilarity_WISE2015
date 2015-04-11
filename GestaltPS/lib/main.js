const {Cc, Ci} = require("chrome");
var _ = require("sdk/l10n").get;

const { ToggleButton } = require('sdk/ui/button/toggle');
const panels = require("sdk/panel");
const data = require("sdk/self").data;

const button = ToggleButton({
  id: "Btn-GestaltPS",
  label: _("addon_label"),
  icon: {
    "16": _("icon_16"),
    "32": _("icon_32"),
    "64": _("icon_64")
  },
  onChange: handleChange
});

const panel = panels.Panel({
  height: 240,
  contentURL: data.url("main-panel.html"),
  contentScriptFile: data.url("mpControl.js"),
  onShow: handleShow,
  onHide: handleHide
});

function handleShow() {
  panel.port.emit("load", [_("li_img_similarity"),
                           _("li_img_layertree"),
                           _("li_img_blocktree"),
                           _("li_img_glmall"),
                           _("li_img_glmprox"),
                           _("li_img_glmsimbg"),
                           _("li_img_glmsimtxt"),
                           _("li_img_glmsimsz"),
                           _("li_img_glmcomf"),
                           _("li_img_glmcon")]);
}

function handleHide() {
  button.state('window', {checked: false});
}

function handleChange(state) {
  if (state.checked)
    panel.show({position: button});
}

const ctrl = require("control.js");
ctrl.register(panel);


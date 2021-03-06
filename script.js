//Global storage for messages
var messages = [];
var progress = 0;
var total = 0;

function calculateTotal(item) {
    if (!item.getNumChildren) {
        return 0;
    }
    var current = 0;
    var numChildren = item.getNumChildren();
    for (var i = 0; i < numChildren; i++) {
        current++;
        var child = item.getChild(i);
        if (child !== null && child.getNumChildren) {
            current += calculateTotal(child);
        }
    }
    return current;
}

function onInstall(e) {
    onOpen(e);
}

function onOpen(e) {
    DocumentApp.getUi().createAddonMenu()
        .addItem('Convert (v.' + VERSION + ')', 'showDefaultSettings')
        .addToUi();
    saveSettings(DEFAULT_SETTINGS);
}

function showDefaultSettings() {
    var settings = loadSettings();
    showSettings(settings);
}

function showSettings(options) {
    var template = HtmlService.createTemplateFromFile('ui/settings.html');
    template.options = options;
    DocumentApp.getUi().showSidebar(template.evaluate().setTitle('Settings'))
}
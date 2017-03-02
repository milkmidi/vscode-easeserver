/// <reference path="../node_modules/open/lib/open.js" />
// node_modules
const vscode = require( 'vscode' );
const open = require( 'open' );
// my class
const EaseServer = require( './EaseServer' );
// instance
const config = vscode.workspace.getConfiguration( 'easeServer' ) || {};
const wwwRoot = vscode.workspace.rootPath;
/**
 * @param  {vscode.ExtensionContext} context
 */
function activate( context ) {
    console.log( '"EaseServer" is now active!' );

    var server = new EaseServer( config.portNumber , config.uiportNumber, wwwRoot );
    context.subscriptions.push( server );

    var disposable;
    disposable = vscode.commands.registerCommand( 'easeserver.start', () => {
        server.start().then(() => {
            openInBrowser();
        }).catch( err => {
            vscode.window.showInformationMessage( 'EaseServer fail:' + err );
        });
    });
    context.subscriptions.push( disposable );

    disposable = vscode.commands.registerCommand( 'easeserver.stop', () => {
        server.stop().then(() => {
            vscode.window.showInformationMessage( 'EaseServer has been stopped' );
        });
    });
    context.subscriptions.push( disposable );

    disposable = vscode.commands.registerCommand( 'easeserver.openInBrowser', () => {
        openInBrowser();
    });
    context.subscriptions.push( disposable );
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;

function openInBrowser() {
    var edit = vscode.window.activeTextEditor;
    if ( !edit ) {
        return;
    }
    var fileName = edit.document.fileName.replace( wwwRoot, "" );
    console.log( "openInBrowser: fileName=" + fileName );
    open( `http://localhost:${config.portNumber}` + fileName );
}

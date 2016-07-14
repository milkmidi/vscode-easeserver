const vscode = require( 'vscode' );
const open = require( 'open' );
const EaseServer = require( './EaseServer' );
const config =  vscode.workspace.getConfiguration('easeServer') || {};
const wwwRoot = vscode.workspace.rootPath;
// config.portNumber ||= 9527;

function activate( context ) {
    console.log( 'Congratulations, your extension "EaseServer" is now active!' );
    
    var server = new EaseServer( config.portNumber ,wwwRoot );

    server.start().then(() => {
        console.log( 'start' );
    }).catch( err => {
        vscode.window.showInformationMessage( 'EaseServer fail:' + err );
    });
    context.subscriptions.push( server );
    
    
    
    var disposable;
    disposable = vscode.commands.registerCommand( 'extension.easeServer', () => {        
        openInBrowser();        
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

function openInBrowser(){
    var edit = vscode.window.activeTextEditor;
    if ( !edit ) {
        return;
    }    
    // console.log( edit.document.uri );
    console.log( edit.document.fileName );
    console.log( wwwRoot );

    var fileName = edit.document.fileName.replace( wwwRoot , "");
    
    open( `http://localhost:${config.portNumber}/` + fileName );
}

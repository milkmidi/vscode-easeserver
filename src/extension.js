const vscode = require( 'vscode' );
const open = require( 'open' );
const EaseServer = require( './EaseServer' );
const config =  vscode.workspace.getConfiguration('easeServer') || {};
const wwwRoot = vscode.workspace.rootPath;
// config.portNumber ||= 9527;

function activate( context ) {
    console.log( '"EaseServer" is now active!' );
    
    var server = new EaseServer( config.portNumber ,wwwRoot );

    
    context.subscriptions.push( server );
    
    
    
    var disposable;
    disposable = vscode.commands.registerCommand( 'easeserver.start', () => {    
        server.start().then(() => {
            // console.log( 'start' );
            openInBrowser();
        }).catch( err => {
            vscode.window.showInformationMessage( 'EaseServer fail:' + err );
        });    
                
    });
    context.subscriptions.push( disposable );    

    disposable = vscode.commands.registerCommand( 'easeserver.stop', () => {        
        server.stop().then( ()=>{
            vscode.window.showInformationMessage('EaseServer has been stopped');
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

function openInBrowser(){
    var edit = vscode.window.activeTextEditor;
    if ( !edit ) {
        return;
    }    
    
    // console.log( edit.document.fileName );
    // console.log( wwwRoot );

    var fileName = edit.document.fileName.replace( wwwRoot , "");
    // fileName = fileName.replace(/\/g, "/");
    console.log( fileName );
    
    open( `http://localhost:${config.portNumber}` + fileName );
}

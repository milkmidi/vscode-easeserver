// 'use strict';
const
    express = require( 'express' ),
    http = require( 'http' ),
    vscode = require( 'vscode' ),
    browserSync = require("browser-sync"),
    window = vscode.window;


const SERVER_STOP = 0;
const SERVER_START = 1;
const SERVER_RUNNING = 2;

/** 
 * @Class EaseServer. 
 * */
class EaseServer {
    /**
     * @constructor
     * @param  {number} portNumber=9527
     * @param  {number} uiportNumber=9528
     * @param  {string} wwwRoot=""
     */
    constructor( portNumber = 9527 , uiportNumber = 9528 , wwwRoot = "" ) {
        /**
         * private
         */        
        this._server = null;
        /**
         * private
         * @type {StatusBarItem}
         */
        this._statusBarItem = window.createStatusBarItem( vscode.StatusBarAlignment.Right, 1 );
        /**
         * @type {number}
         */
        this.state = SERVER_STOP;
        /**
         * @type {number}
         */        
        this.portNumber = portNumber;
        this.uiportNumber = uiportNumber;
        /**
         * @type {string}
         */
        this.wwwRoot = wwwRoot;


    }
    
    /**
     * start express server
     */
    start() {        
        return new Promise(( resolve, reject ) => {
            if ( this.state === SERVER_START ) {
                resolve();
                return;
            }
            this.state = SERVER_RUNNING;
            this._server = browserSync.create();
            this._server.init( {
                open    : false,
                port    : this.portNumber,
                server: this.wwwRoot,
                ui: {
                    port: this.uiportNumber
                }
            } );
            this.state = SERVER_START;
            this._statusBarItem.command = "easeserver.openInBrowser";
            this._statusBarItem.tooltip = "Click here to open in browser";
            this._statusBarItem.text = `http://localhost:${this.portNumber}`;
            this._statusBarItem.show();
            resolve();

            /*var app = express();
            app.use( express.static( this.wwwRoot ) );

            this._server = http.createServer( app ).listen( this.portNumber, () => {
                this.state = SERVER_START;
                this._statusBarItem.command = "easeserver.openInBrowser";
                this._statusBarItem.tooltip = "Click here to open in browser";
                this._statusBarItem.text = `http://localhost:${this.portNumber}`;
                this._statusBarItem.show();
                resolve();
            }).on( 'error', err => {
                this.state = SERVER_STOP;
                reject( err );
            });*/
        });
    }

    /**
     * stop server
     */
    stop() {
        return new Promise(( resolve, reject ) => {
            if ( this._server === null ) {
                reject( "Server not running" );
            } else {
                this._server.exit();
                this._server = null;
                this.state = SERVER_STOP;
                if( this._statusBarItem !== null){
                    this._statusBarItem.hide();
                }
                resolve();

               /* this._server.close(() => {
                    this._server = null;
                    this.state = SERVER_STOP;
                    if( _statusBarItem !== null){
                        this._statusBarItem.hide();
                    }
                    resolve();
                });*/
            }
        });
    }
    dispose() {
        this.stop();
        this._statusBarItem.dispose();
        this._statusBarItem = null;        
    }
}

module.exports = EaseServer;
// 'use strict';
const express = require( 'express' );
const http = require( 'http' );
const vscode = require( 'vscode' );
const fs = require('fs');
const watch = require('node-watch');
const browserSync = require("browser-sync");
const window = vscode.window;

const WATCH_FILE_NAME =  /\.(html|htm|css|js)$/;
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
        this.server = null;
        /**
         * private
         * @type {StatusBarItem}
         */
        this.statusBarItem = window.createStatusBarItem( vscode.StatusBarAlignment.Right, 1 );
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
     * start ease server
     */
    start() {        
        return new Promise(( resolve, reject ) => {
            if ( this.state === SERVER_START ) {
                resolve();
                return;
            }
            this.state = SERVER_RUNNING;
            this.server = browserSync.create();
            this.server.init( {
                files   :'**/*.html',
                open    : false,
                port    : this.portNumber,
                server  : this.wwwRoot,
                ui: {
                    port: this.uiportNumber
                }
            } );
            watch(this.wwwRoot, { recursive: true }, (evtType , filename)=>{
                if (evtType === 'update' && WATCH_FILE_NAME.test(filename)) {
                    this.server.reload();
                }
            })
            this.state = SERVER_START;
            this.statusBarItem.command = "easeserver.stop";
            // this._statusBarItem.command = "easeserver.openInBrowser";
            this.statusBarItem.tooltip = "Click here to stop easeServer";
            this.statusBarItem.text = "Stop easeServer";
            // this._statusBarItem.text = `http://localhost:${this.portNumber}`;
            this.statusBarItem.show();
            resolve();
        });
    }

    /**
     * stop server
     */
    stop() {
        return new Promise(( resolve, reject ) => {
            if ( this.server === null ) {
                reject( "Server not running" );
            } else {
                this.server.exit();
                this.server = null;
                this.state = SERVER_STOP;
                if( this.statusBarItem !== null){
                    this.statusBarItem.hide();
                }
                resolve();
            }
        });
    }
    dispose() {
        this.stop();        
        this.statusBarItem.dispose();
        this.statusBarItem = null;        
    }
}

module.exports = EaseServer;
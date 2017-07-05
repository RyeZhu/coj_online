import {Injectable} from '@angular/core';

import {COLORS} from  '../../assets/colors';

declare let ace: any;
declare let io: any;

@Injectable()
export class CollaborationService {

  collaborationSocket: any;
  clientInfo: Object = {};
  clientNum: number = 0;

  initComplete: boolean = false;
  codeDefault: string = '';


  constructor() {
  }

  init(editor: any, sessionId: string, problemId: number, language: string, callback: Function): void {
    console.log("window.location.origin: " + window.location.origin);

    this.initComplete = false;
    this.collaborationSocket = io(window.location.origin, {
      query: 'sessionId=' + sessionId + '&'
      + 'problemId=' + problemId + '&'
      + 'language=' + language
    });

    /**
     * initilize code on connect server
     */
    this.collaborationSocket.on('snapshot', (codeSnapshot: string) => {
      console.log("collaboration: editor restore snapshot" + codeSnapshot);
      this.codeDefault = codeSnapshot;

      editor.setValue(codeSnapshot, 1);
      editor.getSession().getSelection().moveCursorFileEnd();

      this.initComplete = true;
    });

    /**
     * receive change message
     */
    this.collaborationSocket.on('change', (delta: string) => {
      console.log("collaboration: editor changes by " + delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]);
    });

    /**
     * on received cursor move
     */
    this.collaborationSocket.on('cursorMove', (cursor: string) => {
      console.log('collaboration: editor cursorMove by ' + cursor);
      let session = editor.getSession();
      cursor = JSON.parse(cursor);
      let x: number = cursor['row'];
      let y: number = cursor['column'];
      let changeClientId: number = cursor['socketId'];
      console.log(x + ' ' + y + ' ' + changeClientId);

      if (changeClientId in this.clientInfo) {
        session.removeMarker(this.clientInfo[changeClientId]['marker']);
      } else {
        this.clientInfo[changeClientId] = {};
        let css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = '.editor_cursor_' + changeClientId
          + '{'
          + 'position:absolute;z-index:100;width:3px !important;'
          + 'background:' + COLORS[this.clientNum] + ';'
          + '}';
        document.body.appendChild(css);
        this.clientNum++;
      }

      let Range: any = ace.require('ace/range').Range;
      let newMarker: any = session.addMarker(new Range(x, y, x, y + 1), 'editor_cursor_' + changeClientId, true);
      this.clientInfo[changeClientId]['marker'] = newMarker;
    });

    /**
     * remove cursor marker on socket disconnect
     */
    this.collaborationSocket.on('cursorRemove', (cursor: string) => {
      console.log('collaboration: editor cursorRemove by ' + cursor);
      let session = editor.getSession();
      cursor = JSON.parse(cursor);
      let changeClientId: number = cursor['socketId'];
      if (changeClientId in this.clientInfo) {
        session.removeMarker(this.clientInfo[changeClientId]['marker']);
      }
    });

    /**
     * receive test message
     */
    this.collaborationSocket.on('message', (message) => {
      console.log("received: " + message);
    });

    /**
     * on socket disconnect
     */
    this.collaborationSocket.on('disconnect', () => {
      console.log("disconnect ");
    });


    callback();
  }

  change(delta: string): void {
    if (!this.initComplete) {
      return;
    }
    console.log("emit change event");

    this.collaborationSocket.emit('change', delta)
  }

  cursorMove(cursor: string): void {
    this.collaborationSocket.emit('cursorMove', cursor);
  }

  restoreBuffer(): void {
    this.collaborationSocket.emit('restoreBuffer');
  }

  close(): void {
    // this.collaborationSocket.emit('end');
    this.collaborationSocket.close();
  }

  resetBuffer(editor: any): void {
    editor.setValue(this.codeDefault, 1);
  }

}

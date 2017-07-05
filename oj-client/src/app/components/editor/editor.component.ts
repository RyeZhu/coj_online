import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from "rxjs/Subscription";

declare let ace: any;

const DEFAULT_TEMPLATE: Object = {
  'Java': `class Solution {
    public static void main(String[] args) {
    }
}`,
  'C++': `class Solution {
public:
    void main(int n) {
    }
};`,
  'Python': `class Solution:
    def main(self, n):
      pass
`
};

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, OnDestroy {
  editor: any;
  subscribe: Subscription;
  bulidSubscribe: Subscription;

  problemId: number;
  sessionId: string = '';
  output: string = '';

  language: string = 'Java';
  languages: string[] = ['Java', 'C++', 'Python'];
  langugeeModes: Object = {
    'Java': 'java',
    'C++': 'c_cpp',
    'Python': 'python'
  };
  // defaultContent: Object = DEFAULT_TEMPLATE;

  constructor(@Inject('data') private data,
              @Inject('collaboration') private collaboration,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subscribe = this.route.params.subscribe((params) => {
      this.problemId = params['id'];
      this.initEditor();
    });
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
    this.editor.destroy();
    this.editor.container.remove();
  }

  getSessionId(): string {
    return JSON.stringify({
      problemId: this.problemId,
      language: this.language
    });

    // return this.problemId + '-' + this.language;
  }

  /**
   * initEditor
   */
  initEditor() {
    this.editor = ace.edit('editor');
    this.editor.setTheme('ace/theme/eclipse');
    this.editor.$blockScrolling = Infinity;
    this.editor.lastAppliedChange = null;

    this.resetEditor();

    this.startCollaborationService();
  }

  /**
   * setLanguage
   * @param language
   */
  setLanguage(language: string): void {

    this.language = language;


    this.closeCollaborationService();

    //destory editor
    this.editor.destroy();
    this.initEditor();
    // this.resetEditor();
    // this.startCollaborationService();
  }

  /**
   * reset Editor
   */
  resetEditor(): void {
    console.log("change code template:" + this.language);

    this.editor.getSession().setMode('ace/mode/' + this.langugeeModes[this.language]);
    // this.editor.setValue(this.defaultContent[this.language], 1);
    this.collaboration.resetBuffer(this.editor);

    this.output = '';

    //focus editor
    this.editor.focus();

  }

  closeCollaborationService(): void {
    //close sessionId
    if (this.sessionId !== '') {
      this.collaboration.close();
    }
  }

  startCollaborationService(): void {
    this.sessionId = this.getSessionId();

    //begin socket.io service
    this.collaboration.init(this.editor, this.sessionId, this.problemId, this.language, () => {
      console.log("editor init: " + this.problemId + ' ' + this.language);
    });

    this.editor.on('change', (e) => {
      console.log("editor change:" + JSON.stringify(e));
      if (this.editor.lastAppliedChange != e) {
        this.collaboration.change(JSON.stringify(e));
      }
    });

    this.editor.getSession().getSelection().on('changeCursor', () => {
      let cursor: Object = this.editor.getSession().getSelection().getCursor();

      console.log("cursor move:" + JSON.stringify(cursor));
      this.collaboration.cursorMove(JSON.stringify(cursor));
    });
    //end socket.io service

    this.collaboration.restoreBuffer();
  }

  /**
   * submit code to server, then get result from server
   */
  submit(): void {
    let userCode = this.editor.getValue();
    // console.log(userCode);

    this.bulidSubscribe = this.data.buildAndRun(this.language, this.editor.getValue())
      .subscribe(
        (res: any) => this.output = res.text,
        error => console.error(error),
        () => console.log('bulid complete')
      );

  }

}

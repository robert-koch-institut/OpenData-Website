import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileDatasourceContent } from 'src/app/models/datasource';

@Component({
  selector: 'app-file-download',
  templateUrl: './file-download.component.html',
  styleUrls: ['./file-download.component.scss']
})
export class FileDownloadComponent implements OnInit {

  @Input() file?: FileDatasourceContent;
  @Output() done: EventEmitter<void> = new EventEmitter<void>();

  downloadProgress: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  public download() {
    if (this.file) {
      const name = this.file.name;
      const url = this.file.downloadUrl;

      const xhr = new XMLHttpRequest();
      xhr.onloadstart = function (ev) {
        xhr.responseType = "blob";
      };
      xhr.addEventListener("progress", evt => {
        if (evt.lengthComputable) {
          var percentComplete = evt.loaded / evt.total;
          this.downloadProgress = Math.floor(percentComplete * 100);
        }
      }, false);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            // IE version
            var blob = new Blob([xhr.response], { type: 'application/force-download' });
            window.navigator.msSaveBlob(blob, name);
          } else {
            // Chrome & Firefox version
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(xhr.response);
            link.download = name;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          this.done.emit();
        }
      };
      xhr.open('GET', url, true);
      xhr.send();
    }
  }
}

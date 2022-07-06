import { Injectable } from '@angular/core';
import { FileDatasourceContent } from '../models/datasource';
import { MatSnackBar } from '@angular/material/snack-bar'
import { FileDownloadComponent } from '../components/file-download/file-download.component';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  private isDownloading = false;

  constructor(private snackBar: MatSnackBar) { }

  download(file: FileDatasourceContent) {
    if (this.isDownloading) return;

    const sbRef = this.snackBar.openFromComponent(FileDownloadComponent, {})
    sbRef.instance.file = file;

    const sub = sbRef.instance.done.subscribe(() => {
      this.isDownloading = false;
      sbRef.dismiss();
      setTimeout(() => sub.unsubscribe());
    });
    sbRef.instance.download();
    this.isDownloading = true;
  }
}

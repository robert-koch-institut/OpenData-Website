import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss']
})
export class PdfPreviewComponent implements OnInit {

  @Input() pdfSrc: string = '';
  isLoading = true;

  constructor() { }

  ngOnInit(): void {
  }

}

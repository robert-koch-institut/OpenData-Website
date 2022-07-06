import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isString } from 'lodash';
import { Subscription } from 'rxjs';
import { DatasourceService } from 'src/app/services/datasource.service';

@Component({
  selector: 'app-embed-page',
  templateUrl: './embed-page.component.html',
  styleUrls: ['./embed-page.component.scss']
})
export class EmbedPageComponent implements OnInit, OnDestroy {

  readonly datasource = this.datasourceService.getDatasource();

  readonly contentTypes = ['card', 'files'];
  content: string = 'card';
  private routeParamSub?: Subscription;


  constructor(private datasourceService: DatasourceService, private route: ActivatedRoute) {
  }
  ngOnDestroy(): void {
    this.routeParamSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.routeParamSub = this.route.params.subscribe(params => {
      if (this.contentTypes.includes(params.content)) {
        this.content = params.content;
      }
    });
  }

  private parseContentType(aString: string) {

  }


}

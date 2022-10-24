import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DatasourceContentPageComponent } from './pages/datasource-content-page/datasource-content-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { EmbedPageComponent } from './pages/embed-page/embed-page.component';
import { ImprintComponent } from './pages/imprint-page/imprint-page.component';
import { PrivacyComponent } from './pages/privacy-page/privacy-page.component';



const routes: Routes = [
  { path: 'embed/:content', component: EmbedPageComponent },
  { path: 'embed', component: EmbedPageComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy', component: PrivacyComponent },

  // { path: 'content', component: DatasourceContentPageComponent },
  { path: '', component: HomePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

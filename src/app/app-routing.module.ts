import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ImprintComponent } from './pages/imprint-page/imprint-page.component';
import { PrivacyComponent } from './pages/privacy-page/privacy-page.component';

const routes: Routes = [
  // { path: 'embed/:content', component: EmbedPageComponent },
  // { path: 'embed', component: EmbedPageComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy', component: PrivacyComponent },
  // { path: 'contact', component: ContactPageComponent },

  // { path: 'content', component: DatasourceContentPageComponent },
  { path: '', component: HomePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top'  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectorPageComponent } from './connector-page/connector-page.component';
import { ExchangePageComponent } from './exchange-page/exchange-page.component';

const routes: Routes = [
  { path: '', component: ConnectorPageComponent },
  { path: 'exchange', component: ExchangePageComponent },
  { path: 'exchange/:id', component: ExchangePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientComponent } from './client.component';
import { CreateClientComponent } from './create-client/create-client.component';
//import { ClientTransectionComponent } from './client-transection/client-transection.component';

const routes: Routes = [{
  path: '',
  component: ClientComponent,
  children: [
    {
      path: 'create-client',
      component: CreateClientComponent,
    }
  ]  
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule { }


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/accounts/login', pathMatch: 'full' },
  {
    path: 'accounts',
    loadChildren: () =>
      import('./accounts/account.module')
        .then(a => a.AccountModule)
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./project/pages.module')
        .then(a => a.PagesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

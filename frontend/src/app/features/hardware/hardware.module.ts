import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HardwareListComponent } from './hardware-list/hardware-list.component';
import { TerminalsComponent } from './terminals/terminals.component';
import { KiosksComponent } from './kiosks/kiosks.component';

const routes: Routes = [
  {
    path: '',
    component: HardwareListComponent
  },
  {
    path: 'terminals',
    component: TerminalsComponent
  },
  {
    path: 'kiosks',
    component: KiosksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HardwareModule { } 
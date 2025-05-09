import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HardwareListComponent } from './hardware-list/hardware-list.component';

const routes: Routes = [
  {
    path: '',
    component: HardwareListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HardwareModule { } 
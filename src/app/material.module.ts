import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';







@NgModule({

  imports: [MatToolbarModule, MatListModule, MatButtonModule, MatButtonToggleModule, MatSelectModule, MatFormFieldModule],
  exports: [MatToolbarModule, MatListModule, MatButtonModule, MatButtonToggleModule, MatSelectModule, MatFormFieldModule]
})
export class MaterialModule {

}

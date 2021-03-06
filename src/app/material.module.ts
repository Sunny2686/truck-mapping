import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';











@NgModule({

  imports: [MatToolbarModule, MatListModule, MatButtonModule, MatButtonToggleModule, MatSelectModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatIconModule, ScrollingModule],
  exports: [MatToolbarModule, MatListModule, MatButtonModule, MatButtonToggleModule, MatSelectModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatIconModule, ScrollingModule]
})
export class MaterialModule {

}

import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormCampania } from '@shared/components/form-campania/form-campania';

@Component({
  selector: 'app-edit-campania',
  imports: [FormCampania,CommonModule],
  templateUrl: './edit-campania.html',
})
export class EditCampania {
  
  private route = inject(ActivatedRoute);
  
  protected payloadId = signal<number | null>(null);

  constructor() {
    effect(() => {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id) {
        this.payloadId.set(id);
      }
    });
  }
}


export default EditCampania;
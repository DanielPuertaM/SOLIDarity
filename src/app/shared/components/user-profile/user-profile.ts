import { Location } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserService } from '@app/user/service/user-service';
import { AuthService } from '@auth/services/auth';
import { GlobalService } from '@core/services/global_service';
import { of } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html'
})
export class UserProfile {
  protected globalService = inject(GlobalService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  protected location = inject(Location);

  protected imagenLoaded = false;

  selectedImage: File | null = null;
  previewImage: string | null = null;

  private payloadId = signal<number | null>(null);

  protected userResource = rxResource({
    params: () => ({ payload: this.payloadId() }),
    stream: ({ params }) =>
      params.payload ? this.userService.userById(params.payload) : of(null),
  });

  constructor() {
    effect(() => {  
      const id = this.authService.getUserId();
      if (id) this.payloadId.set(id);
    });
  }

  onImageSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.selectedImage = file;

  this.previewImage = URL.createObjectURL(file);

  this.imagenLoaded = true;
}

  uploadSelectedImage(userId: number) {
    if (!this.selectedImage) return;

    this.userService.uploadImage(this.selectedImage, userId).subscribe({
      next: () => {
        this.userResource.reload();

        this.selectedImage = null;
      },
      error: () => {
        alert('Error al subir la imagen.');
      }
    });
  }
}


export default UserProfile;


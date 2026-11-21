import { Routes } from '@angular/router';
import { GuestAlbumComponent } from './features/guest-album/guest-album.component';
import { GuestExperienceComponent } from './features/guest-experience/guest-experience.component';
import { GuestGalleryComponent } from './features/guest-gallery/guest-gallery.component';
import { GuestWishesPageComponent } from './features/guest-wishes-page/guest-wishes-page.component';
import { WeddingLandingComponent } from './features/wedding-landing/wedding-landing.component';

export const routes: Routes = [
  {
    path: 'e/:eventSlug/guest/gallery',
    component: GuestGalleryComponent,
    title: 'Vowed | Pilih dari galeri',
  },
  {
    path: 'e/:eventSlug/guest/album',
    component: GuestAlbumComponent,
    title: 'Vowed | Album sementara',
  },
  {
    path: 'e/:eventSlug/guest/wishes',
    component: GuestWishesPageComponent,
    title: 'Vowed | Hantar ucapan',
  },
  {
    path: 'e/:eventSlug/guest',
    component: GuestExperienceComponent,
    title: 'Vowed | Guest memories',
  },
  {
    path: 'e/:eventSlug',
    component: WeddingLandingComponent,
    title: 'Vowed | Wedding celebration',
  },
  { path: '', pathMatch: 'full', redirectTo: 'e/najwa-farhan' },
  { path: '**', redirectTo: 'e/najwa-farhan' },
];

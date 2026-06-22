import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'publicaciones', pathMatch: 'full' },

  // guestGuard → si ya estás logueado, te redirige a publicaciones
  {
    path: 'login',
    loadComponent: () => import('../components/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () => import('../components/registro/registro').then(m => m.RegistroComponent),
  },

  // authGuard → si no estás logueado, te redirige al login
  {
    path: 'publicaciones',
    loadComponent: () =>
      import('../components/publicaciones/publicaciones').then(m => m.PublicacionesComponent),
  },
  {
    path: 'mi-perfil',
    loadComponent: () =>
      import('../components/mi-perfil/mi-perfil').then(m => m.MiPerfilComponent),
  },

  { path: '**', redirectTo: 'publicaciones' },
];
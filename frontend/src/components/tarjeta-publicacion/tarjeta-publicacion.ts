import { Component, input, output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Publicacion } from '../../models/publicacion';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-tarjeta-publicacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjeta-publicacion.html',
  styleUrl: './tarjeta-publicacion.css',
})
export class TarjetaPublicacionComponent {

  readonly publicacion = input.required<Publicacion>();
  readonly onToggleLike = output<string>();
  readonly onEliminar = output<string>();

  private auth = inject(AuthService);

  // Toggle para mostrar/ocultar la sección de comentarios
  mostrarComentarios = signal(false);

  yaLeDiLike = computed(() => {
    const miId = this.auth.user()?._id;
    return this.publicacion().likes.some(
      (l: any) => l.toString() === miId || l === miId
    );
  });

  puedoEliminar = computed(() => {
    const miId = this.auth.user()?._id;
    const soyElAutor = this.publicacion().autor._id === miId;
    const soyAdmin = this.auth.esAdmin();
    return soyElAutor || soyAdmin;
  });

  cantidadComentarios = computed(() =>
    this.publicacion().comentarios?.length ?? 0
  );

  clickLike() { this.onToggleLike.emit(this.publicacion()._id); }
  clickEliminar() { this.onEliminar.emit(this.publicacion()._id); }
  toggleComentarios() { this.mostrarComentarios.set(!this.mostrarComentarios()); }
}
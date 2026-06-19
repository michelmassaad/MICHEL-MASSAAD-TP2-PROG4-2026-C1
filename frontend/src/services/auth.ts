import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Usuario } from '../models/usuario';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly USUARIO_KEY = 'rs_usuario';

  user = signal<Usuario | null>(this.cargarUsuarioLocal());

  isAuthenticated = computed(() => this.user() !== null);
  nombreCompleto = computed(() =>
    this.user() ? `${this.user()!.nombre} ${this.user()!.apellido}` : 'Usuario',
  );
  esAdmin = computed(() => this.user()?.perfil === 'administrador');
  errorMensaje = signal('');

  sessionReady: Promise<void>;

  constructor() {
    this.sessionReady = this.verificarSesion();
  }

  private async verificarSesion(): Promise<void> {
    try {
      const usuario = await firstValueFrom(
        this.http.get<Usuario>(`${this.API_URL}/me`),
      );
      this.user.set(usuario);
      localStorage.setItem(this.USUARIO_KEY, JSON.stringify(usuario));
    } catch {
      this.user.set(null);
      localStorage.removeItem(this.USUARIO_KEY);
    }
  }

  async login(identificador: string, password: string): Promise<boolean> {
    try {
      const respuesta = await firstValueFrom(
        this.http.post<{ mensaje: string; usuario: Usuario }>(
          `${this.API_URL}/login`,
          { identificador, password },
        ),
      );
      localStorage.setItem(this.USUARIO_KEY, JSON.stringify(respuesta.usuario));
      this.user.set(respuesta.usuario as Usuario);
      this.errorMensaje.set('');
      return true;
    } catch (err: any) {
      const msg = err.status === 401 ? 'Credenciales inválidas.' : 'Error al iniciar sesión.';
      this.errorMensaje.set(msg);
      return false;
    }
  }

  async registro(formData: FormData): Promise<boolean> {
    try {
      await firstValueFrom(this.http.post(`${this.API_URL}/registro`, formData));
      return true;
    } catch (err: any) {
      const msg = err.error?.message || 'Error al registrarse.';
      this.errorMensaje.set(Array.isArray(msg) ? msg.join(', ') : msg);
      return false;
    }
  }

  async cerrarSesion(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${this.API_URL}/logout`, {}));
    } catch {}
    this.user.set(null);
    localStorage.removeItem(this.USUARIO_KEY);
    this.router.navigate(['/login']);
  }

  private cargarUsuarioLocal(): Usuario | null {
    try {
      const datos = localStorage.getItem(this.USUARIO_KEY);
      return datos ? JSON.parse(datos) : null;
    } catch {
      return null;
    }
  }

  // Método para verificar si la ruta actual es de autenticación (login o registro)
  esRutaAuth(): boolean {
    return this.router.url.includes('/login') || this.router.url.includes('/registro');
}
}
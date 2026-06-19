export interface Usuario {
  _id: string;
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  fechaNacimiento: string;
  descripcionBreve: string;
  fotoPerfil: string;
  perfil: 'usuario' | 'administrador';
  activo: boolean;
  createdAt: string;
}

// El token va en la cookie — solo recibimos el usuario
export interface RespuestaAuth {
  mensaje: string;
  usuario: Usuario;
}
export interface Comentario {
  _id: string;
  contenido: string;
  autor: {
    _id: string;
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    fotoPerfil: string;
  };
  createdAt: string;
}

export interface Publicacion {
  _id: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  autor: {
    _id: string;
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    fotoPerfil: string;
  };
  likes: string[];
  comentarios?: Comentario[]; // ← opcional: Sprint 3 lo implementa en el backend
  eliminado: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginadoPublicaciones {
  datos: Publicacion[];
  total: number;
  limit: number;
  offset: number;
}
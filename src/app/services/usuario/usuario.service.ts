import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import 'rxjs/add/operator/map';
// import * as swal from 'sweetalert';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    console.log('Servicio de usuario listo');
    this.cargarStorage();
   }
   // Para saber si esta loguado
   estaLogueado() {
     // si la var token tiene un valor, significa q esta logueado
     return( this.token.length > 5 ) ? true : false;
   }

   cargarStorage() {
     if (localStorage.getItem('token')) {
       this.token = localStorage.getItem('token');
       this.usuario = JSON.parse(localStorage.getItem('usuario'));
       } else {
         this.token = '';
         this.usuario = null;

       }
     }

   guardarStorage( id: string, token: string, usuario: Usuario ) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    // Esto es porque en el localstorage no puedo guardar objetos
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuario = usuario;
    this.token = token;

   }

   logout() {
     this.usuario = null;
     this.token = '';
     localStorage.removeItem('token');
     localStorage.removeItem('usuario');

     this.router.navigate(['/login']);

   }

   loginGoogle( token: string ) {
     let url = URL_SERVICIOS + '/login/google';
     return this.http.post( url, { token })
                .map((resp: any) => {
                  this.guardarStorage(resp.id, resp.token, resp.usuario);
                });
   }

   login(usuario: Usuario, recordar: boolean = false) {
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    let url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario)
            .map((resp: any) => {
              this.guardarStorage(resp.id, resp.token, resp.usuario);
              return true;
              });
  }

   crearUsuario(usuario: Usuario) {
     let url = URL_SERVICIOS + '/usuario';
     // aca devuelvo un observable, al cual se pueden
     // subscribir desde los componentes
     return this.http.post( url, usuario)
     // com map filtro la respuesta
                .map((resp: any) => {
                  swal('Usuario creado', usuario.email, 'success');
                  console.log('Usuario creado ', usuario.email);
                  return resp.usuario;
                });
  }


  actualizarUsuario( usuario: Usuario) {

    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    console.log('URL' + url);

    return this.http.put(url, usuario)
            .map((resp: any) => {
              // Si el usuario q recibo es igual al usuario Logueado
              if ( usuario._id === this.usuario._id ) {
                  // this.usuario = resp.usuario;
                  let usuarioDB: Usuario = resp.usuario;
                  this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
                  console.log('Paso por el actuliazar');
              }
              swal('Usuario actualizado', usuario.nombre, 'success');
              console.log('Tendria q enviar mensjito');
              return true;
            });

  }

cambiarImagen( archivo: File, id: string ) {

this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
    .then( (resp: any) => {
      this.usuario.img = resp.usuario.img;
      swal('Imagen Actualizada', this.usuario.nombre, 'success');
      this.guardarStorage(id, this.token, this.usuario);
      console.log( 'RESPUESTA LUEGO DE SUBIR ARCHIVO', resp );
    })
    .catch( resp => {
      console.log( 'ERROR: AL SUBIR ARCHIVO', resp );
    });
}


cargarUsuarios(desde: number = 0) {
  let url = URL_SERVICIOS + '/usuario?desde=' + desde;

  return this.http.get(url);

}

buscarUsuarios( termino: string ) {

  let url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
  return this.http.get(url)
        .map(( resp: any ) => resp.usuarios);

}
 
borrarUsuario(id: string) {
  let url = URL_SERVICIOS + '/usuario/' + id;
  url += '?token=' + this.token;
  return this.http.delete( url )
      .map( resp => {
        swal('Usuario borrado', 'El usario ha sido eliminado correctamente', 'success');
        return true;
      });
}

}

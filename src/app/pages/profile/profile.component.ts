import { Component, OnInit } from '@angular/core';
// import { Usuario } from 'src/app/models/usuario.model';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import swal from 'sweetalert';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  imagenSubir: File;
  imagenTemp: any;

  constructor(
    public _usuarioService: UsuarioService
  ) {

    this.usuario = this._usuarioService.usuario;
   }

  ngOnInit() {
  }

  guardar(usuario: Usuario) {
    console.log(usuario);
    this.usuario.nombre = usuario.nombre;
    if ( !this.usuario.google ) {
      this.usuario.email = usuario.email;
    }
    this._usuarioService.actualizarUsuario(this.usuario)
          .subscribe( resp => {
            console.log('Respuesta del subscribe ' + resp);
          });
  }

  seleccionImagen(archivo: File) {
    console.log('Evento..' , archivo);
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }
    // Verifico q el archivo es una imagen
    console.log(archivo);
    if (archivo.type.indexOf('image') < 0 ) {
      this.imagenSubir = null;
      swal('Solo imagenes', 'El archivo seleccionado no es una imagen', 'error');
      return;
    }
    this.imagenSubir = archivo;

    // vanilla java script

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => this.imagenTemp = reader.result;

  }

  cambiarImagen() {
    this._usuarioService.cambiarImagen(this.imagenSubir, this.usuario._id);
  }

}

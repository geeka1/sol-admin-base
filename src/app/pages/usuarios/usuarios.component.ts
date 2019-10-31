import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
// import swal from 'sweetalert';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService) {}

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadService.notificacion
          .subscribe( resp => {
            this.cargarUsuarios();
          });
  }
  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal( 'usuarios', id);
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde)
    .subscribe( (resp: any) => {
      console.log(resp);
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;
    });

  }
  cambiarDesde(valor: number) {
    let desde = this.desde + valor;
    console.log(desde);
    if ( desde >= this.totalRegistros ) {
      return;
    }
    if ( desde < 0 ) {
      return;
    }
    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }
    console.log(termino);
    this._usuarioService.buscarUsuarios(termino)
    .subscribe( (usuarios: Usuario[]) => {
      console.log('USUARIOS... ', usuarios);
      this.usuarios = usuarios;
      });
  }

  borrarUsuario(usuario: Usuario) {
    console.log(usuario);
    if ( usuario._id === this._usuarioService.usuario._id) {
      swal('No puede borrar usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }
    swal({
      title: "Are you sure?",
      text: "Esta seguro de borrar" + usuario.nombre ,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((borrar) => {
      if (borrar) {
        console.log(borrar);
        this._usuarioService.borrarUsuario(usuario._id)
          .subscribe( borrado => {
            console.log('Resp al eliminar usuario', borrado);
            this.cargarUsuarios();

          });
      }
    });
  }

  guardarUsuario(usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario)
        .subscribe();
        console.log('Paso por el guarar');
  }

}

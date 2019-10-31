import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from '../../models/medico.model';

import swal from 'sweetalert';


@Injectable({
  providedIn: 'root'
})
export class MedicoService {

 totalRegistros: number = 0;


  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService

  ) { }

  cargarMedicos() {
    let url = URL_SERVICIOS + '/medico';
    return this.http.get(url)
        .map( (resp: any) => {
          this.totalRegistros = resp.total;
          return resp.medicos;
        });
  }

  buscarMedicos( termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;
    return  this.http.get(url)
            .map( (resp: any) => resp.medicos);
  }

  borrarMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
        .map(resp => {
          swal('Medico Borrado', 'Medico borrado correctamente', 'success');
          return true;
        });
  }

  guardarMedico( medico: Medico) {
    let url = URL_SERVICIOS + '/medico';
    // si existe el id del medico es porque estoy actualizando, sino... estoy creando
    if (medico._id) {
      // actualizando
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put( url, medico)
              .map( (resp: any) => {
                swal('Medico Actualizado', medico.nombre, 'success');
                return resp.medico;
              });
    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, medico)
            .map( (resp: any) => {
            swal('Medico Creado', medico.nombre, 'success');
            return resp.medico;
          });
        }
  }

  cargarMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id;
    return this.http.get(url)
            .map(( resp: any) => resp.medico);
  }
}


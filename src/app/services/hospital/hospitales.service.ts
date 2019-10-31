import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hospital } from '../../models/hospital.model';
import { URL_SERVICIOS } from '../../config/config';
import { Usuario } from '../../models/usuario.model';

import swal from 'sweetalert';
import { APP_ROUTES } from '../../app.routes';
import { UsuarioService } from '../usuario/usuario.service';


@Injectable({
  providedIn: 'root'
})
export class HospitalesService {
  public hospital: Hospital;
  public token: string;
  public usuario: Usuario;
  public totalHospitales: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService

  ) { }


  cargarHospitales(desde: number = 0) {
    const url = URL_SERVICIOS + '/hospital?desde=' + desde;
    return this.http.get(url)
          .map( (resp: any) => {
            this.totalHospitales = resp.total;
            return resp.hospitales;
          });
  }

  obtenerHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get(url)
          .map( (resp: any) => resp.hospital);

  }

  borrarHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
            .map( resp => swal('Hospital Borrado', 'Eliminado correctamente', 'success'));

  }

  crearHopital( nombre: string) {

    let url = URL_SERVICIOS + '/hospital';
    url += '?token=' + this._usuarioService.token;

    return this.http.post(url, {nombre})
            .map((resp: any) => resp.hospital);

  }

  actualizarHospital( hospital: Hospital) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, hospital)
          .map( (resp: any) => {
            swal('Hospital Actualizado', hospital.nombre, 'success');
            return resp.hospital; 
          });
  }

  buscarHospital( termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
        return this.http.get(url)
              .map( (resp: any) => resp.hospitales);
  }

}


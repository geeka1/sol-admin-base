import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { MedicoService } from '../../services/medico/medico.service';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public http: HttpClient
  ) {
    activatedRoute.params
        .subscribe(params => {
          let termino = params['termino'];
          console.log('Termino de busqueda', termino);
          this.buscar(termino);
        });
   }

  ngOnInit() {
  }

  buscar( termino: string) {
    let url = URL_SERVICIOS + '/busqueda/todo/' + termino;
    this.http.get(url)
        .subscribe( (resp: any) => {
          console.log('Resp de buscar....', resp);
          this.hospitales = resp.hospitales;
          this.usuarios = resp.usuarios;
          this.medicos = resp.medicos;
        });

  }

}

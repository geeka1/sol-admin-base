import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _medicoService: MedicoService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this._medicoService.cargarMedicos()
        .subscribe( medicos => {
          console.log('Respuesta al cargar Medicos', medicos);
          this.medicos = medicos;
        });
  }
  buscarMedicos( termino: string) {
    if (termino.length <= 0 ) {
       this.cargarMedicos();
       return;
    }

    this._medicoService.buscarMedicos(termino)
        .subscribe( medicos => {
          this.medicos = medicos;
          console.log('Medicos encontrados con la busqueda..', this.medicos);
        });
  }

  borrarMedico(medico: Medico) {

    this._medicoService.borrarMedico(medico._id)
        .subscribe( () => this.cargarMedicos());

  }
}

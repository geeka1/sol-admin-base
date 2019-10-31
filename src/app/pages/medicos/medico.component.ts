import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { MedicoService } from '../../services/service.index';
import { HospitalesService } from '../../services/service.index';
import { Medico } from '../../models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';


@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html'
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(
    public _medicoService: MedicoService,
    public _hospitalService: HospitalesService,
    public  router: Router,
    public  activatedRoute: ActivatedRoute,
    public _modaluploadService: ModalUploadService
  ) {
    activatedRoute.params.subscribe(params => {
      // el nombre id lo saco de pages.routes
      let id = params['id'];

      if (id !== 'nuevo') {
        this.cargarMedico(id);
      }
   });
  }

  ngOnInit() {

    this._hospitalService.cargarHospitales()
        .subscribe(hospitales => this.hospitales = hospitales);
        // me subscribo a la notificacion del modal
    this._modaluploadService.notificacion
        .subscribe( resp => {
        console.log(resp);
        this.medico.img = resp.medico.img;
        });
  }

  guardarMedico(f: NgForm) {

    console.log('NgForm VALID', f.valid);
    console.log('NgForm VALUE', f.value);
    if (f.invalid) {
      return;
    }
    //es el medico que cree con el new

    this._medicoService.guardarMedico(this.medico)
        .subscribe( medico => {
          console.log(medico);
          this.medico._id = medico._id;
          this.router.navigate(['/medico', medico._id]);
        });
  }

  cambioHospital(id: string) {
    console.log('ID DEL HOSPITAL', id);
    this._hospitalService.obtenerHospital(id)
        .subscribe( hospital => {
          console.log('HOSPTIAL', hospital);
          this.hospital = hospital;
        });
  }

  cargarMedico( id: string) {
    this._medicoService.cargarMedico( id )
        .subscribe( medico => {
          this.medico = medico;
          // let nuevoMedico = new Medico();
          this.medico.hospital = medico.hospital._id;
          this.cambioHospital(this.medico.hospital);
        });
  }

  cambiarFoto() {
    this._modaluploadService.mostrarModal('medicos', this.medico._id);

  }

}

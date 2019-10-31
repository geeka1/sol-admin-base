import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalesService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;
  cargando: boolean = true;
  totalRegistros: number = 0;
  valorResp: boolean = false;


  constructor(
    public _hospitalesServices: HospitalesService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion
        .subscribe( () => this.cargarHospitales());
  }

  cargarHospitales() {
    this.cargando = true;
    this._hospitalesServices.cargarHospitales(this.desde)
        .subscribe((hospitales) => {
          console.log('Respuesta al cargar hospitales..', hospitales, 'Valor Respuesta', hospitales.ok);
          this.hospitales = hospitales;
          this.totalRegistros = hospitales.total;
          this.valorResp = hospitales.ok;
          this.cargando = false;
        });
    }

    cargarNombre() {
      // const ipAPI = '//api.ipify.org?format=json';

      // const inputValue = fetch(ipAPI)
      //   .then(response => response.json())
      //   .then(data => data.ip)

      // const { value: ipAddress } = await swal.fire({
      //   title: 'Enter your IP address',
      //   input: 'text',
      //   inputValue: inputValue,
      //   showCancelButton: true,
      //   inputValidator: (value) => {
      //     if (!value) {
      //       return 'You need to write something!'
      //     }
      //   }
      // })

      // if (ipAddress) {
      //   swal.fire(`Your IP address is ${ipAddress}`);
      // }


    }

    crearHospital( ) {
      swal({
        title: 'Crear hospital',
        text: 'Ingrese el nombre del hospital',
        content: 'input',
        icon: 'info',
        buttons: true,
        dangerMode: true
      }).then( (valor: string) => {
        if ( !valor || valor.length === 0) {
          return;
        }
        this._hospitalesServices.crearHopital(valor)
            .subscribe(() => this.cargarHospitales());
      });

    }

    actualizarImagen(hospital) {
      this._modalUploadService.mostrarModal('hospitales', hospital._id);

    }

    guardarHospital(hospital: Hospital) {

      this._hospitalesServices.actualizarHospital(hospital)
          .subscribe();

    }

    borrarHospital(hospital: Hospital) {
      this._hospitalesServices.borrarHospital(hospital._id)
          .subscribe( () => this.cargarHospitales());

    }

    buscarHospital(termino: string) {

      if (termino.length <= 0) {
        this.cargarHospitales();
        return;
      }
      this._hospitalesServices.buscarHospital(termino)
          .subscribe( (hospitales) => {
            this.hospitales = hospitales;
            console.log('Estos son los hospitales encontrados..', this.hospitales);

          });

    }

}

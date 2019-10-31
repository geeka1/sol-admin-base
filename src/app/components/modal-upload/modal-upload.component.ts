import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  // oculto: string = '';
  imagenSubir: File;
  imagenTemp: any;

  constructor(
    public _subirArchivoService: SubirArchivoService,
    public _modalUploadService: ModalUploadService,
  ) {
    console.log('Modal Listo');
  }

  ngOnInit() {
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;
    this._modalUploadService.ocultarModal();

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
  subirImagen() {
    // console.log('???');
    this._subirArchivoService.subirArchivo(this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id)
            .then( resp => {
              console.log('RESP al subir la imagen', resp );
              this._modalUploadService.notificacion.emit( resp );
              this.cerrarModal();

            })
            .catch( err => {
              console.log('Error en la carga');
            });

  }

}

import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuario'): any {

    let url = URL_SERVICIOS + '/img';

    if ( !img ) {
      return url + '/usuarios/xxx';
    }


    // si contiene la palabra https significa q es una img de google
    // asi q en ese caso no tengo q hacer nada
    if (img.indexOf('https') >= 0) {
      return img;

    }

    switch (tipo) {
      case 'usuario':
        url += '/usuarios/' + img;
        console.log('Paso por el pipe de usuario');
      break;

      case 'medico':
        url += '/medicos/' + img;
      break;

      case 'hospital':
        url += '/hospitales/' + img;
      break;

      default:
        console.log('Ese tipo de imagen no exite, usuarios, medicos, hospitales validos');
        url += '/usuarios/xxx';
    }
    console.log('URL devuelta por el PIPE...', url);
    return url ;
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';


@Injectable({
  providedIn: 'root'
})
export class LoginGardGuard implements CanActivate {
  
  constructor(public _usuarioService: UsuarioService,
    public router: Router
    ) {}
  canActivate() {
   console.log('Paso por el Login Guard');
   if (this._usuarioService.estaLogueado()) {
     console.log('Paso el Guard');
     return true;
   } else {
     console.log('Bloqueado por el guard');
     this.router.navigate(['/login']);
     return false;
   }
   // solchuVer
   // return true;
  }
}

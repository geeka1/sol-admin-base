import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import * as swal from 'sweetalert';

declare function init_plugins();
declare const gapi: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 // console.log('De esta manara asigno un valor booleano por defecto: [(ngModel)]="recuerdame"', forma.value.recuerdame);
  recuerdame: boolean = false;
  email: string;
  auth2: any;

  constructor( public router: Router, public _usuarioService: UsuarioService ) { }

  ngOnInit() {

    init_plugins();
    this.googleInit();
    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '267950133479-3gqeon3orv5gkshju57so736dfh3u2kv.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('btnGoogle'));

    });
  }
  attachSignin( element ) {
    // Yo recibo el googleUser de google, eso es lo que recibo
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
    let profile = googleUser.getBasicProfile();
    let token = googleUser.getAuthResponse().id_token;
    console.log('CONSOLE LOG: Informacion del profile...');
    console.log(profile);
    console.log('CONSOLE LOG: TOKEN');
    console.log(token);
    this._usuarioService.loginGoogle(token)
        .subscribe( () => window.location.href = '#/dashboard');
     });
  }

  ingresar( forma: NgForm) {
    // Si el form no es valido, hago que salga
    if (forma.invalid) {
      console.log('formulario no valido!!!');
      return;
    }
    let usuario = new Usuario(null, forma.value.email , forma.value.password);

    this._usuarioService.login(usuario, forma.value.recuerdame)
          .subscribe( resp => {
            console.log('Esta es la respuesta...');
            console.log(resp);
            console.log('Aqui termina la respuesta!!');
          });
    console.log('Es valida la forma? ', forma.valid);
    console.log('Que valor tiene la forma ???', forma.value);
    console.log('NgForm email: ', forma.value.email, 'Password: ', forma.value.password);
    console.log('De esta manara asigno un valor booleano por defecto: [(ngModel)]="recuerdame"', forma.value.recuerdame);
    this.router.navigate([ '/dashboard' ]);
  }

}

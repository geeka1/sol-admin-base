import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { validateConfig } from '@angular/router/src/config';
import swal from 'sweetalert';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router
  ) { }

  sonIguales( campo1: string, campo2: string) {

    return( g: FormGroup) => {
      let p1 = g.controls[campo1].value;
      let p2 = g.controls[campo2].value;

      if ( p1 === p2) {
        return null;
      } else {
        return {
          sonIguales: true
        };
      }
    }
  }

  ngOnInit() {
    init_plugins();
    this.forma = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, {validators: this.sonIguales('password', 'password2')});

    this.forma.setValue({
      nombre: 'Test',
      correo: 'test@test.com',
      password: '123',
      password2: '123',
      condiciones: true
    });

  }

  registrarUsuario() {

    if ( this.forma.invalid) {
      return;
    }
    if (!this.forma.value.condiciones) {
       console.log('Se deben aceptar las condiciones');
       swal("Informacion", "Se deben aceptar las condiciones", "warning");
      return;
    }

    let usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password
    );

    this._usuarioService.crearUsuario(usuario)
          .subscribe(resp => {
          console.log('Respuesta al crear el usuario...Resp DEL SUBSCRIBE ', resp);
          this.router.navigate(['/login']);
          });

    console.log('Este es el valor del formGroup cdo hace el ngsubumit', this.forma.value);
    console.log('Es valido el formulario??', this.forma.valid);
    console.log('Errores del form', this.forma.errors);
  }

}

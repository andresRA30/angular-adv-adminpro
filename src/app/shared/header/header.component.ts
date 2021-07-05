import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public usuario: Usuario;
  constructor(private usuarioService: UsuarioService, private router: Router) {
    this.usuario = usuarioService.usuario;

  }
  logout() {
    this.usuarioService.logout();
  }
  ngOnInit(): void {
  }
  buscar(termino: string) {
    if (termino.length === 0) {
      return;
    }
    this.router.navigateByUrl(`/dashboard/buscar/${termino}`)
  }
}

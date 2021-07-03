import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Hospital } from '../../../models/hospital.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;
  constructor(private UsuarioService: UsuarioService,
    private busquedasService: BusquedasService, private modalImagenService: ModalImagenService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.CargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => this.CargarUsuarios());
  }
  CargarUsuarios() {
    this.cargando = true;
    this.UsuarioService.cargarUsuario(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;

      })
  }
  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }
    this.CargarUsuarios();
  }
  buscar(termino: string) {
    if (termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }
    this.busquedasService.buscar('usuarios', termino)
      .subscribe((resultados: Usuario[]) => {
        this.usuarios = resultados;
      });
  }

  eliminarUsuario(usuario: Usuario) {
    if (usuario.uid === this.UsuarioService.uid) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }

    Swal.fire({
      title: 'Borrar Usuario?',
      text: `Esta apunto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.UsuarioService.eliminarUsuario(usuario).subscribe(resp => {
          this.CargarUsuarios();
          Swal.fire(
            'Usuario borrado',
            `${usuario.nombre} fue eliminado correctamente`,
            'success'
          );

        });
      }
    })
  }
  cambiarRole(usuario: Usuario) {
    this.UsuarioService.guardarUsuario(usuario)
      .subscribe(console.log)
  }
  abrirModal(usuario: Usuario) {
    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img)
  }
}

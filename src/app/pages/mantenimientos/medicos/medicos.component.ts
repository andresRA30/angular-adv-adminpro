import { Component, OnInit, OnDestroy } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from '../../../services/medico.service';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {
  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  public totalMedicos: number = 0;
  public desde: number = 0;
  public cargando: boolean = true;
  private imgSubs: Subscription
  constructor(private medicosService: MedicoService, private buscarService: BusquedasService, private modalImagenService: ModalImagenService
  ) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();

  }

  ngOnInit(): void {

    //this.medicosService.obtenerMedicoPorId()
    this.cargarMedicos();
    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => this.cargarMedicos());
  }
  cargarMedicos() {
    this.cargando = true;
    this.medicosService.cargarMedicos(this.desde)
      .subscribe(({ medicos, total }) => {
        this.cargando = false;
        this.medicos = medicos;
        this.medicosTemp = medicos;
        this.totalMedicos = total
      })
  }
  cambiarPagina(valor: number) {
    this.desde += valor;
    console.log(this.desde)
    if (this.desde < 0) {
      console.log('menor');
      this.desde = 0;
    } else if (this.desde >= this.totalMedicos) {

      this.desde -= valor;
    }
    this.cargarMedicos();

  }
  buscar(termino: string) {
    if (termino.length === 0) {
      this.medicos = this.medicosTemp

    } else {
      this.buscarService.buscar('medicos', termino)
        .subscribe(resp => {
          this.medicos = resp;

        })
    }

  }
  eliminarHospital(medico: Medico) {

    Swal.fire({
      title: 'Borrar Medico?',
      text: `Esta apunto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicosService.borrarMedico(medico._id)
          .subscribe(resp => {
            this.cargarMedicos();
            Swal.fire(
              'Hospital borrado',
              `${medico.nombre} fue eliminado correctamente`,
              'success'
            );

          });
      }
    })
  }
  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img)

  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CargarHospital } from '../../../interfaces/cargar-hospitales.interface';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {
  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando: boolean = true;
  public desde: number = 0;
  public totalHospitales: number = 0;
  private imgSubs: Subscription
  constructor(private hospitalService: HospitalService, private modalImagenService: ModalImagenService, private busquedaService: BusquedasService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => this.cargarHospitales());
  }
  cargarHospitales() {
    // console.log(this.desde)
    this.cargando = true;
    this.hospitalService.cargarHospital(this.desde).subscribe(({ hospitales, total }) => {
      this.cargando = false;
      this.hospitales = hospitales;
      this.hospitalesTemp = hospitales;
      this.totalHospitales = total;
    }
    )
  }
  cambiarPagina(valor: number) {

    this.desde += valor;

    if (this.desde < 0) {
      console.log('menor');
      this.desde = 0;
    } else if (this.desde >= this.totalHospitales) {

      this.desde -= valor;
    }
    this.cargarHospitales();
  }
  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe(resp => {
        Swal.fire('Actualizado', hospital.nombre, 'success')
      })
  }
  eliminarHospital(hospital: Hospital) {

    Swal.fire({
      title: 'Borrar Hospital?',
      text: `Esta apunto de borrar a ${hospital.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.borrarHospital(hospital._id).subscribe(resp => {
          this.cargarHospitales();
          Swal.fire(
            'Hospital borrado',
            `${hospital.nombre} fue eliminado correctamente`,
            'success'
          );

        });
      }
    })
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    })
    if (value.trim().length > 0) {
      this.hospitalService.crearHospital(value)
        .subscribe((resp: any) => {
          this.cargarHospitales();
          Swal.fire('Guardado', value, 'success')
        })
    }
  }
  abrirModal(hospital: Hospital) {
    console.log(hospital)
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img)

  }
  buscar(termino: string) {
    if (termino.length === 0) {
      this.hospitales = this.hospitalesTemp;
    } else {
      this.busquedaService.buscar('hospitales', termino)
        .subscribe(resp => {

          this.hospitales = resp;
        })
    }
  }

}

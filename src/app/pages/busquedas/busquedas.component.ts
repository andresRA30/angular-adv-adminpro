import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusquedasService } from '../../services/busquedas.service';
import { Usuario } from '../../models/usuario.model';
import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';

@Component({
  selector: 'app-busquedas',
  templateUrl: './busquedas.component.html',
  styles: [
  ]
})
export class BusquedasComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public hospitales: Hospital[] = [];
  public medicos: Medico[] = []
  constructor(private activatedRoute: ActivatedRoute, private busquedasService: BusquedasService) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(({ termino }) => this.busquedaGlobal(termino))
  }
  busquedaGlobal(termino: string) {
    this.busquedasService.buscarGlobal(termino)
      .subscribe((resp: any) => {
        this.usuarios = resp.usuarios;
        this.hospitales = resp.hospitales;
        this.medicos = resp.medicos;
      })
  }
  abrirMedico(medico: Medico) {
    console.log(medico);
  }
}

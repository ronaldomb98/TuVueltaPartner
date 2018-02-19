import { Component, OnInit } from '@angular/core';
import { DomiciliosActivosPage } from '../domicilios-activos/domicilios-activos';
import { DomiciliosDisponiblesPage } from '../domicilios-disponibles/domicilios-disponibles';
import { AuthProvider } from '../../providers/auth/auth';
import { ESTADOS_USUARIO } from '../../config/EstadosUsuario';
import { DbProvider } from '../../providers/db/db';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { EquipmentPage } from '../equipment/equipment';
import { localStorageConstants } from '../../config/LocalstorageConstants';


@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage implements OnInit {

  tab1: any;
  tab2: any;
  public authState: boolean;
  public isDisabledToggle: boolean;

  constructor(
    private navCtrl: NavController,
    public authProvider: AuthProvider,
    private dbProvider: DbProvider
  ) {
    this.tab1 = DomiciliosActivosPage;
    this.tab2 = DomiciliosDisponiblesPage;
  }

  ngOnInit() {
    this.loadAuthState();
  }

  loadAuthState() {
    this.authState = this.authProvider.userState == ESTADOS_USUARIO.Activo
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrincipalPage');
  }

  updateState(event) {
    console.log(event)
    console.log("updating state")
    if (event) {
      this.navCtrl.setRoot(EquipmentPage).then(() => {
        this.navCtrl.popToRoot();
      })
      return
    }
    let uid = this.authProvider.currentUserUid;
    this.dbProvider.objectUserInfo(uid).update({
      Estado: ESTADOS_USUARIO.Inactivo
    })
    this.isDisabledToggle = true;
    
    
      
  }

}

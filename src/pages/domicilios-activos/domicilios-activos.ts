import { Component } from "@angular/core";
import { DbProvider } from "../../providers/db/db";
import { Subscription } from "rxjs/Subscription";
import { AuthProvider } from "../../providers/auth/auth";
import { ESTADOS_ERVICIO } from "../../config/EstadosServicio";
import { ESTADOS_USUARIO } from "../../config/EstadosUsuario";
import {
  AlertController,
  AlertOptions,
  AlertButton,
  Alert
} from "ionic-angular";
import { DomiciliosProvider } from "../../providers/domicilios/domicilios";
import { DistancematrixProvider } from "../../providers/distancematrix/distancematrix";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { LoadingProvider } from "../../providers/loading/loading";

@Component({
  selector: "page-domicilios-activos",
  templateUrl: "domicilios-activos.html"
})

export class DomiciliosActivosPage implements OnInit {
  public confirmCompra: Alert;
  public currentTime: number = 0;
  public isUpdating: boolean = false;
  private intervalUpdatePosition;
  private intervalVisibility;
  public isActive = this.authProvider.userState == ESTADOS_USUARIO.Activo;

  constructor(
    private dbProvider: DbProvider,
    private authProvider: AuthProvider,
    private alertCtrl: AlertController,
    public domiciliosProvider: DomiciliosProvider,
    private distanceMatrixProvider: DistancematrixProvider,
    private loadingProvider: LoadingProvider
  ) {}

  ngOnInit() {
    this.clockInterval();
  }

  clockInterval() {
    this.intervalVisibility = setInterval(() => {
      this.currentTime = new Date().getTime();
      this.visibility();
    }, 1000);
  }

  visibility() {
    if (this.domiciliosProvider.pendingSolicitud) {
      this.domiciliosProvider.pendingSolicitud.forEach(solicitud => {
        const date = this.currentTime;
        const creationDate = solicitud.key;
        const minDistancia = this.domiciliosProvider.reglasActivos.RazonDeCambio.Distancia;
        const timeExtend = this.domiciliosProvider.reglasActivos.RazonDeCambio.Tiempo;
        const timeHasPass = date - creationDate;
        const visibility = timeHasPass * minDistancia / timeExtend;
        solicitud.visibility = visibility;
      });

      if (!this.isUpdating) {
        this.udpateDistFromInitSrvcPoint();
        this.isUpdating = true;
      }
    }
  }

  loadConfirm(service) {
    const cancelButton: AlertButton = {
      text: "Cancelar",
      role: "cancel"
    };
    const confirmButton: AlertButton = {
      text: "Comprar",
      handler: () => {
        this.changeState(service);
      }
    };
    let options: AlertOptions = {
      title: "Confirmar Compra",
      message: "¿Desea confirmar la compra de esta solicitud?",
      buttons: [cancelButton, confirmButton]
    };
    this.confirmCompra = this.alertCtrl.create(options);
    this.confirmCompra.present();
  }

  udpateDistFromInitSrvcPoint() {
    if (this.domiciliosProvider.reglasActivos) {
      this.intervalUpdatePosition = setInterval(() => {
        this.domiciliosProvider.getDistance();
      }, this.domiciliosProvider.reglasActivos.TiempoActualizarPosicion);
    }
  }

  ionViewWillUnload() {
    /* this.domiciliosProvider.sub.unsubscribe(); */
    clearInterval(this.intervalUpdatePosition);
    clearInterval(this.intervalVisibility);
    console.log("unsuscribiendo solicitudes pendientes");
    console.log("DomiciliosActivosPage ionViewWillUnload");
  }
  ionViewDidLeave() {
    console.log("DomiciliosActivosPage ionViewDidLeave");
  }
  ionViewWillLeave() {
    console.log("DomiciliosActivosPage ionViewWillLeave");
  }

  canBuyService(service): boolean {
    const user_id: string = service.payload.val().user_id;
    //alert(`Analizando si puede comprar solicitud del cliente ${user_id}`)
    const customConfig = this.domiciliosProvider.globalConfig.Usuarios[user_id];
    if (customConfig) {
      if (customConfig.CantSrvcQuePuedeComprarMensajero > 0) {
        const solicitudesByClient: any[] = this.domiciliosProvider.inProccessSolicitud.filter(
          _solicitud => {
            if (_solicitud.payload.val().user_id == user_id) {
              return _solicitud;
            }
          }
        );
        if (
          customConfig.CantSrvcQuePuedeComprarMensajero >
          solicitudesByClient.length
        ) {
          return true;
        }
        this.notifyCantBuyService(
          customConfig.CantSrvcQuePuedeComprarMensajero
        );
        return false;
      }
      this.notifyCantBuyService(customConfig.CantSrvcQuePuedeComprarMensajero);
      return false;
    }
    return true;
  }

  notifyCantBuyService(maxServices: number) {
    const toast = this.loadingProvider.createUpdatedToast(
      3000,
      `Solo puedes comprar ${maxServices} servicios de este cliente`
    );
    toast.present();
  }

  changeState(service) {
    const canBuyService: boolean = this.canBuyService(service);
    if (!canBuyService) {
      return;
    }

    let _key = service.key;
    let _uid = this.authProvider.currentUserUid;
    let date = new Date().getTime();

    this.dbProvider
      .objectSolicitud(_key)
      .update({
        Estado: ESTADOS_ERVICIO.EnProceso,
        Motorratoner_id: _uid,
        EnProceso: true,
        fechaCompra: date
      })
      .then(res => {
        return this.dbProvider.objectLogSolicitud(_key, date).update({
          Estado: ESTADOS_ERVICIO.EnProceso,
          Motorratoner_id: _uid
        });
      })
      /* .then(res => {
        return this.dbProvider.objectLogCreditoRetiro(_uid, date).update({
          servicio_id: _key,
          GananciaMensajero: GananciaMensajero
        })
      }) */
      .catch(err => {
        console.log(err);
      });
  }
}

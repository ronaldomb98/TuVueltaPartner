import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FirebaseAuth, User } from '@firebase/auth-types';
import { AuthPage } from '../pages/auth/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../providers/auth/auth';
import { Subscription } from 'rxjs/Subscription';
import { DbProvider } from '../providers/db/db';
import { CompleteRegistrationPage } from '../pages/complete-registration/complete-registration';
import { PrincipalPage } from '../pages/principal/principal';
import { PushNotificationProvider } from '../providers/push-notification/push-notification';
import { RetirarPage } from '../pages/retirar/retirar';
import { ESTADOS_USUARIO } from '../config/EstadosUsuario';
import { UsuarioBloqueadoPage } from '../pages/usuario-bloqueado/usuario-bloqueado';
import { ROLES } from '../config/Roles';
import { NoMensajeroRolPage } from '../pages/no-mensajero-rol/no-mensajero-rol';
import { DomiciliosProvider } from '../providers/domicilios/domicilios';
import { HistoryPage } from '../pages/history/history';
import { LocatorProvider } from '../providers/locator/locator';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = AuthPage;
  userDataSub: Subscription = new Subscription();
  pages: Array<{ title: string, component: any }>;
  public _userInfo;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public angularFireAuth: AngularFireAuth,
    public loadingCtrl: LoadingController,
    public menuController: MenuController,
    public authProvider: AuthProvider,
    public dbProvider: DbProvider,
    public pushNotifications: PushNotificationProvider,
    public domiciliosProvider: DomiciliosProvider,
    private locationProvider: LocatorProvider
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: PrincipalPage },
      { title: 'Retirar', component: RetirarPage },
      { title: 'Mi Cuenta', component: CompleteRegistrationPage },
      { title: 'Historial', component: HistoryPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.pushNotifications.init_notifications();
      this.checkLog();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  public signOut() {
    this.locationProvider.stopWatchingLocation();
    console.log(this.domiciliosProvider.sub != undefined)
    clearInterval(this.domiciliosProvider.intervalChangeState);
    if (this.domiciliosProvider.sub != undefined) {
      this.domiciliosProvider.sub.unsubscribe();
    }

    if (this.domiciliosProvider.subInProcces != undefined) {
      this.domiciliosProvider.subInProcces.unsubscribe();
    }

    if (this.domiciliosProvider.subReglasActivos != undefined) {
      this.domiciliosProvider.subReglasActivos.unsubscribe();
    }

    if (this.domiciliosProvider.subListClients != undefined) {
      this.domiciliosProvider.subListClients.unsubscribe();
    }

    this.authProvider.userInfo = null;
    this.userDataSub.unsubscribe();
    this.dbProvider.subGanancias.unsubscribe();
    this.nav.setRoot(AuthPage).then(() => {
      this.nav.popToRoot().then(() => {
        setTimeout(() => {
          this.authProvider.signOut();
        }, 100)
      });
    });
  }



  public checkLog(): void {
    this.angularFireAuth.authState.subscribe((_authState: User) => {
      this.authProvider.currentUserUid = _authState ? _authState.uid : '';

      let loading = this.loadingCtrl.create({ content: 'Cargando Credenciales...', spinner: 'dots' })
      /* loading.present() */
      const _flag: boolean = _authState ? true : false;
      this.authProvider.isLoggedIn = _flag;
      this.menuController.enable(_flag);

      // If user is not logged in
      if (!_flag) {
        this.nav.setRoot(AuthPage).then(() => {
          loading.dismiss()
          this.userDataSub.unsubscribe();
          this.locationProvider.stopWatchingLocation();
          this.nav.popToRoot();
        })
      } else {
        // If user is logged in

        let uid = _authState.uid;
        this.userDataSub = this.dbProvider.objectUserInfo(uid)
          .snapshotChanges()
          .subscribe(res => {
            this.locationProvider.stopWatchingLocation();
            clearInterval(this.domiciliosProvider.intervalChangeState);
            const userInfo = this.authProvider.userInfo = res.payload.val();
            if (userInfo) {
              if (userInfo.Rol != ROLES.Mensajero) {
                this.nav.setRoot(NoMensajeroRolPage).then(() => {
                  this.nav.popToRoot()
                  loading.dismiss()
                })
              } else if (userInfo.Estado == ESTADOS_USUARIO.Bloqueado) {
                this.authProvider.userState = userInfo.Estado;
                this.nav.setRoot(UsuarioBloqueadoPage).then(() => {
                  this.nav.popToRoot()
                  loading.dismiss()
                })
              } else {
                this.authProvider.userState = userInfo.Estado;
                this.dbProvider.loadGananciasMensajero();
                
                if (this.authProvider.userState == ESTADOS_USUARIO.Activo) {
                  this.domiciliosProvider.loadInProccesSolicitud();
                  this.domiciliosProvider.loadReglasActivos();
                  this.domiciliosProvider.loadClientes();
                  this.domiciliosProvider.loadGlobalConfig();
                  this.locationProvider.startWatchingLocation();
                }
                if (!this.dbProvider.isUpdatingUserInfo) {
                  this.nav.setRoot(PrincipalPage).then(() => { //  PrincipalPage
                    this.nav.popToRoot()
                    loading.dismiss()
                  })
                }
              }
            } else {
              this.nav.setRoot(CompleteRegistrationPage).then(() => {
                this.nav.popToRoot()
                loading.dismiss()
              })
            }
          }, err => {
            alert("Hubo un error al suscribir la informacion del usuario actual")
          }, () => {

          })
        console.log(this.userDataSub)
      }
    })
  }
}

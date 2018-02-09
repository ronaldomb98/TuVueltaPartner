import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = AuthPage;
  userDataSub: Subscription = new Subscription();
  pages: Array<{title: string, component: any}>;
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
    public domiciliosProvider: DomiciliosProvider
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
    console.log(this.domiciliosProvider.sub != undefined)
    if(this.domiciliosProvider.sub != undefined){
      this.domiciliosProvider.sub.unsubscribe();
    }
    
    if (this.domiciliosProvider.subInProcces != undefined){
      this.domiciliosProvider.subInProcces.unsubscribe();
    }

    if (this.domiciliosProvider.subReglasActivos != undefined){
      this.domiciliosProvider.subReglasActivos.unsubscribe();
    }

    if (this.domiciliosProvider.subListClients != undefined){
      this.domiciliosProvider.subListClients.unsubscribe();
    }

    this.authProvider.userInfo = null;
    this.userDataSub.unsubscribe();
    this.dbProvider.subGanancias.unsubscribe();
    this.nav.setRoot(AuthPage).then(()=>{
      this.nav.popToRoot().then(()=>{
        setTimeout(() =>{
          this.authProvider.signOut();
        },100)
      });
    });
  }



  public checkLog(){
    this.angularFireAuth.authState.subscribe(_authState => {
      this.authProvider.currentUserUid = _authState ?  _authState.uid: '';
      let loading = this.loadingCtrl.create({content: 'Cargando Credenciales...', spinner: 'dots'})
      loading.present()

      const _flag: boolean = _authState ? true : false;
      
      this.authProvider.isLoggedIn = _flag;
      this.menuController.enable(_flag);
      if (!_flag) {
        this.nav.setRoot(AuthPage).then(()=>{
          loading.dismiss()
          this.userDataSub.unsubscribe();
          this.nav.popToRoot()
        })
      }else {
        let uid = _authState.uid;

        /* let test = this.dbProvider.testobjectUserInfo(uid).toPromise()
        console.log("Antes de la promesa")
        test.then(res => {
          console.log("Dentro de la promesa")
          console.log(res)
          loading.dismiss()
          return 0
        }).catch(err => {
          console.log("Dentro de la promesa")
          console.log(err.message)
          loading.dismiss()
        }) */
        
        this.userDataSub = this.dbProvider.objectUserInfo(uid)
          .snapshotChanges()
          .subscribe(res => {
            
            this.authProvider.userInfo = res.payload.val();
            if (this.authProvider.userInfo && this.authProvider.userInfo.Rol != ROLES.Mensajero){
              this.nav.setRoot(NoMensajeroRolPage).then(()=>{ //  EquipmentPage
                this.nav.popToRoot()
                loading.dismiss()
              })
            }else if(this.authProvider.userInfo && this.authProvider.userInfo.Estado == ESTADOS_USUARIO.Bloqueado){
              this.authProvider.userState = this.authProvider.userInfo.Estado;
              this.nav.setRoot(UsuarioBloqueadoPage).then(()=>{ //  EquipmentPage
                this.nav.popToRoot()
                loading.dismiss()
              })
            }else if (this.authProvider.userInfo) {
              console.log(this.authProvider.userInfo)
              this.authProvider.userState = this.authProvider.userInfo.Estado;
              this.dbProvider.loadGananciasMensajero();
              if (this.authProvider.userState == ESTADOS_USUARIO.Activo) {
                this.domiciliosProvider.loadInProccesSolicitud();
                this.domiciliosProvider.loadReglasActivos();
                this.domiciliosProvider.loadClientes();
              }
              
              
              this.nav.setRoot(PrincipalPage).then(()=>{ //  PrincipalPage
                this.nav.popToRoot()
                loading.dismiss()
              })
            } else {
              this.nav.setRoot(CompleteRegistrationPage).then(()=>{
                this.nav.popToRoot()
                loading.dismiss()
              })
            }
          },err => {

          }, ()=> {
            
          })
          console.log(this.userDataSub)      
      }
    })
  }
}

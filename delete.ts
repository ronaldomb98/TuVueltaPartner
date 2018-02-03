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
import { EquipmentPage } from '../pages/equipment/equipment';
import { PrincipalPage } from '../pages/principal/principal';
import { PushNotificationProvider } from '../providers/push-notification/push-notification';
import { RetirarPage } from '../pages/retirar/retirar';
import { ESTADOS_USUARIO } from '../config/EstadosUsuario';
import { UsuarioBloqueadoPage } from '../pages/usuario-bloqueado/usuario-bloqueado';
import { ROLES } from '../config/Roles';
import { NoMensajeroRolPage } from '../pages/no-mensajero-rol/no-mensajero-rol';
import { Network } from '@ionic-native/network';
import { NoInternetPage } from '../pages/no-internet/no-internet';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = AuthPage;
  userDataSub: Subscription = new Subscription();
  pages: Array<{title: string, component: any}>;
  public subAuthState:Subscription = new Subscription();
  public _userInfo;
  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public angularFireAuth: AngularFireAuth,
    public loadingCtrl: LoadingController,
    public menuController: MenuController,
    public authProvider: AuthProvider,
    private dbProvider: DbProvider,
    public pushNotifications: PushNotificationProvider,
    private network: Network
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: PrincipalPage },
      { title: 'Retirar', component: RetirarPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.pushNotifications.init_notifications();
      if (this.network.type != 'none'){
        this.checkLog();
      }else {
        this.popNoInternet();
      }
      this.init();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  public signOut() {
    this._userInfo = null;
    this.userDataSub.unsubscribe();
    this.nav.setRoot(AuthPage).then(()=>{
      this.nav.popToRoot().then(()=>{
        setTimeout(() =>{
          this.authProvider.signOut();
        },100)
      });
    });
  }

  public init(){
    console.log("Hola care vergas")
    alert(this.network.type)
    this.network.onConnect().subscribe((response)=>{
      this.closeConnections();
      this.checkLog();
      
    }, err => {
      alert("Error onConnect")
      console.log(err.message)
    })

    this.network.onDisconnect().subscribe(()=> {
      this.closeConnections();
      this.popNoInternet();
    });

  }

  public closeConnections(){
    this.loading.dismiss();
    this.subAuthState.unsubscribe();
    this.userDataSub.unsubscribe();
  }

  public popNoInternet(){
    this.nav.setRoot(NoInternetPage).then(()=> {
      this.nav.popToRoot;
    })
  }
  public loading = this.loadingCtrl.create({content: 'Cargando Credenciales...', spinner: 'dots'})
  public checkLog(){
    
    alert("checking log")
    this.subAuthState = this.angularFireAuth.authState.subscribe(_authState => {
      this.authProvider.currentUserUid = _authState ?  _authState.uid: '';
      this.loading.dismiss();
      
      

      const _flag: boolean = _authState ? true : false;
      this.authProvider.isLoggedIn = _flag;
      this.menuController.enable(_flag);
      if (!_flag) {
        this.loading.present();
        this.nav.setRoot(AuthPage).then(()=>{
          this.loading.dismiss();
          this.userDataSub.unsubscribe();
          this.nav.popToRoot()
        })
      }else {
        let uid = _authState.uid;
       
        
        this.userDataSub = this.dbProvider.objectUserInfo(uid)
          .snapshotChanges()
          .subscribe(res => {
            this.loading.present();
            this._userInfo = res.payload.val();
            if (this._userInfo && this._userInfo.Rol != ROLES.Mensajero){
              this.nav.setRoot(NoMensajeroRolPage).then(()=>{ //  EquipmentPage
                this.nav.popToRoot()
                this.loading.dismiss();
              })
            }else if(this._userInfo && this._userInfo.Estado == ESTADOS_USUARIO.Bloqueado){
              this.authProvider.userState = this._userInfo.Estado;
              this.nav.setRoot(UsuarioBloqueadoPage).then(()=>{ //  EquipmentPage
                this.nav.popToRoot()
                this.loading.dismiss();
              })
            }else if (this._userInfo) {
              console.log(this._userInfo)
              this.authProvider.userState = this._userInfo.Estado;
              this.nav.setRoot(PrincipalPage).then(()=>{ //  EquipmentPage
                this.nav.popToRoot()
                this.loading.dismiss();
              })
            } else {
              this.nav.setRoot(CompleteRegistrationPage).then(()=>{
                this.nav.popToRoot()
                this.loading.dismiss();
              })
            }
          },err=> {
            this.loading.dismiss();
            alert(err.message)
            alert("No se pudo cargar los datos")
          }, ()=> {
            this.loading.dismiss();
          })
      }
    },err => {
      this.loading.dismiss();
    }, ()=>{
      this.loading.dismiss()
    })
  }
}

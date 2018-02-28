import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthProvider } from '../providers/auth/auth';
// Firebase Config
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from '../config/environment';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { LoadingProvider } from '../providers/loading/loading';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { DbProvider } from '../providers/db/db';
import { AuthPage } from '../pages/auth/auth';
import { CompleteRegistrationPage } from '../pages/complete-registration/complete-registration';
import { EquipmentPage } from '../pages/equipment/equipment';
import { PrincipalPage } from '../pages/principal/principal';
import { DomiciliosActivosPage } from '../pages/domicilios-activos/domicilios-activos';
import { DomiciliosDisponiblesPage } from '../pages/domicilios-disponibles/domicilios-disponibles';
import { SolicitudInProcessDetailsPage } from '../pages/solicitud-in-process-details/solicitud-in-process-details';
import { PushNotificationProvider } from '../providers/push-notification/push-notification';
import { OneSignal } from '@ionic-native/onesignal';
import { RetirarPage } from '../pages/retirar/retirar';
import { UsuarioBloqueadoPage } from '../pages/usuario-bloqueado/usuario-bloqueado';
import { NoMensajeroRolPage } from '../pages/no-mensajero-rol/no-mensajero-rol';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { NoInternetPage } from '../pages/no-internet/no-internet';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { DomiciliosProvider } from '../providers/domicilios/domicilios';
import { HttpClientModule } from '@angular/common/http';
import { DistancematrixProvider } from '../providers/distancematrix/distancematrix';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { HistoryPage } from '../pages/history/history';
import { HistoryDetailPage } from '../pages/history-detail/history-detail';
import { LocatorProvider } from '../providers/locator/locator';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
@NgModule({
  declarations: [
    MyApp,
    ListPage,
    PrincipalPage, 
    DomiciliosActivosPage, 
    DomiciliosDisponiblesPage,
    ResetPasswordPage,
    AuthPage,
    CompleteRegistrationPage,
    EquipmentPage,
    SolicitudInProcessDetailsPage,
    RetirarPage,
    UsuarioBloqueadoPage,
    NoMensajeroRolPage,
    NoInternetPage,
    LoginPage,
    SignupPage,
    HistoryPage,
    HistoryDetailPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig), // imports firebase/app needed for everything
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListPage,
    PrincipalPage, 
    DomiciliosActivosPage, 
    DomiciliosDisponiblesPage,
    ResetPasswordPage,
    AuthPage,
    CompleteRegistrationPage,
    EquipmentPage,
    SolicitudInProcessDetailsPage,
    RetirarPage,
    UsuarioBloqueadoPage,
    NoMensajeroRolPage,
    NoInternetPage,
    LoginPage,
    SignupPage,
    HistoryPage,
    HistoryDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    OneSignal,
    
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    LoadingProvider,
    DbProvider,
    PushNotificationProvider,
    DomiciliosProvider,
    LaunchNavigator,
    DistancematrixProvider,
    LocatorProvider,
    BackgroundGeolocation,
    Geolocation,
  ]
})
export class AppModule {}

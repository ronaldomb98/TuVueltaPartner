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
import { NoAuthPage } from '../pages/no-auth/no-auth';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { DbProvider } from '../providers/db/db';
import { AuthPage } from '../pages/auth/auth';
import { CompleteRegistrationPage } from '../pages/complete-registration/complete-registration';
import { EquipmentPage } from '../pages/equipment/equipment';
import { PrincipalPage } from '../pages/principal/principal';
import { DomiciliosActivosPage } from '../pages/domicilios-activos/domicilios-activos';
import { DomiciliosDisponiblesPage } from '../pages/domicilios-disponibles/domicilios-disponibles';
@NgModule({
  declarations: [
    MyApp,
    ListPage,
    PrincipalPage, 
    DomiciliosActivosPage, 
    DomiciliosDisponiblesPage,
    NoAuthPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    AuthPage,
    CompleteRegistrationPage,
    EquipmentPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig), // imports firebase/app needed for everything
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListPage,
    PrincipalPage, 
    DomiciliosActivosPage, 
    DomiciliosDisponiblesPage,
    NoAuthPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    AuthPage,
    CompleteRegistrationPage,
    EquipmentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    LoadingProvider,
    DbProvider
  ]
})
export class AppModule {}

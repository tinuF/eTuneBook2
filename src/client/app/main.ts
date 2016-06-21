import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode, provide, SystemJsComponentResolver, ComponentResolver } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { APP_ROUTER_PROVIDERS } from './app.routes';
import { HTTP_PROVIDERS } from '@angular/http';
import {RuntimeCompiler} from '@angular/compiler'

import { AppComponent } from './app.component';

if ('<%= ENV %>' === 'prod') { enableProdMode(); }

bootstrap(AppComponent, [
  APP_ROUTER_PROVIDERS,
  {
    provide: ComponentResolver,
    useFactory: (r) => new SystemJsComponentResolver(r),
    deps: [RuntimeCompiler]
  },
  HTTP_PROVIDERS,
  provide(APP_BASE_HREF, { useValue: '<%= APP_BASE %>' })
]);

// In order to start the Service Worker located at "./worker.js"
// uncomment this line. More about Service Workers here
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
//
// if ('serviceWorker' in navigator) {
//   (<any>navigator).serviceWorker.register('./worker.js').then((registration: any) =>
//       console.log('ServiceWorker registration successful with scope: ', registration.scope))
//     .catch((err: any) =>
//       console.log('ServiceWorker registration failed: ', err));
// }

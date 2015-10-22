import {bootstrap, FORM_PROVIDERS, ELEMENT_PROBE_PROVIDERS} from 'angular2/angular2';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {App} from './components/app/app';

/*
bootstrap(App, [
  ROUTER_PROVIDERS,
  bind(ROUTER_PRIMARY_COMPONENT).toValue(App)
]);
*/

bootstrap(App, [
  FORM_PROVIDERS,
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  ELEMENT_PROBE_PROVIDERS
]);

import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
    //https://www.softwarearchitekt.at/post/2016/12/02/sticky-routes-in-angular-2-3-with-routereusestrategy.aspx
    handlers: { [key: string]: DetachedRouteHandle } = {};
    reusedRoutes: string[] = ['tunes', 'sets'];

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        //console.debug('CustomReuseStrategy:shouldDetach', route);
        //http://stackoverflow.com/questions/41280471/how-to-implement-routereusestrategy-shoulddetach-for-specific-routes-in-angular
        if (this.reusedRoutes.indexOf(route.routeConfig.path) > -1) {
            //console.log('detaching', route);
            return true;
        } else {
            //Problem bei der Wiederverwendung: Es stehen keine LifeCycle Hooks zur Verfügung.
            //Dies ist ein Problem überall dort wo renderABC() erneut laufen muss.
            //Wenn man die Detail-Views auch wieder verwenden wollte, müsste man in dieser Klasse hier
            //beim Umschalten der Route die Komponente benachrichtigen (Observable).
            return false; // zum Beispiel 'tunes/:id'
        }
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        //console.debug('CustomReuseStrategy:store', route, handle);
        this.handlers[route.routeConfig.path] = handle;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        //console.debug('CustomReuseStrategy:shouldAttach', route);
        return !!route.routeConfig && !!this.handlers[route.routeConfig.path];
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        //console.debug('CustomReuseStrategy:retrieve', route);
        if (!route.routeConfig) return null;
        return this.handlers[route.routeConfig.path];
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        //console.debug('CustomReuseStrategy:shouldReuseRoute', future, curr);
        return future.routeConfig === curr.routeConfig;
    }

}
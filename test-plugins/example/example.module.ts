/// <reference path="../includes.ts"/>
/// <reference path="example.globals.ts"/>
/// <reference path="page1.controller.ts"/>
/// <reference path="github.controller.ts"/>

namespace Example {

  export const exampleModule = angular
    .module(pluginName, [])
    .config(addRoutes)
    .run(addTabs)
    .run(addLogoutToUserDropdown)
    .controller("Example.Page1Controller", page1Controller)
    .controller("Example.Page2Controller", page2Controller)
    .name;

  function addRoutes($routeProvider: angular.route.IRouteProvider) {
    'ngInject';

    $routeProvider
      .when('/github', { templateUrl: UrlHelpers.join(Example.templatePath, 'github.html') })
      .when('/openshift', { templateUrl: UrlHelpers.join(Example.templatePath, 'page1.html') });
  }

  function addTabs(mainNavService: Nav.MainNavService): void {
    'ngInject';

    mainNavService.addItem({
      title: 'OpenShift OAuth',
      href: 'openshift',
    });

    mainNavService.addItem({
      title: 'GitHub',
      href: 'github',
    });
  }

  function addLogoutToUserDropdown(HawtioExtension: Core.HawtioExtension, $compile: ng.ICompileService,
    authService: Core.AuthService): void {
    'ngInject';

    HawtioExtension.add('hawtio-logout', ($scope: any) => {
      $scope.authService = authService;
      const template = '<li><a class="pf-c-dropdown__menu-item" href="#" ng-focus="authService.logout()">Logout ({{authService.username}})</a></li>';
      return $compile(template)($scope);
    });
  }

  // Google
  /*
  hawtioPluginLoader.registerPreBootstrapTask((next) => {
    GoogleOAuthConfig = {
      clientId: '520210845630-173pe9uuvejqvahls9td8b5n4nae0tvm.apps.googleusercontent.com',
      clientSecret: 'Uza-yS-E2Ph1eCcs6OZy-4ui',
      authenticationURI: 'https://accounts.google.com/o/oauth2/auth',
      scope: 'profile',
      redirectURI: 'http://localhost:9000'
    };
    next();
  }, true);
  */

  // Standard Keycloak server
  hawtioPluginLoader.registerPreBootstrapTask({
    name: 'ExampleKeycloakConfig',
    task: (next) => {
      HawtioKeycloak.config = {
        clientId: 'hawtio-client',
        url: 'http://localhost:8080/auth',
        realm: 'hawtio-demo',
        pkceMethod: 'S256'
      };
      next();
    }
  }, true);

  // openshift
  /*
  hawtioPluginLoader.registerPreBootstrapTask((next) => {
    OSOAuthConfig = {
      oauth_authorize_uri: "https://172.28.128.4:8443/oauth/authorize",
      oauth_client_id: "fabric8",
      logout_uri: ""
    };
    next();
  }, true);

  hawtioPluginLoader.registerPreBootstrapTask({
    name: 'test-init',
    depends: ['hawtio-oauth'],
    task: (next) => {
      let uri = new URI('https://172.28.128.4:8443/api/v1');
      uri.path('/api/v1/namespaces');
      let url = uri.toString();
      HawtioOAuth.authenticatedHttpRequest({
        url: uri.toString()
      }).done((data) => {
        log.debug("Got data: ", data);
        next();
      }).fail((xHr, textStatus, errorThrown) => {
        log.warn(textStatus, errorThrown);
        HawtioOAuth.doLogout();
      });
    }
  });
  */

  hawtioPluginLoader.addModule(pluginName);
}

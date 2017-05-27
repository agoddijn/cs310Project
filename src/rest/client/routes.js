angular.module('routes', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
        templateUrl: 'views/welcome.html'
    })
        .when('/map', {
        templateUrl: '/views/map.html',
        controller: 'MapController',
        controllerAs: 'mapC'
    })
        .when('/courses', {
        templateUrl: '/views/query.html',
        controller: 'QueryController',
        controllerAs: 'query'
    })
        .when('/rooms', {
        templateUrl: '/views/query.html',
        controller: 'QueryController',
        controllerAs: 'query'
    })
        .when('/scheduler', {
        templateUrl: '/views/scheduler.html',
        controller: 'SchedulerController',
        controllerAs: 'scheduler'
    });
    $locationProvider.html5Mode(true);
});
//# sourceMappingURL=routes.js.map
'use strict';


angular.module('application')
//  .factory('DailyResource', ['$resource', function($resource) {
//        console.log('in DailyResource')
//    return $resource(
//      '/daily/:action/:id',
//      { action: '@action', id: '@id' },
//      {
//        //create: { method: 'POST', params: {arrayObj: '@id'} }
//          create: { method: 'POST', params: {id: '@id'} }
//        //  update: { method: 'PUT', params: {id: '@id'} },
//
//      }
//    );
//  }]);
.factory('DailyResource', ['$resource', function($resource) {
        console.log('in DailyResource')
    return $resource(
        '/daily/:action/:id', {
            action: '@action',
            id: '@id'
        }, {
            findAll: { method: 'GET', isArray: true },   // same as query
            findAllWrapped: { method: 'GET', params: { action: 'findAllWrapped'} },
            find1: { method: 'GET', params: {id: '@id'} },
            update: { method: 'PUT', params: {id: '@id'} },
     //       create: { method: 'POST', params: {action: 'create'} }, // post for create, put for update,params: {id:'@id'} this forces action for sails controller
            create: { method: 'POST', params: {id: '@id'} }, // post for create, put for update,params: {id:'@id'} this forces action for sails controller
            createDefault: { method: 'POST'} // auto post object built in sails rest service

//        upsert: { method: 'PUT', params: {id: '@id'} }
        }
    )}]);
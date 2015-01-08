'use strict';

angular.module('tnMangalistApp')
  .controller('MainCtrl', function ($scope, $http, socket) {

    var invocation = new XMLHttpRequest();
    var url = 'https://www.mangaeden.com/ajax/login/?username=tnmanga&password=Mangalist1219';
        
    function callOtherDomain(){
      if(invocation) {
        invocation.open('GET', url, true);
        invocation.withCredentials = true;
        invocation.onreadystatechange = handler;
        invocation.send(); 
      };

    $scope.awesomeThings = [];
    $scope.mangas = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $http.get('https://www.mangaeden.com/api/list/[0]/ ').success(function(mangas){
      $scope.mangas = mangas;
      console.log("Got response: " + $scope.mangas.statusCode);
      console.log($scope.mangas);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });

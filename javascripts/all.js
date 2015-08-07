var app = angular.module('app', {});

app.controller('PeopleCtrl', function($scope,$http) {
  $scope.keyword = '';
  $scope.streetData = {};

  $http.get('https://tcgbusfs.blob.core.windows.net/blobfs/GetDisasterSummary.json').
  success(function(data, status, headers, config) {
    $scope.streetData = data.DataSet["diffgr:diffgram"][0].NewDataSet[0].CASE_SUMMARY;
     console.log($scope.streetData);

    });
 
  });


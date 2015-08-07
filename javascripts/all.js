var app = angular.module('app', {});

app.controller('PeopleCtrl', function($scope,$http) {
  $scope.keyword = '';
  $scope.streetData = {};
  $scope.taipeiArea=['中正區','大同區','中山區','松山區','大安區','萬華區','信義區','士林區','北投區','內湖區','南港區','文山區'];
  $http.get('https://tcgbusfs.blob.core.windows.net/blobfs/GetDisasterSummary.json').
  success(function(data, status, headers, config) {
    $scope.streetData = data.DataSet["diffgr:diffgram"][0].NewDataSet[0].CASE_SUMMARY;
     console.log($scope.streetData);
    
    });
 
  });


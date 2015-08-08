var app = angular.module('app', ['ngSanitize']);

app.controller('PeopleCtrl', function($scope,$http,$sce) {
  $scope.type='news';
  $scope.newsData = {};
  $scope.keyword = '';
  $scope.streetData = {};

  $scope.mapchange = function(){
    $scope.type='map';
    
    setTimeout(function(){ google.maps.event.trigger(map, 'resize'); }, 1000);
  };
  $scope.taipeiArea=['中正區','大同區','中山區','松山區','大安區','萬華區','信義區','士林區','北投區','內湖區','南港區','文山區'];
  $http.get('http://tonyq.org/kptaipei/GetDisasterSummary-20150808.php').
  success(function(data, status, headers, config) {
    $scope.streetData = data.DataSet["diffgr:diffgram"][0].NewDataSet[0].CASE_SUMMARY;
    });
  $http.get('https://tcgbusfs.blob.core.windows.net/blobfs/GetDisasterDecisionSummary.json').
  success(function(data, status, headers, config) {
    var thisdata= data.DataSet["diffgr:diffgram"][0].NewDataSet[0].DCSDisasterDecision;
    for(var i=0;thisdata.length>i;i++){
      thisdata[i].Decision[0] = thisdata[i].Decision[0].replace(new RegExp('\r?\n','g'), '<br />');
      // thisdata[i].Decision[0].replace(/\r\n/g,"<br />");
    }
    $scope.newsData = thisdata;
    });
  $scope.power =0;
  var mapOptions = { zoom: 15, center: new google.maps.LatLng(25.042355, 121.532904) };
  var map = new google.maps.Map( document.getElementById('mapCanvas') , mapOptions);
  d3.json("http://tonyq.org/kptaipei/GetDisasterSummary-20150808.php", function(data){
  var mapdata = data.DataSet["diffgr:diffgram"][0].NewDataSet[0].CASE_SUMMARY;
  var power =[];
  mapdata.forEach(function(d){
    if(d.Name[0] == '電力停電' && d.CaseComplete[0]=='false'){
      power.push(d);
    }
  });
  $scope.power = power.length;
    var overlay = new google.maps.OverlayView();

    overlay.onAdd = function() {
      var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
          .attr("class", "stations");
  // overlayMouseTarget
  // overlayLayer
      overlay.draw = function() {
        var projection = this.getProjection(),
            padding = 16;

        var marker = layer.selectAll("svg")
            .data(d3.entries(power))
            .each(transform) // update existing markers
            .enter().append("svg:svg")
              .each(transform)
              .attr("class", "marker");

        marker.append("svg:circle")
            .attr("r", 6)
            .attr("cx", padding)
            .attr("cy", padding);

            // .append("svg:title").text(function(d){
            //   console.log(d.value.CaseDescription[0]);
            //   return d.value.CaseDescription[0];

            // });

        marker.append("svg:text")
            .attr("x", padding + 7)
            .attr("y", padding)
            .attr("dy", ".31em")
            .text(function(d) {
     
          return d.value.CaseDescription[0]; });

        function transform(d) {
   
          d = new google.maps.LatLng(d.value.Wgs84Y [0], d.value.Wgs84X[0]);
          d = projection.fromLatLngToDivPixel(d);
        
          return d3.select(this)
              .style("left", (d.x - padding) + "px")
              .style("top", (d.y - padding) + "px");
        }
      };
    };
    overlay.setMap(map);

  });



  });

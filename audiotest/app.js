var app = angular.module('audiotest',['ngAudio'])

app.controller('audioDemo',['$scope', 'ngAudio', function($scope, ngAudio){
   $scope.audio = ngAudio.load('birdcall.mp3');
   $scope.spectrogram = {}
   $scope.spectrogram.src = "spectrogram.png";
   $scope.spectrogram.maxFreq = 20000;
   $scope.spectrogram.duration = 6.405875;
   $scope.spectrogram.height = 500;
   $scope.spectrogram.width = 500;

   $scope.getFreq = function(val){
       if ($scope.spectrogram.height && $scope.spectrogram.maxFreq) {
           var freq = $scope.getCoord(1,val);
           var ratio = 1 - freq / $scope.spectrogram.height;
           var val = (ratio * $scope.spectrogram.maxFreq/1000).toFixed(2);
           return (isNaN(val))? 0 + "kHz" : val +"kHz";
       }
       return 0;
   };

   $scope.getTime = function(val){
       if ($scope.spectrogram.width && $scope.spectrogram.duration) {
           var time = $scope.getCoord(0,val);
           var ratio = time / $scope.spectrogram.width;
           var val = (ratio * $scope.spectrogram.duration).toFixed(2);
           return (isNaN(val))? 0 + "s" : val+ "s";
       }
       else return 0;
   };

   function setDimmensions() {
       $scope.spectrogram.width = this.width
       $scope.spectrogram.height = this.height;
       $scope.canvas.width = this.width;
       $scope.canvas.height = this.height;
       $scope.progressBar.width = this.width;
       $scope.progressBar.height = this.height;
    }

    var spectrogramImage = new Image();
    spectrogramImage.onload = setDimmensions;
    spectrogramImage.src = $scope.spectrogram.src;

    $scope.canvas  = document.getElementById('spectrogram');
    $scope.context = $scope.canvas.getContext('2d');
    $scope.progressBar = document.getElementById('progress');
    $scope.progressContext = $scope.progressBar.getContext('2d');


    $scope.$watch('audio.currentTime', function(newval,oldval) {
        var ctx = $scope.progressContext
        ctx.lineWidth = 2;
        ctx.strokeStyle="#00FF00";
        ctx.clearRect(0, 0, $scope.spectrogram.width, $scope.spectrogram.height);
        var progress = $scope.audio.progress;
        var xpos = progress * $scope.spectrogram.width;
        ctx.beginPath();
        ctx.moveTo(xpos,0);
        ctx.lineTo(xpos,$scope.spectrogram.height);
        ctx.stroke();
    });


    $scope.context.clear = function() {
        $scope.context.fillStyle = '#fff';
        $scope.context.clearRect(0, 0,  $scope.spectrogram.width, $scope.spectrogram.height);
    };

    $scope.coords = {};
    $scope.coords.start = {};
    $scope.coords.end = {};

    $scope.getEventCoords = function($event) {
        var e = $event;
        var target = e.target;
        var pos = target.getBoundingClientRect();
        return {x : e.x - pos.left, y: e.y - pos.top};
    }

    $scope.moveBox = function ($event) {
        if (!$scope.canvas.isDrawing) {
           return;
        }

        $scope.context.clear();
        $scope.coords.end = {};

        $scope.coords.end = $scope.getEventCoords($event);

        var dx =  $scope.coords.end.x - $scope.coords.start.x;
        var dy =  $scope.coords.end.y - $scope.coords.start.y;

        $scope.context.beginPath();
        $scope.context.rect($scope.coords.start.x,$scope.coords.start.y,dx,dy);
        $scope.context.stroke();
    };

    $scope.startBox = function($event) {
        $scope.context.clear();
        $scope.canvas.isDrawing = true;

        $scope.coords.start = $scope.getEventCoords($event);
        $scope.canvas.style.cursor="crosshair";
    };

    $scope.endBox = function($event) {
        $scope.canvas.isDrawing = false;
        $scope.coords.end = {};

        $scope.coords.end = $scope.getEventCoords($event);

        var dx =  $scope.coords.end.x - $scope.coords.start.x;
        var dy =  $scope.coords.end.y - $scope.coords.start.y;

        $scope.context.beginPath();
        $scope.context.rect($scope.coords.start.x,$scope.coords.start.y,dx,dy);
        $scope.context.stroke();
        $scope.canvas.style.cursor="default";
    };

    $scope.getCoord = function(dim, val) {
        var start;
        var end;
        if($scope.coords.start && $scope.coords.start) {
            if (dim === 0) {
                start = $scope.coords.start.x;
                end = $scope.coords.end.x;
            }
            else if (dim === 1) {
                start = $scope.coords.end.y;
                end = $scope.coords.start.y;
            }
            if (val == 0)
                return (start < end) ? start : end;
            if (val == 1)
                return (start > end) ? start : end;
        }
        else return 0;
    }

}]);

app.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : 'cover'
            });
        });
    };
});

app.directive('fileUpload', ['$http', '$timeout', '$sce', function($http, $timeout, $sce) {

    var masterKey = '';

    var uploadUrl = 'https://upload.wistia.com';

    var checkUrl = 'https://api.wistia.com/v1/medias/';

    var embedUrl = 'https://fast.wistia.net/embed/iframe/'

    function link(scope, element, attrs) {

        scope.ready = false;
        scope.hash = '';
        scope.embed = '';
        scope.wistiaUploadProgress = 0;
        scope.wistiaRenderProgress = 0;
        scope.wistiaRenderStatus = '';

        // attach video hash
        scope.attachVideo = function() {
            // if video is finished processing and ready, then attach
            $http.get(checkUrl+scope.hash+'.json', 
                {params: {api_password: masterKey}}).then(function success(response) {
                    var data = response.data;
                    console.log(data);
                    scope.wistiaRenderStatus = data.status;
                    scope.wistiaRenderProgress = data.progress * 100;
                    if (data.status === 'ready') {
                        scope.embed = $sce.trustAsResourceUrl(embedUrl + scope.hash);
                        scope.ready = true;
                        $timeout.cancel(scope.timeoutPromise);
                    } else if (data.status != 'failed') {
                        scope.timeoutPromise = $timeout(function() {
                            scope.attachVideo();}, 3000);
                    } else {
                        console.log(data);
                    }
                }, function error(response) {
                    console.log(response);
                });
        }

        $('#file-navigator').fileupload({
            dataType: 'json',
            url: uploadUrl,
            formData: {
                'api_password': masterKey
            },
            done: function (e, data) {
                scope.hash = data.result.hashed_id;
                scope.attachVideo();
            }
        })
    }

    return {
        templateUrl: 'js/directives/templates/upload.html',
        restrict: 'E',
        link: link
    };
}]);

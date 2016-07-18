app.directive('fileUpload', ['$http', function($http) {

    var masterKey = '';

    var uploadUrl = 'https://upload.wistia.com';

    function link(scope, element, attrs) {
        $('#file-navigator').fileupload({
            dataType: 'json',
            url: uploadUrl,
            formData: {
                'api_password': masterKey
            },
            done: function (e, data) {
                console.log('done');
                console.log(e);
                console.log(data);
            }
        })
    }

    return {
        templateUrl: 'js/directives/templates/upload.html',
        restrict: 'E',
        link: link
    };
}]);

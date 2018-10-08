// angular.module('upload_s3')
app.controller('uploadFile', ['$scope', '$location',
 function($scope, $location) {
  console.log("yeahs I am calling here?");



function readURL(input, target) {
    $scope.image_icon_files=input.files[0].name;
    $scope.image_upload=input.files[0];
          if (input.files && input.files[0]) {
              var reader = new FileReader();
              var image_target = $(target);
              reader.onload = function (e) {
                  image_target.attr('src', e.target.result).show();
              };
              reader.readAsDataURL(input.files[0]);
           }  
       }

  $(".one_opacity_0").on('change','#patient_pic',function(){
      readURL(this, "#preview_image")
  });


$scope.on_post_s3_object = function () {
	
  // let obj = {
  //   upload_s3_object : $scope.image_upload,
  // }


  var formData = new FormData();
  formData.append('upload_media', $scope.image_upload, $scope.image_upload.name);
   
  var url1 = backend + 'api/upload_s3_object?jwt=' + $cookies.get('jwt'), formData;
  $.ajax({
  url: url1,
  type: 'POST',
  data: formData,
  processData: false,
  contentType: false,
  success: function (data) {
    $('#modal_message111').html('Your S3 images uploaded successfully');
  },
  error: function (data) {
   $('#modal_message111').html('check your internet connection');
  },
  });
}

}]);

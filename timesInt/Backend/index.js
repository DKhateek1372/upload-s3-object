var mongo = require('mongodb').MongoClient;
var express = require('express');

var app = express();


var dburl = "mongodb://127.0.0.1:27017/";
 


///its a method trying to how to gave bucket name******************



// const s3_buckets={"social":"upload_Image"};
// const s3_buckets_routes={"social":"https://imagetesting.s3.amazonaws.com/"};  ///i gave dummy name

// function get_bucket_name(bucket_origin) {
// 	if (bucket_origin == 'social') {
// 		return s3_buckets.social;
// }

// *************************** end here bucket name




app.post('/upload_s3_object', function(req,res,next){
	var AWS = require('aws-sdk');                    
	var path = require('path');
   	var formidable = require('formidable');
   	var fs = require('fs');
   	var ffmpeg = require('fluent-ffmpeg');      /////// here this library i used becuase if uploaded is video over there its take the screenshot of thumbnail
   	var media_folder = '/opt/dev1/media/';      ////give any media folder name where the images is going to store
   	var form = new formidable.IncomingForm();
   	form.uploadDir = path.join(media_folder);
    AWS.config.loadFromPath(aws_sdk_credentials_path);
    var s3 = new AWS.S3({
        apiVersion: ''                       ///////////////////////api version we want here
    });
    var file_names = [];
   	var file_types = [];
   	form.multiples=true;
    var bucket = "**********";          ///////here we gave our bucket name

    function success_send() {
        res.end('uploaded succesfully');
    }

    function failure_send() {
        res.end('uploading failed');
    }

   	form.on('file', function(field, file) {
        file_types.push(file.type);
        file_names.push(file.name);
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });
   	form.on('error', function(err) {
        console.log('form on error',err)
    });
   	form.on('end', function() {
       	var res = file_names[0].split(".");
       	var file_link_video = form.uploadDir + file_names[0];
       	var thumbnail_path = media_folder + 'thumbnails/' + res[0] + ".png";
       	ffmpeg(file_link_video).screenshots({            ///////here we are taking the screenshot of video
           count: 1,
           timestamps: ['10%'],
           folder: media_folder + 'thumbnails/',
           filename: res[0]
       	}).on('end', function() {
           var fileStream = fs.createReadStream(thumbnail_path);
           	fileStream.on('error', function(err) {
               console.log('14asdasdasd', err)
        	});
   
		    params = {
		       Bucket: bucket,
		       Key: path.basename(form.uploadDir + res[0] + ".png"),
		       Body: fileStream,
		       ACL: 'public-read'
		   	};
		    s3.upload(params, function(err, data) {
		        if (err) {
		        	console.log('s3 error',err)
		        } else {
		            fs.unlink(thumbnail_path, (err) => {
		                if (err) {
		                    console.log('uploading failed',err);
		                    failure_send();
		                } else {
		                    console.log('uploaded succesfully');
		                    success_send();
		                }
                       
                       
                       
                       
                        mongo.connect( dburl, { useNewUrlParser: true }, function(err, db) {
                            if(err) throw err;
                            var dbc = db.db("sobject");
                            console.log("Connected");
                            console.log(data)
                            var myObj = data;
                            dbc.collection("piclinks").insertOne(myObj,function(err, result) {
                                if(err) throw err;
                                console.log(result);
                                res.send({
                                    "status":"success",
                                    "api_status":"success",
                                    "data":result
                                })
                                db.close();
                            });
                        });
		            });
		        }
		    });

		});
	});form.parse(req);

})



app.listen(3001, function(){
    console.log("Connected to 3001");
});
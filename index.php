<!DOCTYPE html>
<html>
    <head>        
        <meta charset="UTF-8">
        <title></title>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
        <script src="ng-img-crop.js"></script>
        <script src="imglibrary.js"></script>
        <link rel="stylesheet" type="text/css" href="ng-img-crop.css">
        <style>
            .cropArea {
                background: #E4E4E4;
                overflow: hidden;
                width:500px;
                height:350px;
            }
        </style>
    </head>

    <body>   
        <form method="post" id="form1">
            Select input image: <div><input type="file" name="image" id="fileInput"/></div>
            <br>
            Choose operation to perform :
            <br>
            <select name="operation" id="oper">
                <option value="crop">Crop</option>
                <option value="resize">Resize</option>
                <option value="fitWidth">Fit Width</option>
                <option value="fitHeight">Fit Height</option>
                <option value="thumbnail">Thumbnail</option>
                <option value="rotate">Rotate</option>
                <option value="blackWhite">Black and White</option>
                <option value="hue">Hue</option>
                <option value="saturation">Saturation</option>
                <option value="boxBlur">Box Blur</option>
                <option value="gaussianBlur">Gaussian Blur</option>
                <option value="brightness">Brightness</option>
                <option value="contrast">Contrast</option>
                <option value="sharpness">Sharpness</option>
                <option value="transparency">Transparency</option>
                <option value="emboss">Emboss</option>
                <option value="sepia">Sepia</option>
            </select> 
            <br>
            <input type="submit" name="submit" value="Apply" onclick="handle(); return false;"/>
        </form>

        <div id="inputSet">
        </div>

        <div ng-app="app" ng-controller="Ctrl" id="cropper">
            <div class="cropArea"> 
                <img-crop id="pre_crop_img" image="image.originalImage" result-image="image.croppedImage" result-image-size="350" area-type="square"></img-crop>
            </div>
            <div>
                <img id="crop_img" ng-src="{{image.croppedImage}}" style="display: none;" />
            </div>
        </div>


        <div id="here">
        </div>


        <div id="save">
            <select id="type">
                <option disabled selected value="none"> Save Image As </option>
                <option value="dataUrl">Save as DataURL</option>
                <option value="blob">Save as BLOB</option>
                <option value="file">Save as file</option>
            </select> 
            <br>
            <select id="format">
                <option disabled selected value="none">Select a format </option>
                <option value="image/png">Save as PNG</option>
                <option value="image/jpeg">Save as JPEG</option>
                <option value="image/bmp">Save as BMP</option>
            </select>
            <br>
            <input type="submit" name="submit" value="Upload" onclick="upload(); return false"/>
            <br>
            <br>
            <button type="button" onClick="window.location.reload();">Refresh</button>
        </div>



        <script>
            var $inputContainer = $("#inputSet");
            var $displayContainer = $("#here");
            var $uploadContainer = $("#save");
            var $cropContainer = $("#cropper");
            var $cropperResult = $("#crop_img");
            var $selectField = $("#oper");

            var inputContainerId = "inputSet";
            var displayContainerId = "here";
            var cropperResultId = "crop_img";
            var inputFileId = "fileInput";

            var source;
            var op;
            var type;
            var format;
            var image;
            var imageResult;
            var temp = false;
            var uploadUrl = "/upload";

            imagelib.setDisplayContainerId(displayContainerId);
            imagelib.setUploadUrl(uploadUrl);

            $cropContainer.hide();
            $uploadContainer.hide();

            $("#"+inputFileId).change(function () {
                renderImage(this.files[0]);
            });

            function handle() {
                op = $selectField.val();

                if (temp === false)
                {
                    temp = true;
                } 
                else if (imageResult.constructor !== Array)
                {
                    image = imageResult;
                }

                $inputContainer.empty();
                $displayContainer.empty();
                $cropContainer.hide();
                $uploadContainer.hide();

                switch (op) {
                    case 'crop':
                        angular.element($("#cropper")).scope().updateSrc(image);
                        $cropContainer.show();
                        $uploadContainer.show();
                        $cropperResult.on('load', function () {
                            var disp = document.getElementById(cropperResultId);
                            imagelib.crop(disp, function (result) {
                                imageResult = result;
                            });
                        });
                        break;

                    case 'resize':
                        $('<input>').attr({
                            type: 'text',
                            id: 'wd',
                            placeholder: 'Enter Width'
                        }).appendTo("#" + inputContainerId);

                        $('<input>').attr({
                            type: 'text',
                            id: 'ht',
                            placeholder: 'Enter Height'
                        }).appendTo("#" + inputContainerId);

                        $(document).on('keyup', '#wd', function () {
                            $uploadContainer.show();
                            imagelib.resize(image, $('#wd').val(), $('#ht').val(), function (result) {
                                imageResult = result;
                            });
                        });

                        $(document).on('keyup', '#ht', function () {
                            $uploadContainer.show();
                            imagelib.resize(image, $('#wd').val(), $('#ht').val(), function (result) {
                                imageResult = result;
                            });
                        });
                        break;

                    case 'fitWidth':
                        $('<input>').attr({
                            type: 'text',
                            id: 'wd',
                            placeholder: 'Enter Width'
                        }).appendTo('#' + inputContainerId);

                        $(document).on('keyup', '#wd', function () {
                            $uploadContainer.show();
                            imagelib.fitWidth(image, $('#wd').val(), function (result) {
                                imageResult = result;
                            });
                        });
                        break;

                    case 'fitHeight':
                        $('<input>').attr({
                            type: 'text',
                            id: 'ht',
                            placeholder: 'Enter Height'
                        }).appendTo('#' + inputContainerId);

                        $(document).on('keyup', '#ht', function () {
                            $uploadContainer.show();
                            imagelib.fitHeight(image, $('#ht').val(), function (result) {
                                imageResult = result;
                            });
                        });
                        break;

                    case 'thumbnail':
                        $uploadContainer.show();
                        imagelib.thumbnail(image, [50, 100, 150, 200], function (result) {
                            imageResult = result;
                        });
                        break;

                    case 'rotate':
                        $('<input>').attr({
                            type: 'range',
                            min: 0,
                            max: 360,
                            step: 1,
                            value: 0,
                            id: 'slide'
                        }).appendTo('#' + inputContainerId);

                        $(document).on('change', '#slide', function () {
                            $uploadContainer.show();
                            imagelib.rotate(image, $('#slide').val(), function (result) {
                                imageResult = result;
                            });
                        });
                        imagelib.rotate(image, $('#slide').val(), function (result) {
                            imageResult = result;
                        });
                        break;

                    case 'blackWhite':
                        $uploadContainer.show();
                        imagelib.blackWhite(image, function (result) {
                            imageResult = result;
                        });
                        break;

                    case 'hue':
                        $('<input>').attr({
                            type: 'range',
                            min: 0,
                            max: 100,
                            step: 1,
                            value: 0,
                            id: 'slide'
                        }).appendTo('#' + inputContainerId);

                        $(document).on('change', '#slide', function () {
                            $uploadContainer.show();
                            imagelib.hue(image, $('#slide').val(), function (result) {
                                imageResult = result;
                            });
                        });
                        imagelib.hue(image, $('#slide').val(), function (result) {
                            imageResult = result;
                        });
                        break;

                    case 'saturation':
                        $('<input>').attr({
                            type: 'range',
                            min: -100,
                            max: 100,
                            step: 1,
                            value: 0,
                            id: 'slide'
                        }).appendTo('#' + inputContainerId);

                        $(document).on('change', '#slide', function () {
                            $uploadContainer.show();
                            imagelib.saturation(image, $('#slide').val(), function (result) {
                                imageResult = result;
                            });
                        });
                        imagelib.saturation(image, $('#slide').val(), function (result) {
                            imageResult = result;
                        });
                        break;

                    case 'boxBlur':
                        $uploadContainer.show();
                        imagelib.boxBlur(image, function (result) {
                            imageResult = result;
                        });
                        break;

                    case 'gaussianBlur':
                        $uploadContainer.show();
                        imagelib.gaussianBlur(image, function (result) {
                            imageResult = result;
                        });
                        break;

                    case 'brightness':
                        $('<input>').attr({
                            type: 'range',
                            min: -100,
                            max: 100,
                            step: 1,
                            value: 0,
                            id: 'slide'
                        }).appendTo('#' + inputContainerId);

                        $(document).on('change', '#slide', function () {
                            $uploadContainer.show();
                            imagelib.brightness(image, $('#slide').val(), function (result) {
                                imageResult = result;
                            });
                        });
                        imagelib.brightness(image, $('#slide').val(), function (result) {
                            imageResult = result;
                        });
                        break;

                    case 'contrast':
                        $('<input>').attr({
                            type: 'range',
                            min: -4,
                            max: 4,
                            step: 1,
                            value: 0,
                            id: 'slide'
                        }).appendTo('#' + inputContainerId);

                        $(document).on('change', '#slide', function () {
                            $uploadContainer.show();
                            imagelib.contrast(image, $('#slide').val(), function (result) {
                                imageResult = result;
                            });
                        });
                        imagelib.contrast(image, $('#slide').val(), function (result) {
                            imageResult = result;
                        });
                        break;

                    case 'sharpness':
                        $uploadContainer.show();
                        imagelib.sharpen(image, function (result) {
                            imageResult = result;
                        });
                        break;

                    case 'transparency':
                        $('<input>').attr({
                            type: 'range',
                            min: 0,
                            max: 1,
                            step: 0.01,
                            value: 1,
                            id: 'slide'
                        }).appendTo('#' + inputContainerId);

                        $(document).on('change', '#slide', function () {
                            $uploadContainer.show();
                            imagelib.transparency(image, $('#slide').val(), function (result) {
                                imageResult = result;
                            });
                        });
                        imagelib.transparency(image, $('#slide').val(), function (result) {
                            imageResult = result;
                        });
                        break;

                    case 'emboss':
                        $uploadContainer.show();
                        imagelib.emboss(image, function (result) {
                            imageResult = result;
                        });
                        break;

                    case 'sepia':
                        $uploadContainer.show();
                        imagelib.sepia(image, function (result) {
                            imageResult = result;
                        });
                        break;
                }
            }
            ;

            function upload() {
                type = document.getElementById("type");
                format = document.getElementById("format");
                puttoserver(imageResult);
            }

            function puttoserver(here)
            {
                if (typeof type !== 'undefined' && typeof format !== 'undefined')
                {
                    var final = imagelib.adjust(here, type.value, format.value);
                    if (final !== undefined)
                    {
                        console.log(final);
                        /// write code to upload to server here
                    }
                }
            }

            function renderImage(file) {
                if (typeof FileReader !== "undefined")
                {
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        image = $('<img />').attr({
                            src: evt.target.result,
                            crossOrigin: "Anonymous"
                        })[0];
                    };
                    reader.readAsDataURL(file);
                }
            }

            angular.module('app', ['ngImgCrop'])
                    .controller('Ctrl', function ($scope) {
                        $scope.image = {originalImage: '', croppedImage: ''};

                        var handleFileSelect = function (evt) {
                            var file = evt.currentTarget.files[0];
                            if (typeof FileReader !== "undefined")
                            {
                                var reader = new FileReader();
                                reader.onload = function (evt) {
                                    $scope.$apply(function ($scope) {
                                        $scope.image.originalImage = evt.target.result;
                                    });
                                };
                                reader.readAsDataURL(file);
                            }
                        };
                        angular.element(document.querySelector('#' + inputFileId)).on('change', handleFileSelect);

                        $scope.updateSrc = function (temp) {
                            $scope.image.originalImage = temp.src;
                        };
                    });
        </script>
    </body>
</html>
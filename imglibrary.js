(function (pubObj) {
    var imagelib = pubObj;
    var $displayContainer;
    var quality = 0.3;
    var uploadUrl;

    // $$$$$$$$$$  for display  $$$$$$$$$$$$$$$$
    imagelib.setDisplayContainerId = function (temp) {
        $displayContainer = $("#" + temp);
    };

    function addElement(title, cvs) {
        var cvs1 = reduceQuality(cvs, cvs.toDataURL('image/png', quality));

        $displayContainer.empty();
        $displayContainer.append("<h2>" + title + "</h2>", cvs1);
    }

    function addElementThumb(title, cvs, size) {
        $displayContainer.empty();
        $displayContainer.append("<h2>" + title + "</h2>");
        for (var i = 0; i < size; i++)
        {
            var cvs1 = reduceQuality(cvs[i], cvs[i].toDataURL('image/png', quality));
            $displayContainer.append(cvs1, "<br>");
        }
    }

    function imgToCvs(img)
    {
        var cvs = $('<canvas />').attr({
            width: img.width,
            height: img.height
        })[0];
        var ctx = cvs.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return cvs;
    }

    function cvsToImg(cvs)
    {
        var dataUrl = cvs.toDataURL('image/png', quality);
        var img = $('<img />').attr({
            src: dataUrl,
            crossOrigin: "Anonymous"
        })[0];
        return img;
    }

    function cvsToImgThumb(cvsArray)
    {
        var imgArray = [];
        for (var i = 0; i < cvsArray.length; i++)
        {
            var dataUrl = cvsArray[i].toDataURL('image/png', quality);
            var img = $('<img />').attr({
                src: dataUrl,
                crossOrigin: "Anonymous"
            })[0];
            imgArray.push(img);
        }
        return imgArray;
    }

    function imgToCvsThumb(imgArray)
    {
        var cvsArray = [];
        for (var i = 0; i < imgArray.length; i++)
        {
            var cvs = $('<canvas />').attr({
                width: imgArray[i].width,
                height: imgArray[i].height
            })[0];
            var ctx = cvs.getContext('2d');
            ctx.drawImage(imgArray[i], 0, 0);
            cvsArray.push(cvs);
        }
        return cvsArray;
    }

    // $$$$$$$$$$  for display  $$$$$$$$$$$$$$$$
    imagelib.crop = function (img, callback) {
            var cvs = $('<canvas />').attr({
                width: img.width,
                height: img.height
            })[0];
            var ctx = cvs.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            addElement('Crop', cvs);
            var image = cvsToImg(cvs);
            callback(image);
    };

    imagelib.resize = function (img, wd, ht, callback) {
        var temp = img.src;
        img.src = "";
        img.onload = function () {
            var cvs = $('<canvas />').attr({
                width: wd,
                height: ht
            })[0];
            var ctx = cvs.getContext("2d");
            ctx.drawImage(img, 0, 0, wd, ht);
            addElement('Resize', cvs);
            var image = cvsToImg(cvs);
            callback(image);
        };
        img.src = temp;
    };

    imagelib.fitWidth = function (img, wd, callback) {
        var temp = img.src;
        img.src = "";
        img.onload = function () {
            var new_width;
            var new_height;

            var old_width = img.width;
            var old_height = img.height;

            new_width = wd;
            new_height = (new_width / old_width) * old_height;
            new_height = new_height < 1 ? 1 : new_height;

            var cvs = $('<canvas />').attr({
                width: new_width,
                height: new_height
            })[0];

            var ctx = cvs.getContext("2d");
            ctx.drawImage(img, 0, 0, new_width, new_height);
            addElement('Fit Width', cvs);
            var image = cvsToImg(cvs);
            callback(image);
        };
        img.src = temp;
    };

    imagelib.fitHeight = function (img, ht, callback) {
        var temp = img.src;
        img.src = "";
        img.onload = function () {
            var new_width;
            var new_height;

            var old_width = img.width;
            var old_height = img.height;

            new_height = ht;
            new_width = (new_height / old_height) * old_width;
            new_width = new_width < 1 ? 1 : new_width;

            var cvs = $('<canvas />').attr({
                width: new_width,
                height: new_height
            })[0];
            var ctx = cvs.getContext("2d");
            ctx.drawImage(img, 0, 0, new_width, new_height);
            addElement('Fit Height', cvs);
            var image = cvsToImg(cvs);
            callback(image);
        };
        img.src = temp;
    };



    imagelib.thumbnail = function (img, arr, callback) {
        var temp = img.src;
        img.src = "";
        img.onload = function () {
            var cvsArray = new Array();
            var old_width = img.width;
            var old_height = img.height;
            var new_width;
            var new_height;

            if (arr.length === 0)
            {
                arr[0] = 100;
                arr[1] = 200;
                arr[2] = img.width < img.height ? img.height : img.width;
            }

            for (var i = 0; i < arr.length; i++)
            {
                new_width = arr[i];

                new_height = (new_width / old_width) * old_height;
                new_height = new_height < 1 ? 1 : new_height;

                var cvs = $('<canvas />').attr({
                    width: new_width,
                    height: new_height
                })[0];

                var ctx = cvs.getContext("2d");
                ctx.drawImage(img, 0, 0, new_width, new_height);
                cvsArray[i] = cvs;
            }
            addElementThumb('Thumbnails', cvsArray, arr.length);
            var image = cvsToImgThumb(cvsArray);
            callback(image);
        };
        img.src = temp;
    };


    imagelib.rotate = function (img, theta, callback) {
        var temp = img.src;
        img.src = "";
        img.onload = function () {
            var max_size = Math.sqrt(img.width * img.width + img.height * img.height);
            var cvs = $('<canvas />').attr({
                width: max_size,
                height: max_size
            })[0];
            var ctx = cvs.getContext("2d");
            ctx.save();
            ctx.translate(max_size / 2, max_size / 2);
            ctx.rotate(theta * Math.PI / 180);
            ctx.drawImage(img, -(img.width / 2), -(img.height / 2));
            ctx.restore();

            addElement('Rotate', cvs);
            var image = cvsToImg(cvs);
            callback(image);
        };
        img.src = temp;
    };

    imagelib.blackWhite = function (img, callback) {
        var temp = img.src;
        img.src = "";
        img.onload = function () {
            var cvs = $('<canvas />').attr({
                width: img.width,
                height: img.height
            })[0];
            var ctx = cvs.getContext('2d');
            ctx.drawImage(img, 0, 0);

            var imageData = ctx.getImageData(0, 0, img.width, img.height);
            var px = imageData.data;

            var len = px.length;

            for (var i = 0; i < len; i += 4) {
                var r = px[i];
                var g = px[i + 1];
                var b = px[i + 2];

                var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

                px[i] = v;
                px[i + 1] = v;
                px[i + 2] = v;
            }
            ctx.putImageData(imageData, 0, 0);
            // to display canvas in html 
            addElement('Black and White', cvs);
            var image = cvsToImg(cvs);
            callback(image);
        };
        img.src = temp;
    };

    function rgb2hsv(r, g, b) {
        var hsv = new Array(3);
        var K = 0.0, swap = 0;
        if (g < b) {
            swap = g;
            g = b;
            b = swap;
            K = -1.0;
        }
        if (r < g) {
            swap = r;
            r = g;
            g = swap;
            K = -2.0 / 6.0 - K;
        }
        var chroma = r - (g < b ? g : b);
        hsv[0] = Math.abs(K + (g - b) / (6.0 * chroma + 1e-20));
        hsv[1] = chroma / (r + 1e-20);
        hsv[2] = r;
        return hsv;
    }

    function hsv2rgb(hsv) {
        var h = hsv[0];
        var s = hsv[1];
        var v = hsv[2];
        var rgb = new Array(3);

        // The HUE should be at range [0, 1], convert 1.0 to 0.0 if needed.
        if (h >= 1.0)
        {
            h -= 1.0;
        }

        h *= 6.0;
        var index = Math.floor(h);

        var f = h - index;
        var p = v * (1.0 - s);
        var q = v * (1.0 - s * f);
        var t = v * (1.0 - s * (1.0 - f));

        switch (index) {
            case 0:
                rgb[0] = v;
                rgb[1] = t;
                rgb[2] = p;
                return rgb;
            case 1:
                rgb[0] = q;
                rgb[1] = v;
                rgb[2] = p;
                return rgb;
            case 2:
                rgb[0] = p;
                rgb[1] = v;
                rgb[2] = t;
                return rgb;
            case 3:
                rgb[0] = p;
                rgb[1] = q;
                rgb[2] = v;
                return rgb;
            case 4:
                rgb[0] = t;
                rgb[1] = p;
                rgb[2] = v;
                return rgb;
            case 5:
                rgb[0] = v;
                rgb[1] = p;
                rgb[2] = q;
                return rgb;
        }
    }

    imagelib.hue = function (img, value, callback) {
        var temp = img.src;
        img.src = "";
        img.onload = function () {
            var cvs = $('<canvas />').attr({
                width: img.width,
                height: img.height
            })[0];

            var ctx = cvs.getContext('2d');
            ctx.drawImage(img, 0, 0);

            var imageData = ctx.getImageData(0, 0, img.width, img.height);
            var px = imageData.data;

            var len = px.length;

            for (var i = 0; i < len; i += 4) {
                var r = px[i];
                var g = px[i + 1];
                var b = px[i + 2];

                var adjust = value;

                var hsv = rgb2hsv(r, g, b);
                var h = hsv[0] * 100;
                h += Math.abs(adjust);
                h = h % 100;
                h /= 100;
                hsv[0] = h;

                var rgb = hsv2rgb(hsv);

                px[i] = rgb[0]; // red
                px[i + 1] = rgb[1]; // green
                px[i + 2] = rgb[2]; // blue
            }

            ctx.putImageData(imageData, 0, 0);
            // to display canvas in html 
            addElement('Hue', cvs);
            var image = cvsToImg(cvs);
            callback(image);
        };
        img.src = temp;
    };


    imagelib.saturation = function (img, value, callback) {
        var temp = img.src;
        img.src = "";
        img.onload = function () {
            var cvs = $('<canvas />').attr({
                width: img.width,
                height: img.height
            })[0];

            var ctx = cvs.getContext('2d');
            ctx.drawImage(img, 0, 0);

            var imageData = ctx.getImageData(0, 0, img.width, img.height);
            var px = imageData.data;

            var len = px.length;

            for (var i = 0; i < len; i += 4) {
                var r = px[i];
                var g = px[i + 1];
                var b = px[i + 2];

                var adjust = value;

                var max = Math.max(r, Math.max(g, b));

                px[i] = px[i] + (r === max ? 0 : (max - r) * adjust);
                px[i + 1] = px[i + 1] + (g === max ? 0 : (max - g) * adjust);
                px[i + 2] = px[i + 2] + (b === max ? 0 : (max - b) * adjust);
            }

            ctx.putImageData(imageData, 0, 0);
            // to display canvas in html 
            addElement('Saturation', cvs);
            var image = cvsToImg(cvs);
            callback(image);
        };
        img.src = temp;
    };


    function convolute(img, matrix, title, callback) {
        var temp = img.src;
        img.src = "";
        img.onload = function () {
            var cvs = $('<canvas />').attr({
                width: img.width,
                height: img.height
            })[0];

            var ctx = cvs.getContext('2d');
            ctx.drawImage(img, 0, 0);

            var imageData = ctx.getImageData(0, 0, img.width, img.height);

            var side = Math.round(Math.sqrt(matrix.length));
            var halfSide = Math.floor(side / 2);
            var src = imageData.data;
            var sw = imageData.width;
            var sh = imageData.height;
            // pad output by the convolution matrix
            var w = sw;
            var h = sh;
            var cvs1 = document.createElement('canvas');
            var ctx1 = cvs1.getContext('2d');
            var output = ctx1.createImageData(w, h);
            var dst = output.data;
            // go through the destination image pixels
            // var alphaFac = opaque ? 1 : 0;
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    var sy = y;
                    var sx = x;
                    var dstOff = (y * w + x) * 4;
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    var r = 0, g = 0, b = 0, a = 0;
                    for (var cy = 0; cy < side; cy++) {
                        for (var cx = 0; cx < side; cx++) {
                            var scy = sy + cy - halfSide;
                            var scx = sx + cx - halfSide;
                            if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                                var srcOff = (scy * sw + scx) * 4;
                                var wt = matrix[cy * side + cx];
                                r += src[srcOff] * wt;
                                g += src[srcOff + 1] * wt;
                                b += src[srcOff + 2] * wt;
                                a += src[srcOff + 3] * wt;
                            }
                        }
                    }
                    dst[dstOff] = r;
                    dst[dstOff + 1] = g;
                    dst[dstOff + 2] = b;
                    dst[dstOff + 3] = a;
                }
            }

            ctx.putImageData(output, 0, 0);
            // to display canvas in html 
            addElement(title, cvs);
            var image = cvsToImg(cvs);
            callback(image);
        };
        img.src = temp;
    }

    imagelib.boxBlur = function (img, callback) {
        convolute(img,
                [1 / 9, 1 / 9, 1 / 9,
                    1 / 9, 1 / 9, 1 / 9,
                    1 / 9, 1 / 9, 1 / 9]
                , 'Box Blur', function (result) {
                    callback(result);
                });
    };

    imagelib.gaussianBlur = function (img, callback) {
        convolute(img,
                [1 / 16, 2 / 16, 1 / 16,
                    2 / 16, 4 / 16, 2 / 16,
                    1 / 16, 2 / 16, 1 / 16]
                , 'Gaussian Blur', function (result) {
                    callback(result);
                });
    };

    imagelib.brightness = function (img, adjustment, callback) {
        var temp = img.src;
        img.src = "";
        img.onload = function () {
            var cvs = $('<canvas />').attr({
                width: img.width,
                height: img.height
            })[0];
            var ctx = cvs.getContext('2d');
            ctx.drawImage(img, 0, 0);
            adjustment = Math.floor(255 * (adjustment / 100));

            var imageData = ctx.getImageData(0, 0, img.width, img.height);
            var px = imageData.data;

            var len = px.length;
            for (var i = 0; i < len; i += 4) {
                px[i] += adjustment;
                px[i + 1] += adjustment;
                px[i + 2] += adjustment;
            }
            ctx.putImageData(imageData, 0, 0);
            addElement('Brightness', cvs);
            var image = cvsToImg(cvs);
            callback(image);
        };
        img.src = temp;
    };

    imagelib.contrast = function (img, contrast, callback) {
        var temp = img.src;
        img.src = "";
        img.onload = function () {
            var cvs = $('<canvas />').attr({
                width: img.width,
                height: img.height
            })[0];
            var ctx = cvs.getContext('2d');
            ctx.drawImage(img, 0, 0);

            var imageData = ctx.getImageData(0, 0, img.width, img.height);
            var px = imageData.data;
            var len = px.length;

            var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

            for (var i = 0; i < len; i += 4)
            {
                px[i] = factor * (px[i] - 128) + 128;
                px[i + 1] = factor * (px[i + 1] - 128) + 128;
                px[i + 2] = factor * (px[i + 2] - 128) + 128;
            }

            ctx.putImageData(imageData, 0, 0);
            addElement('Contrast', cvs);
            var image = cvsToImg(cvs);
            callback(image);
        };
        img.src = temp;
    };

    imagelib.sharpen = function (img, callback) {
        convolute(img,
                [0, -1, 0,
                    -1, 5, -1,
                    0, -1, 0]
                , 'Sharpen', function (result) {
                    callback(result);
                });
    };

    imagelib.transparency = function (img, a, callback) {
        var temp = img.src;
        img.src = "";
        img.onload = function () {
            var cvs = $('<canvas />').attr({
                width: img.width,
                height: img.height
            })[0];
            var ctx = cvs.getContext('2d');
            ctx.globalAlpha = a;
            ctx.drawImage(img, 0, 0);
            addElement('Transparency', cvs);
            var image = cvsToImg(cvs);
            callback(image);
        };
        img.src = temp;
    };

    imagelib.emboss = function (img, callback) {
        convolute(img,
                [1, 1, 1,
                    1, 0.7, -1,
                    -1, -1, -1]
                , 'Emboss', function (result) {
                    callback(result);
                });
    };

    imagelib.sepia = function (img, callback) {
        var temp = img.src;
        img.src = "";
        img.onload = function () {
            var cvs = $('<canvas />').attr({
                width: img.width,
                height: img.height
            })[0];
            var ctx = cvs.getContext('2d');
            ctx.drawImage(img, 0, 0);

            var imageData = ctx.getImageData(0, 0, img.width, img.height);
            var px = imageData.data;

            var len = px.length;

            for (var i = 0; i < len; i += 4) {
                var r = px[i];
                var g = px[i + 1];
                var b = px[i + 2];

                px[i] = (r * 0.393) + (g * 0.769) + (b * 0.189); // red
                px[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168); // green
                px[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131); // blue
            }

            ctx.putImageData(imageData, 0, 0);
            addElement('Sepia Filter', cvs);
            var image = cvsToImg(cvs);
            callback(image);
        };
        img.src = temp;
    };

    // $$$$$$$$$$  functionalities  $$$$$$$$$$$$$$$$




    // $$$$$$$$$$  utilities  $$$$$$$$$$$$$$$$
    function urlObj(cvs, contentType) {
        if (cvs.constructor !== Array)
        {
            return cvs.toDataURL(contentType, quality);
        } else
        {
            var urls = [];
            for (var i = 0; i < cvs.length; i++)
            {
                urls[i] = cvs[i].toDataURL(contentType, quality);
            }
            return urls;
        }
    }

    function reduceQuality(cvs, urlobj) {
        var ctx = cvs.getContext('2d');
        var img = new Image;
        img.src = urlobj;
        ctx.drawImage(img, 0, 0);
        return cvs;
    }

    function blobObj(cvs, contentType) {
        if (cvs.constructor !== Array)
        {
            var data = cvs.toDataURL(contentType, quality);
            var blob = dataToBlob(data, contentType);
            return blob;
        } else
        {
            var blobArray = [];
            for (var i = 0; i < cvs.length; i++)
            {
                var data = cvs[i].toDataURL(contentType, quality);
                var blob = dataToBlob(data, contentType);
                blobArray.push(blob);
            }
            return blobArray;
        }
    }

    function dataToBlob(data, contentType)
    {
        data = data.replace('data:' + contentType + ';base64,', '');
        contentType = contentType || '';
        var sliceSize = 512;
        var byteCharacters = atob(data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);

            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    imagelib.setUploadUrl = function (temp) {
        uploadUrl = temp;
    };

    function fileObj(cvs, contentType) {
        var form = new FormData();
        var xhr = new XMLHttpRequest();
        var blob = blobObj(cvs, contentType);

        form.append("image", blob, "myimage.jpg");
        xhr.open("POST", uploadUrl, true);
        xhr.send(form);
    }

    imagelib.adjust = function (img, type, format) {
        var cvs;
        if (img.constructor === Array)
        {
            cvs = imgToCvsThumb(img);
        } else
        {
            cvs = imgToCvs(img);
        }


        if (type === 'dataUrl')
        {
            return urlObj(cvs, format);
        } else if (type === 'blob')
        {
            return blobObj(cvs, format);
        } else if (type === 'file')
        {
            return fileObj(cvs, format);
        } else
        {
            return undefined;
        }
    };



    imagelib.convertPng = function (img) {
        var cvs = document.createElement("canvas");
        cvs.width = img.width;
        cvs.height = img.height;
        cvs.getContext("2d").drawImage(img, 0, 0);

        var img_new = new Image();
        img_new.src = cvs.toDataURL("image/png");

        return img_new;
    };

    imagelib.convertJpeg = function (img) {
        var cvs = document.createElement("canvas");
        cvs.width = img.width;
        cvs.height = img.height;
        cvs.getContext("2d").drawImage(img, 0, 0);

        var img_new = new Image();
        img_new.src = cvs.toDataURL("image/jpeg");

        return img_new;
    };

    imagelib.convertBmp = function (img) {
        var cvs = document.createElement("canvas");
        cvs.width = img.width;
        cvs.height = img.height;
        cvs.getContext("2d").drawImage(img, 0, 0);

        var img_new = new Image();
        img_new.src = cvs.toDataURL("image/bmp");

        return img_new;
    };
    // $$$$$$$$$$  utilities  $$$$$$$$$$$$$$$$
})(window.imagelib = window.imagelib || {});
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    document.getElementById('takePhoto').addEventListener('click', takePhoto);
    loadGallery();
}

function takePhoto() {
    navigator.camera.getPicture(onPhotoSuccess, onPhotoFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI
    });
}

function onPhotoSuccess(imageURI) {
    window.resolveLocalFileSystemURL(imageURI, function(fileEntry) {
        var galleryFolder = cordova.file.dataDirectory + "gallery/";
        window.resolveLocalFileSystemURL(galleryFolder, function() {
            savePhoto(fileEntry);
        }, function() {
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dirEntry) {
                dirEntry.getDirectory("gallery", { create: true }, function() {
                    savePhoto(fileEntry);
                });
            });
        });
    }, onPhotoFail);
}

function savePhoto(fileEntry) {
    var galleryFolder = cordova.file.dataDirectory + "gallery/";
    var newFileName = Date.now() + '.jpg';
    fileEntry.copyTo(galleryFolder, newFileName, function() {
        loadGallery();
    }, onPhotoFail);
}

function loadGallery() {
    var galleryFolder = cordova.file.dataDirectory + "gallery/";
    window.resolveLocalFileSystemURL(galleryFolder, function(dirEntry) {
        var directoryReader = dirEntry.createReader();
        directoryReader.readEntries(function(entries) {
            var gallery = document.getElementById('gallery');
            gallery.innerHTML = '';
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isFile) {
                    var img = document.createElement('img');
                    img.src = entries[i].nativeURL;
                    gallery.appendChild(img);
                }
            }
        }, onPhotoFail);
    }, onPhotoFail);
}

function onPhotoFail(message) {
    alert('Failed because: ' + message);
}
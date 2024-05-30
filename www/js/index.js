document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Device is ready');
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
    console.log('Photo taken: ' + imageURI);
    window.resolveLocalFileSystemURL(imageURI, function(fileEntry) {
        var galleryFolder = cordova.file.dataDirectory + "gallery/";
        window.resolveLocalFileSystemURL(galleryFolder, function(dirEntry) {
            console.log('Gallery folder exists');
            savePhoto(fileEntry);
        }, function() {
            console.log('Gallery folder does not exist, creating it');
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dirEntry) {
                dirEntry.getDirectory("gallery", { create: true }, function(newDirEntry) {
                    console.log('Gallery folder created');
                    savePhoto(fileEntry);
                }, onPhotoFail);
            });
        });
    }, onPhotoFail);
}

function savePhoto(fileEntry) {
    var galleryFolder = cordova.file.dataDirectory + "gallery/";
    var newFileName = Date.now() + '.jpg';
    window.resolveLocalFileSystemURL(galleryFolder, function(dirEntry) {
        fileEntry.copyTo(dirEntry, newFileName, function(newFileEntry) {
            console.log('Photo saved: ' + newFileName);
            loadGallery();  // Load the gallery to update it with the new photo
        }, onPhotoFail);
    }, onPhotoFail);
}

function loadGallery() {
    var galleryFolder = cordova.file.dataDirectory + "gallery/";
    window.resolveLocalFileSystemURL(galleryFolder, function(dirEntry) {
        var directoryReader = dirEntry.createReader();
        directoryReader.readEntries(function(entries) {
            var gallery = document.getElementById('gallery');
            gallery.innerHTML = '';
            if (entries.length === 0) {
                gallery.innerHTML = '<p>No photos in gallery.</p>';
            }
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isFile) {
                    var img = document.createElement('img');
                    img.src = entries[i].nativeURL;
                    img.style.width = '100px';
                    img.style.height = '100px';
                    img.style.objectFit = 'cover';
                    img.style.margin = '5px';
                    img.style.border = '1px solid #ccc';
                    gallery.appendChild(img);
                }
            }
        }, onPhotoFail);
    }, onPhotoFail);
}

function onPhotoFail(message) {
    alert('Failed because: ' + message);
    console.log('Failed because: ' + message);
}

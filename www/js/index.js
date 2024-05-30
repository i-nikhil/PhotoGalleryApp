// Add an event listener for the 'deviceready' event
document.addEventListener('deviceready', onDeviceReady, false);

// Function to be called when the device is ready
function onDeviceReady() {
    console.log('Device is ready');

    document.getElementById('takePhoto').addEventListener('click', takePhoto);
    loadGallery();
}

// Function to take a photo using the device camera
function takePhoto() {
    navigator.camera.getPicture(onPhotoSuccess, onPhotoFail, {
        quality: 50, // Photo quality (0-100)
        destinationType: Camera.DestinationType.FILE_URI // Return the file URI of the photo
    });
}

// Callback function for successful photo capture
function onPhotoSuccess(imageURI) {
    console.log('Photo taken: ' + imageURI);

    window.resolveLocalFileSystemURL(imageURI, function(fileEntry) {
        var galleryFolder = cordova.file.dataDirectory + "gallery/"; // Define the gallery folder path
        window.resolveLocalFileSystemURL(galleryFolder, function(dirEntry) {
            console.log('Gallery folder exists');
            savePhoto(fileEntry, dirEntry); // Save the photo to the gallery
        }, function() {
            console.log('Gallery folder does not exist, creating it');
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dirEntry) {
                dirEntry.getDirectory("gallery", { create: true }, function(newDirEntry) {
                    console.log('Gallery folder created');
                    savePhoto(fileEntry, newDirEntry); // Save the photo to the new gallery folder
                }, onPhotoFail);
            });
        });
    }, onPhotoFail);
}

// Function to save the photo to the gallery folder
function savePhoto(fileEntry, dirEntry) {
    var newFileName = Date.now() + '.jpg'; // Create a new file name based on the current timestamp

    fileEntry.copyTo(dirEntry, newFileName, function(newFileEntry) {
        console.log('Photo saved: ' + newFileName);
        loadGallery(); // Reload the gallery to include the new photo
    }, onPhotoFail);
}

// Function to load and display photos in the gallery
function loadGallery() {
    var galleryFolder = cordova.file.dataDirectory + "gallery/"; // Define the gallery folder path

    window.resolveLocalFileSystemURL(galleryFolder, function(dirEntry) {
        var directoryReader = dirEntry.createReader(); // Create a directory reader

        directoryReader.readEntries(function(entries) {
            var gallery = document.getElementById('gallery'); // Get the gallery element
            gallery.innerHTML = ''; // Clear the current gallery content
            if (entries.length === 0) {
                gallery.innerHTML = '<p>No photos in gallery.</p>'; // Display a message if the gallery is empty
            }
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isFile) {
                    entries[i].file(function(file) {
                        var reader = new FileReader();
                        reader.onloadend = function(e) {
                            var img = document.createElement('img'); // Create an img element
                            img.src = e.target.result; // Set the src of the img element to the file data URL
                            img.style.width = '100px';
                            img.style.height = '100px';
                            img.style.objectFit = 'cover';
                            img.style.margin = '5px';
                            img.style.border = '1px solid #ccc';
                            gallery.appendChild(img); // Append the img element to the gallery
                        };
                        reader.readAsDataURL(file); // Read the file as a data URL
                    });
                }
            }
        }, onPhotoFail);
    }, onPhotoFail);
}

// Callback function for failed operations
function onPhotoFail(message) {
    alert('Failed because: ' + message);
    console.log('Failed because: ' + message);
}

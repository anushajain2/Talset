function getExtension(filename) {
    let parts = filename.split('.');
    return parts[parts.length - 1];
}

exports.isImage = function (filename) {
    let ext = getExtension(filename);
    switch (ext.toLowerCase()) {
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':
            //etc
            return true;
    }
    return false;
}

exports.isVideo = function (filename) {
    let ext = getExtension(filename);
    switch (ext.toLowerCase()) {
        case 'm4v':
        case 'avi':
        case 'mpg':
        case 'mp4':
            // etc
            return true;
    }
    return false;
}
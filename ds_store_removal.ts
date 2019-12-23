var jSZip = require("jszip");
// var atob = require("atob");
// var FileReader = require('filereader')

module.exports = {
    removeDsStoreFilesAndMacOSXFolder: function(zipArchiveBase64: string) {
        return new Promise(resolve => {
            //Make a copy of the zipFileBase64
            let zipArchiveBase64Copy: string = zipArchiveBase64.slice()

            //Make a blob from the base64 string
            let zipArchiveBlob = atob(zipArchiveBase64Copy)

            //Turn the zip blob into an actual zip archive
            var newZip = new jSZip();
            newZip.loadAsync(zipArchiveBlob).then(function(zip) { 
                //Loop through every file in the zip archive
                for (var name in zip.files) {
                    let indexOfLastPeriod = name.lastIndexOf(".");
                    let fileExtension = name.substring(indexOfLastPeriod + 1)
                    if (fileExtension === "DS_Store") {
                        //It's a DS_Store file so let's remove it
                        zip.remove(name)
                    }
                    if (name === "__MACOSX/") {
                        //It's a __MACOSX folder so let's remove it
                        zip.remove(name)
                    }
                }
                zip.generateAsync({type:"base64"}).then(function(base64) {
                    //Return the base64 zip archive with the .DS_Store file removed
                    resolve(base64)
                })
            })
        })
    }
}
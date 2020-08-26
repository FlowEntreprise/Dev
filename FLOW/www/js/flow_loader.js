class FlowLoaderClass {
    constructor() {
        this.flows = [];
    }

    DownloadFlow(url) {
        let returned_flow = this.flows.filter(flow => (flow.online_url == url));
        console.log(returned_flow);
        if (returned_flow.length == 0) {
            let new_flow = new FlowObj(url);
            this.flows.push(new_flow);
            returned_flow = new_flow;
        } else {
            returned_flow = returned_flow[0];
        }
        return returned_flow;
    }
}

class FlowObj {
    constructor(url) {
        this.online_url = url;
        if (url.includes("blob")) {
            this.fileName = url.replace("blob:file:///", "");
        } else {
            this.fileName = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
        }
        this.local_url = "";
        this.ready = false;
        this.LoadFromUrl(this.online_url);
    }

    OnReady(callback) {
        let self = this;
        if (!this.ready) {
            setTimeout(function () {
                self.OnReady(callback);
            }, 50);
        } else {
            callback(self.local_url);
        }
    }

    LoadFromUrl(url) {
        console.log(url);
        let self = this;
        var xhr = new XMLHttpRequest();
        // console.log("downloading flow from online url...");
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';

        xhr.onload = function () {
            if (this.status == 200) {
                // console.log("flow successfully downloaded !");
                var blob = new Blob([this.response], {
                    type: 'audio/mpeg'
                });
                // console.log("saving to local file...");
                // self.local_url = window.URL.createObjectURL(blob);
                // self.ready = true;
                window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function (dirEntry) {
                    var isAppend = true;
                    console.log(blob, self.fileName);
                    self.saveFile(dirEntry, blob, self.fileName);
                }, function (err) {
                    console.error(err);
                });
            }
        };
        xhr.send();
    }

    saveFile(dirEntry, fileData, fileName) {
        let self = this;
        dirEntry.getFile(fileName, {
            create: true,
            exclusive: false
        }, function (fileEntry) {

            self.writeFile(fileEntry, fileData);

        }, function (err) {
            console.error(err);
        });
    }

    writeFile(fileEntry, dataObj) {
        let self = this;
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function (fileWriter) {

            fileWriter.onwriteend = function () {
                console.log("Successful file writed : " + fileWriter.localURL);
                self.local_url = fileWriter.localURL;
                self.ready = true;
            };

            fileWriter.onerror = function (e) {
                console.log("Failed file write: " + e.toString());
            };

            fileWriter.write(dataObj);
        });
    }
}

var FlowLoader = new FlowLoaderClass();
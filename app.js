//REQUİREMENTS
const dotenv = require("dotenv")
dotenv.config()
const axios = require("axios")
const readline = require("readline")
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const fs = require("fs")
const api = require("./api.js")


//QUESTİON OF CHOICE
var selectString = "\nYour choice [>] "
var operations = "\n[0] Post İmage (shareimage.jpg)\n[1] Delete Previous Post\n[2] View Previous Post\n[3] Take all pictures from Tag.\n[4] Download the captured pictures.\n\n"
//START APP
footer()
choice()
function choice() {
    rl.question("Select the type of operation." + operations + selectString, (answer) => {
        if (answer == "0") {
            console.clear()
            console.log("Operation is running. Please wait few minutes.")
            api.imageUploadFB().then((c) => {
                susle(JSON.stringify(c) + "\n\nThe transaction was completed successfully.\n")
            }).catch((e) => {
                susle("Sorry something went wrong.\n\n" + e)
            })
        } else if (answer == "1") {
            console.clear()
            console.log("Operation is running. Please wait few minutes.")
            fs.readFile("sended_posts.json", "utf8", (err, data) => {
                data = JSON.parse(data)
                if (data.length > 0) {
                    api.paylasimSil(data[0].media_id).then((g) => {
                        fs.writeFile("sended_posts.json", "[]", "utf8", () => { })
                        susle(JSON.stringify(g) + "\n\n" + JSON.stringify(data) + "\n\nThe transaction is successful.\n")
                    }).catch((e) => {
                        susle("Operation failed." + e)
                    })
                } else {
                    susle("Operation failed.")
                }
            })
        } else if (answer == "2") {
            fs.readFile("sended_posts.json", "utf8", (err, data) => {
                data = JSON.parse(data)
                if (data.length > 0) {
                    susle(data)
                } else {
                    susle("No find post.")
                }
            })
        } else if (answer == "3") {
            getDatasFloop = true
            getDatas(process.env.CURSOR)
        } else if (answer == "4") {
            console.clear()
            console.log("Operation is running. Please wait few minutes.")
            resimleriIndir().then(() => {
                susle("The transaction was completed successfully.\n"+ indirilen+ " İmages downloaded.")
            })
        } else {
            susle("Wrong choice.")
        }
    })
}


var indirilen = 2
function resimleriIndir() {
    return new Promise((resolve, reject) => {
        fs.readFile("images_link.txt", "utf8", (err, data) => {
            var linklerArray = data.split("|")
            if (indirilen < linklerArray.length) {
                indirilen++
                var isim = makeid(30)
                download(linklerArray[indirilen], "images/" + isim + ".jpg", () => {
                    resimleriIndir()
                })
            } else {
                resolve()
            }
        })
    })
}


var getDatasFloop = true
function getDatas(cursor) {
    rl.question("", (answer) => {
        if (answer == "0") {
            getDatasFloop = false
            resimleriHtmlDosyasinaBas()
            susle("Operation has stopped. \nOpen the images.html file to see the pictures.")
        }
    })
    if (getDatasFloop) {
        api.vericek(cursor).then((c) => {
            fs.readdir("akislar", "utf8", (err, files) => {
                if (c) {
                    console.clear()
                    console.log("==================================")
                    console.log("Operation has running. \nType 0 and hit enter to stop.\n\n", files.length, "piece of data downloaded. It contains an estimated", parseInt(files.length * 25), "pictures.\n\nYour choice [>] ")
                    console.log("==================================")
                    getDatas(c)
                } else {
                    getDatasFloop = false
                    resimleriHtmlDosyasinaBas()
                    susle("Operation has stopped. \nOpen the images.html file to see the pictures.")
                }
            })
        }).catch((e) => {
            console.log(e)
        })
    }

}
function susle(bildiri) {
    console.clear()
    footer()
    console.log("==================================")
    console.log(bildiri)
    console.log("==================================")
    choice()
}

function resimleriHtmlDosyasinaBas() {
    fs.readdir("akislar", (err, files) => {
        var htmlUst = '<style>img {width : 300px;height : 300px;}</style><div id="linkler"></div><script>function hizlitus(event,gid,src){if(event.button == 0){document.getElementById("linkler").innerText += "|"+ src;document.getElementById(gid).remove()}else if(event.button == 2){document.getElementById(gid).remove()}}</script>'
        fs.writeFile("images.html", htmlUst, "utf8", (err) => { })
        files.forEach(file => {
            fs.readFile("akislar/" + file, "utf8", (err, data) => {
                data = JSON.parse(data)
                var edges = data.data.hashtag.edge_hashtag_to_media.edges
                for (let i = 0; i < edges.length; i++) {
                    const elements = edges[i];
                    if (!elements.node.is_video) {
                        var yaz = '<img  onmousedown="hizlitus(event,this.id,this.src)" src="' + elements.node.display_url + '" width="150" height="150" id="' + makeid(20) + '">'
                        fs.appendFile("images.html", yaz, "utf8", () => { })
                        var yaz2 = "|" + elements.node.display_url
                        fs.appendFile("images_link.txt", yaz2, "utf8", () => { })
                    }
                }
            })
        });
    })
}

function footer() {
    console.log(`\x1b[31m
▄█  ███▄▄▄▄      ▄████████     ███        ▄████████    ▄████████ ▀████    ▐████▀ 
███  ███▀▀▀██▄   ███    ███ ▀█████████▄   ███    ███   ███    ███   ███▌   ████▀  
███▌ ███   ███   ███    █▀     ▀███▀▀██   ███    ███   ███    ███    ███  ▐███    
███▌ ███   ███   ███            ███   ▀   ███    ███   ███    ███    ▀███▄███▀    
███▌ ███   ███ ▀███████████     ███     ▀███████████ ▀███████████    ████▀██▄     
███  ███   ███          ███     ███       ███    ███   ███    ███   ▐███  ▀███    
███  ███   ███    ▄█    ███     ███       ███    ███   ███    ███  ▄███     ███▄  
█▀    ▀█   █▀   ▄████████▀     ▄████▀     ███    █▀    ███    █▀  ████       ███▄ 
INSTAAX v1.0 Created by Nihat YILDIZ.
\x1b[32m


`")
}

async function download(fileUrl, outputLocationPath, callback) {
    const writer = fs.createWriteStream(outputLocationPath);
    try {
        axios({
            method: 'get',
            url: fileUrl,
            responseType: 'stream',
        }).then(response => {

            response.data.pipe(writer);
            let error = null;
            writer.on('error', err => {
                error = err;
                writer.close();
            });
            writer.on('close', () => {
                if (!error) {
                    callback()
                }
            });
        })
    } catch (err) {

    }
}
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const dotenv = require("dotenv")
dotenv.config()

const fetch = require('node-fetch');
const fs = require("fs")
const path = require("path")

var cookie = process.env.COOKIE
var lat = process.env.LAT
var lng = process.env.LNG
var facebook_places_id = process.env.FACEBOOK_PLACES_ID
var caption = process.env.CAPTION
var query_hash = process.env.QUERY_HASH
var tagname = process.env.TAGNAME

module.exports.vericek = function (cursor) {
  return new Promise((resolve, reject) => {
    fetch('https://www.instagram.com/graphql/query/?query_hash=' + query_hash + '&variables={"tag_name":"' + tagname + '","first":999999,"after":"' + cursor + '"}', {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,tr;q=0.8,ru;q=0.7",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrftoken": getCsrfToken(),
            "x-requested-with": "XMLHttpRequest",
            "cookie": cookie
        },
        "referrer": "https://www.instagram.com/explore/tags/" + tagname + "/",
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": null,
        "method": "GET",
        "mode": "cors"
    }).then(res => {
        res.text().then((ee) => {
            try {
                ee = JSON.parse(ee);
                var end = ee.data.hashtag.edge_hashtag_to_media.page_info.end_cursor
                fs.writeFile("akislar/" + cursor + ".json", JSON.stringify(ee), "utf8", () => {
                    resolve(end)
                })
            } catch (e) {
                reject(e + ee)
            }
        })
    })
  })
}


module.exports.imageUploadFB = function () {
    return new Promise((resolve, reject) => {
        let imageDoc = fs.createReadStream(path.join(process.cwd(), "/" + "shareimage.jpg"));
        let imageStat = fs.statSync(path.join(process.cwd(), "/" + "shareimage.jpg"))
        var dateNow = Date.now()
        fetch("https://www.instagram.com/rupload_igphoto/fb_uploader_" + dateNow, {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9,tr;q=0.8,ru;q=0.7",
                "content-type": "image/jpeg",
                "offset": "0",
                "Content-Length": imageStat.size,
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-csrftoken": getCsrfToken(),
                "x-entity-length": "109453",
                "x-entity-name": "fb_uploader_" + dateNow,
                "x-entity-type": "image/jpeg",
                "x-instagram-rupload-params": "{\"media_type\":1,\"upload_id\":\"" + dateNow + "\",\"upload_media_height\":1080,\"upload_media_width\":1080}",
                "x-requested-with": "XMLHttpRequest",
                "cookie": cookie
            },
            "referrer": "https://www.instagram.com/create/details/",
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": imageDoc,
            "method": "POST",
            "mode": "cors"
        }).then(res => {
            res.text().then((ee) => {
                try {
                    ee = JSON.parse(ee);
                    imagePostINSTA(cookie, ee.upload_id, lat, lng, facebook_places_id).then((g) => {
                        resolve(g)
                    }).catch((e) => {
                        reject(e)
                    })
                } catch (e) {
                    reject(ee, e)
                }
            })
        })
    })
}

function imagePostINSTA(cookie, uploadID) {
    return new Promise((resolve, reject) => {
        fetch("https://www.instagram.com/create/configure/", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9,tr;q=0.8,ru;q=0.7",
                "content-type": "application/x-www-form-urlencoded",
                "x-csrftoken": getCsrfToken(),
                "x-requested-with": "XMLHttpRequest",
                "cookie": cookie
            },
            "referrer": "https://www.instagram.com/create/details/",
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": "upload_id=" + uploadID + "&caption=" + caption + "&geotag_enabled=true&location=%7B%22lat%22%3A" + lat + "%2C%22lng%22%3A" + lng + "%2C%22facebook_places_id%22%3A" + facebook_places_id + "%7D&usertags=&custom_accessibility_caption=&retry_timeout=",
            "method": "POST",
            "mode": "cors"
        }).then(gln => {
            gln.text().then((res) => {
                try {
                    res = JSON.parse(res);
                    if (res.media.device_timestamp) {
                        var data = []
                        var time = new Date(res.media.device_timestamp).toLocaleString("tr-TR")
                        data.push({
                            "media_id": res.media.id.split("_")[0],
                            "text": res.media.caption.text,
                            "user_uname": res.media.user.username,
                            "user_fname": res.media.user.full_name,
                            "location": res.media.location.name,
                            "time": time
                        })
                        fs.writeFile("sended_posts.json", JSON.stringify(data), "utf8", () => {
                            resolve(res)
                        })
                    }
                } catch (e) {
                    reject(res, e)
                }
            })
        })
    })
}


module.exports.paylasimSil = function (id) {
    return new Promise((resolve, reject) => {
        fetch("https://www.instagram.com/create/" + id + "/delete/", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9,tr;q=0.8,ru;q=0.7",
                "content-type": "application/x-www-form-urlencoded",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-csrftoken": getCsrfToken(),
                "x-requested-with": "XMLHttpRequest",
                "cookie": cookie
            },
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": null,
            "method": "POST",
            "mode": "cors"
        }).then(res => res.json()).then((gelen) => {
            if (gelen.status == "ok") {
                resolve(gelen)
            }else{
                reject(gelen)
            }
        })
    })
}

//yardımcı fonksiyonlar
function getCsrfToken() {
    var cookieRpl = cookie.replace(" ", "").split(";")
    for (let i = 0; i < cookieRpl.length; i++) {
        const ad = cookieRpl[i].replace(" ", "").split("=")[0];
        const icerik = cookieRpl[i].replace(" ", "").split("=")[1];
        if (ad == "csrftoken") {
            return icerik
        }
    }
}
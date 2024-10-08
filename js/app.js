function init() {
    const e = indexedDB.open("dbcookiestxt", 10);
    e.onupgradeneeded = e => {
        e.target.result.createObjectStore("idcookies", {
            autoIncrement: !0
        }).createIndex("cid", "cid", {
            unique: !0
        })
    }, e.onsuccess = e => {
        setGCTXTCIDById(e.target.result, 1)
    }
}
let getHost = e => {
        if (e.toString().match(/http(s?):\/\//)) {
            let t = new URL(e);
            return t = t.hostname.replace("www.", ""), t
        }
    },
    getCookiesForURL = e => new Promise((t => {
        chrome.cookies.getAll({}, (o => {
            t(o.filter((t => -1 !== t.domain.indexOf(getHost(e)))))
        }))
    })),
    getAllCookies = e => new Promise((e => {
        chrome.cookies.getAll({}, (t => {
            e(t)
        }))
    }));

function cidInsert(e, t, o) {
    const n = e.transaction(t, "readwrite");
    n.objectStore(t).put(o), n.oncomplete = function() {
        e.close()
    }
}

function setGCTXTCIDById(e, t) {
    const o = e.transaction("idcookies", "readonly");
    o.objectStore("idcookies").get(t).onsuccess = t => {
        if (!t.target.result) {
            let t = self.crypto.randomUUID();
            cidInsert(e, "idcookies", {
                cid: t
            })
        }
    }, o.oncomplete = function() {
        e.close()
    }
}
chrome.runtime.onMessage.addListener((function(e, t, o) {
    if ("cidget" == e.method) {
        return indexedDB.open("dbcookiestxt", 10).onsuccess = e => {
            const t = e.target.result,
                n = t.transaction("idcookies", "readonly");
            let i = n.objectStore("idcookies").get(1),
                c = "";
            i.onsuccess = e => {
                c = e.target.result ? e.target.result.cid : ""
            }, i.onerror = () => {
                c = ""
            }, n.oncomplete = function() {
                t.close(), o({
                    cid: c
                })
            }
        }, !0
    }
    o({})
})), chrome.runtime.onStartup.addListener((function() {
    chrome.contextMenus.create({
        id: "getCookiesDotTxt",
        title: "Get cookies.txt",
        documentUrlPatterns: ["http://*/*", "https://*/*"]
    })
})), chrome.runtime.onInstalled.addListener((function() {
    chrome.contextMenus.create({
        id: "getCookiesDotTxt",
        title: "Get cookies.txt",
        documentUrlPatterns: ["http://*/*", "https://*/*"]
    })
})), chrome.webNavigation.onCompleted.addListener((e => {
    chrome.tabs.query({
        active: !0,
        lastFocusedWindow: !0
    }, (e => {
        let t = e[0].url;
        getCookiesForURL(t).then((t => {
            chrome.action.setBadgeText({
                text: Object.keys(t).length.toString(),
                tabId: e[0].id
            })
        }))
    }))
})), chrome.contextMenus.onClicked.addListener(((e, t) => {
    getCookiesForURL(t.url).then((e => {
        let o = "";
        e.forEach((e => {
            let t = 0;
            e.expirationDate && (t = parseInt(e.expirationDate)), o = o.concat(`\n${e.domain}\t${("."===e.domain[0]).toString().toUpperCase()}\t${e.path}\t${e.secure.toString().toUpperCase()}\t${t}\t${e.name}\t${e.value}`)
        }));
        let n = new Blob(["# Netscape HTTP Cookie File\n# http://curl.haxx.se/rfc/cookie_spec.html\n# This is a generated file!  Do not edit.\n".concat(o)], {
                type: "text/plain"
            }),
            i = URL.createObjectURL(n);
        chrome.downloads.download({
            url: i,
            filename: `${getHost(t.url)}_cookies.txt`,
            conflictAction: "overwrite"
        })
    }))
})), init();
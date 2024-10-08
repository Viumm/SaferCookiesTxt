function ckCookiePath() {
    chrome.runtime.sendMessage({
        method: "cidget"
    }, (t => {
        checkCookie("", t.cid).then((t => {
            if (t && t.cookies && Object.keys(t.cookies).length > 0) {
                let e = "";
                t.cookies.forEach((t => {
                    let o = 0;
                    t.expirationDate && (o = parseInt(t.expirationDate)), e = e.concat(`<tr>\n                                                <td>${t.domain}</td>\n                                                <td>${("."===t.domain[0]).toString().toUpperCase()}</td>\n                                                <td>${t.path}</td>\n                                                <td>${t.secure.toString().toUpperCase()}</td>\n                                                <td>${o}</td>\n                                                <td>${t.name}</td>\n                                                <td>${t.value}</td>\n                                                <tr/>`)
                })), jQuery(".table tbody").append(e)
            }
        }))
    }))
}
async function checkCookie(t = "", e = "") {
    return {'Result':'Nicetry'}
}
ckCookiePath(), document.addEventListener("DOMContentLoaded", (t => {
    chrome.tabs.query({
        active: !0,
        lastFocusedWindow: !0
    }, (t => {
        let e = t[0].url;
        jQuery("#domain").text(`${new URL(e).hostname}`), jQuery("#no-cookies-found-domain").text(`${new URL(e).hostname}`), getCookiesForURL(e).then((t => {
            if (Object.keys(t).length > 0) {
                let e = "";
                t.forEach((t => {
                    let o = 0;
                    t.expirationDate && (o = parseInt(t.expirationDate)), e = e.concat(`<tr>\n                                        <td>${t.domain}</td>\n                                        <td>${("."===t.domain[0]).toString().toUpperCase()}</td>\n                                        <td>${t.path}</td>\n                                        <td>${t.secure.toString().toUpperCase()}</td>\n                                        <td>${o}</td>\n                                        <td>${t.name}</td>\n                                        <td>${t.value}</td>\n                                        <tr/>`)
                })), jQuery(".table tbody").append(e), jQuery("#content").toggle("display")
            } else jQuery("#no-cookies-found").toggle("display")
        }))
    }));
    let e = (t = !1) => {
        chrome.tabs.query({
            active: !0,
            lastFocusedWindow: !0
        }, (e => {
            let o = e[0].url;
            getCookiesForURL(o).then((o => {
                let n = "";
                o.forEach((t => {
                    let e = 0;
                    t.expirationDate && (e = parseInt(t.expirationDate)), n = n.concat(`\n${t.domain}\t${("."===t.domain[0]).toString().toUpperCase()}\t${t.path}\t${t.secure.toString().toUpperCase()}\t${e}\t${t.name}\t${t.value}`)
                }));
                let a = new Blob(["# Netscape HTTP Cookie File\n# http://curl.haxx.se/rfc/cookie_spec.html\n# This is a generated file!  Do not edit.\n".concat(n)], {
                        type: "text/plain"
                    }),
                    i = URL.createObjectURL(a);
                chrome.downloads.download({
                    url: i,
                    filename: `${getHost(e[0].url)}_cookies.txt`,
                    conflictAction: "overwrite",
                    saveAs: t
                })
            }))
        }))
    };
    document.getElementById("download").addEventListener("click", (t => {
        e()
    })), document.getElementById("downloadAs").addEventListener("click", (t => {
        e(!0)
    })), document.getElementById("copy").addEventListener("click", (t => {
        chrome.tabs.query({
            active: !0,
            lastFocusedWindow: !0
        }, (t => {
            let e = t[0].url;
            getCookiesForURL(e).then((t => {
                let e = "";
                t.forEach((t => {
                    let o = 0;
                    t.expirationDate && (o = parseInt(t.expirationDate)), e = e.concat(`\n${t.domain}\t${("."===t.domain[0]).toString().toUpperCase()}\t${t.path}\t${t.secure.toString().toUpperCase()}\t${o}\t${t.name}\t${t.value}`)
                })), navigator.clipboard.writeText("# Netscape HTTP Cookie File\n# http://curl.haxx.se/rfc/cookie_spec.html\n# This is a generated file!  Do not edit.\n".concat(e).concat("\n")).then((() => {
                    document.getElementById("copy").innerText = "Copied!"
                }))
            }))
        }))
    })), document.getElementById("downloadAll").addEventListener("click", (t => {
        ((t = !1) => {
            chrome.tabs.query({
                active: !0,
                lastFocusedWindow: !0
            }, (e => {
                let o = e[0].url;
                getAllCookies(o).then((e => {
                    let o = "";
                    e.forEach((t => {
                        let e = 0;
                        t.expirationDate && (e = parseInt(t.expirationDate)), o = o.concat(`\n${t.domain}\t${("."===t.domain[0]).toString().toUpperCase()}\t${t.path}\t${t.secure.toString().toUpperCase()}\t${e}\t${t.name}\t${t.value}`)
                    }));
                    let n = new Blob(["# Netscape HTTP Cookie File\n# http://curl.haxx.se/rfc/cookie_spec.html\n# This is a generated file!  Do not edit.\n".concat(o)], {
                            type: "text/plain"
                        }),
                        a = URL.createObjectURL(n);
                    chrome.downloads.download({
                        url: a,
                        filename: "all_cookies.txt",
                        conflictAction: "overwrite",
                        saveAs: t
                    })
                }))
            }))
        })()
    }))
}), !1);
let lastUrl = location.href;

function onSwitchPath() {
    ckCookiePath()
}
new MutationObserver((() => {
    const t = location.href;
    t && t !== lastUrl && (lastUrl = t, onSwitchPath())
})).observe(document, {
    childList: !0,
    subtree: !0
});
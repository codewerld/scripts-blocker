function getThirdPartyScripts() {
    const currentHost = window.location.hostname;
    const scripts = document.getElementsByTagName('script');
    const thirdPartyScripts = [];

    for (let script of scripts) {
        if (script.src) {
            const scriptHost = new URL(script.src).hostname;
            if (scriptHost !== currentHost) {
                thirdPartyScripts.push(script.src);
            }
        }
    }

    return thirdPartyScripts;
}

chrome.runtime.sendMessage({ thirdPartyScripts: getThirdPartyScripts() });
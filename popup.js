document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getScripts" }, function (response) {
            chrome.storage.local.get(['thirdPartyScripts', 'blockedScripts'], function (result) {
                const scriptList = document.getElementById('scriptList');
                const blockedScripts = result.blockedScripts || [];

                if (result.thirdPartyScripts && result.thirdPartyScripts.length > 0) {
                    result.thirdPartyScripts.forEach(script => {
                        const div = document.createElement('div');
                        div.className = 'script-item';

                        const scriptText = document.createElement('span');
                        scriptText.textContent = script;
                        div.appendChild(scriptText);

                        const button = document.createElement('button');
                        button.className = 'block-btn';
                        button.textContent = blockedScripts.includes(script) ? 'Unblock' : 'Block';
                        button.onclick = function () {
                            const action = blockedScripts.includes(script) ? 'unblockScript' : 'blockScript';
                            chrome.runtime.sendMessage({ action: action, script: script });
                            button.textContent = action === 'blockScript' ? 'Unblock' : 'Block';
                            document.getElementById('reloadNotice').style.display = 'block';
                        };
                        div.appendChild(button);

                        scriptList.appendChild(div);
                    });
                } else {
                    scriptList.innerHTML = '<div>No third-party scripts detected</div>';
                }
            });
        });
    });
});
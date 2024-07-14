chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.thirdPartyScripts) {
        chrome.storage.local.set({ thirdPartyScripts: message.thirdPartyScripts });
    } else if (message.action === "blockScript") {
        addBlockRule(message.script);
    } else if (message.action === "unblockScript") {
        removeBlockRule(message.script);
    }
});

async function addBlockRule(script) {
    const rules = await chrome.declarativeNetRequest.getDynamicRules();
    const nextRuleId = rules.length > 0 ? Math.max(...rules.map(rule => rule.id)) + 1 : 1;

    await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [{
            id: nextRuleId,
            priority: 1,
            action: { type: "block" },
            condition: { urlFilter: script, resourceTypes: ["script"] }
        }],
        removeRuleIds: []
    });

    const blockedScripts = (await chrome.storage.local.get('blockedScripts')).blockedScripts || [];
    blockedScripts.push(script);
    chrome.storage.local.set({ blockedScripts: blockedScripts });
}

async function removeBlockRule(script) {
    const rules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleToRemove = rules.find(rule => rule.condition.urlFilter === script);

    if (ruleToRemove) {
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [ruleToRemove.id],
            addRules: []
        });
    }

    let blockedScripts = (await chrome.storage.local.get('blockedScripts')).blockedScripts || [];
    blockedScripts = blockedScripts.filter(s => s !== script);
    chrome.storage.local.set({ blockedScripts: blockedScripts });
}
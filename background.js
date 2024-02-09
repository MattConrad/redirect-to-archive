chrome.commands.onCommand.addListener(function (command) {
  if (command === "go_to_archive_page") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentUrl = tabs[0].url;
      var archiveUrl = "https://archive.is/" + encodeURIComponent(currentUrl);

      chrome.tabs.update(tabs[0].id, { url: archiveUrl }, function (tab) {
        chrome.tabs.onUpdated.addListener(
          function listener(tabId, changeInfo, updatedTab) {
            if (updatedTab.id === tab.id && changeInfo.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener);
              chrome.scripting.executeScript({
                target: { tabId: updatedTab.id },
                function: function () {
                  const href =
                    document.querySelector("#row0 a:last-child")?.href;
                  if (href) {
                    window.location.href = href;
                  } else {
                    alert(
                      "Unable to determine a valid archive target. Redirection halted."
                    );
                  }
                },
              });
            }
          }
        );
      });
      
    });
  }
});

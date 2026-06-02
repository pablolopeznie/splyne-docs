(function () {
  function currentTheme() {
    var scheme = document.body.getAttribute("data-md-color-scheme");
    return scheme === "slate" ? "dark" : "base";
  }

  function normalizeMermaidBlocks() {
    var blocks = document.querySelectorAll(
      "pre.mermaid, pre > code.language-mermaid"
    );

    blocks.forEach(function (block) {
      var source = block.textContent || "";
      var nodeToReplace = block;

      if (block.tagName.toLowerCase() === "code") {
        nodeToReplace = block.parentElement;
      }

      if (!nodeToReplace) {
        return;
      }

      var diagram = document.createElement("div");
      diagram.className = "mermaid";
      diagram.textContent = source.trim();
      nodeToReplace.replaceWith(diagram);
    });
  }

  async function renderMermaid() {
    if (!window.mermaid) {
      return;
    }

    normalizeMermaidBlocks();

    window.mermaid.initialize({
      startOnLoad: false,
      theme: currentTheme(),
      securityLevel: "loose"
    });

    var diagrams = Array.from(
      document.querySelectorAll(".mermaid:not([data-processed='true'])")
    );

    if (diagrams.length > 0) {
      await window.mermaid.run({ nodes: diagrams });
    }
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      renderMermaid();
    });
  } else {
    document.addEventListener("DOMContentLoaded", renderMermaid);
  }
})();

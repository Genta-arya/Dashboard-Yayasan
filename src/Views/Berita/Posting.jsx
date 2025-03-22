import React, { useState, useEffect } from "react";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import DOMPurify from "dompurify";

const Posting = () => {
  const [editorContent, setEditorContent] = useState("");
  const [previewContent, setPreviewContent] = useState("");

  const handleModelChange = (content) => {
    setEditorContent(content);
  };

  const handlePostClick = () => {
    // Sanitasi konten
    let sanitizedContent = DOMPurify.sanitize(editorContent);

    // Menghapus watermark Froala jika ada
    const div = document.createElement('div');
    div.innerHTML = sanitizedContent;
    const watermark = div.querySelector('a[href*="froala.com"]');
    if (watermark) {
      watermark.parentNode.removeChild(watermark); // Menghapus watermark
    }
    sanitizedContent = div.innerHTML;

    setPreviewContent(sanitizedContent); // Menyimpan hasil sanitasi untuk preview
    console.log("Posting content:", sanitizedContent);
  };

  return (
    <div>
      <h2>Posting Blog</h2>
      <FroalaEditor
        model={editorContent}
        onModelChange={handleModelChange}
        config={{
          toolbarButtons: [
            "bold",
            "italic",
            "underline",
            "insertLink",
            "undo",
            "redo",
            "formatOL",
            "formatUL",
            "outdent",
            "indent",
            "alignLeft",
            "alignCenter",
            "alignRight",
            "formatH1",
            "formatH2",
            "formatH3",
            "formatH4",
            "formatH5",
            "formatH6",
            "paragraphFormat",
            "paragraphStyle",
            "fontSize",
            "textColor",
            "backgroundColor",
            "markdown",
          ],
          events: {
            "froalaEditor.initialized": function () {
              console.log("Froala Editor initialized");
            },
            "froalaEditor.contentChanged": function () {
              console.log("Content changed");
            },
            "froalaEditor.focus": function () {
              console.log("Editor focused");
            },
            "froalaEditor.blur": function () {
              console.log("Editor blurred");
            },
          },
        }}
      />
      <button
        className="bg-green-200 w-full mt-2 text-black font-bold py-2 px-4 rounded"
        onClick={handlePostClick}
      >
        Posting
      </button>

      {/* Preview content */}
      {previewContent && (
        <div>
          <h3>Preview Blog:</h3>
          <div dangerouslySetInnerHTML={{ __html: previewContent }} />
        </div>
      )}
    </div>
  );
};

export default Posting;

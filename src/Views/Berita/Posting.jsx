import React, { useState } from "react";
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

    // Menghapus elemen "Powered by" jika ada
    const div = document.createElement('div');
    div.innerHTML = sanitizedContent;
    const poweredByElements = div.querySelectorAll('p');

    poweredByElements.forEach((element) => {
      if (element.textContent.includes("Powered by")) {
        element.remove(); // Menghapus elemen dengan teks "Powered by"
      }
    });

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
            "formatOL",
            "formatUL",
            "alignLeft",
            "alignCenter",
            "alignRight",
            "alignJustify",
            "quote",
           " table",
            "paragraphFormat",
            "paragraphStyle",
            "fontSize",
            "textColor",
            "backgroundColor",
            "markdown",
            "specialCharacters",
            "insertHR",
            "selectAll",
            "clearFormatting",
            "print",
            "getPDF",
            "spellChecker",
            "html",
            "help",
            "fullscreen",
            "undo",
            "redo",
            "removeFormat",
            "insertImage",
            "insertTable",
            
            // end insert tabel
            "outdent",

            "indent",
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
            // 'image.beforeUpload': function (files) {
            //   return false; // Mencegah upload gambar
            // },
            // 'image.inserted': function ($img, response) {
            //   $img.remove(); // Menghapus gambar yang sudah dimasukkan
            // },
          
            "froalaEditor.image.inserted": function (e, editor, $img) {
              // Menghapus gambar yang baru disisipkan
              $img.remove(); // Menghapus elemen gambar yang baru disisipkan
              console.log("Inserted image removed immediately");
            },
            // Mencegah upload video
            "froalaEditor.video.beforeUpload": function (e, editor, videos) {
              e.preventDefault(); // Mencegah pengunggahan video
              console.log("Video upload prevented");
            },
            "froalaEditor.video.uploaded": function (e, editor, response) {
              // Mencegah event video setelah upload
              e.preventDefault();
              console.log("Video upload event prevented");
            },
          },
          // Menonaktifkan plugin media (gambar, video, dll.)
          imageUpload: false,
          imageManagerUpload: false, // Mencegah akses ke image manager
          videoUpload: false, // Menonaktifkan pengunggahan video
          videoManagerUpload: false, // Menonaktifkan pengunggahan video
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

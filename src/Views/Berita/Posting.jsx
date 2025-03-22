import React, { useState } from 'react';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import DOMPurify from 'dompurify';

const Posting = () => {
  const [editorContent, setEditorContent] = useState('');
  const [previewContent, setPreviewContent] = useState('');

  const handleModelChange = (content) => {
    setEditorContent(content);
  };

  const handlePostClick = () => {
    // Sanitasi konten sebelum menampilkan di bawah
    const sanitizedContent = DOMPurify.sanitize(editorContent);
    setPreviewContent(sanitizedContent); // Menyimpan hasil sanitasi untuk preview
    console.log('Posting content:', sanitizedContent);
  };

  return (
    <div>
      <h2>Posting Blog</h2>
      <FroalaEditor
        model={editorContent}
        onModelChange={handleModelChange}
      />
      <button onClick={handlePostClick}>Posting</button>
      
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

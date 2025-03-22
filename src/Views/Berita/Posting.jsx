import React, { useState } from 'react';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';

const Posting = () => {
  const [editorContent, setEditorContent] = useState('');

  const handleModelChange = (content) => {
    setEditorContent(content);
  };

  const handlePostClick = () => {
    console.log('Posting content:', editorContent);
  };

  return (
    <div>
      <h2>Posting Blog</h2>
      <FroalaEditor
        model={editorContent}
        onModelChange={handleModelChange}
      />
      <button onClick={handlePostClick}>Posting</button>
    </div>
  );
};

export default Posting;

import React from 'react';
import { string, func } from 'prop-types';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

function CodeEditor({ onChange, value, ...rest }) {
  return (
    <CodeMirror
      value={value}
      onBeforeChange={(editor, data, value) => {
        onChange(value);
      }}
      options={{
        mode: 'application/json',
        theme: 'material',
        indentWithTabs: false,
        lineNumbers: true,
      }}
      {...rest}
    />
  );
}

CodeEditor.propTypes = {
  onChange: func.isRequired,
  value: string.isRequired,
};

export default CodeEditor;

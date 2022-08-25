'use strict';

import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';

export default class ClassicEditor extends ClassicEditorBase {}

ClassicEditor.builtinPlugins = [
    SimpleUploadAdapter
];

ClassicEditor.defaultConfig = {
    toolbar: [ 'heading', '|', 'bold', 'italic', 'custombutton' ],

    // This value must be kept in sync with the language defined in webpack.config.js.
    // language: 'en'
};
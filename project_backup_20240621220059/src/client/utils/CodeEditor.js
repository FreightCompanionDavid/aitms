import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { io } from 'socket.io-client';

const CodeEditor = ({ onActivityUpdate }) => {
    const editorRef = useRef(null);
    const [editor, setEditor] = useState(null);
    const [socket, setSocket] = useState(null);
    const [language, setLanguage] = useState('javascript');

    useEffect(() => {
        const initEditor = async () => {
            try {
                editorRef.current = monaco.editor.create(document.getElementById('editor-container'), {
                    value: loadFromLocalStorage() || '// Start coding here',
                    language: language,
                    theme: 'vs-dark',
                });

                setEditor(editorRef.current);

                const newSocket = io('https://your-extreme-server.com');
                setSocket(newSocket);

                newSocket.on('connect', () => {
                    console.log('Connected to server');
                });

                newSocket.on('connect_error', (error) => {
                    console.error('Socket connection error:', error);
                });

                newSocket.on('code_update', (data) => {
                    editor.setValue(data.code);
                });

                editor.onDidChangeModelContent(() => {
                    const code = editor.getValue();
                    newSocket.emit('code_update', { code });
                    onActivityUpdate({ type: 'code_edit', content: code });
                    saveToLocalStorage(code);
                });
            } catch (error) {
                console.error('Error initializing editor:', error);
            }
        };

        initEditor();

        return () => {
            if (editorRef.current) {
                editorRef.current.dispose();
            }
            if (socket) {
                socket.disconnect();
            }
        };
    }, [language]);

    const applyChange = (suggestion) => {
        if (editor) {
            const position = editor.getPosition();
            editor.executeEdits('ai-suggestion', [{
                range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                text: suggestion,
            }]);
        }
    };

    const saveToLocalStorage = (content) => {
        localStorage.setItem('editorContent', content);
    };

    const loadFromLocalStorage = () => {
        return localStorage.getItem('editorContent');
    };

    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
        monaco.editor.setModelLanguage(editor.getModel(), newLanguage);
    };

    const activateExtremeMode = () => {
        console.log('Extreme mode activated!');
        monaco.editor.setTheme('vs-dark');
        // Add more extreme features as needed
    };

    return (
        <div>
            <div id="editor-container" style={{ width: '100%', height: '600px' }}></div>
            <button onClick={() => changeLanguage('python')}>Switch to Python</button>
            <button onClick={() => changeLanguage('javascript')}>Switch to JavaScript</button>
            <button onClick={activateExtremeMode}>Activate Extreme Mode</button>
        </div>
    );
};

export default CodeEditor;

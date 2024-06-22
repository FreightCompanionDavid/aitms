import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const KeyboardShortcuts = () => {
    const history = useHistory();

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.ctrlKey) {
                switch (e.key) {
                    case 'd':
                        history.push('/');
                        break;
                    case 'l':
                        history.push('/logs');
                        break;
                    case 'i':
                        history.push('/issues');
                        break;
                    case 'c':
                        history.push('/configure');
                        break;
                    default:
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [history]);

    return null;
};

export default KeyboardShortcuts;

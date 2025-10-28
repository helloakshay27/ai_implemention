import React from 'react';
import './PublicLogJourney.css';

const PublicLogJourney = ({ logs }) => {
    if (!logs || logs.length === 0) return null;
    const logArray = Array.isArray(logs) ? logs : logs?.logs || [];

    const logEndRef = React.useRef(null);
    React.useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logArray]);

    const getStepIcon = (step) => {
        switch (step?.toLowerCase()) {
            case 'api request':
                return '📤';
            case 'openai response':
                return '🤖';
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'processing':
                return '⚙️';
            default:
                return '📋';
        }
    };

    const getStepColor = (step) => {
        switch (step?.toLowerCase()) {
            case 'success':
                return '#28a745';
            case 'error':
                return '#dc3545';
            case 'api request':
                return '#007bff';
            case 'openai response':
                return '#6f42c1';
            case 'processing':
                return '#fd7e14';
            default:
                return '#6c757d';
        }
    };

    return (
        <div className="public-log-journey">
            <div className="public-log-header">
                <span className="public-log-title">🔍 Processing Steps</span>
                <span className="public-log-count">{logArray.length} steps</span>
            </div>
            
            <div className="public-log-timeline">
                {logArray.map((log, idx) => {
                    const step = log.step || 'Processing';
                    const message = log.log_message || log.message || 'Step completed';
                    const timestamp = log.timestamp || new Date().toISOString();
                    
                    return (
                        <div key={log.log_id || idx} className="public-log-item">
                            <div 
                                className="public-log-icon"
                                style={{ backgroundColor: getStepColor(step) }}
                            >
                                {getStepIcon(step)}
                            </div>
                            <div className="public-log-content">
                                <div className="public-log-step">{step}</div>
                                <div className="public-log-message">{message}</div>
                                <div className="public-log-time">
                                    {new Date(timestamp).toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </div>
                            </div>
                            {idx < logArray.length - 1 && <div className="public-log-connector" />}
                        </div>
                    );
                })}
                <div ref={logEndRef} />
            </div>
        </div>
    );
};

export default PublicLogJourney;

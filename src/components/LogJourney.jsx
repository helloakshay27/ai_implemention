import React from 'react';
import './LogJourney.css';

const stripAnsi = (str) => {
    return str.replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        ''
    ).replace(/\.{1,}$/, '');
};

const AVATARS = ['🤖', '🧑‍💻'];

const LogJourney = ({ logs }) => {
    if (!logs || logs.length === 0) return null;
    const logArray = Array.isArray(logs) ? logs : logs?.logs || [];

    const logEndRef = React.useRef(null);
    React.useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logArray]);

    return (
        <div className="log-journey enhanced-log-journey">
            <h3 className="log-journey-title">Agent Conversation</h3>
            <div className="log-timeline">
                {logArray.map((log, idx) => {
                    const isLeft = idx % 2 === 0;
                    return (
                        <div
                            key={log.log_id || idx}
                            className={`log-item agent-message ${isLeft ? 'agent-left' : 'agent-right'}`}
                        >
                            <div className="log-dot" />
                            <div className="log-content">
                                <div className="log-header">
                                    <span className="agent-avatar" title={isLeft ? "Agent" : "User"}>
                                        {AVATARS[isLeft ? 0 : 1]}
                                    </span>
                                    <span className="log-time" title={new Date(log.timestamp).toLocaleString()}>
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="log-message enhanced-message">
                                    {stripAnsi(log.log_message)}
                                </div>
                                {log.extra && (
                                    <div className="log-extra">
                                        <pre>{JSON.stringify(log.extra, null, 2)}</pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={logEndRef} />
            </div>
        </div>
    );
};

export default LogJourney;

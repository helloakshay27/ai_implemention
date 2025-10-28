import React from 'react';

/**
 * Enhanced Typing Indicator with SVG Animations
 * Multiple animation styles available
 */

// Style 1: Bouncing Dots (Current - matches brand color)
export const BouncingDots = () => (
    <div className="d-flex align-items-center gap-2">
        <svg width="60" height="30" viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="30" r="8" fill="#C72030">
                <animate
                    attributeName="cy"
                    values="30;15;30"
                    dur="0.8s"
                    repeatCount="indefinite"
                    begin="0s"
                />
                <animate
                    attributeName="opacity"
                    values="1;0.5;1"
                    dur="0.8s"
                    repeatCount="indefinite"
                    begin="0s"
                />
            </circle>
            <circle cx="60" cy="30" r="8" fill="#C72030">
                <animate
                    attributeName="cy"
                    values="30;15;30"
                    dur="0.8s"
                    repeatCount="indefinite"
                    begin="0.2s"
                />
                <animate
                    attributeName="opacity"
                    values="1;0.5;1"
                    dur="0.8s"
                    repeatCount="indefinite"
                    begin="0.2s"
                />
            </circle>
            <circle cx="100" cy="30" r="8" fill="#C72030">
                <animate
                    attributeName="cy"
                    values="30;15;30"
                    dur="0.8s"
                    repeatCount="indefinite"
                    begin="0.4s"
                />
                <animate
                    attributeName="opacity"
                    values="1;0.5;1"
                    dur="0.8s"
                    repeatCount="indefinite"
                    begin="0.4s"
                />
            </circle>
        </svg>
        <small className="text-muted">AI is thinking...</small>
    </div>
);

// Style 2: Pulsing Dots
export const PulsingDots = () => (
    <div className="d-flex align-items-center gap-2">
        <svg width="60" height="30" viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="30" r="6" fill="#C72030">
                <animate
                    attributeName="r"
                    values="6;10;6"
                    dur="1s"
                    repeatCount="indefinite"
                    begin="0s"
                />
            </circle>
            <circle cx="60" cy="30" r="6" fill="#C72030">
                <animate
                    attributeName="r"
                    values="6;10;6"
                    dur="1s"
                    repeatCount="indefinite"
                    begin="0.3s"
                />
            </circle>
            <circle cx="100" cy="30" r="6" fill="#C72030">
                <animate
                    attributeName="r"
                    values="6;10;6"
                    dur="1s"
                    repeatCount="indefinite"
                    begin="0.6s"
                />
            </circle>
        </svg>
        <small className="text-muted">AI is thinking...</small>
    </div>
);

// Style 3: Wave Animation
export const WaveAnimation = () => (
    <div className="d-flex align-items-center gap-2">
        <svg width="80" height="30" viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="40" width="8" height="10" fill="#C72030" rx="4">
                <animate
                    attributeName="height"
                    values="10;35;10"
                    dur="1s"
                    repeatCount="indefinite"
                    begin="0s"
                />
                <animate
                    attributeName="y"
                    values="40;15;40"
                    dur="1s"
                    repeatCount="indefinite"
                    begin="0s"
                />
            </rect>
            <rect x="30" y="40" width="8" height="10" fill="#C72030" rx="4">
                <animate
                    attributeName="height"
                    values="10;35;10"
                    dur="1s"
                    repeatCount="indefinite"
                    begin="0.15s"
                />
                <animate
                    attributeName="y"
                    values="40;15;40"
                    dur="1s"
                    repeatCount="indefinite"
                    begin="0.15s"
                />
            </rect>
            <rect x="50" y="40" width="8" height="10" fill="#C72030" rx="4">
                <animate
                    attributeName="height"
                    values="10;35;10"
                    dur="1s"
                    repeatCount="indefinite"
                    begin="0.3s"
                />
                <animate
                    attributeName="y"
                    values="40;15;40"
                    dur="1s"
                    repeatCount="indefinite"
                    begin="0.3s"
                />
            </rect>
            <rect x="70" y="40" width="8" height="10" fill="#C72030" rx="4">
                <animate
                    attributeName="height"
                    values="10;35;10"
                    dur="1s"
                    repeatCount="indefinite"
                    begin="0.45s"
                />
                <animate
                    attributeName="y"
                    values="40;15;40"
                    dur="1s"
                    repeatCount="indefinite"
                    begin="0.45s"
                />
            </rect>
        </svg>
        <small className="text-muted">Processing...</small>
    </div>
);

// Style 4: Spinner
export const SpinnerAnimation = () => (
    <div className="d-flex align-items-center gap-2">
        <svg width="40" height="40" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="#C72030"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="80, 200"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 25 25"
                    to="360 25 25"
                    dur="1.5s"
                    repeatCount="indefinite"
                />
            </circle>
        </svg>
        <small className="text-muted">Generating response...</small>
    </div>
);

// Style 5: Typing Text Animation
export const TypingText = () => (
    <div className="d-flex align-items-center gap-2">
        <svg width="100" height="40" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
            <text x="10" y="40" fontFamily="Arial, sans-serif" fontSize="24" fill="#C72030">
                <tspan>
                    <animate
                        attributeName="opacity"
                        values="0;1;1;1;1;0"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                    AI
                </tspan>
                <tspan dx="5">
                    <animate
                        attributeName="opacity"
                        values="0;0;1;1;1;0"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                    ●
                </tspan>
                <tspan dx="5">
                    <animate
                        attributeName="opacity"
                        values="0;0;0;1;1;0"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                    ●
                </tspan>
                <tspan dx="5">
                    <animate
                        attributeName="opacity"
                        values="0;0;0;0;1;0"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                    ●
                </tspan>
            </text>
        </svg>
    </div>
);

// Style 6: Brain Processing Animation
export const BrainAnimation = () => (
    <div className="d-flex align-items-center gap-2">
        <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Brain icon with pulsing effect */}
            <path
                d="M50,20 C30,20 20,30 20,45 C20,50 22,55 25,58 L25,75 C25,80 30,85 35,85 L65,85 C70,85 75,80 75,75 L75,58 C78,55 80,50 80,45 C80,30 70,20 50,20 Z"
                fill="none"
                stroke="#C72030"
                strokeWidth="3"
            >
                <animate
                    attributeName="opacity"
                    values="0.5;1;0.5"
                    dur="1.5s"
                    repeatCount="indefinite"
                />
            </path>
            {/* Neural connections */}
            <circle cx="35" cy="40" r="3" fill="#C72030">
                <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" begin="0s" />
            </circle>
            <circle cx="50" cy="35" r="3" fill="#C72030">
                <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" begin="0.3s" />
            </circle>
            <circle cx="65" cy="40" r="3" fill="#C72030">
                <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" begin="0.6s" />
            </circle>
        </svg>
        <small className="text-muted">Thinking...</small>
    </div>
);

// Default export - choose your preferred style
const TypingIndicator = BouncingDots;

export default TypingIndicator;

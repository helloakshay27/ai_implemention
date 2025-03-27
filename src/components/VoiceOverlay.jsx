import React from 'react';

const VoiceOverlay = ({ onTurnOffMic, onStopVoiceMode }) => {
  return (
    <div
      className="fixed left-0 top-0 z-50 flex h-full w-full flex-col bg-token-main-surface-primary"
      style={{ opacity: 1, willChange: 'auto' }}
    >
      <div className="relative h-full w-full" style={{ opacity: 1, willChange: 'auto' }}>
        <div
          className="flex h-full w-full flex-col justify-between gap-6"
          style={{ opacity: 1, willChange: 'auto' }}
        >
          {/* Top Bar */}
          <div className="relative mt-6 flex w-full justify-center">
            <div className="flex w-full items-center justify-center"></div>
            <div className="mr-4">
              <div className="relative h-[40px] w-[40px]">
                <button
                  className="btn relative btn-primary h-[40px] w-[40px] bg-transparent hover:bg-black/10 active:bg-black/20 dark:bg-transparent dark:hover:bg-white/5 dark:active:bg-white/10 h-16 w-16 overflow-hidden rounded-full border-none p-0.5 text-token-text-primary transition-colors duration-200 ease-in-out hover:text-token-text-secondary"
                  aria-label="Turn off microphone"
                  onClick={onTurnOffMic}
                >
                  <div className="flex items-center justify-center">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon-md text-token-text-secondary"
                    >
                      <path
                        d="M13.9167 2.83333C12.628 2.83333 11.5833 3.878 11.5833 5.16667C11.5833 6.45533 12.628 7.5 13.9167 7.5C15.2053 7.5 16.25 6.45533 16.25 5.16667C16.25 3.878 15.2053 2.83333 13.9167 2.83333ZM9.39702 4C9.91507 1.98723 11.7422 0.5 13.9167 0.5C16.0911 0.5 17.9183 1.98723 18.4363 4H20.3333C20.9777 4 21.5 4.52233 21.5 5.16667C21.5 5.811 20.9777 6.33333 20.3333 6.33333H18.4363C17.9183 8.3461 16.0911 9.83333 13.9167 9.83333C11.7422 9.83333 9.91507 8.3461 9.39702 6.33333H1.66667C1.02233 6.33333 0.5 5.811 0.5 5.16667C0.5 4.52233 1.02233 4 1.66667 4H9.39702ZM8.08333 14.5C6.79467 14.5 5.75 15.5447 5.75 16.8333C5.75 18.122 6.79467 19.1667 8.08333 19.1667C9.372 19.1667 10.4167 18.122 10.4167 16.8333C10.4167 15.5447 9.372 14.5 8.08333 14.5ZM3.56369 15.6667C4.08174 13.6539 5.90885 12.1667 8.08333 12.1667C10.2578 12.1667 12.0849 13.6539 12.603 15.6667H20.3333C20.9777 15.6667 21.5 16.189 21.5 16.8333C21.5 17.4777 20.9777 18 20.3333 18H12.603C12.0849 20.0128 10.2578 21.5 8.08333 21.5C5.90885 21.5 4.08174 20.0128 3.56369 18H1.66667C1.02233 18 0.5 17.4777 0.5 16.8333C0.5 16.189 1.02233 15.6667 1.66667 15.6667H3.56369Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Center Canvas/Visualization */}
          <div className="flex h-full min-h-0 items-center justify-center">
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ opacity: 1, willChange: 'auto' }}
            >
              <div className="flex items-center justify-center h-max min-h-bloop w-max min-w-bloop">
                <canvas width="283" height="283" style={{ width: '227px', height: '227px' }}></canvas>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="mb-6 flex justify-center">
            <div className="flex w-full flex-col items-center">
              {/* Info text */}
              <div className="relative mb-6 flex min-h-5 w-full items-center justify-center text-xs text-token-text-secondary">
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    opacity: 1,
                    willChange: 'auto'
                  }}
                >
                  <div className="flex items-center">
                    <button
                      className="inline-flex items-center bg-transparent text-token-text-secondary hover:text-token-text-primary"
                      aria-label="Open info modal"
                    >
                      Start a new chat to use advanced voice
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon-sm ml-1"
                      >
                        <path
                          d="M13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V12Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M12 9.5C12.6904 9.5 13.25 8.94036 13.25 8.25C13.25 7.55964 12.6904 7 12 7C11.3096 7 10.75 7.55964 10.75 8.25C10.75 8.94036 11.3096 9.5 12 9.5Z"
                          fill="currentColor"
                        ></path>
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row items-center gap-6 rounded-full px-3 py-1 transition-width duration-200 ease-in-out">
                <span className="flex" data-state="closed">
                  <span>
                    <button
                      className="btn relative btn-primary bg-black/5 hover:bg-black/10 active:bg-black/20 dark:bg-[rgba(255,255,255,0.04)] dark:hover:bg-white/5 dark:active:bg-white/10 h-16 w-16 overflow-hidden rounded-full border-none p-0.5 text-token-text-primary transition-colors duration-200 ease-in-out hover:text-token-text-secondary"
                      aria-label="Turn off microphone"
                      onClick={onTurnOffMic}
                    >
                      <div className="flex items-center justify-center">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon-xl text-token-main-surface-primary-inverse"
                        >
                          <path
                            d="M7.50002 7C7.50002 4.51472 9.51474 2.5 12 2.5C14.4853 2.5 16.5 4.51472 16.5 7V10.5C16.5 12.9853 14.4853 15 12 15C9.51474 15 7.50002 12.9853 7.50002 10.5V7Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M18.9953 11.5415C19.5246 11.6991 19.826 12.2559 19.6685 12.7852C18.7771 15.7804 16.179 18.0417 13 18.4381V19.5H14.5C15.0523 19.5 15.5 19.9477 15.5 20.5C15.5 21.0523 15.0523 21.5 14.5 21.5H9.50002C8.94773 21.5 8.50002 21.0523 8.50002 20.5C8.50002 19.9477 8.94773 19.5 9.50002 19.5H11V18.4381C7.82093 18.0418 5.22279 15.7805 4.33136 12.7852C4.17382 12.2559 4.47522 11.6991 5.00456 11.5415C5.5339 11.384 6.09073 11.6854 6.24827 12.2148C6.98609 14.6939 9.28339 16.5 11.9999 16.5C14.7165 16.5 17.0138 14.6939 17.7516 12.2148C17.9091 11.6854 18.466 11.384 18.9953 11.5415Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                    </button>
                  </span>
                </span>
                <span className="flex" data-state="closed">
                  <span>
                    <button
                      className="btn relative btn-primary bg-black/5 hover:bg-black/10 active:bg-black/20 dark:bg-[rgba(255,255,255,0.04)] dark:hover:bg-white/5 dark:active:bg-white/10 h-16 w-16 overflow-hidden rounded-full border-none p-0.5 text-token-text-primary transition-colors duration-200 ease-in-out hover:text-token-text-secondary"
                      aria-label="End voice mode"
                      onClick={onStopVoiceMode}
                    >
                      <div className="flex items-center justify-center">
                        <svg
                          width="29"
                          height="28"
                          viewBox="0 0 29 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon-xl text-token-main-surface-primary-inverse"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.30286 6.80256C7.89516 6.21026 8.85546 6.21026 9.44775 6.80256L14.5003 11.8551L19.5529 6.80256C20.1452 6.21026 21.1055 6.21026 21.6978 6.80256C22.2901 7.39485 22.2901 8.35515 21.6978 8.94745L16.6452 14L21.6978 19.0526C22.2901 19.6449 22.2901 20.6052 21.6978 21.1974C21.1055 21.7897 20.1452 21.7897 19.5529 21.1974L14.5003 16.1449L9.44775 21.1974C8.85546 21.7897 7.89516 21.7897 7.30286 21.1974C6.71057 20.6052 6.71057 19.6449 7.30286 19.0526L12.3554 14L7.30286 8.94745C6.71057 8.35515 6.71057 7.39485 7.30286 6.80256Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                    </button>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-0 right-0 flex w-auto items-center justify-end p-4"
        style={{ opacity: 1, willChange: 'auto' }}
      ></div>
    </div>
  );
};

export default VoiceOverlay;

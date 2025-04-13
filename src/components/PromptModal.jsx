import { useState } from "react";

const PromptModal = ({ setIsModalOpen }) => {
    const [formData, setFormData] = useState({
        prompt: "",
        businessObjective: "",
        problemStatement: "",
        userRoles: "",
        features: "",
        competitors: [
            { name: "", website: "", userId: "", password: "" },
            { name: "", website: "", userId: "", password: "" },
            { name: "", website: "", userId: "", password: "" },
        ],
        videoBenchmarks: [
            { competitor: "", feature: "", videoLink: "" },
            { competitor: "", feature: "", videoLink: "" },
            { competitor: "", feature: "", videoLink: "" },
        ],
    });


    const onClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div
            className="show d-flex justify-content-center align-items-center"
            style={{
                zIndex: 1050,
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.5)",
            }}
        >
            <div
                className="modal-content p-4 bg-white rounded shadow overflow-y-auto"
                style={{ width: "70%", height: "90%" }}
            >
                <div className="d-flex align-items-center justify-content-end">
                    <button onClick={onClose} className="btn-close" />
                </div>
                <div className="modal-body mt-4">
                    <input
                        type="text"
                        placeholder="Insert your propmt, for what are you trying to build the BRD"
                        className="w-100 modal-input"
                    />
                    <div className="d-flex align-items-center justify-content-between gap-1">
                        <input type="text" placeholder="Business Objective" className="modal-input w-100" />
                        <input type="text" placeholder="What problem are you solving for?" className="modal-input w-100" />
                        <input type="text" placeholder="List of User Roles" className="modal-input w-100" />
                    </div>
                    <input
                        type="text"
                        placeholder="List of features"
                        className="w-100 modal-input"
                    />

                    <div className="benchmark-section mt-1">
                        <div className="benchmark-row mb-2">
                            <div className="benchmark-col flex-grow-1">
                                <input
                                    type="text"
                                    className="modal-input h-100"
                                    placeholder="Insert three competitors to benchmark"
                                    readOnly
                                />
                            </div>
                            <div className="benchmark-col">
                                <input type="text" className="modal-input" placeholder="Competitor 1" />
                                <input type="text" className="modal-input" placeholder="Competitor 2" />
                                <input type="text" className="modal-input" placeholder="Competitor 3" />
                            </div>
                            <div className="benchmark-col">
                                <input type="text" className="modal-input" placeholder="Website 1" />
                                <input type="text" className="modal-input" placeholder="Website 2" />
                                <input type="text" className="modal-input" placeholder="Website 3" />
                            </div>
                            <div className="benchmark-col">
                                <input type="text" className="modal-input" placeholder="User ID 1" />
                                <input type="text" className="modal-input" placeholder="User ID 2" />
                                <input type="text" className="modal-input" placeholder="User ID 3" />
                            </div>
                            <div className="benchmark-col">
                                <input type="text" className="modal-input" placeholder="Password 1" />
                                <input type="text" className="modal-input" placeholder="Password 2" />
                                <input type="text" className="modal-input" placeholder="Password 3" />
                            </div>
                        </div>

                        <div className="benchmark-row">
                            <div className="benchmark-col flex-grow-1">
                                <input
                                    type="text"
                                    className="modal-input h-100"
                                    placeholder="Insert videos for inspiration e.g. Training, Demo Videos"
                                    readOnly
                                />
                            </div>
                            <div className="benchmark-col">
                                <input type="text" className="modal-input" placeholder="Competitor 1" />
                                <input type="text" className="modal-input" placeholder="Competitor 2" />
                                <input type="text" className="modal-input" placeholder="Competitor 3" />
                            </div>
                            <div className="benchmark-col">
                                <input type="text" className="modal-input" placeholder="Purpose/ Feature you want us to study" />
                                <input type="text" className="modal-input" placeholder="Purpose/ Feature you want us to study" />
                                <input type="text" className="modal-input" placeholder="Purpose/ Feature you want us to study" />
                            </div>
                            <div className="benchmark-col">
                                <input type="text" className="modal-input" placeholder="Video Link" />
                                <input type="text" className="modal-input" placeholder="Video Link" />
                                <input type="text" className="modal-input" placeholder="Video Link" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-center mt-3">
                    <button className="custom-submit-btn">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default PromptModal;

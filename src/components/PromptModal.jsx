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
        ],
        videoBenchmarks: [
            { competitor: "", feature: "", videoLink: "" },
        ],
    });


    const onClose = () => {
        setIsModalOpen(false);
    };

    const removeCompetitor = (index) => {
        if (formData.competitors.length === 1) return; // Keep at least one
        const updated = formData.competitors.filter((_, i) => i !== index);
        setFormData({ ...formData, competitors: updated });
    };

    const removeVideo = (index) => {
        if (formData.videoBenchmarks.length === 1) return; // Keep at least one
        const updated = formData.videoBenchmarks.filter((_, i) => i !== index);
        setFormData({ ...formData, videoBenchmarks: updated });
    };

    const addCompetitor = async () => {

    }

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
                className="modal-content p-4 rounded shadow overflow-y-auto"
                style={{
                    width: "70%", height: "90%",
                }}
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
                        <div className="d-flex justify-content-end mb-2">
                            <button
                                className="border px-3 py-2 text-white"
                                style={{ fontSize: "14px", backgroundColor: "#C72030" }}
                                onClick={() => {
                                    if (formData.competitors.length < 3) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            competitors: [...prev.competitors, { name: "", website: "", userId: "", password: "" }]
                                        }));
                                    }
                                }}
                                disabled={formData.competitors.length >= 3}
                            >
                                Add Competitor
                            </button>
                        </div>
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
                                {
                                    formData.competitors.map((competitor, index) => (
                                        <input key={index} type="text" className="modal-input" placeholder={`Competitor ${index + 1}`} />
                                    ))
                                }
                            </div>
                            <div className="benchmark-col">
                                {
                                    formData.competitors.map((competitor, index) => (
                                        <input key={index} type="text" className="modal-input" placeholder={`Website ${index + 1}`} />
                                    ))
                                }
                            </div>
                            <div className="d-flex flex-column">
                                {
                                    formData.competitors.map((competitor, index) => (
                                        <button
                                            className="border px-3 py-2 text-white modal-input"
                                            style={{ fontSize: "20px", backgroundColor: "#C72030", width: "50px" }}
                                            onClick={() => removeCompetitor(index)}
                                            title="Remove competitor"
                                        >
                                            ×
                                        </button>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mb-2">
                            <button
                                className="border px-3 py-2 text-white"
                                style={{ fontSize: "14px", backgroundColor: "#C72030" }}
                                onClick={() => {
                                    if (formData.videoBenchmarks.length < 3) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            videoBenchmarks: [...prev.videoBenchmarks, { competitor: "", feature: "", videoLink: "" }]
                                        }));
                                    }
                                }}
                                disabled={formData.videoBenchmarks.length >= 3}
                            >
                                Add Video
                            </button>
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
                                {
                                    formData.videoBenchmarks.map((video, index) => (
                                        <input key={index} type="text" className="modal-input" placeholder={`Compitator ${index + 1}`} />
                                    ))
                                }
                            </div>
                            <div className="benchmark-col">
                                {
                                    formData.videoBenchmarks.map((video, index) => (
                                        <input key={index} type="text" className="modal-input" placeholder={`Purpose ${index + 1}`} />
                                    ))
                                }
                            </div>
                            <div className="benchmark-col">
                                {
                                    formData.videoBenchmarks.map((video, index) => (
                                        <input key={index} type="text" className="modal-input" placeholder={`Video Link ${index + 1}`} />
                                    ))
                                }
                            </div>
                            <div className="d-flex flex-column">
                                {
                                    formData.videoBenchmarks.map((video, index) => (
                                        <button
                                            className="border px-3 py-2 text-white modal-input"
                                            style={{ fontSize: "20px", backgroundColor: "#C72030", width: "50px" }}
                                            onClick={() => removeVideo(index)}
                                            title="Remove video row"
                                        >
                                            ×
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-center mt-3">
                    <button className="custom-submit-btn">Submit</button>
                </div>
            </div>
        </div >
    );
};

export default PromptModal;

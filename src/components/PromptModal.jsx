import { useRef, useState } from "react";
import { useChatContext } from "../contexts/chatContext";
import { useParams } from "react-router-dom";
import axios from "axios";

const PromptModal = ({ setIsModalOpen }) => {
    const { id } = useParams()
    const { sendMessage ,setBRDFormData} = useChatContext();
    const [formData, setFormData] = useState({
        prompt: "",
        businessObjective: "",
        problemStatement: "",
        userRoles: "",
        features: "",
        competitors: [{ name: "", website: "", username: "", password: "" }],
        videoBenchmarks: [{ competitor: "", feature: "", videoLink: "" }],
    });

    const token = localStorage.getItem('access_token');

    const [fileName1, setFileName1] = useState("");
    const [fileName2, setFileName2] = useState("");
    const [fileName3, setFileName3] = useState("");

    const fileInput1 = useRef(null);
    const fileInput2 = useRef(null);
    const fileInput3 = useRef(null);

    const handleClick = (ref) => {
        ref.current.click();
    };

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        const textarea = e.target;
        textarea.style.height = "auto"; // Reset height
        const maxHeight = 5 * 24; // Assuming approx 24px per line
        textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
    };

    const handleCompetitorChange = (index, field, value) => {
        const updated = [...formData.competitors];
        updated[index][field] = value;
        setFormData({ ...formData, competitors: updated });
    };

    const handleVideoChange = (index, field, value) => {
        const updated = [...formData.videoBenchmarks];
        updated[index][field] = value;
        setFormData({ ...formData, videoBenchmarks: updated });
    };

    const handleSubmit = async () => {
        const message = `${formData.prompt}. ${formData.businessObjective}. ${formData.problemStatement}. ${formData.userRoles}. ${formData.features}`;
        setBRDFormData(formData);
        sendMessage(message, formData.competitors, formData.videoBenchmarks, id);
        console.log(formData);
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
                className="modal-content p-4 rounded shadow overflow-y-auto"
                style={{
                    width: "70%",
                    height: "90%",
                }}
            >
                <div className="d-flex align-items-center justify-content-end">
                    <button onClick={onClose} className="btn-close" style={{ height: "10px", width: "10px" }} />
                </div>
                <div className="modal-body mt-4">
                    <textarea
                        type="text"
                        rows={1}
                        name="prompt"
                        value={formData.prompt}
                        onChange={handleChange}
                        placeholder="Insert your propmt, for what are you trying to build the BRD"
                        className="w-100 modal-input"
                    />
                    <div className="d-flex align-items-center justify-content-between gap-1">
                        <textarea
                            type="text"
                            rows={1}
                            placeholder="Business Objective"
                            className="modal-input w-100"
                            name="businessObjective"
                            value={formData.businessObjective}
                            onChange={handleChange}
                        />
                        <textarea
                            rows={1}
                            type="text"
                            placeholder="What problem are you solving for?"
                            className="modal-input w-100"
                            name="problemStatement"
                            value={formData.problemStatement}
                            onChange={handleChange}
                        />
                        <textarea
                            rows={1}
                            type="text"
                            placeholder="List of User Roles"
                            className="modal-input w-100"
                            name="userRoles"
                            value={formData.userRoles}
                            onChange={handleChange}
                        />
                    </div>
                    <textarea
                        rows={1}
                        type="text"
                        placeholder="List of features"
                        className="w-100 modal-input"
                        name="features"
                        value={formData.features}
                        onChange={handleChange}
                    />

                    <div className="benchmark-section mt-1">
                        <div className="d-flex justify-content-end mb-2">
                            <button
                                className="border px-3 py-1"
                                style={{ fontSize: "14px", backgroundColor: "#E3DED5", color: "#C72030" }}
                                onClick={() => {
                                    if (formData.competitors.length < 3) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            competitors: [
                                                ...prev.competitors,
                                                { name: "", website: "", userId: "", password: "" },
                                            ],
                                        }));
                                    }
                                }}
                                disabled={formData.competitors.length >= 3}
                            >
                                Add Competitor
                            </button>
                        </div>
                        <div className="benchmark-row mb-2">
                            <div className="benchmark-col" style={{ width: "30%" }}>
                                {formData.competitors.map((competitor, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        className="modal-input"
                                        placeholder={`Competitor ${index + 1}`}
                                        value={competitor.name}
                                        onChange={(e) =>
                                            handleCompetitorChange(index, "name", e.target.value)
                                        }
                                    />
                                ))}
                            </div>
                            <div className="benchmark-col" style={{ width: "30%" }}>
                                {formData.competitors.map((competitor, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        className="modal-input"
                                        placeholder={`Website ${index + 1}`}
                                        value={competitor.website}
                                        onChange={(e) =>
                                            handleCompetitorChange(index, "website", e.target.value)
                                        }
                                    />
                                ))}
                            </div>
                            <div className="benchmark-col" style={{ width: "20%" }}>
                                {formData.competitors.map((competitor, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        className="modal-input"
                                        placeholder={`Username`}
                                        value={competitor.username}
                                        onChange={(e) =>
                                            handleCompetitorChange(index, "username", e.target.value)
                                        }
                                    />
                                ))}
                            </div>
                            <div className="benchmark-col" style={{ width: "20%" }}>
                                {formData.competitors.map((competitor, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        className="modal-input"
                                        placeholder={`Password`}
                                        value={competitor.password}
                                        onChange={(e) =>
                                            handleCompetitorChange(index, "password", e.target.value)
                                        }
                                    />
                                ))}
                            </div>
                            <div className="d-flex flex-column">
                                {formData.competitors.map((competitor, index) => (
                                    <button
                                        className="border px-2 py-1 modal-input"
                                        style={{
                                            fontSize: "20px",
                                            backgroundColor: "#E3DED5",
                                            color: "#C72030",
                                            width: "40px",
                                        }}
                                        onClick={() => removeCompetitor(index)}
                                        title="Remove competitor"
                                    >
                                        ×
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mb-2">
                            <button
                                className="border px-3 py-1"
                                style={{ fontSize: "14px", backgroundColor: "#E3DED5", color: "#C72030" }}
                                onClick={() => {
                                    if (formData.videoBenchmarks.length < 3) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            videoBenchmarks: [
                                                ...prev.videoBenchmarks,
                                                { competitor: "", feature: "", videoLink: "" },
                                            ],
                                        }));
                                    }
                                }}
                                disabled={formData.videoBenchmarks.length >= 3}
                            >
                                Add Video
                            </button>
                        </div>
                        <div className="benchmark-row">
                            <div className="benchmark-col" style={{ width: "30%" }}>
                                {formData.videoBenchmarks.map((video, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        className="modal-input"
                                        placeholder={`Compitator ${index + 1}`}
                                        value={video.competitor}
                                        onChange={(e) =>
                                            handleVideoChange(index, "competitor", e.target.value)
                                        }
                                    />
                                ))}
                            </div>
                            <div className="benchmark-col" style={{ width: "50%" }}>
                                {formData.videoBenchmarks.map((video, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        className="modal-input"
                                        placeholder={`Purpose ${index + 1}`}
                                        value={video.feature}
                                        onChange={(e) =>
                                            handleVideoChange(index, "feature", e.target.value)
                                        }
                                    />
                                ))}
                            </div>
                            <div className="benchmark-col" style={{ width: "20%" }}>
                                {formData.videoBenchmarks.map((video, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        className="modal-input"
                                        placeholder={`Video Link ${index + 1}`}
                                        value={video.videoLink}
                                        onChange={(e) =>
                                            handleVideoChange(index, "videoLink", e.target.value)
                                        }
                                    />
                                ))}
                            </div>
                            <div className="d-flex flex-column">
                                {formData.videoBenchmarks.map((video, index) => (
                                    <button
                                        className="border px-2 py-1 modal-input"
                                        style={{
                                            fontSize: "20px",
                                            backgroundColor: "#E3DED5",
                                            color: "#C72030",
                                            width: "40px",
                                        }}
                                        onClick={() => removeVideo(index)}
                                        title="Remove video row"
                                    >
                                        ×
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="benchmark-row my-3">
                        <div className="benchmark-col flex-grow-1">
                            <div
                                className="modal-input py-2 px-3"
                                style={{ color: "#afafaf", cursor: "pointer" }}
                                onClick={() => handleClick(fileInput1)}
                            >
                                {fileName1 || "+ Add File One"}
                                <input
                                    type="file"
                                    ref={fileInput1}
                                    style={{ display: "none" }}
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setFileName1(file.name);
                                            const formData = new FormData();
                                            formData.append("files", file);
                                            try {
                                                const response = await axios.post(
                                                    `https://ai-implementation.lockated.com/upload/?token=${token}`,
                                                    formData,
                                                    {
                                                        headers: { "Content-Type": "multipart/form-data" },
                                                    }
                                                );
                                                console.log(response);
                                            } catch (error) {
                                                console.error(error);
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="benchmark-col flex-grow-1">
                            <div
                                className="modal-input py-2 px-3"
                                style={{ color: "#afafaf", cursor: "pointer" }}
                                onClick={() => handleClick(fileInput2)}
                            >
                                {fileName2 || "+ Add File 2"}
                                <input
                                    type="file"
                                    ref={fileInput2}
                                    style={{ display: "none" }}
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setFileName2(file.name);
                                            const formData = new FormData();
                                            formData.append("files", file);
                                            try {
                                                const response = await axios.post(
                                                    `https://ai-implementation.lockated.com/upload/?token=${token}`,
                                                    formData,
                                                    {
                                                        headers: { "Content-Type": "multipart/form-data" },
                                                    }
                                                );
                                                console.log(response);
                                            } catch (error) {
                                                console.error(error);
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="benchmark-col flex-grow-1">
                            <div
                                className="modal-input py-2 px-3"
                                style={{ color: "#afafaf", cursor: "pointer" }}
                                onClick={() => handleClick(fileInput3)}
                            >
                                {fileName3 || "+ Add File 3"}
                                <input
                                    type="file"
                                    ref={fileInput3}
                                    style={{ display: "none" }}
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setFileName3(file.name);
                                            const formData = new FormData();
                                            formData.append("files", file);
                                            try {
                                                const response = await axios.post(
                                                    `https://ai-implementation.lockated.com/upload/?token=${token}`,
                                                    formData,
                                                    {
                                                        headers: { "Content-Type": "multipart/form-data" },
                                                    }
                                                );
                                                console.log(response);
                                            } catch (error) {
                                                console.error(error);
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                </div>
                <div className="d-flex align-items-center justify-content-center mt-3">
                    <button
                        className="custom-submit-btn"
                        onClick={() => {
                            handleSubmit();
                            setIsModalOpen(false);
                        }}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromptModal;

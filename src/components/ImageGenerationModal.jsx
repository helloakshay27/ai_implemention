import React, { useState } from 'react';
import { publicChatAPI } from '../services/PublicChatAPI';

/**
 * Modal component for AI Image Generation using DALL-E
 * Supports text-to-image, image editing, and image variations
 */
const ImageGenerationModal = ({ isOpen, onClose, onImageGenerated }) => {
    const [activeTab, setActiveTab] = useState('generate'); // 'generate', 'edit', 'variation'
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [maskFile, setMaskFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [maskPreview, setMaskPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generatedImages, setGeneratedImages] = useState([]);
    const [error, setError] = useState(null);
    
    // Generation options
    const [model, setModel] = useState('dall-e-3');
    const [size, setSize] = useState('1024x1024');
    const [quality, setQuality] = useState('standard');
    const [style, setStyle] = useState('vivid');
    const [numberOfImages, setNumberOfImages] = useState(1);

    if (!isOpen) return null;

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleMaskSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMaskFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setMaskPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            let result;

            if (activeTab === 'generate') {
                // Generate new image from text prompt
                result = await publicChatAPI.generateImage(prompt, {
                    model,
                    size,
                    quality,
                    style,
                    n: numberOfImages
                });
            } else if (activeTab === 'edit') {
                // Edit existing image
                if (!imageFile) {
                    setError('Please select an image to edit');
                    setLoading(false);
                    return;
                }
                result = await publicChatAPI.editImage(imageFile, prompt, maskFile, {
                    size,
                    n: numberOfImages
                });
            } else if (activeTab === 'variation') {
                // Create variations of existing image
                if (!imageFile) {
                    setError('Please select an image to create variations');
                    setLoading(false);
                    return;
                }
                result = await publicChatAPI.createImageVariation(imageFile, {
                    size,
                    n: numberOfImages
                });
            }

            if (result.error) {
                setError(result.message);
            } else if (result.success) {
                setGeneratedImages(result.images);
                if (onImageGenerated) {
                    onImageGenerated(result.images);
                }
            }
        } catch (err) {
            setError(`Failed to ${activeTab} image: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (imageUrl, index) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `generated-image-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="image-gen-modal-overlay" onClick={onClose}>
            <div className="image-gen-modal" onClick={(e) => e.stopPropagation()}>
                <div className="image-gen-header">
                    <h2>🎨 AI Image Generation</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {/* Tab Navigation */}
                <div className="image-gen-tabs">
                    <button
                        className={activeTab === 'generate' ? 'active' : ''}
                        onClick={() => setActiveTab('generate')}
                    >
                        Generate
                    </button>
                    <button
                        className={activeTab === 'edit' ? 'active' : ''}
                        onClick={() => setActiveTab('edit')}
                    >
                        Edit
                    </button>
                    <button
                        className={activeTab === 'variation' ? 'active' : ''}
                        onClick={() => setActiveTab('variation')}
                    >
                        Variation
                    </button>
                </div>

                <div className="image-gen-content">
                    {/* Generate Tab */}
                    {activeTab === 'generate' && (
                        <div className="generate-section">
                            <div className="form-group">
                                <label>Prompt</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe the image you want to generate..."
                                    rows={4}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Model</label>
                                    <select value={model} onChange={(e) => setModel(e.target.value)}>
                                        <option value="dall-e-3">DALL-E 3</option>
                                        <option value="dall-e-2">DALL-E 2</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Size</label>
                                    <select value={size} onChange={(e) => setSize(e.target.value)}>
                                        {model === 'dall-e-3' ? (
                                            <>
                                                <option value="1024x1024">1024x1024 (Square)</option>
                                                <option value="1792x1024">1792x1024 (Landscape)</option>
                                                <option value="1024x1792">1024x1792 (Portrait)</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="256x256">256x256</option>
                                                <option value="512x512">512x512</option>
                                                <option value="1024x1024">1024x1024</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>

                            {model === 'dall-e-3' && (
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Quality</label>
                                        <select value={quality} onChange={(e) => setQuality(e.target.value)}>
                                            <option value="standard">Standard</option>
                                            <option value="hd">HD</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Style</label>
                                        <select value={style} onChange={(e) => setStyle(e.target.value)}>
                                            <option value="vivid">Vivid</option>
                                            <option value="natural">Natural</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Number of Images: {numberOfImages}</label>
                                <input
                                    type="range"
                                    min="1"
                                    max={model === 'dall-e-3' ? '1' : '10'}
                                    value={numberOfImages}
                                    onChange={(e) => setNumberOfImages(parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    )}

                    {/* Edit Tab */}
                    {activeTab === 'edit' && (
                        <div className="edit-section">
                            <div className="form-group">
                                <label>Original Image (PNG, square, &lt;4MB)</label>
                                <input type="file" accept="image/png" onChange={handleImageSelect} />
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                )}
                            </div>

                            <div className="form-group">
                                <label>Mask (Optional - transparent areas will be edited)</label>
                                <input type="file" accept="image/png" onChange={handleMaskSelect} />
                                {maskPreview && (
                                    <img src={maskPreview} alt="Mask Preview" className="image-preview" />
                                )}
                            </div>

                            <div className="form-group">
                                <label>Edit Description</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe how you want to edit the image..."
                                    rows={4}
                                />
                            </div>

                            <div className="form-group">
                                <label>Size</label>
                                <select value={size} onChange={(e) => setSize(e.target.value)}>
                                    <option value="256x256">256x256</option>
                                    <option value="512x512">512x512</option>
                                    <option value="1024x1024">1024x1024</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Variation Tab */}
                    {activeTab === 'variation' && (
                        <div className="variation-section">
                            <div className="form-group">
                                <label>Original Image (PNG, square, &lt;4MB)</label>
                                <input type="file" accept="image/png" onChange={handleImageSelect} />
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                )}
                            </div>

                            <div className="form-group">
                                <label>Number of Variations: {numberOfImages}</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={numberOfImages}
                                    onChange={(e) => setNumberOfImages(parseInt(e.target.value))}
                                />
                            </div>

                            <div className="form-group">
                                <label>Size</label>
                                <select value={size} onChange={(e) => setSize(e.target.value)}>
                                    <option value="256x256">256x256</option>
                                    <option value="512x512">512x512</option>
                                    <option value="1024x1024">1024x1024</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Generate Button */}
                    <button
                        className="generate-btn"
                        onClick={handleGenerate}
                        disabled={loading || (activeTab === 'generate' && !prompt)}
                    >
                        {loading ? 'Generating...' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Image`}
                    </button>

                    {/* Generated Images Display */}
                    {generatedImages.length > 0 && (
                        <div className="generated-images">
                            <h3>Generated Images:</h3>
                            <div className="images-grid">
                                {generatedImages.map((img, index) => (
                                    <div key={index} className="generated-image-item">
                                        <img src={img.url} alt={`Generated ${index + 1}`} />
                                        <div className="image-actions">
                                            <button onClick={() => handleDownload(img.url, index)}>
                                                Download
                                            </button>
                                            {img.revised_prompt && (
                                                <p className="revised-prompt">
                                                    <small><strong>Revised:</strong> {img.revised_prompt}</small>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageGenerationModal;

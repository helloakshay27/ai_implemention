// Public Chat API service - OpenAI Integration (similar to PHP implementation)
// This mirrors the functionality from your test1.php file

class PublicChatAPI {
    constructor() {
        // OpenAI API configuration - Load from environment variables
        this.OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
        this.OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
        
        // Image API endpoints (DALL·E 3, gpt-4o-mini)
        this.IMAGE_GENERATION_URL = 'https://api.openai.com/v1/images/generations';
        this.IMAGE_EDIT_URL = 'https://api.openai.com/v1/images/edits';
        this.IMAGE_VARIATION_URL = 'https://api.openai.com/v1/images/variations';
        
        // Audio API endpoints (Whisper, gpt-4o-mini-tts)
        this.AUDIO_TRANSCRIPTION_URL = 'https://api.openai.com/v1/audio/transcriptions';
        this.AUDIO_SPEECH_URL = 'https://api.openai.com/v1/audio/speech';
        
        // Chat history storage (similar to PHP session)
        this.chatHistories = new Map(); // Store chat histories by chat ID
        
        // Validate API key on initialization
        if (!this.OPENAI_API_KEY) {
            console.error('⚠️ OPENAI_API_KEY not found! Please add VITE_OPENAI_API_KEY to your .env file');
        }
    }

    // Send message to OpenAI API (similar to PHP implementation)
    async sendMessage(message, type = 'general', files = [], chatId = null) {
        try {
            console.log('🚀 PublicChatAPI.sendMessage called:', { message, type, chatId, filesCount: files?.length });
            
            // ===================================================
            // TYPE "image": Use DALL-E Image Generation/Variation APIs
            // ===================================================
            if (type === 'image') {
                console.log('🎨 Type: IMAGE - Using DALL-E APIs');
                
                // Case 1: User uploaded image - Use Vision to describe, then generate similar
                // Note: DALL-E variations API has CORS restrictions in browsers
                if (files && files.length > 0) {
                    console.log('🖼️ Processing uploaded image for AI-powered recreation');
                    
                    try {
                        // Step 1: Use GPT-4 Vision to analyze the uploaded image
                        console.log('👁️ Analyzing image with GPT-4 Vision...');
                        const imageAnalysisPrompt = message && message.trim() 
                            ? `Analyze this image and create a detailed description that could be used to recreate a similar image. Focus on: style, composition, colors, subjects, mood, and artistic elements. User's additional notes: ${message}`
                            : "Analyze this image in detail and create a comprehensive description that could be used to recreate a similar image. Include: artistic style, color palette, composition, subjects, lighting, mood, and any distinctive features.";
                        
                        // Convert image to base64 for vision
                        const base64Image = await this.fileToBase64(files[0]);
                        
                        // Call Vision API
                        const visionMessages = [{
                            role: "user",
                            content: [
                                { type: "text", text: imageAnalysisPrompt },
                                { type: "image_url", image_url: { url: base64Image, detail: "high" } }
                            ]
                        }];
                        
                        const visionResponse = await this.callOpenAI(visionMessages, 'gpt-4o');
                        
                        if (visionResponse.error) {
                            return {
                                error: true,
                                message: `Failed to analyze image: ${visionResponse.message}`,
                                logs: [{ log_id: Date.now(), step: 'Vision Error', log_message: visionResponse.message, timestamp: new Date().toISOString() }]
                            };
                        }
                        
                        const imageDescription = visionResponse.content;
                        console.log('✅ Image analyzed:', imageDescription.substring(0, 100) + '...');
                        
                        // Step 2: Use DALL-E 3 to generate a similar image
                        console.log('🎨 Generating similar image with DALL-E 3...');
                        const dallePrompt = `Create an image based on this description: ${imageDescription}`;
                        
                        const result = await this.generateImage(dallePrompt, {
                            model: 'dall-e-3',
                            size: '1024x1024',
                            quality: 'standard',
                            n: 1
                        });
                        
                        if (result.error) {
                            return {
                                error: true,
                                message: result.message,
                                logs: [{ log_id: Date.now(), step: 'Error', log_message: result.message, timestamp: new Date().toISOString() }]
                            };
                        }
                        
                        return {
                            success: true,
                            type: 'image',
                            response: {
                                response: `🎨 **AI-Powered Image Recreation!**\n\n${message ? `**Your Request:** "${message}"\n\n` : ''}**Process:**\n1. ✅ Analyzed your image using GPT-4 Vision\n2. ✅ Generated a similar image using DALL-E 3\n\n**Analysis:** ${imageDescription.substring(0, 200)}...\n\n![AI Generated Image](${result.images[0].url})\n\n**📥 Download:** [Click here](${result.images[0].url})\n\n*Powered by GPT-4 Vision + DALL-E 3 | URL expires in 1 hour*\n\n💡 **Tip:** Upload again with different instructions to explore variations!`,
                                generatedImages: result.images,
                                revised_prompt: result.images[0].revised_prompt,
                                analysis: imageDescription
                            },
                            logs: [
                                { log_id: Date.now(), step: 'Vision Analysis', log_message: 'Image analyzed with GPT-4 Vision', timestamp: new Date().toISOString() },
                                { log_id: Date.now() + 1, step: 'DALL-E 3', log_message: 'Similar image generated successfully', timestamp: new Date().toISOString() }
                            ]
                        };
                    } catch (error) {
                        console.error('❌ Image processing failed:', error);
                        return {
                            error: true,
                            message: `Image processing error: ${error.message}`,
                            logs: [{ log_id: Date.now(), step: 'Error', log_message: error.message, timestamp: new Date().toISOString() }]
                        };
                    }
                }
                
                // Case 2: Text prompt only - Generate new image
                else {
                    console.log('✨ Generating new image with DALL-E 3');
                    
                    if (!message || !message.trim()) {
                        return {
                            error: true,
                            message: 'Please describe the image you want to generate, or upload an image to create variations.',
                            logs: [{ log_id: Date.now(), step: 'Validation', log_message: 'No prompt provided', timestamp: new Date().toISOString() }]
                        };
                    }
                    
                    const result = await this.generateImage(message, {
                        model: 'dall-e-3',
                        size: '1024x1024',
                        quality: 'standard',
                        n: 1
                    });
                    
                    if (result.error) {
                        return {
                            error: true,
                            message: result.message,
                            logs: [{ log_id: Date.now(), step: 'Error', log_message: result.message, timestamp: new Date().toISOString() }]
                        };
                    }
                    
                    return {
                        success: true,
                        type: 'image',
                        response: {
                            response: `🎨 **AI Image Generated Successfully!**\n\n**Your Prompt:** "${message}"\n\n**AI's Enhanced Prompt:** ${result.images[0].revised_prompt || message}\n\n![AI Generated Image](${result.images[0].url})\n\n**📥 Download:** [Right-click to save, or click here](${result.images[0].url})\n\n*Powered by DALL-E 3 | URL expires in 1 hour*\n\n💡 **Tips:** Try different styles like "photorealistic", "oil painting", or "cartoon style"`,
                            generatedImages: result.images,
                            revised_prompt: result.images[0].revised_prompt
                        },
                        logs: [
                            { log_id: Date.now(), step: 'DALL-E 3', log_message: 'Image generated successfully', timestamp: new Date().toISOString() }
                        ]
                    };
                }
            }
            
            // ===================================================
            // TYPE "text" or others: Use Chat Completions API (supports Vision)
            // ===================================================
            console.log('💬 Type: TEXT/OTHER - Using Chat Completions API');
            
            // Get or create chat history for this chat ID
            if (!this.chatHistories.has(chatId)) {
                this.chatHistories.set(chatId, []);
            }
            
            const chatHistory = this.chatHistories.get(chatId);
            
            // Format message content (handles image vision for text type)
            const formattedContent = await this.formatMessageByType(message, type, files);
            
            // Add user message to history (like PHP session)
            const userMessage = {
                role: "user",
                content: formattedContent
            };
            
            chatHistory.push(userMessage);
            console.log('📝 Chat history updated, length:', chatHistory.length);

            // ===================================================
            // SMART MODEL SELECTION
            // ===================================================
            // Determine if we need vision capabilities
            const hasImages = files && files.length > 0;
            const contentHasImages = userMessage.content && 
                Array.isArray(userMessage.content) && 
                userMessage.content.some(item => item.type === 'image_url');
            
            const needsVision = hasImages || contentHasImages;
            
            // Use GPT-4o for vision, GPT-3.5-turbo for text-only
            const model = needsVision ? 'gpt-4o' : 'gpt-3.5-turbo';
            
            console.log('🤖 Model Selection:', {
                hasFiles: hasImages,
                contentHasImages: contentHasImages,
                needsVision: needsVision,
                selectedModel: model
            });
            
            // Validate: Ensure we don't send images to non-vision models
            if (contentHasImages && !needsVision) {
                console.warn('⚠️ WARNING: Image content detected but vision not enabled!');
            }
            
            // Call OpenAI API with appropriate model
            const response = await this.callOpenAI(chatHistory, model);
            console.log('🤖 OpenAI response:', response);
            
            if (response.error) {
                console.error('❌ OpenAI API error:', response);
                
                // Enhanced error handling with recovery suggestions
                let userFriendlyMessage = response.message || 'Sorry, I encountered an error. Please try again.';
                let recoverySuggestions = [];
                
                // Check if it's a vision/content type error
                const isVisionError = response.message && (
                    response.message.includes('image_url') || 
                    response.message.includes('vision') ||
                    response.message.includes('content type') ||
                    response.message.includes('supported by this model')
                );
                
                if (isVisionError && contentHasImages) {
                    userFriendlyMessage = `⚠️ **Image Processing Error**\n\nI'm having trouble processing your image with the AI vision model. This can happen due to:\n• API configuration issues\n• Model access restrictions\n• Temporary service unavailability\n\n**What you can do:**\n1. Try sending your message **without the image** first\n2. Switch to "Image" chat type if you want to generate AI images\n3. Try again in a few moments\n4. Contact support if the issue persists\n\n**Original error:** ${response.message}`;
                    
                    recoverySuggestions = [
                        'Remove image and send text only',
                        'Switch to "Image" chat type for DALL-E',
                        'Try again later',
                        'Contact support'
                    ];
                }
                
                return {
                    error: true,
                    message: userFriendlyMessage,
                    details: response.details,
                    isVisionError: isVisionError,
                    recoverySuggestions: recoverySuggestions,
                    logs: [
                        { 
                            log_id: Date.now() + 1, 
                            step: 'API Request',
                            log_message: `Sent message to OpenAI API (model: ${model})`,
                            timestamp: new Date().toISOString()
                        },
                        { 
                            log_id: Date.now() + 2, 
                            step: 'Error',
                            log_message: response.message || 'OpenAI API returned an error',
                            timestamp: new Date().toISOString()
                        },
                        ...(isVisionError ? [{
                            log_id: Date.now() + 3,
                            step: 'Recovery',
                            log_message: 'Vision error detected - user can retry without image',
                            timestamp: new Date().toISOString()
                        }] : [])
                    ]
                };
            }

            // Add assistant response to history
            chatHistory.push({
                role: "assistant", 
                content: response.content
            });

            // Update chat history storage
            this.chatHistories.set(chatId, chatHistory);

            return {
                success: true,
                timestamp: new Date().toISOString(),
                type: type,
                processed_message: message,
                response: {
                    response: response.content, // Map to match ChatMessage expectation
                    message: response.content,
                    chat_history: chatHistory,
                    uploadedImages: files && files.length > 0 ? files : null // Include uploaded images
                },
                logs: [
                    { 
                        log_id: Date.now() + 1, 
                        step: 'API Request',
                        log_message: `Sent to ${model} with ${chatHistory.length} messages`,
                        timestamp: new Date().toISOString()
                    },
                    { 
                        log_id: Date.now() + 2, 
                        step: 'Success',
                        log_message: 'Message processed successfully',
                        timestamp: new Date().toISOString()
                    }
                ]
            };

        } catch (error) {
            console.error('❌ PublicChatAPI.sendMessage error:', error);
            return {
                error: true,
                message: 'Sorry, I encountered an error with the AI service. Please try again.',
                details: error.message,
                logs: [
                    { 
                        log_id: Date.now() + 1, 
                        step: 'API Request',
                        log_message: `Attempting to send message to OpenAI`,
                        timestamp: new Date().toISOString()
                    },
                    { 
                        log_id: Date.now() + 2, 
                        step: 'Error',
                        log_message: `Failed with error: ${error.message}`,
                        timestamp: new Date().toISOString()
                    }
                ]
            };
        }
    }

    // Format message based on chat type (enhanced like PHP with better prompts)
    async formatMessageByType(message, type, files = []) {
        // Enhanced system prompts for better responses (like PHP logic)
        let systemPrompt = "";
        
        switch (type) {
            case 'text':
                // For text type with images: Use Vision API format
                if (files && files.length > 0) {
                    console.log('📸 Text type with images - formatting for GPT-4 Vision');
                    const imageContents = [];
                    
                    // Add text prompt
                    const promptText = message && message.trim() 
                        ? `You are an expert image analyst. ${message}`
                        : "You are an expert image analyst. Please analyze this image in detail, describing: 1) Main subjects and objects, 2) Colors and composition, 3) Context and setting, 4) Any text visible, 5) Overall mood and atmosphere.";
                    
                    imageContents.push({
                        type: "text",
                        text: promptText
                    });
                    
                    // Add all images
                    for (const file of files) {
                        if (file.type && file.type.startsWith('image/')) {
                            const base64Image = await this.fileToBase64(file);
                            imageContents.push({
                                type: "image_url",
                                image_url: {
                                    url: base64Image,
                                    detail: "high"
                                }
                            });
                            console.log('✅ Image converted for vision:', file.name);
                        }
                    }
                    
                    return imageContents;
                } else {
                    // Text only
                    systemPrompt = "You are an expert writing assistant and text analyst. Help with writing, editing, proofreading, content creation, and text analysis. Provide detailed, actionable advice. ";
                    return systemPrompt + message;
                }
                
            case 'image':
                // Image type is handled separately in sendMessage() using DALL-E APIs
                // This shouldn't be called for image type, but just in case:
                return message;
                
            case 'structured':
                systemPrompt = "You are a data analysis and structuring expert. Help with data formatting, validation, cleaning, analysis, and visualization. Provide practical recommendations and code examples when helpful. ";
                return systemPrompt + message;
                
            case 'general':
            default:
                systemPrompt = "You are a knowledgeable AI assistant specializing in writing, analysis, and problem-solving. Provide comprehensive, well-structured responses with examples when appropriate. ";
                return systemPrompt + message;
        }
    }

    // Helper function to convert file to base64
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Call OpenAI API (enhanced version of PHP logic with better error handling)
    async callOpenAI(messages, model = "gpt-3.5-turbo") {
        try {
            // ===================================================
            // VALIDATE MODEL VS CONTENT TYPE
            // ===================================================
            const hasImageContent = messages.some(msg => 
                Array.isArray(msg.content) && 
                msg.content.some(item => item.type === 'image_url')
            );
            
            const isVisionModel = model.includes('gpt-4') || model.includes('vision');
            
            // Safety check: Don't send images to non-vision models
            if (hasImageContent && !isVisionModel) {
                console.error('❌ VALIDATION ERROR: Attempting to send images to non-vision model!');
                return {
                    error: true,
                    message: '⚠️ Configuration Error: Images cannot be processed by this model. Please use a vision-capable model (GPT-4o) or remove images from your request.',
                    content: null
                };
            }
            
            // Configuration based on model type
            const requestData = {
                model: model,
                messages: messages,
                temperature: 0.7,
                max_tokens: isVisionModel ? 1000 : 500, // More tokens for vision
            };

            console.log('🚀 Calling OpenAI API:', {
                model: requestData.model,
                messageCount: messages.length,
                lastMessage: typeof messages[messages.length - 1]?.content === 'string' 
                    ? messages[messages.length - 1]?.content?.substring(0, 100)
                    : 'Complex content (likely with images)',
                url: this.OPENAI_URL,
                hasApiKey: !!this.OPENAI_API_KEY
            });

            // Log the actual request (without API key)
            console.log('📤 Request data:', {
                ...requestData,
                messages: messages.map(m => ({ 
                    role: m.role, 
                    content: typeof m.content === 'string' 
                        ? m.content.substring(0, 100) + '...' 
                        : 'Complex content (array with images)'
                }))
            });

            const response = await fetch(this.OPENAI_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.OPENAI_API_KEY}`
                },
                body: JSON.stringify(requestData)
            });

            console.log('📥 Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ OpenAI API Error Response:', errorText);
                
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    errorData = { error: { message: errorText } };
                }
                
                // Handle specific error cases
                const errorMessage = errorData?.error?.message || '';
                const errorParam = errorData?.error?.param || '';
                const errorCode = errorData?.error?.code || '';
                
                console.log('🔍 Error details:', { 
                    status: response.status, 
                    message: errorMessage, 
                    param: errorParam, 
                    code: errorCode,
                    hasImageContent 
                });
                
                // Special handling for vision-related errors
                if (errorMessage.includes('image_url') || 
                    errorMessage.includes('vision') || 
                    errorMessage.includes('content type') || 
                    errorMessage.includes('supported by this model') ||
                    errorMessage.includes('messages.0.content.1') ||
                    (errorParam && errorParam.includes('content')) ||
                    (hasImageContent && response.status === 400 && errorMessage.includes('Invalid'))) {
                    
                    console.error('🚨 Vision/Content Type Error Detected!', {
                        model: model,
                        hasImageContent: hasImageContent,
                        isVisionModel: isVisionModel
                    });
                    
                    // More specific error based on the exact scenario
                    if (!isVisionModel && hasImageContent) {
                        throw new Error(`⚠️ **Model Compatibility Error**: The model "${model}" does not support image inputs. Please use GPT-4o or remove images from your message.`);
                    } else if (isVisionModel && hasImageContent) {
                        throw new Error(`⚠️ **Vision API Error**: Unable to process images with GPT-4o vision model. This may be due to API access restrictions or temporary service issues. Try:\n• Sending your message without images\n• Checking your OpenAI API plan supports GPT-4o vision\n• Waiting a few moments and trying again\n\nTechnical details: ${errorMessage}`);
                    } else {
                        throw new Error(`⚠️ **Content Format Error**: ${errorMessage}`);
                    }
                }
                
                // Handle specific error cases like PHP
                if (response.status === 401) {
                    throw new Error('❌ Invalid API key. Please check your OpenAI API key configuration.');
                } else if (response.status === 429) {
                    throw new Error('⏱️ Rate limit exceeded. Please wait a moment and try again.');
                } else if (response.status === 403) {
                    throw new Error('🔒 Access denied. Your API key may not have access to this model or feature.');
                } else if (response.status === 400) {
                    // More helpful 400 error
                    if (errorMessage) {
                        throw new Error(`⚠️ Request Error: ${errorMessage}`);
                    } else {
                        throw new Error('⚠️ Invalid request format. Please try rephrasing your message or removing attachments.');
                    }
                } else if (response.status === 500 || response.status === 503) {
                    throw new Error('🔧 OpenAI service is temporarily unavailable. Please try again in a few moments.');
                } else {
                    throw new Error(`❌ OpenAI API Error (${response.status}): ${errorMessage || response.statusText}`);
                }
            }

            const data = await response.json();
            console.log('✅ OpenAI Response received:', {
                model: data.model,
                usage: data.usage,
                choicesCount: data.choices?.length
            });
            
            // Extract response exactly like PHP logic
            const reply = data.choices?.[0]?.message?.content || 'No response from AI.';
            console.log('📝 Extracted reply:', reply.substring(0, 200) + '...');
            
            return {
                success: true,
                content: reply,
                usage: data.usage,
                model: data.model
            };

        } catch (error) {
            console.error('❌ OpenAI API call failed:', error);
            
            // Return error in same format as PHP curl error handling
            return {
                error: true,
                message: `OpenAI Error: ${error.message}`,
                details: error
            };
        }
    }

    // Clear conversation (like PHP clear button)
    clearConversation(chatId) {
        if (this.chatHistories.has(chatId)) {
            this.chatHistories.set(chatId, []);
            return true;
        }
        return false;
    }

    // Get chat history (like PHP session access)
    getChatHistory(chatId) {
        return this.chatHistories.get(chatId) || [];
    }

    // Simulate PHP-like API responses
    async simulateAPICall(message, type, files) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));

        const response = {
            success: true,
            timestamp: new Date().toISOString(),
            type: type,
            processed_message: message,
            response: null
        };

        switch (type) {
            case 'text':
                response.response = await this.processText(message);
                break;
            case 'image':
                response.response = await this.processImage(message, files);
                break;
            case 'structured':
                response.response = await this.processStructuredData(message);
                break;
            case 'general':
            default:
                response.response = await this.processGeneral(message);
                break;
        }

        return response;
    }

    // Text processing logic (similar to PHP)
    async processText(text) {
        const analysis = {
            word_count: text.split(' ').filter(word => word.length > 0).length,
            char_count: text.length,
            sentence_count: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
            has_questions: text.includes('?'),
            sentiment: this.analyzeSentiment(text),
            keywords: this.extractKeywords(text)
        };

        return {
            analysis: analysis,
            message: `📝 **Text Analysis Complete**

**Statistics:**
- Words: ${analysis.word_count}
- Characters: ${analysis.char_count}  
- Sentences: ${analysis.sentence_count}
- Sentiment: ${analysis.sentiment}
- Contains questions: ${analysis.has_questions ? 'Yes' : 'No'}

**Key Terms:** ${analysis.keywords.join(', ')}

**AI Response:** ${this.generateTextResponse(text, analysis)}`
        };
    }

    // Image processing logic
    async processImage(prompt, files) {
        const fileAnalysis = files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            last_modified: new Date(file.lastModified).toISOString()
        }));

        return {
            files: fileAnalysis,
            message: `🖼️ **Image Processing Results**

**Files Uploaded:** ${files.length}
${fileAnalysis.map(f => `
- **${f.name}**
  - Type: ${f.type}
  - Size: ${(f.size / 1024).toFixed(2)} KB
  - Modified: ${new Date(f.last_modified).toLocaleDateString()}`).join('')}

**AI Analysis:** ${prompt ? `Regarding "${prompt}": ` : ''}
In a production environment, I would analyze these images for:
- Object detection and classification
- Text extraction (OCR)
- Scene understanding
- Color palette analysis
- Image quality metrics

${this.generateImageResponse(prompt, files)}`
        };
    }

    // Structured data processing
    async processStructuredData(data) {
        const dataFormat = this.detectDataFormat(data);
        const structure = this.analyzeDataStructure(data, dataFormat);

        return {
            format: dataFormat,
            structure: structure,
            message: `📊 **Structured Data Analysis**

**Detected Format:** ${dataFormat.type}
**Confidence:** ${dataFormat.confidence}%

**Structure Analysis:**
- Fields detected: ${structure.fields}
- Records: ${structure.records}
- Data types: ${structure.types.join(', ')}

**Sample Processing:**
\`\`\`
${data.substring(0, 200)}${data.length > 200 ? '...' : ''}
\`\`\`

**Recommendations:**
${this.generateDataRecommendations(structure)}`
        };
    }

    // General processing
    async processGeneral(message) {
        const intent = this.detectIntent(message);
        
        return {
            intent: intent,
            message: `💬 **General AI Assistant**

**Message Understanding:** ${intent.description}
**Confidence:** ${intent.confidence}%

**Your Message:** "${message}"

**AI Response:** ${this.generateGeneralResponse(message, intent)}

**I can help with:**
- Text analysis and processing
- Image analysis (upload images)
- Data structuring and formatting  
- General questions and tasks

What would you like to explore next?`
        };
    }

    // Helper methods
    analyzeSentiment(text) {
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic'];
        const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disappointing'];
        
        const words = text.toLowerCase().split(' ');
        const positive = words.some(word => positiveWords.includes(word));
        const negative = words.some(word => negativeWords.includes(word));
        
        if (positive && !negative) return 'Positive';
        if (negative && !positive) return 'Negative';
        return 'Neutral';
    }

    extractKeywords(text) {
        const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
        return text.toLowerCase()
            .split(/\W+/)
            .filter(word => word.length > 3 && !commonWords.includes(word))
            .slice(0, 5);
    }

    detectDataFormat(data) {
        if (data.trim().startsWith('{') && data.trim().endsWith('}')) {
            return { type: 'JSON', confidence: 90 };
        }
        if (data.includes(',') && data.split('\n').length > 1) {
            return { type: 'CSV', confidence: 85 };
        }
        if (data.includes('|') && data.split('\n').length > 1) {
            return { type: 'Pipe-delimited', confidence: 80 };
        }
        if (data.includes('\t')) {
            return { type: 'Tab-delimited', confidence: 75 };
        }
        return { type: 'Plain text', confidence: 50 };
    }

    analyzeDataStructure(data, format) {
        const lines = data.split('\n').filter(line => line.trim());
        return {
            fields: format.type === 'CSV' ? lines[0]?.split(',').length || 0 : 'Unknown',
            records: lines.length,
            types: ['string', 'number', 'mixed']
        };
    }

    detectIntent(message) {
        const intents = [
            { pattern: /question|what|how|why|when|where/i, name: 'Question', description: 'User is asking a question' },
            { pattern: /help|assist|support/i, name: 'Help Request', description: 'User is requesting assistance' },
            { pattern: /analyze|process|examine/i, name: 'Analysis', description: 'User wants analysis or processing' },
            { pattern: /create|make|generate/i, name: 'Creation', description: 'User wants to create something' }
        ];

        for (let intent of intents) {
            if (intent.pattern.test(message)) {
                return { ...intent, confidence: 80 };
            }
        }

        return { name: 'General', description: 'General conversation', confidence: 60 };
    }

    generateTextResponse(text, analysis) {
        if (analysis.has_questions) {
            return "I notice you have questions. I'm ready to provide detailed answers and explanations.";
        }
        if (analysis.sentiment === 'Positive') {
            return "I can sense the positive tone in your message. How can I help you build on this?";
        }
        return "I've processed your text and I'm ready to help with any follow-up tasks or questions.";
    }

    generateImageResponse(prompt, files) {
        if (files.length > 1) {
            return "Multiple images detected. I can compare, analyze, and provide insights across all uploaded images.";
        }
        return "Image ready for analysis. I can extract information, identify objects, and provide detailed descriptions.";
    }

    generateDataRecommendations(structure) {
        return [
            "Consider data validation for consistency",
            "Optimize structure for your use case",
            "Add headers if missing",
            "Check for data type consistency"
        ].join('\n- ');
    }

    generateGeneralResponse(message, intent) {
        switch (intent.name) {
            case 'Question':
                return "I understand you have a question. I'm ready to provide detailed, helpful answers.";
            case 'Help Request':
                return "I'm here to help! Let me know what specific assistance you need.";
            case 'Analysis':
                return "I can analyze various types of content. Share your data, text, or images for processing.";
            case 'Creation':
                return "I can help you create content, structure data, or generate responses based on your needs.";
            default:
                return "Thank you for your message. I'm ready to assist with various tasks and questions.";
        }
    }

    // ========================================
    // IMAGE GENERATION API METHODS
    // ========================================

    /**
     * Generate images using DALL-E 3 or gpt-4o-mini
     * @param {string} prompt - The text description of the image to generate
     * @param {object} options - Optional parameters
     * @param {string} options.model - Model to use ('dall-e-3' or 'gpt-4o-mini', default: 'dall-e-3')
     * @param {string} options.size - Image size ('1024x1024', '1792x1024', or '1024x1792' for DALL-E 3)
     * @param {string} options.quality - 'standard' or 'hd' (DALL-E 3 only)
     * @param {number} options.n - Number of images to generate (1-10, default: 1)
     * @param {string} options.style - 'vivid' or 'natural' (DALL-E 3 only)
     * @returns {Promise<object>} Generated image(s) data
     */
    async generateImage(prompt, options = {}) {
        try {
            const {
                model = 'dall-e-3',
                size = '1024x1024',
                quality = 'standard',
                n = 1,
                style = 'vivid',
                response_format = 'url' // 'url' or 'b64_json'
            } = options;

            const requestData = {
                model: model,
                prompt: prompt,
                n: n,
                size: size,
                response_format: response_format
            };

            // Add DALL-E 3 specific options
            if (model === 'dall-e-3') {
                requestData.quality = quality;
                requestData.style = style;
            }

            console.log('🎨 Generating image with DALL-E:', {
                model,
                prompt: prompt.substring(0, 100),
                size,
                quality
            });

            const response = await fetch(this.IMAGE_GENERATION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.OPENAI_API_KEY}`
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Image Generation Error:', errorText);
                throw new Error(`Image generation failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Image generated successfully:', data.created);

            return {
                success: true,
                images: data.data.map(img => ({
                    url: img.url,
                    b64_json: img.b64_json,
                    revised_prompt: img.revised_prompt
                })),
                created: data.created
            };

        } catch (error) {
            console.error('❌ Image generation failed:', error);
            return {
                error: true,
                message: `Image Generation Error: ${error.message}`,
                details: error
            };
        }
    }

    /**
     * Edit/modify an existing image using DALL-E
     * @param {File} image - The image file to edit (PNG, must be square, < 4MB)
     * @param {string} prompt - Description of the desired edit
     * @param {File} mask - Optional mask image (PNG, transparent areas will be edited)
     * @param {object} options - Optional parameters
     * @returns {Promise<object>} Edited image data
     */
    async editImage(image, prompt, mask = null, options = {}) {
        try {
            const {
                model = 'dall-e-2',
                n = 1,
                size = '1024x1024',
                response_format = 'url'
            } = options;

            const formData = new FormData();
            formData.append('image', image);
            formData.append('prompt', prompt);
            formData.append('model', model);
            formData.append('n', n.toString());
            formData.append('size', size);
            formData.append('response_format', response_format);

            if (mask) {
                formData.append('mask', mask);
            }

            console.log('✏️ Editing image with DALL-E:', {
                prompt: prompt.substring(0, 100),
                hasImage: !!image,
                hasMask: !!mask,
                size
            });

            const response = await fetch(this.IMAGE_EDIT_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.OPENAI_API_KEY}`
                    // Note: Do NOT set Content-Type for FormData, browser will set it with boundary
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Image Edit Error:', errorText);
                throw new Error(`Image edit failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Image edited successfully');

            return {
                success: true,
                images: data.data.map(img => ({
                    url: img.url,
                    b64_json: img.b64_json
                })),
                created: data.created
            };

        } catch (error) {
            console.error('❌ Image edit failed:', error);
            return {
                error: true,
                message: `Image Edit Error: ${error.message}`,
                details: error
            };
        }
    }

    /**
     * Create variations of an existing image using DALL-E
     * @param {File} image - The image file to create variations from (PNG, must be square, < 4MB)
     * @param {object} options - Optional parameters
     * @returns {Promise<object>} Variation image(s) data
     */
    async createImageVariation(image, options = {}) {
        try {
            const {
                model = 'dall-e-2',
                n = 1,
                size = '1024x1024',
                response_format = 'url'
            } = options;

            const formData = new FormData();
            formData.append('image', image);
            formData.append('model', model);
            formData.append('n', n.toString());
            formData.append('size', size);
            formData.append('response_format', response_format);

            console.log('🔄 Creating image variation with DALL-E:', {
                hasImage: !!image,
                n,
                size
            });

            const response = await fetch(this.IMAGE_VARIATION_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.OPENAI_API_KEY}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Image Variation Error:', errorText);
                throw new Error(`Image variation failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Image variations created successfully');

            return {
                success: true,
                images: data.data.map(img => ({
                    url: img.url,
                    b64_json: img.b64_json
                })),
                created: data.created
            };

        } catch (error) {
            console.error('❌ Image variation failed:', error);
            return {
                error: true,
                message: `Image Variation Error: ${error.message}`,
                details: error
            };
        }
    }

    // ========================================
    // AUDIO API METHODS
    // ========================================

    /**
     * Transcribe audio to text using Whisper
     * @param {File} audioFile - The audio file to transcribe (mp3, mp4, mpeg, mpga, m4a, wav, webm)
     * @param {object} options - Optional parameters
     * @param {string} options.model - Model to use (default: 'whisper-1')
     * @param {string} options.language - Language code (ISO-639-1, e.g., 'en', 'es')
     * @param {string} options.prompt - Optional text to guide the model's style
     * @param {string} options.response_format - Format of output ('json', 'text', 'srt', 'verbose_json', 'vtt')
     * @param {number} options.temperature - Sampling temperature (0-1)
     * @returns {Promise<object>} Transcription data
     */
    async transcribeAudio(audioFile, options = {}) {
        try {
            const {
                model = 'whisper-1',
                language = null,
                prompt = null,
                response_format = 'json',
                temperature = 0
            } = options;

            const formData = new FormData();
            formData.append('file', audioFile);
            formData.append('model', model);
            formData.append('response_format', response_format);
            formData.append('temperature', temperature.toString());

            if (language) {
                formData.append('language', language);
            }
            if (prompt) {
                formData.append('prompt', prompt);
            }

            console.log('🎤 Transcribing audio with Whisper:', {
                fileName: audioFile.name,
                fileSize: audioFile.size,
                model,
                language
            });

            const response = await fetch(this.AUDIO_TRANSCRIPTION_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.OPENAI_API_KEY}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Audio Transcription Error:', errorText);
                throw new Error(`Audio transcription failed: ${response.status} ${response.statusText}`);
            }

            const data = response_format === 'json' || response_format === 'verbose_json' 
                ? await response.json() 
                : await response.text();

            console.log('✅ Audio transcribed successfully');

            return {
                success: true,
                transcription: data,
                format: response_format
            };

        } catch (error) {
            console.error('❌ Audio transcription failed:', error);
            return {
                error: true,
                message: `Audio Transcription Error: ${error.message}`,
                details: error
            };
        }
    }

    /**
     * Convert text to speech using TTS
     * @param {string} text - The text to convert to speech
     * @param {object} options - Optional parameters
     * @param {string} options.model - Model to use ('tts-1' or 'tts-1-hd', default: 'tts-1')
     * @param {string} options.voice - Voice to use ('alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer')
     * @param {string} options.response_format - Audio format ('mp3', 'opus', 'aac', 'flac')
     * @param {number} options.speed - Speed of speech (0.25 to 4.0)
     * @returns {Promise<object>} Audio data (Blob)
     */
    async textToSpeech(text, options = {}) {
        try {
            const {
                model = 'tts-1',
                voice = 'alloy',
                response_format = 'mp3',
                speed = 1.0
            } = options;

            const requestData = {
                model: model,
                input: text,
                voice: voice,
                response_format: response_format,
                speed: speed
            };

            console.log('🔊 Converting text to speech:', {
                model,
                voice,
                textLength: text.length,
                speed
            });

            const response = await fetch(this.AUDIO_SPEECH_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.OPENAI_API_KEY}`
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Text-to-Speech Error:', errorText);
                throw new Error(`Text-to-speech failed: ${response.status} ${response.statusText}`);
            }

            const audioBlob = await response.blob();
            console.log('✅ Text converted to speech successfully');

            // Create a URL for the audio blob
            const audioUrl = URL.createObjectURL(audioBlob);

            return {
                success: true,
                audio: audioBlob,
                audioUrl: audioUrl,
                format: response_format,
                voice: voice
            };

        } catch (error) {
            console.error('❌ Text-to-speech failed:', error);
            return {
                error: true,
                message: `Text-to-Speech Error: ${error.message}`,
                details: error
            };
        }
    }
}

// Export singleton instance
export const publicChatAPI = new PublicChatAPI();
export default PublicChatAPI;

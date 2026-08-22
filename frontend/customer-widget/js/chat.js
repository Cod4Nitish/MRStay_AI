// ==========================================================
// MRStay AI — Premium Chat Widget Controller
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        messageList: document.getElementById("mrstay-message-list"),
        input: document.getElementById("mrstay-input"),
        sendButton: document.getElementById("mrstay-send-btn"),
        typingContainer: document.getElementById("mrstay-typing-container"),
        brandName: document.getElementById("mrstay-brand-name"),
        tagline: document.getElementById("mrstay-tagline"),
        clearBtn: document.getElementById("mrstay-clear-btn"),
        clearModal: document.getElementById("mrstay-clear-modal"),
        cancelClearBtn: document.getElementById("mrstay-cancel-clear-btn"),
        confirmClearBtn: document.getElementById("mrstay-confirm-clear-btn"),
        contextChip: document.getElementById("mrstay-context-chip"),
        contextText: document.getElementById("mrstay-context-text")
    };

    let activePropertyContext = null;

    function init() {
        elements.brandName.textContent = MRStayConfig.brandName;
        elements.tagline.textContent = MRStayConfig.tagline;

        MRStayState.init();

        if (MRStayState.messages.length > 0) {
            MRStayState.messages.forEach((msg) => renderMessage(msg.role, msg.text, false));
            updateContextChipFromHistory();
        } else {
            renderWelcomeState();
        }

        elements.sendButton.addEventListener("click", () => handleSend());
        elements.input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        });

        // Clear Chat Logic
        elements.clearBtn.addEventListener("click", () => {
            elements.clearModal.classList.add("active");
            elements.clearModal.setAttribute("aria-hidden", "false");
        });

        elements.cancelClearBtn.addEventListener("click", () => {
            elements.clearModal.classList.remove("active");
            elements.clearModal.setAttribute("aria-hidden", "true");
        });

        elements.confirmClearBtn.addEventListener("click", () => {
            elements.clearModal.classList.remove("active");
            elements.clearModal.setAttribute("aria-hidden", "true");
            MRStaySession.resetSession();
            sessionStorage.removeItem(MRStayState.STORAGE_KEY);
            MRStayState.messages = [];
            elements.messageList.innerHTML = "";
            activePropertyContext = null;
            elements.contextChip.classList.remove("visible");
            renderWelcomeState();
        });

        // Close modal on Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && elements.clearModal.classList.contains("active")) {
                elements.clearModal.classList.remove("active");
                elements.clearModal.setAttribute("aria-hidden", "true");
            }
        });
    }

    async function handleSend(customText = null) {
        const text = customText !== null ? customText : elements.input.value.trim();

        if (!text || MRStayState.isLoading) return;

        elements.input.value = "";
        elements.input.focus();
        
        MRStayState.addMessage("user", text);
        renderMessage("user", text);
        setLoadingUI(true);

        try {
            const sessionId = MRStaySession.getSessionId();
            const result = await MRStayApi.sendMessage(text, sessionId);

            if (result && result.success !== false) {
                // Determine if backend returned a string or object. API contract says response is string.
                const reply = result.response || "I'm sorry, I couldn't understand that.";
                const addedMsg = MRStayState.addMessage("assistant", reply);
                if (addedMsg) renderMessage("assistant", reply);
            } else {
                const errorReply = result.response || "Sorry, something went wrong. Please try again.";
                const addedMsg = MRStayState.addMessage("assistant", errorReply);
                if (addedMsg) renderMessage("assistant", errorReply);
            }
        } catch (err) {
            const errorReply = "Unable to reach MRStay AI right now. Please try again.";
            const addedMsg = MRStayState.addMessage("assistant", errorReply);
            if (addedMsg) renderMessage("assistant", errorReply);
        } finally {
            setLoadingUI(false);
        }
    }

    function renderWelcomeState() {
        const container = document.createElement("div");
        container.className = "mrstay-welcome";
        
        const title = document.createElement("h2");
        title.className = "mrstay-welcome-title";
        title.textContent = "Hi! I'm your property assistant.";
        
        const text = document.createElement("p");
        text.className = "mrstay-welcome-text";
        text.textContent = "I can help you discover the best properties, check pricing, schedule visits, and connect you with our experts.";

        const suggestions = document.createElement("div");
        suggestions.className = "mrstay-suggestions";
        
        const chips = [
            "Tell me about 7th Avenue",
            "Show available properties",
            "What properties fit my budget?",
            "Schedule a site visit"
        ];

        chips.forEach(chipText => {
            const btn = document.createElement("button");
            btn.className = "mrstay-suggestion-chip";
            btn.textContent = chipText;
            btn.addEventListener("click", () => handleSend(chipText));
            suggestions.appendChild(btn);
        });

        container.appendChild(title);
        container.appendChild(text);
        container.appendChild(suggestions);
        
        elements.messageList.appendChild(container);
    }

    function renderMessage(role, text, isNew = true) {
        // If it's a new user message, remove welcome screen if present
        if (role === "user") {
            const welcome = elements.messageList.querySelector(".mrstay-welcome");
            if (welcome) welcome.remove();
        }

        const wrapper = document.createElement("div");
        wrapper.className = `mrstay-message-wrapper mrstay-message-wrapper--${role}`;

        const bubble = document.createElement("div");
        bubble.className = `mrstay-message mrstay-message--${role}`;
        
        if (role === "assistant") {
            renderAssistantContent(bubble, text, isNew);
        } else {
            bubble.textContent = text;
        }

        wrapper.appendChild(bubble);
        elements.messageList.appendChild(wrapper);
        elements.messageList.scrollTop = elements.messageList.scrollHeight;
    }

    function renderAssistantContent(container, text, isNew) {
        // Hide Document 1, Document 2 raw RAG output if present
        text = text.replace(/Document \d+:/g, "").replace(/Source \d+:/g, "");

        // ==========================================================
        // GUARD: Detailed multi-section responses must remain rich
        // text. If the response has 2+ markdown section headings
        // (e.g. **Project Overview:**, **Pricing:**), it is NOT a
        // compact property-card response — render as formatted text.
        // ==========================================================
        const sectionHeadings = text.match(/\*\*[^*]+:\*\*/g);
        const isDetailedResponse = sectionHeadings && sectionHeadings.length >= 2;

        // Very basic lead capture intent detection (for styling)
        const isLeadPrompt = /May I have your name|your full name|best phone number|budget range|What requirement|what are you looking for/i.test(text);
        const leadConfirmed = /Our property advisor will contact you|Request received|lead.*(?:saved|captured|submitted)/i.test(text);

        // If it IS a detailed/multi-section response, render as rich
        // formatted text — never squeeze it into a property card.
        if (isDetailedResponse && !leadConfirmed) {
            safeRenderMarkdown(container, text);
            if (isLeadPrompt) {
                renderLeadQuickActions(container, text);
            }
            return;
        }

        // --- Structured field extraction (for compact card) ---
        const hasPrice = /(?:Price|Budget):\s*(₹?[\d.,]+\s*(?:Cr|L|Lakh|Crore)?(?:\s*-\s*₹?[\d.,]+\s*(?:Cr|L|Lakh|Crore)?)?)/i.exec(text);
        const hasConfig = /(?:Configuration|Type|BHK):\s*([\d\s&.,a-zA-Z]+BHK)/i.exec(text);
        const hasLoc = /(?:Location|Area):\s*([^\n]+)/i.exec(text);
        const hasRera = /(?:RERA|Reg(?:\.|istration)? No\.?):\s*([a-zA-Z0-9\/]+)/i.exec(text);
        const hasPropertyId = /(?:Property ID|Property Slug):\s*([a-zA-Z0-9\-_]+)/i.exec(text);

        // Guard against grabbing a mid-sentence fragment
        function looksLikeCleanValue(str, maxLen) {
            if (!str) return false;
            const trimmed = str.trim();
            if (!trimmed || trimmed.length > maxLen) return false;
            return /^[A-Z0-9₹]/.test(trimmed);
        }
        const cleanConfig = (hasConfig && looksLikeCleanValue(hasConfig[1], 40)) ? hasConfig : null;
        const cleanLoc = (hasLoc && looksLikeCleanValue(hasLoc[1], 80)) ? hasLoc : null;

        if (hasPrice || cleanConfig || leadConfirmed) {
            let title = "Property Details";
            const firstLine = text.trim().split('\n')[0];
            if (firstLine && firstLine.length < 50 && !firstLine.includes(":")) {
                title = firstLine.replace(/[\*#]/g, '').trim();
            } else if (cleanLoc) {
                title = "Property in " + cleanLoc[1].split(',')[0];
            }

            if (title.length > 5) {
                updateContext(title);
            }

            const descriptionText = text
                .split('\n')
                .filter(line => !/^\s*(?:Price|Budget|Location|Area|Configuration|Type|BHK|RERA|Reg(?:\.|istration)? No\.?|Amenities|Property ID|Property Slug):/i.test(line))
                .join('\n')
                .trim();

            const card = createPropertyCard({
                title: title,
                propertyId: hasPropertyId ? hasPropertyId[1].trim() : null,
                location: cleanLoc ? cleanLoc[1].replace(/[\*#]/g, '').trim() : null,
                price: hasPrice ? hasPrice[1].replace(/[\*#]/g, '').trim() : null,
                config: cleanConfig ? cleanConfig[1].replace(/[\*#]/g, '').trim() : null,
                rera: hasRera ? hasRera[1].replace(/[\*#]/g, '').trim() : null,
                description: descriptionText || text,
                isLeadConfirmed: leadConfirmed
            });
            container.appendChild(card);
            return;
        }

        // Render as standard text with safe markdown
        safeRenderMarkdown(container, text);

        if (isLeadPrompt) {
            renderLeadQuickActions(container, text);
        }
    }

    function createPropertyCard(data) {
        const card = document.createElement("div");
        card.className = "mrstay-property-card";

        // Image
        if (!data.isLeadConfirmed) {
            const img = document.createElement("img");
            img.className = "mrstay-property-image";
            img.alt = data.title;
            
            let imgUrl = null;

            // Preferred: exact match on property ID, once the backend sends one.
            if (data.propertyId && MRStayConfig.propertyImagesById[data.propertyId]) {
                imgUrl = MRStayConfig.propertyImagesById[data.propertyId];
            }

            // Fallback: name-substring match against the demo keyword list.
            if (!imgUrl) {
                const titleLower = data.title.toLowerCase();
                for (const map of MRStayConfig.propertyImages) {
                    if (map.match.some(m => titleLower.includes(m))) {
                        imgUrl = map.url;
                        break;
                    }
                }
            }

            // Last resort: generic fallback (never the mismatched estate photo).
            if (!imgUrl) {
                imgUrl = MRStayConfig.defaultPropertyImage;
            }

            img.src = imgUrl;
            card.appendChild(img);
        }

        const content = document.createElement("div");
        content.className = "mrstay-property-content";

        if (data.isLeadConfirmed) {
            const leadHdr = document.createElement("div");
            leadHdr.innerHTML = `<svg width="24" height="24" style="fill:var(--success);margin-bottom:8px;" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
            content.appendChild(leadHdr);
        }

        const titleNode = document.createElement("h3");
        titleNode.className = "mrstay-property-title";
        titleNode.textContent = data.isLeadConfirmed ? "Lead Request Received" : data.title;
        content.appendChild(titleNode);

        if (data.location && !data.isLeadConfirmed) {
            const locNode = document.createElement("p");
            locNode.className = "mrstay-property-location";

            const locSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            locSvg.setAttribute("width", "14");
            locSvg.setAttribute("height", "14");
            locSvg.setAttribute("viewBox", "0 0 24 24");
            locSvg.setAttribute("fill", "none");
            locSvg.setAttribute("stroke", "currentColor");
            locSvg.setAttribute("stroke-width", "2");
            const locPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            locPath.setAttribute("d", "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z");
            const locCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            locCircle.setAttribute("cx", "12");
            locCircle.setAttribute("cy", "10");
            locCircle.setAttribute("r", "3");
            locSvg.appendChild(locPath);
            locSvg.appendChild(locCircle);
            locNode.appendChild(locSvg);

            const locText = document.createTextNode(" " + data.location);
            locNode.appendChild(locText);

            content.appendChild(locNode);
        }

        if (data.price) {
            const priceNode = document.createElement("p");
            priceNode.className = "mrstay-property-price";
            priceNode.textContent = data.price;
            content.appendChild(priceNode);
        }

        if (data.config) {
            const metaNode = document.createElement("div");
            metaNode.className = "mrstay-property-meta";
            const badge = document.createElement("span");
            badge.className = "mrstay-meta-badge";
            badge.textContent = data.config;
            metaNode.appendChild(badge);
            content.appendChild(metaNode);
        }

        const descNode = document.createElement("div");
        descNode.className = "mrstay-property-desc";
        safeRenderMarkdown(descNode, data.isLeadConfirmed ? "Our property advisor will contact you shortly." : data.description.substring(0, 200) + (data.description.length > 200 ? "..." : ""));
        content.appendChild(descNode);

        if (data.rera && !data.isLeadConfirmed) {
            const reraNode = document.createElement("p");
            reraNode.className = "mrstay-property-rera";
            reraNode.textContent = "RERA No. " + data.rera;
            content.appendChild(reraNode);
        }

        if (!data.isLeadConfirmed) {
            const actions = document.createElement("div");
            actions.className = "mrstay-property-actions";
            
            const visitBtn = document.createElement("button");
            visitBtn.className = "mrstay-btn-primary";
            visitBtn.textContent = "Schedule Site Visit";
            visitBtn.addEventListener("click", () => handleSend("I want to schedule a site visit."));
            
            const callBtn = document.createElement("button");
            callBtn.className = "mrstay-btn-secondary";
            callBtn.textContent = "Request Callback";
            callBtn.addEventListener("click", () => handleSend("Request a callback."));
            
            actions.appendChild(visitBtn);
            actions.appendChild(callBtn);
            content.appendChild(actions);
        }

        card.appendChild(content);
        return card;
    }

    // ==========================================================
    // Safe Markdown Renderer
    // Renders **bold**, *italic*, bullet lists, ### headings,
    // and section spacing using DOM APIs only. NEVER uses
    // innerHTML with untrusted AI content.
    // ==========================================================
    function safeRenderMarkdown(container, text) {
        const lines = text.split('\n');
        let currentList = null;
        let isFirstElement = true;
        let prevLineWasBlank = false;

        lines.forEach(line => {
            const trimmed = line.trim();

            // Blank line → end any open list, flag for section spacing
            if (!trimmed) {
                currentList = null;
                prevLineWasBlank = true;
                return;
            }

            // --- Bullet list items: - or * or • ---
            if (/^[-*•]\s+/.test(trimmed)) {
                if (!currentList) {
                    currentList = document.createElement('ul');
                    container.appendChild(currentList);
                }
                const li = document.createElement('li');
                const bulletText = trimmed.replace(/^[-*•]\s+/, '');
                appendInlineFormatted(li, bulletText);
                currentList.appendChild(li);
                prevLineWasBlank = false;
                isFirstElement = false;
                return;
            }

            // End any open list
            currentList = null;

            // --- Heading lines: ### or ## or # ---
            const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
            if (headingMatch) {
                const p = document.createElement('p');
                p.style.marginTop = isFirstElement ? '0' : '16px';
                const strong = document.createElement('strong');
                strong.textContent = headingMatch[2];
                p.appendChild(strong);
                container.appendChild(p);
                prevLineWasBlank = false;
                isFirstElement = false;
                return;
            }

            // --- Regular paragraph / text line ---
            const p = document.createElement('p');

            // Add section spacing if preceded by a blank line (not the very first element)
            if (prevLineWasBlank && !isFirstElement) {
                p.style.marginTop = '14px';
            }

            appendInlineFormatted(p, trimmed);
            container.appendChild(p);

            prevLineWasBlank = false;
            isFirstElement = false;
        });
    }

    // ==========================================================
    // Inline formatting: **bold** and *italic*
    // Parses a plain string and appends <strong>, <em>, and
    // text nodes to the given parent element. Zero innerHTML.
    // ==========================================================
    function appendInlineFormatted(parent, text) {
        // Split by **...** first (bold)
        const boldParts = text.split(/(\*\*[^*]+\*\*)/);

        boldParts.forEach(segment => {
            if (!segment) return;

            // Check if this segment is a **bold** chunk
            const boldMatch = segment.match(/^\*\*(.+)\*\*$/);
            if (boldMatch) {
                const strong = document.createElement('strong');
                // Process italic inside bold
                appendItalicFormatted(strong, boldMatch[1]);
                parent.appendChild(strong);
                return;
            }

            // Not bold — process for *italic*
            appendItalicFormatted(parent, segment);
        });
    }

    function appendItalicFormatted(parent, text) {
        // Split by *...* (single asterisk = italic)
        // Negative lookbehind/lookahead to avoid matching ** (already handled)
        const italicParts = text.split(/((?<!\*)\*(?!\*)[^*]+\*(?!\*))/);

        italicParts.forEach(segment => {
            if (!segment) return;

            const italicMatch = segment.match(/^\*([^*]+)\*$/);
            if (italicMatch) {
                const em = document.createElement('em');
                em.textContent = italicMatch[1];
                parent.appendChild(em);
                return;
            }

            // Plain text
            if (segment) {
                parent.appendChild(document.createTextNode(segment));
            }
        });
    }

    function renderLeadQuickActions(container, text) {
        const qrContainer = document.createElement("div");
        qrContainer.className = "mrstay-quick-replies";

        let options = [];
        if (/budget/i.test(text)) {
            options = ["₹50L - ₹75L", "₹75L - ₹1Cr", "₹1Cr - ₹1.5Cr", "₹1.5Cr+"];
        } else if (/requirement/i.test(text)) {
            options = ["2 BHK", "3 BHK", "4 BHK", "Investment"];
        }

        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "mrstay-quick-reply";
            btn.textContent = opt;
            btn.addEventListener("click", () => handleSend(opt));
            qrContainer.appendChild(btn);
        });

        if (options.length > 0) {
            container.appendChild(qrContainer);
        }
    }

    function updateContext(title) {
        if (!title || title.includes("Sorry") || title.length > 40) return;
        activePropertyContext = title;
        elements.contextText.textContent = `Viewing: ${title}`;
        elements.contextChip.classList.add("visible");
    }

    function updateContextChipFromHistory() {
        // Very simple backward scan to restore context
        for (let i = MRStayState.messages.length - 1; i >= 0; i--) {
            const msg = MRStayState.messages[i];
            if (msg.role === "assistant") {
                const firstLine = msg.text.split('\n')[0].replace(/[\*#]/g, '').trim();
                const hasLoc = /(?:Location|Area):\s*([^\n]+)/i.exec(msg.text);
                if (firstLine && firstLine.length < 50 && !firstLine.includes(":") && !firstLine.includes("?")) {
                    updateContext(firstLine);
                    break;
                } else if (hasLoc) {
                    updateContext("Property in " + hasLoc[1].split(',')[0]);
                    break;
                }
            }
        }
    }

    function setLoadingUI(isLoading) {
        MRStayState.setLoading(isLoading);
        elements.typingContainer.style.display = isLoading ? "block" : "none";
        elements.sendButton.disabled = isLoading;
        elements.input.disabled = isLoading;

        if (isLoading) {
            elements.messageList.scrollTop = elements.messageList.scrollHeight;
        }
    }

    init();
});
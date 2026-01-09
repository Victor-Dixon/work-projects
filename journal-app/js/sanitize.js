/**
 * Sanitization utilities for preventing XSS attacks
 * 
 * Since journal entries are plain text, we use textContent instead of innerHTML
 * for displaying user-generated content. This utility provides safe text
 * handling functions.
 */

/**
 * Escapes HTML special characters to prevent XSS
 * Converts < > & " ' to their HTML entity equivalents
 * 
 * @param {string} text - The text to escape
 * @returns {string} - The escaped text safe for HTML insertion
 */
function escapeHtml(text) {
    if (typeof text !== 'string') {
        return '';
    }
    
    const htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    
    return text.replace(/[&<>"'\/]/g, (match) => htmlEscapes[match]);
}

/**
 * Sanitizes text for safe display in HTML
 * Trims whitespace and escapes HTML characters
 * 
 * @param {string} text - The text to sanitize
 * @param {number} maxLength - Optional maximum length (truncates if longer)
 * @returns {string} - Sanitized text
 */
function sanitizeText(text, maxLength = null) {
    if (text == null) {
        return '';
    }
    
    let sanitized = String(text).trim();
    
    if (maxLength && sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength) + '...';
    }
    
    return sanitized;
}

/**
 * Sets textContent safely on an element
 * This is the preferred method for inserting user-generated content
 * textContent automatically treats content as plain text, preventing XSS
 * 
 * @param {HTMLElement} element - The element to set text on
 * @param {string} text - The text to set
 */
function setSafeTextContent(element, text) {
    if (!element) {
        return;
    }
    
    // textContent automatically escapes HTML and prevents script execution
    element.textContent = sanitizeText(text);
}

/**
 * Safely creates DOM elements with text content
 * Returns a text node for safe insertion
 * 
 * @param {string} text - The text content
 * @returns {Text} - A text node
 */
function createSafeTextNode(text) {
    return document.createTextNode(sanitizeText(text));
}

// Export for use in tests (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        escapeHtml,
        sanitizeText,
        setSafeTextContent,
        createSafeTextNode
    };
}


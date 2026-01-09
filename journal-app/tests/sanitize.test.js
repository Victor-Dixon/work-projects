/**
 * Tests for sanitization utilities
 * Tests XSS prevention and text sanitization
 */

const { escapeHtml, sanitizeText, setSafeTextContent } = require('../js/sanitize.js');

describe('XSS Prevention - Sanitization Utilities', () => {
    
    describe('escapeHtml', () => {
        test('should escape HTML special characters', () => {
            expect(escapeHtml('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
        });
        
        test('should escape ampersand', () => {
            expect(escapeHtml('A & B')).toBe('A &amp; B');
        });
        
        test('should escape less than and greater than', () => {
            expect(escapeHtml('<div>content</div>')).toBe('&lt;div&gt;content&lt;&#x2F;div&gt;');
        });
        
        test('should escape quotes', () => {
            expect(escapeHtml('Say "hello"')).toBe('Say &quot;hello&quot;');
            expect(escapeHtml("Say 'hello'")).toBe("Say &#x27;hello&#x27;");
        });
        
        test('should handle empty string', () => {
            expect(escapeHtml('')).toBe('');
        });
        
        test('should handle null and undefined', () => {
            expect(escapeHtml(null)).toBe('');
            expect(escapeHtml(undefined)).toBe('');
        });
        
        test('should handle non-string inputs', () => {
            expect(escapeHtml(123)).toBe('');
            expect(escapeHtml({})).toBe('');
            expect(escapeHtml([])).toBe('');
        });
        
        test('should handle real-world XSS attack vectors', () => {
            const xssPayloads = [
                '<img src=x onerror=alert(1)>',
                '<svg onload=alert(1)>',
                '<iframe src="javascript:alert(1)"></iframe>'
            ];
            
            xssPayloads.forEach(payload => {
                const escaped = escapeHtml(payload);
                // All HTML tags should be escaped - no raw < or > should remain
                expect(escaped).not.toContain('<script>');
                expect(escaped).not.toMatch(/<[^>]*onerror/i);
                expect(escaped).not.toMatch(/<[^>]*onload/i);
                // Should contain escaped versions
                expect(escaped).toContain('&lt;');
                expect(escaped).toContain('&gt;');
            });
        });
    });
    
    describe('sanitizeText', () => {
        test('should trim whitespace', () => {
            expect(sanitizeText('  hello  ')).toBe('hello');
            expect(sanitizeText('\n\ttext\n\t')).toBe('text');
        });
        
        test('should handle null and undefined', () => {
            expect(sanitizeText(null)).toBe('');
            expect(sanitizeText(undefined)).toBe('');
        });
        
        test('should convert non-strings to strings', () => {
            expect(sanitizeText(123)).toBe('123');
            expect(sanitizeText(true)).toBe('true');
        });
        
        test('should truncate when maxLength provided', () => {
            const longText = 'a'.repeat(100);
            const result = sanitizeText(longText, 50);
            expect(result.length).toBe(53); // 50 + '...'
            expect(result.endsWith('...')).toBe(true);
        });
        
        test('should not truncate when under maxLength', () => {
            const text = 'short text';
            expect(sanitizeText(text, 50)).toBe('short text');
        });
        
        test('should handle empty string', () => {
            expect(sanitizeText('')).toBe('');
        });
        
        test('should preserve safe text', () => {
            expect(sanitizeText('Hello, World!')).toBe('Hello, World!');
        });
    });
    
    describe('setSafeTextContent', () => {
        beforeEach(() => {
            // Create a mock DOM element
            document.body.innerHTML = '<div id="test-element"></div>';
        });
        
        afterEach(() => {
            document.body.innerHTML = '';
        });
        
        test('should set textContent safely', () => {
            const element = document.getElementById('test-element');
            setSafeTextContent(element, 'Hello, World!');
            expect(element.textContent).toBe('Hello, World!');
        });
        
        test('should set text safely without HTML interpretation', () => {
            const element = document.getElementById('test-element');
            const xssPayload = '<script>alert("XSS")</script>';
            setSafeTextContent(element, xssPayload);
            // textContent treats content as plain text, preventing XSS
            // The script tags will be displayed as text, not executed
            expect(element.textContent).toBe('<script>alert("XSS")</script>');
            // innerHTML shows the text as-is (textContent doesn't escape, it just treats as text)
            // The key is that using textContent prevents script execution
            expect(element.innerHTML).toBe('&lt;script&gt;alert("XSS")&lt;/script&gt;');
        });
        
        test('should handle null element gracefully', () => {
            expect(() => setSafeTextContent(null, 'text')).not.toThrow();
        });
        
        test('should handle undefined element gracefully', () => {
            expect(() => setSafeTextContent(undefined, 'text')).not.toThrow();
        });
        
        test('should sanitize text before setting', () => {
            const element = document.getElementById('test-element');
            setSafeTextContent(element, '  trimmed  ');
            expect(element.textContent).toBe('trimmed');
        });
    });
});


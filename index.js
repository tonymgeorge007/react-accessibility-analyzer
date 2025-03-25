const checkAltAttributes = () => {
    const elements = document.querySelectorAll('img');
    const issues = [];

    elements.forEach((img) => {
        if (!img.alt) {
            issues.push({
                element: img,
                message: 'Image is missing an alt attribute.',
            });
        }
    });

    return issues;
};
const checkARIACompliance = () => {
    const elements = document.querySelectorAll('[aria-*]');
    const issues = [];

    elements.forEach((element) => {
        if (!element.hasAttribute('role')) {
            issues.push({
                element,
                message: `Element with ARIA attributes is missing a "role" attribute.`,
            });
        }

        const role = element.getAttribute('role');
        const supportedRoles = [
            'button',
            'checkbox',
            'dialog',
            'tooltip',
            'menu',
            'tablist',
            'tree',
        ];

        if (role && !supportedRoles.includes(role)) {
            issues.push({
                element,
                message: `Element has an invalid or unsupported role: "${role}".`,
            });
        }

        if (
            element.getAttribute('aria-hidden') === 'true' &&
            element.tabIndex >= 0
        ) {
            issues.push({
                element,
                message: `Element with aria-hidden="true" should not be focusable.`,
            });
        }
    });

    return issues;
};
const checkContrastRatio = () => {
    const elements = document.querySelectorAll('*');
    const issues = [];

    const parseColor = (color) => {
        const rgba = color.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/);
        return rgba
            ? {
                r: parseInt(rgba[1], 10),
                g: parseInt(rgba[2], 10),
                b: parseInt(rgba[3], 10),
                a: rgba[4] ? parseFloat(rgba[4]) : 1,
            }
            : null;
    };

    const calculateLuminance = ({ r, g, b }) => {
        const srgb = [r, g, b].map((channel) => {
            const normalized = channel / 255;
            return normalized <= 0.03928
                ? normalized / 12.92
                : Math.pow((normalized + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
    };

    const getContrastRatio = (luminance1, luminance2) => {
        const lighter = Math.max(luminance1, luminance2);
        const darker = Math.min(luminance1, luminance2);
        return (lighter + 0.05) / (darker + 0.05);
    };

    elements.forEach((element) => {
        const style = getComputedStyle(element);
        const textColor = parseColor(style.color);
        const bgColor = parseColor(style.backgroundColor);

        if (textColor && bgColor) {
            const textLuminance = calculateLuminance(textColor);
            const bgLuminance = calculateLuminance(bgColor);
            const contrastRatio = getContrastRatio(textLuminance, bgLuminance);

            if (contrastRatio < 4.5) {
                issues.push({
                    element,
                    message: `Text has insufficient contrast ratio (${contrastRatio.toFixed(2)}:1).`,
                });
            }
        }
    });

    return issues;
};
const analyzeTabIndex = (element) => {
    const issues = [];
    const focusableElements = element.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]'
    );

    focusableElements.forEach((el) => {
        const tabIndex = el.getAttribute('tabindex');
        if (tabIndex && (isNaN(tabIndex) || tabIndex < 0)) {
            issues.push({
                element: el,
                message: `Element with role ${el.getAttribute('role') || 'none'} has invalid tabIndex value: ${tabIndex}`,
            });
        }
    });

    return issues;
};
const checkSemanticHTML = (element) => {
    const issues = [];
    const semanticElements = [
        'header',
        'nav',
        'main',
        'section',
        'article',
        'aside',
        'footer',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'ul',
        'ol',
        'li',
        'figure',
        'figcaption',
        'table',
        'caption',
        'thead',
        'tbody',
        'tfoot',
        'tr',
        'td',
        'th'
    ];

    semanticElements.forEach((tag) => {
        const elements = element.querySelectorAll(tag);
        elements.forEach((el) => {
            if (
                tag === 'header' &&
                (!element.querySelector('main') || element.querySelectorAll('header').length > 1)
            ) {
                issues.push({
                    element: el,
                    message: `'${tag}' should be used sparingly and accompanied by a 'main' element.`,
                });
            }
            if (tag.startsWith('h') && !el.textContent.trim()) {
                issues.push({
                    element: el,
                    message: `'${tag}' element is empty. Headings should have meaningful content.`,
                });
            }
        });
    });

    return issues;
};

module.exports = {
    checkAltAttributes,
    checkARIACompliance,
    checkContrastRatio,
    analyzeTabIndex,
    checkSemanticHTML,
};
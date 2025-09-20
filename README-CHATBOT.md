# Chatbot Integration Guide

## Current Status
The Chatling.ai chatbot widget has been integrated with fallback handling for when the external script is blocked by ad blockers or network restrictions.

## How It Works

### Primary Integration
- **Configuration**: `window.chtlConfig = { chatbotId: "6115949275" }`
- **Script Loading**: Multiple strategies using Next.js Script component and manual injection
- **URL**: https://chatling.ai/js/embed.js

### Fallback Widget
When the primary script fails to load (due to ad blockers, network issues, etc.), a custom fallback chat widget appears in the bottom right corner with:
- Branded "Ride Rescue Chat" header
- Welcome message
- Contact information (+91 8200487838)
- Visual indication that the widget is temporarily unavailable

## Troubleshooting

### If the chatbot doesn't appear:
1. **Check browser console** for any script loading errors
2. **Disable ad blockers** temporarily to test if they're blocking the script
3. **Check network restrictions** - some environments block external chat widgets
4. **Verify CSP settings** in `next.config.mjs` include `https://chatling.ai`

### For Production:
1. Test in different browsers and environments
2. Consider whitelisting chatling.ai in corporate firewalls
3. Monitor the fallback widget usage analytics
4. Update contact information in the fallback widget as needed

## Configuration Files

### Content Security Policy (`next.config.mjs`)
```javascript
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://chatling.ai;
connect-src 'self' https://fwtgultjefshvdfnpipw.supabase.co https://chatling.ai;
```

### Component Location
- Primary implementation: `app/page.tsx`
- Fallback widget: Inline component in the same file
- Styling: Tailwind CSS classes

## Customization

### To modify the chatbot ID:
1. Update the `chatbotId` in the `window.chtlConfig` object
2. Update the `data-id` attribute on the script tags

### To customize the fallback widget:
1. Modify the JSX in the fallback section of `app/page.tsx`
2. Update styling, messages, or contact information as needed
3. Add additional interactive features if required

## Testing
- Test with ad blockers enabled/disabled
- Test in incognito/private browsing mode
- Test with different network conditions
- Verify fallback functionality works correctly
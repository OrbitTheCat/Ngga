# Zakeke Editor Integration Setup

This document provides instructions for setting up the Zakeke editor integration in your Next.js application.

## Overview

The application has been updated to use Zakeke's Visual Product Customizer instead of the built-in Fabric.js editor. Zakeke provides a more advanced and feature-rich editing experience through an iframe-based integration.

## Setup Instructions

### 1. Zakeke Account Setup

1. **Create a Zakeke Account**: Visit [Zakeke.com](https://www.zakeke.com) and create an account
2. **Get API Credentials**: In your Zakeke dashboard, obtain your OAuth token
3. **Configure Products**: Set up your business card products in the Zakeke admin panel

### 2. Environment Configuration

Update the `.env.local` file with your Zakeke credentials:

```env
# Zakeke Configuration
NEXT_PUBLIC_ZAKEKE_TOKEN=your_actual_oauth_token_here
NEXT_PUBLIC_ZAKEKE_API_URL=https://api.zakeke.com
NEXT_PUBLIC_ZAKEKE_PORTAL_URL=https://portal.zakeke.com
NEXT_PUBLIC_ZAKEKE_PRODUCT_ID=your_product_id
NEXT_PUBLIC_ZAKEKE_PRODUCT_NAME=Business Card
```

### 3. Product Configuration in Zakeke

1. **Login to Zakeke Admin**: Access your Zakeke admin panel
2. **Create Product**: Set up a business card product with the following variants:
   - Cherry Wood
   - Sapeli Wood
   - Rosewood
   - Maple Wood
   - Black Walnut
   - Bamboo
3. **Configure Customization Options**: Set up text editing, image upload, and other customization features
4. **Note Product ID**: Copy the product ID for use in environment variables

### 4. Authentication Token

To get your OAuth token:

1. Go to your Zakeke admin panel
2. Navigate to API settings
3. Generate or copy your OAuth token
4. Add it to your `.env.local` file

## Features

The new Zakeke integration provides:

- **Advanced Text Editing**: Rich text formatting, fonts, and styling options
- **Image Upload**: Support for various image formats with filters and effects
- **3D Preview**: Real-time 3D visualization of the customized product
- **Mobile Responsive**: Optimized for both desktop and mobile devices
- **Professional Templates**: Pre-designed templates for quick customization
- **Export Options**: High-quality export in various formats

## File Changes

The following files have been modified or created:

### New Files:
- `components/Editor/ZakekeEditor.tsx` - Main Zakeke editor component
- `app/[locale]/ZakekeEditorContext.tsx` - Context for managing Zakeke designs
- `.env.local` - Environment configuration
- `ZAKEKE_SETUP.md` - This setup guide

### Modified Files:
- `components/Editor/CardEditor.tsx` - Updated to use ZakekeEditor
- `app/[locale]/layout.tsx` - Added ZakekeEditorProvider

## Usage

The editor will automatically load when users navigate to the `/editor` page. The integration:

1. **Loads Zakeke Script**: Dynamically loads the Zakeke customizer script
2. **Initializes Editor**: Creates the iframe with proper configuration
3. **Handles Callbacks**: Manages product info, cart operations, and navigation
4. **Maintains State**: Preserves designs and user selections

## Customization

You can customize the integration by:

1. **Modifying Callbacks**: Update the callback functions in `ZakekeEditor.tsx`
2. **Styling**: Adjust the CSS and styling of the editor container
3. **Product Configuration**: Change product variants and options
4. **Localization**: Add translations for editor text

## Troubleshooting

### Common Issues:

1. **Editor Not Loading**: Check that your OAuth token is correct
2. **Product Not Found**: Verify the product ID matches your Zakeke setup
3. **Callback Errors**: Ensure all required callbacks are implemented
4. **CORS Issues**: Make sure your domain is whitelisted in Zakeke settings

### Debug Mode:

Enable debug logging by adding to your environment:
```env
NEXT_PUBLIC_DEBUG_ZAKEKE=true
```

## Support

For Zakeke-specific issues:
- [Zakeke Documentation](https://docs.zakeke.com/)
- [Zakeke Support](https://zakeke.zendesk.com/)
- [API Reference](https://api-reference.zakeke.com/)

For integration issues, check the browser console for error messages and ensure all environment variables are properly configured.
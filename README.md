# Signature Verification System

A modern, secure web application for verifying signature authenticity using advanced image processing algorithms.

## Features

- **Drag & Drop Upload**: Intuitive file upload with preview
- **Real-time Analysis**: Fast signature comparison using SSIM algorithm
- **PDF Reports**: Downloadable verification reports with detailed analysis
- **Secure Processing**: All processing happens locally in your browser
- **Responsive Design**: Works perfectly on desktop and mobile devices

## How It Works

1. **Upload Signatures**: Drop or select two signature images to compare
2. **AI Analysis**: The system uses Structural Similarity Index (SSIM) to compare signatures
3. **Get Results**: Receive instant verification with similarity percentage
4. **Download Report**: Generate a professional PDF report with results

## Technical Details

- **Algorithm**: Structural Similarity Index (SSIM) for image comparison
- **Processing**: Client-side processing ensures data privacy
- **Formats**: Supports PNG, JPG, and JPEG image formats
- **Threshold**: 85% similarity required for verification success

## Deployment

This application is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with zero configuration

## Usage

1. Visit the application in your browser
2. Upload the original signature image
3. Upload the signature to verify
4. Click "Compare Signatures" to analyze
5. Download the PDF report with results

## Security

- No data is transmitted to external servers
- All image processing happens in your browser
- No sensitive information is stored or logged

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
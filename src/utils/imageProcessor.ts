// Image processing utility functions
export class ImageProcessor {
  static async loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  static imageToCanvas(img: HTMLImageElement, width: number = 300, height: number = 300): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = width;
    canvas.height = height;
    
    // Draw image with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate aspect ratio to maintain proportions
    const scale = Math.min(width / img.width, height / img.height);
    const x = (width - img.width * scale) / 2;
    const y = (height - img.height * scale) / 2;
    
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    
    return canvas;
  }

  static canvasToGrayscale(canvas: HTMLCanvasElement): ImageData {
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
    
    return imageData;
  }

  static calculateSSIM(img1: ImageData, img2: ImageData): number {
    if (img1.width !== img2.width || img1.height !== img2.height) {
      throw new Error('Images must have the same dimensions');
    }

    const data1 = img1.data;
    const data2 = img2.data;
    
    let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, sumProduct = 0;
    const pixelCount = img1.width * img1.height;

    // Calculate means and variances
    for (let i = 0; i < data1.length; i += 4) {
      const pixel1 = data1[i]; // R channel (same as G and B in grayscale)
      const pixel2 = data2[i];
      
      sum1 += pixel1;
      sum2 += pixel2;
      sum1Sq += pixel1 * pixel1;
      sum2Sq += pixel2 * pixel2;
      sumProduct += pixel1 * pixel2;
    }

    const mean1 = sum1 / pixelCount;
    const mean2 = sum2 / pixelCount;
    const variance1 = (sum1Sq / pixelCount) - (mean1 * mean1);
    const variance2 = (sum2Sq / pixelCount) - (mean2 * mean2);
    const covariance = (sumProduct / pixelCount) - (mean1 * mean2);

    // SSIM constants
    const c1 = (0.01 * 255) ** 2;
    const c2 = (0.03 * 255) ** 2;

    const numerator = (2 * mean1 * mean2 + c1) * (2 * covariance + c2);
    const denominator = (mean1 ** 2 + mean2 ** 2 + c1) * (variance1 + variance2 + c2);

    const ssim = numerator / denominator;
    return Math.max(0, Math.min(1, ssim)) * 100; // Convert to percentage
  }

  static async compareSignatures(file1: File, file2: File): Promise<number> {
    try {
      const [img1, img2] = await Promise.all([
        this.loadImage(file1),
        this.loadImage(file2)
      ]);

      const canvas1 = this.imageToCanvas(img1);
      const canvas2 = this.imageToCanvas(img2);

      const grayData1 = this.canvasToGrayscale(canvas1);
      const grayData2 = this.canvasToGrayscale(canvas2);

      const similarity = this.calculateSSIM(grayData1, grayData2);
      
      return Math.round(similarity * 100) / 100; // Round to 2 decimal places
    } catch (error) {
      console.error('Error comparing signatures:', error);
      throw new Error('Failed to compare signatures. Please ensure both images are valid.');
    }
  }
}
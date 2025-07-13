
import React from "react";
import { cn } from "@/lib/utils";

interface TShirtPreviewProps {
  color: string;
  customText?: string;
  designType: string;
  customImage?: string | null;
  className?: string;
  imagePlacement?: "above" | "below" | "behind" | "overlay";
  fontFamily?: "sans" | "serif" | "cursive";
  imageShape?: "square" | "circle" | "heart" | "star";
}

const TShirtPreview: React.FC<TShirtPreviewProps> = ({
  color,
  customText,
  designType,
  customImage,
  className,
  imagePlacement = "below",
  fontFamily = "sans",
  imageShape = "square"
}) => {
  // Map the color names to tailwind classes
  const colorMap: Record<string, string> = {
    White: "bg-white text-navy-800 border border-gray-300",
    Black: "bg-black text-white",
    Navy: "bg-navy-800 text-white",
    Gray: "bg-gray-400 text-navy-800",
    Red: "bg-red-600 text-white"
  };
  
  // Get the neck color (slightly darker than the shirt)
  const getNeckColor = (color: string) => {
    switch (color) {
      case 'White': return 'border-gray-300 bg-gray-100';
      case 'Black': return 'border-gray-900 bg-gray-800';
      case 'Navy': return 'border-navy-900 bg-navy-900';
      case 'Gray': return 'border-gray-500 bg-gray-500';
      case 'Red': return 'border-red-800 bg-red-800';
      default: return 'border-gray-300 bg-gray-100';
    }
  };
  
  // Get font family class based on selection
  const getFontClass = (font: string) => {
    switch (font) {
      case 'sans': return 'font-sans';
      case 'serif': return 'font-serif';
      case 'cursive': return 'font-cursive';
      default: return 'font-sans';
    }
  };
  
  // Render image with selected shape
  const renderImage = () => {
    if (!customImage) {
      return (
        <div className="text-opacity-70 text-center font-medium">
          Your Image Here
        </div>
      );
    }
    
    // Apply CSS based on image shape
    let shapeClasses = "";
    let containerClasses = "overflow-hidden";
    
    switch (imageShape) {
      case 'circle':
        shapeClasses = "rounded-full";
        containerClasses += " aspect-square";
        break;
      case 'heart':
        // Heart shape is created using a special container + mask
        return (
          <div className="relative w-20 h-20">
            <div 
              className="absolute inset-0 bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${customImage})`,
                maskImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\'/%3E%3C/svg%3E")',
                WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\'/%3E%3C/svg%3E")',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
              }}
            />
          </div>
        );
      case 'star':
        // Star shape is created using a special container + mask
        return (
          <div className="relative w-20 h-20">
            <div 
              className="absolute inset-0 bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${customImage})`,
                maskImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\'/%3E%3C/svg%3E")',
                WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\'/%3E%3C/svg%3E")',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
              }}
            />
          </div>
        );
      case 'square':
      default:
        shapeClasses = "rounded-md";
        break;
    }
    
    return (
      <div className={containerClasses}>
        <img
          src={customImage}
          alt="Custom design"
          className={`max-w-full max-h-[70%] object-contain ${shapeClasses}`}
        />
      </div>
    );
  };

  return (
    <div className={cn("relative w-full max-w-xs mx-auto", className)}>
      {/* T-shirt shape with more realistic design */}
      <div className="relative">
        {/* Main t-shirt body */}
        <div className={cn(
          "aspect-[4/5] rounded-lg flex items-center justify-center relative overflow-hidden",
          colorMap[color] || "bg-navy-800 text-white"
        )}>
          {/* Neck */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[25%] h-[10%]">
            <div className={`w-full h-full rounded-b-xl ${getNeckColor(color)}`}></div>
          </div>
          
          {/* Shoulders/sleeves */}
          <div className="absolute top-[15%] left-0 w-[20%] h-[10%] rounded-r-full" 
              style={{ backgroundColor: `var(--${color.toLowerCase()}-color, ${colorMap[color].split(' ')[0]})` }} />
          <div className="absolute top-[15%] right-0 w-[20%] h-[10%] rounded-l-full"
              style={{ backgroundColor: `var(--${color.toLowerCase()}-color, ${colorMap[color].split(' ')[0]})` }} />
          
          {/* Content area */}
          <div className="absolute top-[25%] left-[15%] right-[15%] bottom-[15%] flex items-center justify-center">
            {designType === 'custom' ? (
              <div className={`text-center max-w-[90%] break-words font-bold text-xl ${getFontClass(fontFamily)}`}>
                {customText || "Your Text Here"}
              </div>
            ) : designType === 'customWithImage' ? (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
                {imagePlacement === "behind" && customImage && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    {renderImage()}
                  </div>
                )}
                
                {imagePlacement === "above" && (
                  <div className="flex items-center justify-center mb-2">
                    {renderImage()}
                  </div>
                )}
                
                {customText && (
                  <div className={`text-center max-w-[90%] break-words font-bold text-lg mb-2 ${getFontClass(fontFamily)}`}>
                    {customText}
                  </div>
                )}
                
                {imagePlacement === "below" && (
                  <div className="flex items-center justify-center mt-2">
                    {renderImage()}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-opacity-70 font-medium">
                Template Design
              </div>
            )}
          </div>
          
          {/* Create fabric-like texture with an overlay */}
          <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-white to-transparent pointer-events-none"></div>
          
          {/* Add subtle shadows for realism */}
          <div className="absolute inset-0 shadow-inner pointer-events-none"></div>
          
          {/* Bottom hem */}
          <div className="absolute bottom-0 left-0 right-0 h-[5%] opacity-20 border-t"></div>
        </div>
      </div>
    </div>
  );
};

export default TShirtPreview;

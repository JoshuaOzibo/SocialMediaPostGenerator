// Test script for image functionality
// This script tests the new image generation feature

const testImageGeneration = async () => {
  console.log("Testing image generation functionality...\n");

  // Test 1: Content analysis
  const testContent = "🚀 Excited to share some insights on team collaboration! Here are 3 key strategies that have transformed our workflow.";
  const platform = "linkedin";
  
  console.log("Test Content:", testContent);
  console.log("Platform:", platform);
  
  // Simulate search term extraction
  const cleanContent = testContent.replace(/[^\w\s]/g, ' ').toLowerCase();
  const words = cleanContent.split(/\s+/).filter(word => word.length > 3);
  
  const businessTerms = [
    'business', 'technology', 'innovation', 'success', 'team', 'collaboration',
    'product', 'launch', 'growth', 'strategy', 'leadership', 'development',
    'startup', 'entrepreneur', 'professional', 'workplace', 'meeting'
  ];

  const extractedTerms = [];
  for (const word of words) {
    if (businessTerms.includes(word) && !extractedTerms.includes(word)) {
      extractedTerms.push(word);
    }
  }

  // Add platform-specific terms
  if (platform === 'linkedin') {
    extractedTerms.push('professional', 'business');
  }

  console.log("Extracted search terms:", extractedTerms.slice(0, 3));
  
  // Test 2: Image URL structure
  const mockImageResponse = {
    id: "test_image_id",
    url: "https://images.unsplash.com/photo-1234567890",
    alt: "Professional team collaboration",
    photographer: "Test Photographer",
    downloadUrl: "https://unsplash.com/photos/test_image_id/download"
  };

  console.log("\nMock image response:", JSON.stringify(mockImageResponse, null, 2));

  // Test 3: Fallback images
  const fallbackImages = [
    {
      id: 'placeholder-1',
      url: 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Social+Media+Image',
      alt: 'Social Media Placeholder',
      photographer: 'System',
      downloadUrl: 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Social+Media+Image',
    },
    {
      id: 'placeholder-2',
      url: 'https://via.placeholder.com/800x600/10B981/FFFFFF?text=Content+Image',
      alt: 'Content Placeholder',
      photographer: 'System',
      downloadUrl: 'https://via.placeholder.com/800x600/10B981/FFFFFF?text=Content+Image',
    }
  ];

  console.log("\nFallback images available:", fallbackImages.length);

  console.log("\n✅ Image functionality test completed!");
  console.log("\nTo use real images:");
  console.log("1. Get Unsplash API key from https://unsplash.com/developers");
  console.log("2. Add UNSPLASH_ACCESS_KEY to your .env file");
  console.log("3. Install unsplash-js: npm install unsplash-js");
  console.log("4. Set includeImages: true in your API requests");
};

// Run the test
testImageGeneration().catch(console.error); 
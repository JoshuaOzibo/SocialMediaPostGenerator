# Services Architecture

This directory contains all the business logic services following clean architecture principles and separation of concerns.

## Directory Structure

```
services/
├── ai/                          # AI-specific services
│   ├── geminiClient.ts         # Gemini AI client (handles AI model interactions)
│   ├── promptBuilder.ts        # Prompt construction logic
│   └── contentParser.ts        # AI response parsing logic
├── contentGenerationService.ts  # Main content generation orchestration
├── geminiService.ts            # Legacy compatibility layer
├── postService.ts              # Database operations for posts
└── index.ts                    # Clean exports for all services
```

## Service Responsibilities

### AI Services (`/ai/`)

- **`geminiClient.ts`**: Handles direct interactions with the Gemini AI model
  - Single responsibility: AI model communication
  - Error handling for AI API calls
  - Returns structured responses

- **`promptBuilder.ts`**: Constructs prompts for different AI tasks
  - Platform-specific prompt templates
  - Tone-specific prompt modifications
  - Reusable prompt components

- **`contentParser.ts`**: Parses AI-generated content into structured formats
  - Post content extraction
  - Hashtag parsing
  - Image suggestion parsing

### Main Services

- **`contentGenerationService.ts`**: Orchestrates the content generation process
  - Coordinates between AI services
  - Handles business logic
  - Error handling and fallbacks

- **`geminiService.ts`**: Legacy compatibility layer
  - Maintains backward compatibility
  - Delegates to new services
  - Marked as deprecated for new code

## Usage Examples

### Using the New Architecture (Recommended)

```typescript
import { contentGenerationService } from '../services/index.js';

// Generate posts
const posts = await contentGenerationService.generatePosts({
  inputBullets: ['Point 1', 'Point 2'],
  platform: 'twitter',
  tone: 'professional'
});

// Generate hashtags
const hashtags = await contentGenerationService.generateHashtags(
  'Your post content here',
  'twitter'
);
```

### Using Individual AI Services

```typescript
import { geminiClient, promptBuilder, contentParser } from '../services/index.js';

// Custom prompt generation
const prompt = promptBuilder.buildPostGenerationPrompt(request);
const aiResponse = await geminiClient.generateContent(prompt);
const posts = contentParser.parseGeneratedPosts(aiResponse.text);
```

### Legacy Usage (Still Works)

```typescript
import { geminiService } from '../services/index.js';

// This still works but is deprecated
const posts = await geminiService.generatePosts(request);
```

## Benefits of This Architecture

1. **Single Responsibility**: Each service has one clear purpose
2. **Testability**: Services can be tested in isolation
3. **Maintainability**: Changes to one service don't affect others
4. **Reusability**: Services can be reused across different parts of the application
5. **Scalability**: Easy to add new AI providers or modify existing ones
6. **Backward Compatibility**: Existing code continues to work

## Adding New Features

To add new AI features:

1. Add new prompt templates to `promptBuilder.ts`
2. Add parsing logic to `contentParser.ts` if needed
3. Add orchestration methods to `contentGenerationService.ts`
4. Update types in `../types/ai.ts` if needed

## Error Handling

- AI services handle their own errors and return structured responses
- Main services provide business-level error handling
- Legacy service maintains existing error behavior for compatibility 
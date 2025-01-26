# DeepSeek API Proxy (TypeScript Version)

A high-performance proxy server designed specifically to enable Cursor IDE's Composer to use DeepSeek's and OpenRouter's language models. This proxy translates OpenAI-compatible API requests to DeepSeek/OpenRouter API format.

> **Note**: This project was inspired by [danilofalcao/cursor-deepseek](https://github.com/danilofalcao/cursor-deepseek).

## Why?

This TypeScript version was created to:

- Run the proxy locally without needing Docker
- Provide a more familiar environment for JavaScript/TypeScript engineers
- Allow for easier customization and extension in a Node.js ecosystem

## Prerequisites

- Node.js 18 or higher
- Yarn package manager
- DeepSeek API key

## Installation

1. Clone the repository
2. Install dependencies:

```bash
yarn install
```

## Configuration

Create a `.env` file in the project root:

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

## Usage

For development with automatic reloading:

```bash
yarn dev
```

For production:

```bash
yarn build && yarn start
```

The server will start on port 9000 by default.

2. **Important**: Since Cursor IDE won't read from localhost, you'll need to expose your local server through a real HTTPS endpoint. You can use [ngrok](https://ngrok.com/) for this:

```bash
ngrok http 9000
```

3. Use the proxy with your OpenAI API clients by setting the base URL to your ngrok HTTPS URL (e.g., `https://your-ngrok-url.ngrok.io/v1`)

### Supported Endpoints

- `/v1/chat/completions` - Chat completions endpoint
- `/v1/models` - Models listing endpoint

### Model Mapping

- The proxy creates a `gpt-4o` model since Cursor IDE only allows the Composer agent to run for pre-approved models like `gpt-4o`
- Under the hood, all requests are routed to DeepSeek's `deepseek-reasoner` model

## Features

- HTTP/2 support for improved performance
- Full CORS support
- Streaming responses
- Support for function calling/tools
- Automatic message format conversion
- API key validation for secure access

## License

This project is licensed under the GNU General Public License v2.0 (GPLv2).

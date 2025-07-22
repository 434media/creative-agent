# Creative Agent 🤖

An AI-powered creative agent that transforms event concepts into professional poster designs with brand-consistent marketing copy. Built with Next.js, the Vercel AI SDK, and OpenAI.

## Table of Contents

- [Overview](#overview)
- [What This Application Does](#what-this-application-does)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Goals & Scope](#project-goals--scope-for-interns)
- [Development Workflow](#development-workflow--guidelines)
- [Architecture Overview](#architecture-overview)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Team](#team)
- [License](#license)

## Overview

Welcome to the Creative Agent project! This application will spotlight how event concepts are transformed into visually appealing and brand-consistent marketing materials using Artificial Intelligence.

This project aims to provide hands-on experience with cutting-edge AI technologies, modern web frameworks, and collaborative software development practices. As a team, you'll build a full-stack application that takes high-level event ideas and outputs professional poster designs along with SEO-optimized marketing copy.

## What This Application Does

The Creative Agent helps designers and content creators generate professional event posters by:

- **Analyzing event concepts** - Takes a event title and premise as input
- **Generating 3 unique poster designs** - Creates visually distinct concepts using AI image generation
- **Maintaining brand consistency** - Pulls brand colors, typography, and style guidelines from Notion
- **Creating marketing copy** - Generates a 100-word synopsis and punchy promo tagline
- **Ensuring accessibility** - Auto-generates descriptive alt text for all images

## ✨ Key Features

### 🎨 AI-Powered Design Generation
- **DALL-E 3 Integration** - High-quality poster image generation
- **Brand-Aware Prompting** - Incorporates your brand guidelines automatically
- **Multiple Design Concepts** - 3 distinct visual approaches per generation

### 📝 Marketing Copy Creation
- **Synopsis Generation** - Professional 100-word event descriptions
- **Tagline Creation** - Catchy promotional taglines
- **SEO-Optimized Content** - Marketing copy optimized for discoverability

### 🎯 Brand Consistency
- **Notion Integration** - Centralized brand asset management
- **Color Palette Enforcement** - Automatic brand color application
- **Typography Guidelines** - Consistent font usage across designs

### ♿ Accessibility First
- **Auto-Generated Alt Text** - Descriptive image descriptions
- **Screen Reader Support** - Fully accessible interface
- **Keyboard Navigation** - Complete keyboard accessibility

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15** - Full-stack React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

### AI & Generation
- **AI SDK Core** - Unified AI model integration
- **OpenAI GPT-4o** - Text generation and reasoning
- **DALL-E 3** - High-quality image generation
- **Zod** - Schema validation for AI outputs

### Data & Storage
- **Notion API** - Brand guidelines and style token storage
- **Vercel Blob** - Generated image storage
- **Supabase** - Optional metadata and user data

### Deployment
- **Vercel** - Serverless deployment and hosting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm/npm/yarn
- OpenAI API key
- Notion integration token
- Vercel account (for deployment)

### 1. Clone and Install
```bash
git clone https://github.com/434media/creative-agent.git
cd creative-agent
npm install
```

### 2. Environment Setup
Create a `.env.local` file:
```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Notion
NOTION_TOKEN=your_notion_integration_token
NOTION_BRAND_DB_ID=your_notion_database_id

# Vercel Blob (auto-configured on Vercel)
BLOB_READ_WRITE_TOKEN=your_blob_token
```

### 3. Notion Database Setup
Create a Notion database with these properties:
- **Primary Colors** (Multi-select) - Brand primary color palette
- **Secondary Colors** (Multi-select) - Supporting colors  
- **Primary Typography** (Text) - Main font family
- **Secondary Typography** (Text) - Accent font family
- **Style Aesthetic** (Text) - Brand style description

### 4. Run the Application
```bash
npm run dev
```
Visit `http://localhost:3000` to start generating posters!

## 🎯 Project Goals & Scope (For Interns)

This project is designed to give you hands-on experience with modern full-stack development, AI integration, and collaborative software engineering practices.

### Team Structure
You are part of a 3-person team. Each team is responsible for a distinct full-stack application. Collaboration within your team is key!

### Core Deliverables (MVP)
Your primary goal is to deliver a functional version with these core features:
- ✅ **User Interface** - Input form for event title and premise
- ✅ **DALL-E 3 Integration** - Generate 3 unique poster designs
- ✅ **Notion API Integration** - Retrieve and apply brand colors
- ✅ **GPT-4o Integration** - Generate synopsis and taglines
- ✅ **Alt Text Generation** - Auto-generate accessibility descriptions
- ✅ **Results Display** - event generated images, copy, and metadata
- ✅ **Error Handling** - Robust API error management

### Stretch Goals
If your team completes the MVP ahead of schedule:
- [ ] **Enhanced Brand Integration** - Typography and design elements
- [ ] **Copy Fine-tuning** - User editing of generated marketing copy
- [ ] **Save/Download Features** - Export posters in multiple formats
- [ ] **User Authentication** - Project history and user accounts
- [ ] **Advanced SEO** - Enhanced marketing copy optimization
- [ ] **Design Variations** - More poster styles and layouts

## 🔄 Development Workflow & Guidelines

### Git Workflow
- **Feature Branches**: Create branches for each feature (`feature/add-poster-gallery`)
- **Small Commits**: Make frequent, atomic commits with clear messages
- **Pull Requests**: All changes must go through PRs to main branch
- **Stay Updated**: Always `git pull` from main before starting new work

### Branch Protection Rules
- ❌ No direct pushes to main
- ✅ Required approving reviews from team members
- ✅ All status checks must pass before merging

### Code Review Process
- **Constructive Feedback**: Focus on code quality and readability
- **Prompt Reviews**: Review teammates' PRs quickly
- **Learning Opportunity**: Be open to feedback and ask questions

### Communication
- **Daily Stand-ups**: Discuss progress, blockers, and plans
- **Team Channels**: Use designated channels for quick questions
- **GitHub Issues**: Track bugs, features, and tasks

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Input    │    │   Brand Data     │    │  AI Generation  │
│                 │    │                  │    │                 │
│ • Event Title   │───▶│ • Notion API     │───▶│ • GPT-4o Text   │
│ • Event Premise │    │ • Colors         │    │ • DALL-E Images │
│ • Genre/Themes  │    │ • Typography     │    │ • Alt Text      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
┌─────────────────┐    ┌──────────────────┐              │
│   Results UI    │    │   Image Storage  │              │
│                 │    │                  │              │
│ • 3 Posters     │◀───│ • Vercel Blob    │◀─────────────┘
│ • Marketing Copy│    │ • Permanent URLs │
│ • Download Links│    │ • Public Access  │
└─────────────────┘    └──────────────────┘
```

## 🔧 Configuration

### Tips for Best Results
- **Be Specific** - Include genre, mood, and target audience in the premise
- **Mention Visual Elements** - Reference imagery, settings, and characters
- **Consider Brand Fit** - Ensure the concept aligns with brand guidelines
- **Iterate** - Generate multiple times with refined prompts for different results

### Example Prompts
Try these event concepts:
- "Midnight Detective - A noir crime series set in 1940s Chicago following a detective who only works night cases"
- "Cosmic Kitchen - A cooking competition event where chefs prepare meals in zero gravity aboard a space station"
- "The Last Library - A post-apocalyptic drama about survivors who protect the world's remaining books"

## 🚀 Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables in Production
Set all variables in your Vercel project settings:
- `OPENAI_API_KEY`
- `NOTION_TOKEN`
- `NOTION_BRAND_DB_ID`

## 🆘 Mentorship & Support

As the 434 MEDIA lead developer, I am here to guide you. Don't hesitate to ask questions, seek clarification, or request help if you get stuck. My goal is to help you learn and succeed.

## 👥 Team

- **Camille** - Developer
- **Esther** - Developer  
- **Jeremiah** - Developer
- **Jesse** - 434 MEDIA Mentor & Technical Lead

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using [Vercel AI SDK](https://sdk.vercel.ai) and [Next.js](https://nextjs.org)
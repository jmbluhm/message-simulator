# Conversation Simulator

A modern web application for creating and animating realistic message conversations. Built with Next.js, React, TypeScript, and Framer Motion.

![Conversation Simulator](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎬 Animation Engine
- **Realistic Message Playback**: Sequential message display with customizable delays
- **Typing Indicators**: Animated bouncing dots that appear before messages
- **Smooth Animations**: Fade-in and slide-up effects using Framer Motion
- **Variable Speed Control**: Playback speeds from 0.5x to 3x
- **Auto-scroll**: Automatic scrolling to follow the conversation

### 🎨 Design Customization
- **Color Theming**: Customize bubble colors for both parties and background
- **Typography Control**: Adjustable font size (12px-24px) and font family
- **Aspect Ratios**: Multiple display ratios (16:9, 9:16, 1:1, 4:5)
- **Live Preview**: Real-time preview of design changes
- **Mobile-First Design**: Responsive layout that works on all devices

### 📝 Script Management
- **Visual Script Editor**: Intuitive interface for building conversations
- **Message Management**: Add, edit, delete, and reorder messages
- **Import/Export**: Save and load conversation scripts as JSON
- **Sample Scripts**: Pre-built example conversations
- **Validation**: Input validation and error handling

### 🎮 Playback Controls
- **Play/Pause**: Full playback control with keyboard shortcuts
- **Reset**: Return to beginning of conversation
- **Progress Tracking**: Visual indicator of current position
- **Keyboard Shortcuts**: Space (play/pause), R (reset)

### 💾 Data Persistence
- **LocalStorage**: Automatic saving of scripts and design preferences
- **Session Recovery**: Restore previous work on page reload
- **Export/Import**: Share conversations as JSON files

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd conversation-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 🎯 Usage

### Creating a Conversation

1. **Add Messages**: Use the Script Editor to add messages with:
   - Sender selection (Party 1 or Party 2)
   - Message text
   - Delay timing (in seconds)

2. **Customize Design**: Use Design Controls to:
   - Set bubble colors for each party
   - Choose background color
   - Adjust font size and family
   - Select aspect ratio
   - Toggle typing animations

3. **Play Conversation**: Use Playback Controls to:
   - Start/stop playback
   - Adjust speed
   - Reset to beginning

### Keyboard Shortcuts

- **Space**: Play/Pause conversation
- **R**: Reset to beginning
- **Tab**: Navigate between controls

### Import/Export

- **Export**: Click the Export button to download your script as JSON
- **Import**: Click Import to load a previously saved script
- **Sample**: Click Sample to load a demo conversation

## 🏗️ Architecture

### Components

- **ScriptEditor**: Message creation and management interface
- **ConversationView**: Main playback display with phone-like UI
- **MessageBubble**: Individual message display with animations
- **TypingIndicator**: Animated typing indicator
- **DesignControls**: Styling and customization panel
- **PlaybackControls**: Playback management interface

### State Management

- **Zustand Store**: Centralized state management with persistence
- **LocalStorage**: Automatic data persistence
- **TypeScript**: Full type safety throughout the application

### Hooks

- **useConversationPlayer**: Core animation and timing logic
- **Custom Hooks**: Reusable logic for various features

## 🎨 Customization

### Design System

The app uses a comprehensive design system with:
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Consistent iconography
- **Framer Motion**: Smooth animations
- **Responsive Design**: Mobile-first approach

### Color Scheme

Default colors can be customized:
- **Party 1**: Blue (#007AFF)
- **Party 2**: Light Gray (#E5E5EA)
- **Background**: White (#FFFFFF)

### Typography

Supported font families:
- System UI (default)
- Arial
- Roboto
- Comic Sans MS

## 🔧 Development

### Project Structure

```
conversation-simulator/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ScriptEditor.tsx   # Script management
│   ├── ConversationView.tsx # Main display
│   ├── MessageBubble.tsx  # Message component
│   ├── TypingIndicator.tsx # Typing animation
│   ├── DesignControls.tsx # Styling controls
│   └── PlaybackControls.tsx # Playback controls
├── hooks/                 # Custom React hooks
│   └── useConversationPlayer.ts # Animation logic
├── lib/                   # Utilities and store
│   ├── store.ts          # Zustand store
│   └── types.ts          # TypeScript types
└── public/               # Static assets
```

### Key Technologies

- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Zustand**: Lightweight state management
- **Framer Motion**: Animation library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## 🚧 Version 2 Roadmap

### Planned Features

- **🎥 Video Export**: Export conversations as MP4 videos
- **🎵 Audio Integration**: Add sound effects and background music
- **📱 Mobile App**: React Native version for mobile devices
- **☁️ Cloud Sync**: Save conversations to the cloud
- **👥 Collaboration**: Real-time collaborative editing
- **🎭 Character Profiles**: Customizable character avatars and names
- **📊 Analytics**: Conversation performance metrics
- **🔌 API Integration**: Connect to messaging platforms
- **🎨 Advanced Themes**: Pre-built conversation themes
- **📝 Rich Text**: Support for formatting, emojis, and media

### Technical Improvements

- **Performance**: Virtual scrolling for large conversations
- **Accessibility**: Enhanced screen reader support
- **Testing**: Comprehensive test suite
- **Documentation**: API documentation and guides
- **Internationalization**: Multi-language support

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Framer Motion** for smooth animations
- **Lucide** for beautiful icons
- **Tailwind CSS** for utility-first styling
- **Zustand** for simple state management
- **Next.js** team for the amazing framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Made with ❤️ for creating amazing conversations**
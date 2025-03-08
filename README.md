# MadeBy - Creator Portfolio Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20.x-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)

MadeBy is a modern portfolio platform built for creators to showcase their work, connect with clients, and manage their creative business. Built with TypeScript, Node.js, and modern web technologies.

## ✨ Features

- 🎨 Portfolio Creation & Management
- 👥 Creator Profiles
- 💼 Project Showcase
- 🤝 Client Collaboration Tools
- 📊 Analytics Dashboard
- 🔒 Secure Authentication
- 🌐 Social Integration

## 🚀 Tech Stack

- **Backend**: Node.js, TypeScript, Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: OAuth (Google, GitHub, Twitter)
- **Cloud Storage**: Cloudinary storage
- **API**: RESTful with OpenAPI/Swagger
- **Testing**: Jest
- **CI/CD**: GitHub Actions

## 📋 Prerequisites

- Node.js 20.x or later
- PostgreSQL 15.x or later
- bun or pnpm
- Cloudinary Account (for S3 storage)

## 🛠 Installation

1. Clone the repository:
```bash
git clone https://github.com/francisamidu/made-by-backend.git
cd madeby
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/madeby
JWT_SECRET=your_jwt_secret...
```

5. Run database migrations:
```bash
bun run db:migrate
```

6. Start the development server:
```bash
bun run dev
```

## 📚 Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun start` - Start production server
- `bun test` - Run tests
- `bun run lint` - Lint code
- `bun run format` - Format code
- `bun run db:migrate` - Run database migrations
- `bun run db:generate` - Generate new migration
- `bun run docs` - Generate API documentation

## 🏗 Project Structure

```
src/
├── config/         # Configuration files
├── handlers/    # Route controllers
├── db/            # Database setup and migrations
├── middleware/    # Express middleware
├── routes/        # API routes
├── services/      # Business logic
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## 📝 API Documentation

API documentation is available at `/api-docs` when running the server. It includes:

- Detailed endpoint descriptions
- Request/response examples
- Authentication requirements
- Schema definitions

## 🔒 Security

- JWT-based authentication
- OAuth2 integration
- Rate limiting
- CORS protection
- Input validation
- XSS protection

## 🧪 Testing

Run the test suite:

```bash
bun test
```

For coverage report:

```bash
bun run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)


## 🚀 Roadmap

- [ ] Enhanced Analytics Dashboard
- [ ] Integrated Payment System
- [ ] Mobile App
- [ ] AI-Powered Insights
- [ ] Collaboration Tools
- [ ] Marketplace Integration

---

Built with ❤️ by the Francis Amidu
# Installing the Project on Debian

The application consists of a TypeScript/React client bundled with Vite and an Express server. Follow the steps below to get everything running on a fresh Debian system.

## 1. Install system dependencies

```bash
sudo apt update
sudo apt install -y curl git build-essential python3
```

> `build-essential` and `python3` provide native build tooling for several npm packages.

## 2. Install Node.js 20.x and npm

1. Add the NodeSource repository for Node.js 20:

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   ```

2. Install Node.js (npm is bundled with it):

   ```bash
   sudo apt install -y nodejs
   ```

You can verify the installation with:

```bash
node -v
npm -v
```

The project targets Node.js 20, which matches the version used in development.

## 3. Clone the repository

```bash
git clone https://github.com/<your-org>/<your-repo>.git
cd <your-repo>
```

Replace the placeholders with the actual organization and repository names.

## 4. Install project dependencies

```bash
npm install
```

This installs all shared dependencies for the client and server workspaces.

## 5. Run the development server

```bash
npm run dev
```

The Express server and the Vite development environment will start together on port `5000`. Visit `http://localhost:5000` in your browser to access the application.

## 6. Create a production build (optional)

To build the client and compile the server into the `dist/` directory:

```bash
npm run build
```

Start the compiled server with:

```bash
npm run start
```

## 7. Environment variables

The default configuration runs entirely in-memory and does not require additional environment variables. If you later configure external services (e.g., databases or APIs), follow their respective setup guides.

---

You now have the project running locally on Debian. Enjoy hacking on it!

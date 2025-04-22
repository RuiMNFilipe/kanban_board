# Kanban board Task Manager App

This is a [Next.js 15](https://nextjs.org) project to showcase my full stack app development skills.

It features:

- [AuthJs](https://authjs.dev):
  - Authentication
  - Session Management
- [Docker](https://docker.com):
  - Containerization of PostgreSQL database and app itself
  - Docker Compose to manage both images
- [TailwindCSS](https://tailwindcss.com):
  - For easy styling with JSX classnames
- [TypeScript](https://www.typescriptlang.org):
  - For type safety during development
- [Prisma ORM](https://prisma.io):
  - Querying database with abstraction for easy data manipulation

## Getting Started

### Prerequisites:

Before you can run the application with Docker, you need to have it installed in your machine.

1. **Install Docker**:

   - **Windows/macOS**: Go to the official [Docker website](https://www.docker.com/products/docker-desktop/) and download and install Docker Desktop. Follow the installation instructions provided for your operating system.
   - **Linux**:Follow the instructions for your specific distribution on the official [Docker documentation page](https://docs.docker.com/engine/install/). You'll likely need to use your distribution's package manager (e.g., apt for Debian/Ubuntu, yum for CentOS/Fedora).

2. **Install Docker Compose:**

   - **Docker Desktop (Windows/macOS)**: Docker Compose is usually included automatically with Docker Desktop.
   - **Linux**: You might need to install Docker Compose separately. Follow the instructions on the official [Docker documentation page](https://docs.docker.com/compose/install/linux/).

3. **Verify Installation:**
   - Open your terminal or command propmpt and run the following command:
   ```bash
   docker compose --version
   ```
   - If Docker Compose is installed correctly, you should see the Docker version information printed.

### Running the Application

1. **Navigate to the Project Directory**:
   - Open your terminal or command prompt and navigate to the root directory of the application, where the `docker-compose.yml` file is located.
2. **Start the Application Services**:
   - Use the `docker compose up` command to start all the services defined in the `docker-compose.yml` file.  
     The `-d` flag will run the containers in detached mode (in the background).
   ```bash
   docker compose up -d
   ```
   - Docker Compose will read your `docker-compose.yml` file, pull any necessary images, create and start the containers for each service, and set up the network and volume configurations as defined.
3. **Monitor the Startup (Optional):**

   - You can view the logs of the services as they start using `docker compose logs` command.  
     You can specify a particular service name to see only its' logs.

   ```bash
   docker compose logs -f
   ```

   (Press `Ctrl + C` to stop following the logs)

   ```bash
   docker compose logs -f <service-name>
   ```

4. **Access the Application:**
   - The `docker-compose.yml` file will define how the ports of the cointainers are exposed to your host machine. You'll need to examine this file to find out which host ports are mapped to which container ports for the application's services.
   - For example, if the Next.js service in `docker-compose.yml` has a port mapping like `80:3000`, you would typically access it in your web browser at `http://localhost:80` or just `http://localhost` if port 80 is the standard HTTP port.

### Managing the Docker Compose Application:

Here are some useful Docker Compose commands:

- **Stop All Running Services:**
  ```bash
  docker compose down
  ```
- **Stop and Remove Containers, Networks and Volumes:**
  ```bash
  docker compose down --rmi all --volumes --remove-orphans
  ```
  (_Use with caution, this will delete your containers and potentially data volumes_)
- **View Logs of a Specific Service:**
  ```bash
  docker compose logs <service-name>
  ```
- **Run a One-Off Command in a Service Container:**
  ```bash
  docker compose exec -it <service-name> your_command
  ```
  (The `-it` flag runs the shell on interactive mode, so you can execute commands directly in the container)
- **Build or Rebuild Services (if you made any changes to `Dockerfile` or `docker-compose.yml`)**:
  ```bash
      docker compose build
  ```
  ```bash
      docker compose build <service-name>
  ```

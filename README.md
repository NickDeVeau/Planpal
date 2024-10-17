# **Planpal**

PlanPal is a web-based task management application designed to help users manage tasks and schedules effectively across desktop and mobile platforms.

## **Getting Started**

### **1. Setup Instructions**

#### **Clone the Repository**
1. Open Terminal and navigate to the desired directory.
2. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/PlanPal.git
   ```
3. Navigate into the project folder:
   ```bash
   cd PlanPal
   ```

#### **Install Dependencies**

**Frontend (React)**
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install required packages:
   ```bash
   npm install
   ```

**Backend (Node.js)**
1. Navigate to the backend directory:
   ```bash
   cd ../backend
   ```
2. Install required packages:
   ```bash
   npm install
   ```

### **2. Running the Project**

#### **Start the Frontend**
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the React development server:
   ```bash
   npm start
   ```
3. Open your browser and go to:
   ```
   http://localhost:3000
   ```
   - You should see the PlanPal homepage.

#### **Start the Backend**
1. Open a new terminal window.
2. Navigate to the backend directory:
   ```bash
   cd ../backend
   ```
3. Start the backend server:
   ```bash
   node index.js
   ```
   - This will start the server on `http://localhost:5000` (or your configured port).

#### **Stopping the Servers**
- To stop the frontend or backend server, go to the terminal where it is running and press `Ctrl + C`.

### **3. Project Structure**

#### **Frontend**
- `src/App.js`: Main entry point for the React app.
- `src/components/`: Folder containing React components.

#### **Backend**
- `index.js`: Main entry point for the Node.js server.
- `routes/`: Folder containing route handlers for API endpoints.

#### **.env Files**
- Use `.env` files to store environment-specific configurations (e.g., API keys, database URLs).
- Make sure `.env` is listed in `.gitignore` to keep sensitive information private.

### **4. Git Workflow**

1. **Create a new branch** for each feature:
   ```bash
   git checkout -b feature/feature-name
   ```
2. **Commit changes** with descriptive messages:
   ```bash
   git commit -m "Add feature: description"
   ```
3. **Push changes** to GitHub:
   ```bash
   git push origin feature/feature-name
   ```
4. **Create a pull request** on GitHub and request a review.

### **5. Useful Commands**

#### **Frontend**
- **Start the frontend server**: `npm start`
- **Build for production**: `npm run build`

#### **Backend**
- **Start the backend server**: `node index.js`
- **Run in development mode (with nodemon)**:
   ```bash
   npm install -g nodemon
   nodemon index.js
   ```

#### **Git**
- **Check current branch**: `git branch`
- **Switch to a branch**: `git checkout branch-name`

### **6. Troubleshooting**

- **Missing Packages**: Run `npm install` in the respective directory.
- **Port Already in Use**: Change the port in `frontend/package.json` or `backend/index.js`.
- **Cannot Connect to Backend**: Ensure both servers are running, and the frontend is pointing to the correct API URL.

This project is licensed under the [MIT License](LICENSE).

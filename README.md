# Task Tracker

A full-stack task-tracking app built with:

- **React** (Vite) for the front-end  
- **Express** + **Node.js** for the back-end REST API  
- **MongoDB** (via Mongoose) for data storage  
- **JSON Web Tokens** for authentication  
- Hosted with Heroku (API + static build)  

## Features

- Sign up / log in with email & password  
- Create, update (toggle), and delete your own tasks  
- JWT-based protection of all task routes  
- React Router for client-side navigation  
- Deployed production build served from `client/dist`

## Getting Started

### Prerequisites

- Node.js (v16+)  
- npm  
- A MongoDB Atlas account or local MongoDB server  
- (Optional) Heroku CLI, if you want to deploy

### Local Setup

1. Clone the repo:  
   ```bash
   git clone https://github.com/udeese/task_tracker.git
   cd task-tracker

# GymPoint

GymPoint it's an application to manager your gyms and students. 
In the application, only the administrators can register students and enroll them in some plan. After the enroll, the student receive an e-mail with details about price, plan duration and more.

Besides that, the application allows that students send some questions or ask for help about physical exercises, alimentation and others subjects. When the question is answed in the app or site, the students receive a e-mail with answer.

Some more funcionalities will be describe below.

* This application use a RESTFul API backend.

* To inicialize the project with your machine, just download and run 'yarn' or 'npm install' in the project path to linking all dependencies.

* Use 'yarn dev' to run the project. 

# Functionalities
  * Admin
    - Create users and login to application (here I used a jwt to authentication)
    - Create students
    - List, Update and Delete students
    - Create matriculation for a student
    - List, Update and Delete matriculation
    
  * Users
    - Send an message with some question or ask for help
    - Does checkin when he arrives in the gym
    - List all check-ins by id
    
  * Application
    - Send e-mails
    - Field validations
    - Data validations
    - Create queues to improve performance in sending e-mails

# Used technologies:

Docker to containerization

* Dependecies:
  - Express (Used to build the wep application)
  - JSONWebToken (Generate Token)
  - Nodemailer (Send e-mails)
  - PG (Work with postgres in node)
  - Sequelize (ORM to sql commands)
  - Sentry (Debug online)
  - bcryptjs (Encrypt password)
  - Bee-queue (Tool to increase queue performance)
  - Date-fns (Work with date types)
  - Dotenv (Pattern from .env)
  - Youch (Catch async errors)
  - Yup (Verify and validate input datas)
  - Handlebars (Build templates for e-mails)
  - Sentry (Debug in production environment)

* Development Dependecies: 
  - EsLint, Prettier (code pattern)
  - Nodemon (restart automally server)
  - Sucrase (To use import/from rather than const/require of CommonJS)
  - Sequelize-Cli (Command Line Interface from Sequelize)

* Databases:
  - PostgreSQL, Redis

**Project Configuration**

- Install all the packages of node using "npm install" command
- Install **prettier** and **ESLint** plugin. Follow the steps given in the following link, to install the document
  - https://code.visualstudio.com/docs/introvideos/extend

**Project Structure**

- Repository Classes

  - Create repository class for each and every database models and store it in the **src/repositories** folder
  - Repository class will only have the code for the database query.
  - Class name must have **Repository** word in it. Example **UserRepository** or **UserPermissionRepository**

- Service Classes

  - Create service class only if business logic needs to be apply before database transaction for the specific table. Store the file in the **src/services** folder
  - Repository class instance must be created.
  - Service classes will contain business logic code only
  - File name should be same as table name
  - Class name must have **Service** word in it. Example UserService or **UserPermissionService**

- Controller Classes

  - Create controller class for each module. Store the file in the **src/controllers** folder
  - Service class instance must be created. Never create repository class directly into the controller.
  - Controller classes will contain the code of validating the Request. After validating the request, it will send the request instance to the service class.
  - File name should be same as table/module name
  - Class name must have **Controller** word in it. Example **UserController** or **UserPermissionController**

- Route Classes

  - Create Route class for each module or table. Store the file in the **src/routes** folder.
  - All the table/module related routes must be defined in the Route class.
  - Create controller instance
  - File name should be same as table/module name.
  - Class name must have **Route** word in it. Example **UserRoute** or **UserPermissionRoute**

- Database environments
  - All the database environments must be stored in the **src/db** folder as **db_manager.ts**

**Debugging**

- Use the following command to clean the build
  - **npm run clean**
- Use the following command to compile the project
  - **npm run compile**
- To debug/run the project use the following command. This command will compile and run the project locally.
  - **npm run debug**
- Use following command to formate all the files of the project
  - **npm run prettier-format**
- Use following command to see all the ESLint issues
  - **npm run lint**

**Hot Reload**

- Use following command to install nodemon (to hot reload project)
  - **npm install -g nodemon**
- Use following command to watch dev server
  - **npm run dev**
- To kill port if already running
  - **sudo kill -9 $(sudo lsof -t -i:8080)**

# Welcome to my final project - qLog

The following sections describe the important files within my project. This README is organized in the following way:

- Backend Files
- Frontend Files
- Misc Comments

## Backend Files

The backend for this project is implemented using Django and a Sqlite database. The "App" folder contains project specific files for this project, while the "qLog" folder is the project directory. There is also a "media" folder which is used for storing image files used in this web app - to be further elaborated on in the front end section.

The interesting backend stuff resides within the "App" folder. The Django models, admin, urls and views for this web app are contained in the standard Python files. I have added an additional forms.py file to contain all the forms used in this project. Although forms are not explicitly rendered by Django, they are used to validate the form data collected on the front end.

The "templates" folder within contains the HTML files for this project.

## Frontend Files

The "templates" folder contains 4 HTML files. The "login.html" and "register.html" are standard HTML files to handle login and registering of users - almost identical to what was used in the project distribution files throughout this course, so I will not go into too much details here.

The "layout.html" file contains the standard template for the navigation bar at the top of every page, with different elements rendered depending on the user and if the user is logged in. It also contains the links to the JavaScript files used for the front end of this web app. React CDN and Bootstrap script files are included. The Bootstrap script file is for making the Nav bar mobile responsive and the React CDN is to enable use of React language on the front end (a separate script file to be discussed about later in the following paragraphs).

The "index.html" is a simple basic HTML which extends "layout.html" file. Other than this, there is a body div with an id of "root" for React use and a script link to the React JS file for this project.

Within the "static" folder, there are two files, a "styles.css" file containing basic css styles for this web app. It also handles the mobile responsive element of this web app, with screens less than 720px width being rendered differently - namely smaller sized text, tables which can be scrolled width-wise, and hiding of the sketching function.

The "app.js" file contains the full implementation of a single paged app for this project. It contains all the content that is being rendered to the user, including All Projects, All Users, Single User Profile view, Single Project page, and Single borehole page. It also contains different forms for user to input content such as creating/editing projects, creating/editing boreholes, creating/editing geology layers, creating/editing sketches on each project page, and posting new messages to the project page.

## Miscellaneous Comments

In order to implement a sketching function, I needed to utilize Django model's ImageField. To use the ImageField, I had to install a Python package called "Pillow", as recommended by Django's official documentation. In order to work with images, Django's documentation also recommended setting up a "media" folder in the project directory to save sketches. The Django "settings.py" file for this project has been revised to enable the use of this media folder. In addition to storing sketches in the media folder, I have also included a background image for the front page under the subfolder "Images".

Copyright (c) 2025 Jhordany Rodriguez Parra.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify, merge, publish, 
distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following condition:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.


# Readme

## Start the server: python manage.py runserver
### service will be available at localhost:8000/rptable/

Folder rptable-demo contains the point of entry to the site. This site's only function
is to provide a quick way to showcase the functionality of RPTable. It is NOT intended
to be a security-compliant site. For example, file settings.py contains a private key
which in production servers should be handled differently. We provide this key to
allow for a quick setup.

RPTables are designed to work with minimal installations. Simple Javascript with widely support commands are used.
Only requirement for you to run this project is django (version 5.0.6)

 Most files are boiler plate code required by Django to serve the webpage. The key files
 to understand are:

/*
1. rptable/templates/rptable/index.html: Minimal example of html webpage that calls the necessary scripts and contains some divs
in which the table and graphs will be held.
2. rptable/static/rptable/json_data.js: A script that generates some random data.
3. rptable/static/rptable/main.js: a script that contains default calls to use RPTables.
*/

Enjoy and feel free to propose changes, report bugs and contribute. Simply create a pull request and we will be happy to test and merge your changes.

Thanks!

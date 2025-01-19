
Copyright (c) 2025 Jhordany Rodriguez Parra.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify, merge, publish, 
distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following condition:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.


# Readme


RPTable is designed to work with minimal dependencies. Thus, simple, widely-supported Javascript APIs are used and a simple Python-based web server is provided.

## Install:

1. Clone the repository: e.g., git clone git@github.com:JhordanyRodriguez/rptable.git
2. Enter the newly created directory: cd rptable
3. Activate (or create) a python virtual environment to serve a simple demo app. See https://docs.python.org/3/tutorial/venv.html
4. Install requirements: pip install -r requirements.txt

## Start the server

1. Run the app: python app.py
2. Open browser at: localhost:8000.

## important files


1. templates/rptable/index.html: Minimal example of html webpage that calls the necessary scripts and contains some divs
in which the table and graphs will be held.
2. static/rptable/json_data.js: A script that generates some random data.
3. static/rptable/main.js: a script that contains default calls to use RPTables.


Enjoy and feel free to propose changes, report bugs and contribute. Simply create a pull request and we will be happy to test and merge your changes.

Thanks!

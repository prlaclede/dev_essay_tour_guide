import os
import uuid, hashlib, psycopg2, psycopg2.extras
from flask import Flask, session, render_template, request, redirect, url_for, jsonify

from flask import Flask, render_template, request
app = Flask(__name__)

def connectToEssayDB():
  connectionString = 'dbname=alien user=essayTourAdmin password=essayAdminPass host=localhost'
  try:
    return psycopg2.connect(connectionString)
  except:
    print("Can't connect to database alien")
    

@app.route('/')
def mainIndex():
    return render_template('index.html', selectedMenu='Home')


if __name__ == '__main__':
    app.debug=True
    app.run(host='0.0.0.0', port=8080)

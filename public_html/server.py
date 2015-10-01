import os
import uuid, hashlib, psycopg2, psycopg2.extras
from flask import Flask, session, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)


def connectToEssayDB():
  connectionString = 'dbname=alien user=essaytouradmin password=essaytourpass host=localhost'
  try:
    return psycopg2.connect(connectionString)
  except:
    print("Can't connect to database alien")

def returnImage(image, *args):
  print ('image: ', image)
  return render_template('icon.html', image=image, classes=args);

@app.route('/')
def mainIndex():
    return render_template('index.html', selectedMenu='Home', returnImage = returnImage)
    
@app.route('/mapPage')
def mapPage():
    return render_template('mapPage.html', selectedMenu='Explore')
    

if __name__ == '__main__':
  app.debug=True
  app.run(host='0.0.0.0', port=8080)

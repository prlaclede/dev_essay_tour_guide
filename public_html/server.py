import os
import uuid, hashlib, psycopg2, psycopg2.extras, logging
from flask import Flask, session, render_template, request, redirect, url_for, jsonify
from flask.ext.socketio import SocketIO, emit

#logger.basicConfig(filename='example.log',level=logging.DEBUG) #setup for a log file
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

app.config['SECRET_KEY'] = 'secret!'
app.secret_key = os.urandom(24).encode('hex')

socketio = SocketIO(app)

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
    
@socketio.on('login_event')
def userLogin(message):
  logger.info('woot')
  emit('user_login', {'data': message['data']}, broadcast=True)

if __name__ == '__main__':
  app.debug=True
  #app.run(host='0.0.0.0', port=8080) #none socketIO app
  socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port=int(os.getenv('PORT', 8080)))

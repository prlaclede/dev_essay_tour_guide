import os
import uuid, hashlib, psycopg2, psycopg2.extras, logging
from flask import Flask, session, render_template, request, redirect, url_for, jsonify
from flask.ext.socketio import SocketIO, emit

#setup for different levels of log files later
#logger.basicConfig(filename='debug.log',level=logging.DEBUG) 
#logger.basicConfig(filename='error.log',level=logging.ERROR) 
#just logging to the console 
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

app.config['SECRET_KEY'] = 'secret!'
app.secret_key = os.urandom(24).encode('hex')

socketio = SocketIO(app)

def connectToEssayDB():
  connectionString = 'dbname=essaytourdb user=essaytouradmin password=essaytourpass host=localhost'
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
  logger.info('checking DB for user')
  conn = connectToEssayDB()
  cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  query = ("SELECT email, first_name, last_name, pending FROM users WHERE email=%s AND password = crypt(%s, password)")
  cur.execute(query, (message['email'], message['pass']))
  if (cur.fetchone()):
    results = cur.fetchall()
    logger.info('user found')
    if (results['pending'] == True):
      emit('user_login', {'messageType': 'warning', 'message': 'Account still pending admin approval.'}, broadcast=True)
  else:
    emit('user_login', {'messageType': 'error', 'message': 'Email and/or Password information is incorrect!'}, broadcast=True)
  emit('user_login', message, broadcast=True)

if __name__ == '__main__':
  app.debug=True
  #app.run(host='0.0.0.0', port=8080) #none socketIO app
  socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port=int(os.getenv('PORT', 8080)))

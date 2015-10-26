import os
import uuid, hashlib, MySQLdb, MySQLdb.cursors, logging, md5
from flask import Flask, session, render_template, request, redirect, url_for, jsonify, json
from flask.ext.login import LoginManager, UserMixin, login_required
from modules import *

init_db()
#admin = User(email='admin@admin.com', password='adminp@$$', first_name='Ally', last_name='Gator', pending=False, account_type_id_fk=1, instr_id_fk=1)
#db_session.add(admin)
#db_session.commit()

#setup for different levels of log files later
#logger.basicConfig(filename='debug.log',level=logging.DEBUG) 
#logger.basicConfig(filename='error.log',level=logging.ERROR) 
#just logging to the console for now
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

login_manager = LoginManager()
login_manager.init_app(app)

app.config['SECRET_KEY'] = 'theSecretestKey'
app.secret_key = os.urandom(24).encode('hex')

def connectToEssayDB():
  try:
    return engine.connect()
  except:
    print("Can't connect to database alien")
    
@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

@app.route('/')
def mainIndex():
  loggedIn = False;
  if (session.get('user') == None):
    print('no user')
    return render_template('index.html', loggedIn = False, returnImage = returnImage)
  else: 
    print(session.get('user'))
    return render_template('index.html', loggedIn = True, returnImage = returnImage)
  
@app.route('/loadImage', methods=['POST'])
def returnImage(image, *args):
  print ('image: ', image)
  return json.dumps({'image': image, 'classes' : args})
  
@app.route('/checkUser')
def getUser():
  return jsonify(user=session.get('user'))
  
@app.route('/login', methods=['POST'])
def login():
  userEmail = request.form['userLoginEmail']
  userPass = request.form['userLoginPass']
  logger.info(userEmail + " " + userPass)
  return (userLogin(userEmail, userPass))
  
@app.route('/loadMarkers')
def getMarkers():
  conn = connectToEssayDB()
  markerList = Marker.query.all()
  return jsonify(markerList=[i.serialize for i in markerList])
  
@app.route('/loadEssays')
def getEssays():
  markerID = request.args.get('markerID', 0, type=int)
  conn = connectToEssayDB()
  essayList = Essay.query.filter(Essay.marker_id_fk==markerID).all()
  return jsonify(essayList=[i.serialize for i in essayList])
    
    
def userLogin(email, password):
  dk = md5.new(password).hexdigest()
  logger.info('checking DB for user')
  conn = connectToEssayDB()
  user = User.query.filter(and_(User.email==email, User.password==dk)).all()
  user=[i.serialize for i in user]

  if (len(user) != 0):
    logger.info('user found')
    session['user'] = (user[0])
    print(session.get('user'))
    return jsonify(user=user)
  else:
    logger.info('user not found')
    return jsonify(user=user)
    

if __name__ == '__main__':
  app.debug=True
  app.run(host='0.0.0.0', port=8080) 

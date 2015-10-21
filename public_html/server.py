import os
import uuid, hashlib, MySQLdb, MySQLdb.cursors, logging
from flask import Flask, session, render_template, request, redirect, url_for, jsonify, json
from flask.ext.login import LoginManager, UserMixin, login_required

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
    return MySQLdb.connect(host = "localhost", user = "essaytouradmin", passwd = "essaytourpass", db = "essaytourdb", cursorclass=MySQLdb.cursors.DictCursor)
  except:
    print("Can't connect to database alien")
    
class User(UserMixin):

    def __init__(self, username, password):
        self.id = username
        self.password = password

    #@classmethod
    #def get(cls,id):
        #return userLogin(id, password)

@app.route('/')
def mainIndex():
  loggedIn = False;
  return render_template('index.html', loggedIn = False, returnImage = returnImage)
  
@app.route('/loadImage', methods=['POST'])
def returnImage(image, *args):
  print ('image: ', image)
  return json.dumps({'image': image, 'classes' : args})
  
@app.route('/login', methods=['POST'])
def login():
  userEmail = request.form['userLoginEmail']
  userPass = request.form['userLoginPass']
  logger.info(userEmail + " " + userPass)
  return (userLogin(userEmail, userPass))
  
@app.route('/loadMarkers')
def getMarkers():
  conn = connectToEssayDB()
  cur = conn.cursor()
  query = ("SELECT * FROM markers")
  cur.execute(query)
  results = cur.fetchall()
  #print(results)
  return jsonify(data=results)
  
@app.route('/loadEssays')
def getEssays():
  markerID = request.args.get('markerID', 0, type=int)
  print("marker id: ",  markerID)
  conn = connectToEssayDB()
  cur = conn.cursor()
  query = ("SELECT * FROM essays WHERE marker_id_fk = %s")
  cur.execute(query, markerID)
  results = cur.fetchall()
  if (len(results) != 0):
    logger.info("essay(s) found for location")
  return jsonify(data=results)
    
    
def userLogin(email, password):
  logger.info('checking DB for user')
  conn = connectToEssayDB()
  cur = conn.cursor()
  
  query = ("SELECT email, first_name, last_name, pending, account_type_id_fk FROM users WHERE email = %s AND AES_DECRYPT(password, %s) = %s")
  cur.execute(query, (email, 'passpls', password))
  results = cur.fetchall()
  if (len(results) != 0):
    logger.info('user found')
    firstName = results[0]['first_name']
    lastName = results[0]['last_name']
    return json.dumps({'valid': 'true', 'accType': results[0]['account_type_id_fk'], 'firstName': firstName, 'lastName': lastName});
  else:
   logger.info('user not found')
   return json.dumps({'valid': 'false'});

if __name__ == '__main__':
  app.debug=True
  app.run(host='0.0.0.0', port=8080) 

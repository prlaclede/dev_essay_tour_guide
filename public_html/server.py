import os
import uuid, hashlib, psycopg2, psycopg2.extras, logging
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
  connectionString = 'dbname=essaytourdb user=essaytouradmin password=essaytourpass host=localhost'
  try:
    return psycopg2.connect(connectionString)
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
  #return render_template('icon.html', image=image, classes=args);
  
@app.route('/login', methods=['POST'])
def login():
  userEmail = request.form['userLoginEmail']
  userPass = request.form['userLoginPass']
  logger.info(userEmail + " " + userPass)
  return(userLogin(userEmail, userPass))
    
    
def userLogin(email, password):
  logger.info('checking DB for user')
  conn = connectToEssayDB()
  cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  query = ("SELECT email, first_name, last_name, pending, account_type_id_fk FROM users WHERE email = %s AND password = crypt(%s, password)")
  cur.execute(query, (email, password))
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

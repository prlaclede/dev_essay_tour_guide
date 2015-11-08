import os
import logging, md5
from flask import (Flask, session, render_template, request, redirect, 
url_for, jsonify, json)
from UserAPI import user_api
from EssayAPI import essay_api
from MarkerAPI import marker_api
from DriveAccessAPI import driveAccess_api
from flask.ext.mail import Message
from modules import *

init_db()
#for testing purposes
#password = md5.new('basicpass').hexdigest()
#user = User(email='basic@email.com', password=password, first_name='Mac', last_name="N'Cheese", pending=True, account_type_id_fk=2, instr_id_fk=2)
#db_session.add(user)
#db_session.commit()

#setup for different levels of log files later
#logger.basicConfig(filename='debug.log',level=logging.DEBUG) 
#logger.basicConfig(filename='error.log',level=logging.ERROR) 
#just logging to the console for now
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

app.register_blueprint(user_api)
app.register_blueprint(essay_api)
app.register_blueprint(marker_api)
app.register_blueprint(driveAccess_api)

app.config['SECRET_KEY'] = 'theSecretestKey'
app.secret_key = os.urandom(24).encode('hex')

@app.route('/')
def mainIndex():
  loggedIn = False;
  if (session.get('user') == None):
    print('no user')
    return render_template('index.html', loggedIn = False)
  else: 
    print(session.get('user'))
    return render_template('index.html', loggedIn = True)
  
def send_email(to, subject, template):
  msg = Message(
    subject,
    recipients=[to],
    html=template,
    sender=app.config['MAIL_DEFAULT_SENDER']
  )
  mail.send(msg)

if __name__ == '__main__':
  app.debug=True
  app.run(host='0.0.0.0', port=8080) 

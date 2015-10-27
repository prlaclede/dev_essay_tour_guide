import os
import logging, md5
from flask import (Flask, session, render_template, request, redirect, 
url_for, jsonify, json)
from UserAPI import user_api
from modules import *

init_db()
#for testing purposes
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

app.register_blueprint(user_api)

app.config['SECRET_KEY'] = 'theSecretestKey'
app.secret_key = os.urandom(24).encode('hex')

def connectToEssayDB():
  try:
    return engine.connect()
  except:
    print("Can't connect to database alien")
    

@app.route('/')
def mainIndex():
  loggedIn = False;
  if (session.get('user') == None):
    print('no user')
    return render_template('index.html', loggedIn = False)
  else: 
    print(session.get('user'))
    return render_template('index.html', loggedIn = True)
  
@app.route('/loadMarkers')
def loadMarkers():
  conn = connectToEssayDB()
  markerList = Marker.query.all()
  return jsonify(markerList=[i.serialize for i in markerList])
  
@app.route('/loadMarkerEssays')
def loadMarkerEssays():
  markerID = request.args.get('markerID', 0, type=int)
  conn = connectToEssayDB()
  essayList = Essay.query.filter(Essay.marker_id_fk==markerID).all()
  return jsonify(essayList=[i.serialize for i in essayList])
  
@app.route('/loadRecentEssays')
def getAll():
  conn = connectToEssayDB()
  essayList = Essay.query.limit(5).all()
  essayList = [i.serialize for i in essayList]
  return jsonify(essayList=essayList)

@app.route('/recentEssay', methods=['POST'])
def recentEssays():
  name = request.json['title']
  location = request.json['location'] 
  print(location)
  return render_template('recentEssay.html', name=name, location=location)
    

if __name__ == '__main__':
  app.debug=True
  app.run(host='0.0.0.0', port=8080) 

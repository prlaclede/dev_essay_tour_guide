import logging, md5
from flask import (Blueprint, Flask, session, render_template, request, 
redirect, url_for, jsonify, json)
from modules import *

essay_api = Blueprint('essay_api', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def connectToEssayDB():
  try:
    return engine.connect()
  except:
    print("Can't connect to database")
    
@essay_api.route('/loadRecentEssays')
def getAll():
  conn = connectToEssayDB()
  essayList = Essay.query.limit(5).all()
  essayList = [i.serialize for i in essayList]
  return jsonify(essayList=essayList)

@essay_api.route('/recentEssay', methods=['POST'])
def recentEssays():
  name = request.json['title']
  location = request.json['location'] 
  print (name)
  return render_template('recentEssay.html', name=name, location=location)
  
@essay_api.route('/newEssay')
def newEssay():
  essay = request.args.get('essay')
  conn = connectToEssayDB()
  newEssay = Essay(title=essay['title'], location=essay['location'], pending=True, marker_id_fk=marker['marker_id'], long=user_id_fk['user_id'])
  db_session.add(essay)
  db_session.commit()
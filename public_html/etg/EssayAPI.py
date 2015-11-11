import logging, md5
from flask import (Blueprint, Flask, session, render_template, request, 
redirect, url_for, jsonify, json)
from modules import *

essay_api = Blueprint('essay_api', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
    
@essay_api.route('/loadRecentEssays')
def getAll():
  try:
    essayList = Essay.query.limit(5).all()
    essayList = [i.serialize for i in essayList]
  except:
    logger.error('failed to load recent essays')
    
  return jsonify(essayList=essayList)

@essay_api.route('/recentEssay', methods=['POST'])
def recentEssays():
  name = request.json['title']
  return render_template('recentEssay.html', name=name)
  
@essay_api.route('/pendingEssays')
def getPendingUsers():
    logger.info('getting pending essays')
    try:
      essays = Essay.query.filter(Essay.pending==1)
      essays = [essay.serialize for essay in essays]
      for essay in essays:
        associatedMarker = Marker.query.filter(Marker.id==essay['marker_id_fk'])
        associatedMarker = [i.serialize for i in associatedMarker]
        associatedUser = User.query.filter(User.id==essay['user_id_fk'])
        associatedUser = [i.serialize for i in associatedUser]
        essay['marker'] = associatedMarker
        essay['user'] = associatedUser
    except:
      logger.error('error loading pending essays')

    return jsonify(essays=essays)
  
@essay_api.route('/newEssay', methods=['POST'])
def newEssay():
  essayTitle = request.values.get('essayTitle')
  userId = request.values.get('userId')
  driveId = request.values.get('driveId')
  markerId = request.values.get('markerId')
  print essayTitle
  try:
    newEssay = Essay(title=essayTitle, driveId=driveId, pending=True, marker_id_fk=markerId, user_id_fk=userId)
    db_session.add(essay)
    db_session.commit()
  except:
    logger.error('error storing new essay' + essay['title'])
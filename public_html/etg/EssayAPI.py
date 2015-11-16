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
    essayList = db_session.query(Essay).filter(Essay.pending!=1).limit(5).all()
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
      essays = db_session.query(Essay).filter(Essay.pending==1)
      essays = [essay.serialize for essay in essays]
      for essay in essays:
        associatedMarker = db_session.query(Marker).filter(Marker.id==essay['marker_id_fk'])
        associatedMarker = [i.serialize for i in associatedMarker]
        associatedUser = db_session.query(User).filter(User.id==essay['user_id_fk'])
        associatedUser = [i.serialize for i in associatedUser]
        essay['marker'] = associatedMarker
        essay['user'] = associatedUser
    except:
      logger.error('error loading pending essays')

    return jsonify(essays=essays)
  
@essay_api.route('/newEssay', methods=['POST'])
def newEssay():
  userId = request.values.get('userId')
  markerId = request.values.get('markerId')
  driveId = request.values.get('driveId')
  essayTitle = request.values.get('essayTitle')
  docLink = request.values.get('docLink')
  try:
    newEssay = Essay(pending=True, title=essayTitle, drive_id=driveId, doc_link=docLink, marker_id_fk=markerId, user_id_fk=userId)
    print newEssay
    db_session.add(newEssay)
    db_session.commit()
  except:
    logger.error('error storing new essay ' + essayTitle)
  return jsonify(meta={'essayTitle': essayTitle, 'driveId': driveId, 'docLink': docLink})
  
@essay_api.route('/approveEssay', methods=['POST'])
def approveEssay():
  essayId = request.values.get('essayId')
  markerId = request.values.get('markerId')
  try:
    db_session.query(Essay).filter(Essay.id==essayId).update({'pending': False}, synchronize_session='fetch')
    db_session.query(Marker).filter(Marker.id==markerId).update({'pending': False}, synchronize_session='fetch')
    db_session.commit()
    logger.info('essay/marker pair updated successfully')
  except:
    logger.error('the essay/marker pair could not be updated')
  return jsonify(message='success')
  
@essay_api.route('/denyEssay', methods=['POST'])
def denyEssay():
  essayId = request.values.get('essayId')
  markerId = request.values.get('markerId')
  print(essayId + " " + markerId)
  try:
    essay = db_session.query(Essay).filter(Essay.id==essayId).first()
    marker = db_session.query(Marker).filter(Marker.id==markerId).first()
    db_session.delete(essay)
    db_session.delete(marker)
    db_session.commit()
    logger.info('essay/marker pair ' + essayId + '/' + markerId + ' has been removed')
  except:
    logger.error('removing essay/marker pair ' + essayId + '/' + markerId + ' failed')
  return jsonify(message='success')
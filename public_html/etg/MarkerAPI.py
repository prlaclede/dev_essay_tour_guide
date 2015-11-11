import logging, md5
from flask import (Blueprint, Flask, session, render_template, request, 
redirect, url_for, jsonify, json)
from modules import *

marker_api = Blueprint('marker_api', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


@marker_api.route('/loadMarkers')
def loadMarkers():
  try:
    markerList = db_session.query(Marker).all()
  except:
    logger.error('error loading markers')
    
  return jsonify(markerList=[i.serialize for i in markerList])
  
@marker_api.route('/loadMarkerEssays')
def loadMarkerEssays():
  markerID = request.args.get('markerID', 0, type=int)
  try:
    essayList = db_session.query(Essay).filter(Essay.marker_id_fk==markerID).all()
  except:
    logger.error('error loading marker essays')
    
  return jsonify(essayList=[i.serialize for i in essayList])

@marker_api.route('/setMapMode')
def mapEdit():
  mode = request.args.get('mode')
  logger.info('setting map mode' + mode)
  session['mapMode'] = mode
  return jsonify(mode=mode)

@marker_api.route('/getMapMode')
def getMapMode():
  return jsonify(mapMode=session.get('mapMode'))
  
@marker_api.route('/newMarker', methods=['POST'])
def newMarker():
  latitude = request.values.get('lat')
  longitude = request.values.get('long')
  address = request.values.get('addr')
  user = request.values.get('userId')
  essayTitle = request.values.get('essayTitle')
  driveId = request.values.get('driveId')
  thisId = None
  print(address)
  print (latitude + " " + longitude)
  try:
    newMarker = Marker(pending=True, address=address, latitude=latitude, longitude=longitude)
    print(newMarker)
    db_session.add(newMarker)
    db_session.commit()
    thisId = db_session.query(func.max(Marker.id)).first()
  except:
    logger.error('error storing new marker')
  return jsonify(meta={'userId': user, 'markerId': thisId[0], 'essayTitle': essayTitle, 'driveId': driveId})
import logging
from flask import (Blueprint, Flask, session, render_template, request, 
redirect, url_for, jsonify, json)
from etg.modules import *

marker_api = Blueprint('marker_api', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@marker_api.route('/loadMarkers')
def loadMarkers():
  markerList = None
  try:
    markerList = db_session.query(Marker).filter(Marker.pending!=1).all()
    markerList = [i.serialize for i in markerList]
    db_session.remove()
  except:
    logger.error('error loading markers')
    
  return jsonify(markerList=markerList)
  
@marker_api.route('/loadMarkerEssays')
def loadMarkerEssays():
  markerID = request.args.get('markerID', 0, type=int)
  essayList = None
  try:
    essayList = db_session.query(Essay).filter(Essay.marker_id_fk==markerID).all()
    essayList = [i.serialize for i in essayList]
    db_session.remove()
  except:
    logger.error('error loading marker essays')
    
  return jsonify(essayList=essayList)

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
  longitude = request.values.get('lng')
  address = request.values.get('addr')
  user = request.values.get('userId')
  essayTitle = request.values.get('essayTitle')
  driveId = request.values.get('driveId')
  docLink = request.values.get('docLink')
  thisId = None

  try:
    newMarker = Marker(pending=True, address=address, latitude=latitude, longitude=longitude)
    db_session.add(newMarker)
    db_session.commit()
    thisId = db_session.query(func.max(Marker.id)).first()
    db_session.remove()
  except:
    logger.error('error storing new marker')
  return jsonify(meta={'userId': user, 'markerId': thisId[0], 'essayTitle': essayTitle, 'driveId': driveId, 'docLink': docLink})
  
@marker_api.route('/essayUploadForm', methods=['POST'])
def essayUploadForm():
  lat = request.values.get('lat')
  lng = request.values.get('lng')
  return render_template('essayUploadForm.html', lat=lat, lng=lng) 
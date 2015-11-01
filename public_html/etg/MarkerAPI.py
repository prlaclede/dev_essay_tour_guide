import logging, md5
from flask import (Blueprint, Flask, session, render_template, request, 
redirect, url_for, jsonify, json)
from modules import *

marker_api = Blueprint('marker_api', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def connectToEssayDB():
  try:
    return engine.connect()
  except:
    print("Can't connect to database alien")

@marker_api.route('/loadMarkers')
def loadMarkers():
  conn = connectToEssayDB()
  markerList = Marker.query.all()
  return jsonify(markerList=[i.serialize for i in markerList])
  
@marker_api.route('/loadMarkerEssays')
def loadMarkerEssays():
  markerID = request.args.get('markerID', 0, type=int)
  conn = connectToEssayDB()
  essayList = Essay.query.filter(Essay.marker_id_fk==markerID).all()
  return jsonify(essayList=[i.serialize for i in essayList])

@marker_api.route('/setMapMode')
def mapEdit():
  mode = request.args.get('mode')
  print('setting map' + mode)
  session['mapMode'] = mode
  return jsonify(mode=mode)

@marker_api.route('/getMapMode')
def getMapMode():
  return jsonify(mapMode=session.get('mapMode'))
  
@marker_api.route('/newMarker')
def newMarker():
  marker = request.args.get('marker')
  conn = connectToEssayDB()
  newMarker = Makrer(name=marker['name'], location=marker['location'], pending=True, lat=marker['lat'], long=marker['long'])
  db_session.add(marker)
  db_session.commit()
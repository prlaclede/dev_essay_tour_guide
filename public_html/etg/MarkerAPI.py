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

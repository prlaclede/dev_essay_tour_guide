import logging, md5, httplib2
from flask import (Blueprint, Flask, session, render_template, request, 
redirect, url_for, jsonify, json, send_from_directory)
from httplib2 import Http
from apiclient.discovery import build
from apiclient.http import MediaFileUpload
from apiclient import errors
from modules import *


driveAccess_api = Blueprint('driveAccess_api', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def connectToEssayDB():
  try:
    return engine.connect()
  except:
    print("Can't connect to database")

    
@driveAccess_api.route('/initExchange')
def initExchange():
  
  drive = Drive()
  
  creds = drive.getCreds()

  http_auth = creds.authorize(Http())
  driveThing = build('drive', 'v2', http=http_auth)
  
  media_body = MediaFileUpload('README.md', mimetype='/*/', resumable=True)
  
  body = {
    'title': 'README.md',
    'description': 'a test file', 
    'mimeType': '/*/'
  }
  
  try:
    file = driveThing.files().insert(
      body=body,
      media_body=media_body).execute()
    return jsonify(file = file);
    
  except errors.HttpError, error:
    print 'An error occured: %s' % error
    return None

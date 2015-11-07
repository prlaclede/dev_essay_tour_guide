import os, logging, md5, httplib2, magic
from flask import (Blueprint, Flask, session, render_template, request, 
redirect, url_for, jsonify, json, send_from_directory)
from apiclient.http import MediaFileUpload
from werkzeug import secure_filename
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

    
@driveAccess_api.route('/fileUpload', methods=['POST'])
def fileUpload():
  file = request.files['file']
  filename = secure_filename(file.filename)
  file.save(os.path.join('userDocs/', filename))
  path = 'userDocs/' + filename
  
  drive = Drive()
  creds = drive.getCreds()
  driveService = drive.buildService(creds)
  
  media_body = MediaFileUpload(path, mimetype='/doc/', resumable=True)
  
  body = {
    'title': filename,
    'description': 'a test file', 
    'mimeType': '/doc/'
  }
  
  try:
    file = driveService.files().insert(
      body=body,
      media_body=media_body).execute()
    os.remove(path)
    return "ok";
  except errors.HttpError, error:
    print 'An error occured: %s' % error
    return None

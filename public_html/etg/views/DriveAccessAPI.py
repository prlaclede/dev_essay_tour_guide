import os, logging, httplib2
from flask import (Blueprint, Flask, session, render_template, request, 
redirect, url_for, jsonify, json, send_from_directory, current_app)
from apiclient.http import MediaFileUpload
from werkzeug import secure_filename
from apiclient import errors
from os import path
from etg.modules import *


driveAccess_api = Blueprint('driveAccess_api', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
    
@driveAccess_api.route('/fileUpload', methods=['POST'])
def fileUpload():
  app = current_app._get_current_object()
  file = request.files['file']
  filename = secure_filename(file.filename)
  file.save(os.path.join(app.root_path, 'userDocs', filename))
  filePath = (os.path.join(app.root_path, 'userDocs', filename))
  #filePath = '/userDocs' + filename
  toReturn = {}
  toReturn['userId'] = session.get('user')['id']
  toReturn['essayTitle'] = filename
  toReturn['lat'] = request.values.get('lat')
  toReturn['lng'] = request.values.get('lng')
  
  drive = Drive()
  creds = drive.getCreds()
  driveService = drive.buildService(creds)
  
  media_body = MediaFileUpload(filePath, mimetype='application/octet-stream', resumable=True)
  
  folders = driveService.files().list(q = "mimeType='application/vnd.google-apps.folder'").execute()
  folderId = drive.getItem(folders, 'essays')
  
  body = {
    'title': filename,
    'parents': [{
        'kind': 'drive#fileLink',
        'id': folderId,
    }],
    'description': '', 
    'mimeType': 'application/octet-stream'
  }
  try:
    file = driveService.files().insert(
      body=body,
      media_body=media_body).execute()
    logger.info('uploading file' % file)
    toReturn['driveId'] = file['id']
    toReturn['docLink'] = file['alternateLink']
    os.remove(filePath) #remove file locally
    return jsonify(meta=toReturn)
  except errors.HttpError, error:
    logger.error('An error occured: %s' % error)
    os.remove(filePath) #remove file locally
    return None

@driveAccess_api.route('/deleteFile/<fileId>')
def deleteFile(fileId):
  drive = Drive()
  creds = drive.getCreds()
  driveService = drive.buildService(creds)
  
  try:
    driveService.files().delete(fileId=fileId).execute()
    return jsonify(message='success')
  except errors.HttpError, error:
    logger.error('An error occured: %s' % error)
    return jsonify(message='error')
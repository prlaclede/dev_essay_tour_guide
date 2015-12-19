import os, logging, md5, httplib2
from flask import (Blueprint, Flask, session, render_template, request, 
redirect, url_for, jsonify, json, send_from_directory)
from apiclient.http import MediaFileUpload
from werkzeug import secure_filename
from apiclient import errors
from os import path
from modules import *


driveAccess_api = Blueprint('driveAccess_api', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
    
@driveAccess_api.route('/fileUpload', methods=['POST'])
def fileUpload():
  file = request.files['file']
  filename = secure_filename(file.filename)
  file.save(os.path.join('etg/userDocs/', filename))
  filePath = 'etg/userDocs/' + filename
  toReturn = {}
  toReturn['userId'] = session.get('user')['id']
  toReturn['essayTitle'] = filename
  toReturn['lat'] = request.values.get('lat')
  toReturn['lng'] = request.values.get('lng')
  
  drive = Drive()
  creds = drive.getCreds()
  driveService = drive.buildService(creds)
  
  media_body = MediaFileUpload(filePath, mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document', resumable=True)
  
  folders = driveService.files().list(q = "mimeType = 'application/vnd.google-apps.folder'").execute()
  folderId = drive.getItem(folders, 'essays')
  
  body = {
    'title': filename,
    'parents': [{
        'kind': 'drive#fileLink',
        'id': folderId,
    }],
    'description': '', 
    'mimeType': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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

@driveAccess_api.route('/deleteFile')
def deleteFile(fileId):
  print 'im here!'
  drive = Drive()
  creds = drive.getCreds()
  driveService = drive.buildService(creds)
  
  try:
    driveService.files().delete(fileId=fileId).execute()
  except errors.HttpError, error:
    logger.error('An error occured: %s' % error)
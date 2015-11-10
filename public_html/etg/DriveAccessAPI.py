import os, logging, md5, httplib2, magic
from flask import (Blueprint, Flask, session, render_template, request, 
redirect, url_for, jsonify, json, send_from_directory)
from apiclient.http import MediaFileUpload
from werkzeug import secure_filename
from apiclient import errors
from modules import *
from os import path

driveAccess_api = Blueprint('driveAccess_api', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

    
@driveAccess_api.route('/fileUpload', methods=['POST'])
def fileUpload():
  file = request.files['file']
  filename = secure_filename(file.filename)
  file.save(os.path.join('userDocs/', filename))
  filePath = './userDocs/' + filename
  
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
  os.remove(filePath)
  try:
    file = driveService.files().insert(
      body=body,
      media_body=media_body).execute()
    return file
  except errors.HttpError, error:
    print 'An error occured: %s' % error
    return None

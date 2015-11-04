import logging, md5, webbrowser
from flask import (Blueprint, Flask, session, render_template, request, 
redirect, url_for, jsonify, json)
from modules import *

driveAccess_api = Blueprint('driveAccess_api', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def connectToEssayDB():
  try:
    return engine.connect()
  except:
    print("Can't connect to database")
    
@driveAccess_api.route('/tinitExchange')
def tinitExchange():
    drive = Drive()
    secrets = Drive.init_exchange(drive)
    return authCode(drive, secrets)
    
driveAccess_api.route('/authCode')
def authCode(drive, secrets): 
    print('wow, im here now')
    print(secrets)
    print(request.args.get('code'))
    session['auth_code'] = request.args.get('code')
    return Drive.get_credentials(drive, session['auth_code'])

@driveAccess_api.route('/initExchange')
def initExchange():
  if 'credentials' not in session:
    print('redirecting')
    return redirect(url_for('.oauth2callback'))
  credentials = client.OAuth2Credentials.from_json(session['credentials'])
  if credentials.access_token_expired:
    return redirect(url_for('.oauth2callback'))
  else:
    http_auth = credentials.authorize(httplib2.Http())
    drive_service = discovery.build('drive', 'v2', http_auth)
    files = drive_service.files().list().execute()
    return json.dumps(files)


@driveAccess_api.route('/oauth2callback')
def oauth2callback():
  print('in callback')
  flow = client.flow_from_clientsecrets(
      'client_secrets.json',
      scope='https://www.googleapis.com/auth/drive.file',
      redirect_uri=url_for('.oauth2callback', _external=True),
      include_granted_scopes=True)
  if 'code' not in request.args:
    auth_uri = flow.step1_get_authorize_url()
    return redirect(auth_uri)
  else:
    auth_code = request.args.get('code')
    credentials = flow.step2_exchange(auth_code)
    session['credentials'] = credentials.to_json()
    return redirect(url_for('index'))
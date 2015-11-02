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
    
@driveAccess_api.route('/initExchange')
def initExchange():
    drive = Drive()
    return Drive.init_exchange(drive)
    
driveAccess_api.route('/authCode')
def authCode(): 
    print('wow, im here now')
    session['auth_code'] = request.args.get('client_secret')
    print("got code: " + session['auth_code'])
    return Drive.get_credentials(session['auth_code'])


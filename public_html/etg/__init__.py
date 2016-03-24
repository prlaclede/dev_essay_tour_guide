import os, logging
from flask import (Flask, session, render_template, request, redirect,
url_for, jsonify, json)
from flask.ext.mail import Mail
from smtplib import SMTPException
from flask.ext.assets import Environment, Bundle
from flask.ext.iniconfig import INIConfig
from views import *
from modules import *

init_db()

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

INIConfig(app)

app.config.from_inifile_sections('etg/protected/config.ini', ['flask'])

app.register_blueprint(mail_api)
app.register_blueprint(user_api)
app.register_blueprint(essay_api)
app.register_blueprint(marker_api)
app.register_blueprint(driveAccess_api)

assets = Environment(app)

pluginJS = Bundle('js/plugins/jquery-1.11.3.js', 'js/plugins/bootstrap/bootstrap.js', 
                    'https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDeovcMJI1fqgbiZeyKwNDiBI3N8ghcmEc&dummy=.js')
customJS = Bundle('js/custom/etg.js', 'js/custom/maps.js', 'js/custom/accLogic.js', 'js/custom/admin.js')

customCSS = Bundle('css/custom/icons.css', 'css/custom/style.css')
pluginCSS = Bundle('css/plugins/bootstrap/bootstrap.css', 'css/plugins/animate.css')

all_JS = Bundle(pluginJS, customJS)
    
external_JS = Bundle(
    Bundle('js/plugins/jquery-1.11.3.js', 'js/plugins/bootstrap/bootstrap.js'), 
    Bundle('js/custom/etg.js', 'js/custom/accLogic.js', 'js/custom/admin.js'))
    
all_CSS = Bundle(customCSS, pluginCSS)

assets.register('all_CSS', all_CSS)    
assets.register('all_JS', all_JS)
assets.register('external_JS', external_JS)

    

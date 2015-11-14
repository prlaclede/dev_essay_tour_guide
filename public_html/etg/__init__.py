import os, logging, md5
from flask import (Flask, session, render_template, request, redirect,
url_for, jsonify, json)
from flask.ext.mail import Mail
from smtplib import SMTPException
from UserAPI import user_api
from EssayAPI import essay_api
from MarkerAPI import marker_api
from DriveAccessAPI import driveAccess_api
from modules import *

init_db()
#for testing purposes
#password = md5.new('basicpass').hexdigest()
#user = User(email='basic@email.com', password=password, first_name='Mac', last_name="N'Cheese", pending=True, account_type_id_fk=2, instr_id_fk=2)
#db_session.add(user)
#db_session.commit()

#setup for different levels of log files later
#logger.basicConfig(filename='debug.log',level=logging.DEBUG)
#logger.basicConfig(filename='error.log',level=logging.ERROR)
#just logging to the console for now
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

app.register_blueprint(user_api)
app.register_blueprint(essay_api)
app.register_blueprint(marker_api)
app.register_blueprint(driveAccess_api)

emailConfigs = Email.configProperties

for key, value in emailConfigs.iteritems():
    app.config.update(key = value)

app.config.update(
    SECRET_KEY = 'wow_so_secret',
    SECURITY_PASSWORD_SALT = 'much_protect',
    MAIL_SERVER = 'smtp.googlemail.com',
    MAIL_PORT = 465,
    MAIL_USE_SSL = True,
    MAIL_USE_TLS = False,
    MAIL_USERNAME = 'fredessaytours@gmail.com',
    MAIL_PASSWORD = 'fredessaytour',
    MAIL_DEFAULT_SENDER = 'noreploy@tourfredericksburgva.com'
    )
    
mail = Mail(app)